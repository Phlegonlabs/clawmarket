import {
  type AgentResponse,
  DEFAULT_CHAIN_ID,
  type Entitlement,
  err,
  ok,
  PurchaseIntentRequestSchema,
  type Result,
} from "@clawmarket/contracts";
import {
  agentIdentities,
  entitlements,
  purchaseIntents,
  purchases,
  revenueLedger,
  strategyPackages,
} from "@clawmarket/db";
import { and, eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { generateId } from "../lib/id.js";
import { getPaymentAdapter, type PaymentChallenge } from "../lib/x402.js";

const INTENT_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function createPurchaseIntent(
  db: Database,
  input: unknown,
  payTo: string,
): Promise<
  Result<
    AgentResponse<{ intentId: string; challenge: PaymentChallenge }>,
    "VALIDATION" | "STRATEGY_NOT_FOUND" | "CHAIN_ERROR" | "ALREADY_OWNED"
  >
> {
  const parsed = PurchaseIntentRequestSchema.safeParse(input);
  if (!parsed.success) return err("VALIDATION", parsed.error.message);
  const { strategySlug, agentId, chainId, paymentToken } = parsed.data;

  // Ensure agent exists (auto-create)
  const existingAgent = await db
    .select()
    .from(agentIdentities)
    .where(eq(agentIdentities.id, agentId))
    .limit(1);
  if (!existingAgent[0]) {
    const now = new Date().toISOString();
    await db.insert(agentIdentities).values({ id: agentId, createdAt: now, updatedAt: now });
  }

  // Find strategy
  const strats = await db
    .select()
    .from(strategyPackages)
    .where(eq(strategyPackages.slug, strategySlug))
    .limit(1);
  const strategy = strats[0];
  if (!strategy) return err("STRATEGY_NOT_FOUND", `Strategy '${strategySlug}' not found`);

  // Check duplicate entitlement
  const existing = await db
    .select()
    .from(entitlements)
    .where(and(eq(entitlements.strategyId, strategy.id), eq(entitlements.agentId, agentId)))
    .limit(1);
  if (existing[0]) return err("ALREADY_OWNED", "Agent already owns this strategy");

  // Resolve chain + build challenge
  const adapterResult = getPaymentAdapter(chainId ?? DEFAULT_CHAIN_ID);
  if (!adapterResult.ok) return err("CHAIN_ERROR", adapterResult.message);
  const adapter = adapterResult.value;

  const expiresAt = new Date(Date.now() + INTENT_TTL_MS).toISOString();
  const challengeResult = adapter.buildChallenge({
    payTo,
    amountUsd: strategy.priceUsd,
    tokenSymbol: paymentToken,
    expiresAt,
  });
  if (!challengeResult.ok) return err("CHAIN_ERROR", challengeResult.error);
  const challenge = challengeResult.value;

  // Persist intent
  const intentId = generateId("int");
  const now = new Date().toISOString();
  await db.insert(purchaseIntents).values({
    id: intentId,
    strategyId: strategy.id,
    agentId,
    chainId: String(challenge.chainId),
    paymentToken: challenge.token,
    tokenAddress: challenge.tokenAddress,
    amountRaw: challenge.amount,
    amountUsd: strategy.priceUsd,
    status: "challenged",
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });

  return ok({
    data: { intentId, challenge },
    display: {
      markdown: `**Payment Required** — $${strategy.priceUsd} ${challenge.token} on chain ${challenge.chainId}\nIntent: \`${intentId}\` · Expires: ${expiresAt}`,
    },
  });
}

export async function getSigningTemplate(
  db: Database,
  intentId: string,
): Promise<
  Result<AgentResponse<{ intentId: string; eip712TypedData: unknown }>, "NOT_FOUND" | "EXPIRED">
> {
  const intents = await db
    .select()
    .from(purchaseIntents)
    .where(eq(purchaseIntents.id, intentId))
    .limit(1);
  const intent = intents[0];
  if (!intent) return err("NOT_FOUND", `Intent '${intentId}' not found`);
  if (new Date(intent.expiresAt) < new Date()) return err("EXPIRED", "Intent has expired");

  const adapterResult = getPaymentAdapter(Number(intent.chainId));
  if (!adapterResult.ok) return err("NOT_FOUND", "Chain configuration not found");

  const domain = adapterResult.value.getEIP712Domain();
  const typedData = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Payment: [
        { name: "intentId", type: "string" },
        { name: "payTo", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "token", type: "address" },
        { name: "expiry", type: "uint256" },
      ],
    },
    primaryType: "Payment",
    domain,
    message: {
      intentId: intent.id,
      payTo: "0x0000000000000000000000000000000000000000", // from env at runtime
      amount: intent.amountRaw,
      token: intent.tokenAddress,
      expiry: Math.floor(new Date(intent.expiresAt).getTime() / 1000),
    },
  };

  return ok({
    data: { intentId, eip712TypedData: typedData },
    display: {
      markdown: `**EIP-712 Signing Template** for intent \`${intentId}\`\nChain: ${intent.chainId} · Token: ${intent.paymentToken} · Amount: ${intent.amountRaw}`,
    },
  });
}

export async function completePurchase(
  db: Database,
  intentId: string,
  txHash: string | undefined,
  platformShareBps: number,
): Promise<
  Result<
    AgentResponse<{ purchaseId: string; entitlementId: string }>,
    "NOT_FOUND" | "EXPIRED" | "ALREADY_COMPLETED"
  >
> {
  const intents = await db
    .select()
    .from(purchaseIntents)
    .where(eq(purchaseIntents.id, intentId))
    .limit(1);
  const intent = intents[0];
  if (!intent) return err("NOT_FOUND", `Intent '${intentId}' not found`);
  if (intent.status === "completed") return err("ALREADY_COMPLETED", "Already completed");
  if (new Date(intent.expiresAt) < new Date()) return err("EXPIRED", "Intent has expired");

  // Find strategy for publisherId
  const strats = await db
    .select()
    .from(strategyPackages)
    .where(eq(strategyPackages.id, intent.strategyId))
    .limit(1);
  const strategy = strats[0];
  if (!strategy) return err("NOT_FOUND", "Strategy not found");

  // Check duplicate entitlement again
  const existingEnt = await db
    .select()
    .from(entitlements)
    .where(
      and(eq(entitlements.strategyId, intent.strategyId), eq(entitlements.agentId, intent.agentId)),
    )
    .limit(1);
  if (existingEnt[0]) return err("ALREADY_COMPLETED", "Agent already owns this strategy");

  const now = new Date().toISOString();
  const purchaseId = generateId("pur");
  const entitlementId = generateId("ent");

  // Create purchase
  await db.insert(purchases).values({
    id: purchaseId,
    intentId: intent.id,
    strategyId: intent.strategyId,
    agentId: intent.agentId,
    publisherId: strategy.publisherId,
    chainId: intent.chainId,
    paymentToken: intent.paymentToken,
    tokenAddress: intent.tokenAddress,
    amountRaw: intent.amountRaw,
    amountUsd: intent.amountUsd,
    txHash: txHash ?? null,
    completedAt: now,
  });

  // Create entitlement (chain-agnostic)
  await db.insert(entitlements).values({
    id: entitlementId,
    strategyId: intent.strategyId,
    agentId: intent.agentId,
    purchaseId,
    grantedAt: now,
  });

  // Revenue split
  const platformAmount = Math.round((Number(intent.amountRaw) * platformShareBps) / 10000);
  const publisherAmount = Number(intent.amountRaw) - platformAmount;

  await db.insert(revenueLedger).values([
    {
      id: generateId("rev"),
      purchaseId,
      recipientType: "publisher",
      recipientId: strategy.publisherId,
      chainId: intent.chainId,
      paymentToken: intent.paymentToken,
      amountRaw: String(publisherAmount),
      amountUsd: intent.amountUsd * ((10000 - platformShareBps) / 10000),
      shareBps: 10000 - platformShareBps,
      createdAt: now,
    },
    {
      id: generateId("rev"),
      purchaseId,
      recipientType: "platform",
      recipientId: "platform",
      chainId: intent.chainId,
      paymentToken: intent.paymentToken,
      amountRaw: String(platformAmount),
      amountUsd: intent.amountUsd * (platformShareBps / 10000),
      shareBps: platformShareBps,
      createdAt: now,
    },
  ]);

  // Mark intent completed
  await db
    .update(purchaseIntents)
    .set({ status: "completed", updatedAt: now })
    .where(eq(purchaseIntents.id, intentId));

  return ok({
    data: { purchaseId, entitlementId },
    display: {
      markdown: `**Purchase Complete** — Strategy unlocked!\nPurchase: \`${purchaseId}\` · Entitlement: \`${entitlementId}\``,
    },
  });
}

export async function checkEntitlement(
  db: Database,
  strategyId: string,
  agentId: string,
): Promise<Result<Entitlement, "NOT_ENTITLED">> {
  const rows = await db
    .select()
    .from(entitlements)
    .where(and(eq(entitlements.strategyId, strategyId), eq(entitlements.agentId, agentId)))
    .limit(1);
  if (!rows[0]) return err("NOT_ENTITLED", "Agent does not have access to this strategy");
  return ok({
    id: rows[0].id,
    strategyId: rows[0].strategyId,
    agentId: rows[0].agentId,
    purchaseId: rows[0].purchaseId,
    grantedAt: rows[0].grantedAt,
  });
}
