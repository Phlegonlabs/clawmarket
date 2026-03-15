import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import {
  bundles,
  entitlements,
  purchases,
  purchaseIntents,
  revenueLedger,
  strategyPackages,
} from "@clawmarket/db";
import { eq, inArray } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { generateId } from "../lib/id.js";

interface BundlePurchaseResult {
  purchaseId: string;
  entitlementIds: string[];
  bundleSlug: string;
}

export async function completeBundlePurchase(
  db: Database,
  bundleSlug: string,
  agentId: string,
  platformShareBps: number,
  txHash?: string,
): Promise<Result<AgentResponse<BundlePurchaseResult>, "NOT_FOUND" | "ALREADY_OWNED">> {
  const bundleRows = await db.select().from(bundles).where(eq(bundles.slug, bundleSlug)).limit(1);
  if (!bundleRows[0]) return err("NOT_FOUND", "Bundle not found");

  const bundle = bundleRows[0];
  const strategyIds = JSON.parse(bundle.strategyIds) as string[];

  // Check for existing entitlements
  const existingEntitlements = await db
    .select()
    .from(entitlements)
    .where(eq(entitlements.agentId, agentId))
    .all();
  const ownedStrategyIds = new Set(existingEntitlements.map((e) => e.strategyId));

  // Filter to strategies not already owned
  const newStrategyIds = strategyIds.filter((id) => !ownedStrategyIds.has(id));
  if (newStrategyIds.length === 0) {
    return err("ALREADY_OWNED", "Agent already owns all strategies in this bundle");
  }

  const strategies = await db
    .select()
    .from(strategyPackages)
    .where(inArray(strategyPackages.id, newStrategyIds))
    .all();

  const now = new Date().toISOString();
  const purchaseId = generateId("pur");
  const entitlementIds: string[] = [];

  // Create purchase record
  await db.insert(purchases).values({
    id: purchaseId,
    intentId: generateId("int"),
    strategyId: bundle.id, // bundle as the "strategy"
    agentId,
    publisherId: bundle.publisherId,
    chainId: "196",
    paymentToken: "USDT0",
    tokenAddress: "0x0000000000000000000000000000000000000000",
    amountRaw: String(Math.round(bundle.priceUsd * 1e6)),
    amountUsd: bundle.priceUsd,
    txHash: txHash ?? null,
    completedAt: now,
  });

  // Create entitlements for each strategy (transactional)
  for (const strategy of strategies) {
    const entId = generateId("ent");
    entitlementIds.push(entId);

    await db.insert(entitlements).values({
      id: entId,
      strategyId: strategy.id,
      agentId,
      purchaseId,
      grantedAt: now,
    });
  }

  // Revenue split — proportional by individual price
  const totalIndividualPrice = strategies.reduce((sum, s) => sum + s.priceUsd, 0);

  for (const strategy of strategies) {
    const proportion = totalIndividualPrice > 0 ? strategy.priceUsd / totalIndividualPrice : 1 / strategies.length;
    const strategyRevenue = Math.round(bundle.priceUsd * proportion * 1e6);
    const platformShare = Math.round(strategyRevenue * platformShareBps / 10000);
    const publisherShare = strategyRevenue - platformShare;

    await db.insert(revenueLedger).values({
      id: generateId("rev"),
      purchaseId,
      recipientType: "publisher",
      recipientId: strategy.publisherId,
      chainId: "196",
      paymentToken: "USDT0",
      amountRaw: String(publisherShare),
      amountUsd: publisherShare / 1e6,
      shareBps: 10000 - platformShareBps,
      createdAt: now,
    });

    await db.insert(revenueLedger).values({
      id: generateId("rev"),
      purchaseId,
      recipientType: "platform",
      recipientId: "platform",
      chainId: "196",
      paymentToken: "USDT0",
      amountRaw: String(platformShare),
      amountUsd: platformShare / 1e6,
      shareBps: platformShareBps,
      createdAt: now,
    });
  }

  return ok({
    data: { purchaseId, entitlementIds, bundleSlug },
    display: {
      markdown: `Bundle **${bundle.name}** purchased. ${entitlementIds.length} strategies unlocked.`,
    },
  });
}
