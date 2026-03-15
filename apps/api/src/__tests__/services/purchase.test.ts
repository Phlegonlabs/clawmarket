import { beforeEach, describe, expect, it } from "vitest";
import {
  agentIdentities,
  entitlements,
  publishers,
  purchaseIntents,
  purchases,
  revenueLedger,
  strategyPackages,
} from "@clawmarket/db";
import { eq } from "drizzle-orm";
import type { Database } from "../../lib/db.js";
import {
  checkEntitlement,
  completePurchase,
  createPurchaseIntent,
  getSigningTemplate,
} from "../../services/purchase.js";
import {
  TEST_AGENT,
  TEST_PUBLISHER,
  TEST_STRATEGY_ROW,
} from "../helpers/fixtures.js";
import { createTestDb } from "../helpers/test-db.js";

let db: Database;

beforeEach(() => {
  db = createTestDb();
  db.insert(publishers).values(TEST_PUBLISHER).run();
  db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();
});

const VALID_INTENT = {
  strategySlug: "momentum-breakout",
  agentId: "agent_test1",
  chainId: 196,
};

const PAY_TO = "0xTEST_TREASURY";

describe("createPurchaseIntent", () => {
  it("returns challenge for valid intent", async () => {
    const result = await createPurchaseIntent(db, VALID_INTENT, PAY_TO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.intentId).toMatch(/^int_/);
      expect(result.value.data.challenge.payTo).toBe(PAY_TO);
      expect(result.value.data.challenge.chainId).toBe(196);
      expect(result.value.data.challenge.token).toBe("USDT0");
    }
  });

  it("auto-creates agent if not exists", async () => {
    await createPurchaseIntent(db, VALID_INTENT, PAY_TO);

    const agents = await db.select().from(agentIdentities).all();
    expect(agents).toHaveLength(1);
    expect(agents[0].id).toBe("agent_test1");
  });

  it("does not duplicate agent on second call with different strategy", async () => {
    await createPurchaseIntent(db, VALID_INTENT, PAY_TO);

    // Add another strategy
    db.insert(strategyPackages)
      .values({ ...TEST_STRATEGY_ROW, id: "strat_test2", slug: "another-strat" })
      .run();

    await createPurchaseIntent(
      db,
      { ...VALID_INTENT, strategySlug: "another-strat" },
      PAY_TO,
    );

    const agents = await db.select().from(agentIdentities).all();
    expect(agents).toHaveLength(1);
  });

  it("returns STRATEGY_NOT_FOUND for bad slug", async () => {
    const result = await createPurchaseIntent(
      db,
      { ...VALID_INTENT, strategySlug: "nonexistent" },
      PAY_TO,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("STRATEGY_NOT_FOUND");
    }
  });

  it("returns ALREADY_OWNED when entitlement exists", async () => {
    // Pre-seed agent, purchase, and entitlement
    db.insert(agentIdentities).values(TEST_AGENT).run();
    db.insert(purchaseIntents)
      .values({
        id: "int_existing",
        strategyId: TEST_STRATEGY_ROW.id,
        agentId: TEST_AGENT.id,
        chainId: "196",
        paymentToken: "USDT0",
        tokenAddress: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
        amountRaw: "49990000",
        amountUsd: 49.99,
        status: "completed",
        expiresAt: "2099-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      })
      .run();
    db.insert(purchases)
      .values({
        id: "pur_existing",
        intentId: "int_existing",
        strategyId: TEST_STRATEGY_ROW.id,
        agentId: TEST_AGENT.id,
        publisherId: TEST_PUBLISHER.id,
        chainId: "196",
        paymentToken: "USDT0",
        tokenAddress: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
        amountRaw: "49990000",
        amountUsd: 49.99,
        completedAt: "2026-01-01T00:00:00.000Z",
      })
      .run();
    db.insert(entitlements)
      .values({
        id: "ent_existing",
        strategyId: TEST_STRATEGY_ROW.id,
        agentId: TEST_AGENT.id,
        purchaseId: "pur_existing",
        grantedAt: "2026-01-01T00:00:00.000Z",
      })
      .run();

    const result = await createPurchaseIntent(db, VALID_INTENT, PAY_TO);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("ALREADY_OWNED");
    }
  });

  it("returns CHAIN_ERROR for unsupported chain", async () => {
    const result = await createPurchaseIntent(
      db,
      { ...VALID_INTENT, chainId: 999 },
      PAY_TO,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("CHAIN_ERROR");
    }
  });

  it("persists intent row in DB", async () => {
    await createPurchaseIntent(db, VALID_INTENT, PAY_TO);

    const intents = await db.select().from(purchaseIntents).all();
    expect(intents).toHaveLength(1);
    expect(intents[0].status).toBe("challenged");
    expect(intents[0].chainId).toBe("196");
  });

  it("challenge contains correct raw amount", async () => {
    const result = await createPurchaseIntent(db, VALID_INTENT, PAY_TO);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // 49.99 USD * 10^6 = 49990000
      expect(result.value.data.challenge.amount).toBe("49990000");
    }
  });
});

describe("getSigningTemplate", () => {
  let intentId: string;

  beforeEach(async () => {
    const result = await createPurchaseIntent(db, VALID_INTENT, PAY_TO);
    if (!result.ok) throw new Error("Setup failed");
    intentId = result.value.data.intentId;
  });

  it("returns EIP-712 typed data for valid intent", async () => {
    const result = await getSigningTemplate(db, intentId);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const typedData = result.value.data.eip712TypedData as Record<string, unknown>;
      expect(typedData).toHaveProperty("types");
      expect(typedData).toHaveProperty("domain");
      expect(typedData).toHaveProperty("message");
      expect(typedData).toHaveProperty("primaryType", "Payment");

      const domain = typedData.domain as Record<string, unknown>;
      expect(domain.chainId).toBe(196);
      expect(domain.name).toBe("ClawMarket");
    }
  });

  it("returns NOT_FOUND for missing intent", async () => {
    const result = await getSigningTemplate(db, "int_nonexistent");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("returns EXPIRED for expired intent", async () => {
    // Set intent to expired
    db.update(purchaseIntents)
      .set({ expiresAt: "2020-01-01T00:00:00.000Z" })
      .where(eq(purchaseIntents.id, intentId))
      .run();

    const result = await getSigningTemplate(db, intentId);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("EXPIRED");
    }
  });
});

describe("completePurchase", () => {
  let intentId: string;

  beforeEach(async () => {
    const result = await createPurchaseIntent(db, VALID_INTENT, PAY_TO);
    if (!result.ok) throw new Error("Setup failed");
    intentId = result.value.data.intentId;
  });

  it("creates purchase, entitlement, and revenue records", async () => {
    const result = await completePurchase(db, intentId, "0xTX_HASH", 1000);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.purchaseId).toMatch(/^pur_/);
      expect(result.value.data.entitlementId).toMatch(/^ent_/);
    }

    // Verify DB state
    const purchaseRows = await db.select().from(purchases).all();
    expect(purchaseRows).toHaveLength(1);
    expect(purchaseRows[0].txHash).toBe("0xTX_HASH");

    const entitlementRows = await db.select().from(entitlements).all();
    expect(entitlementRows).toHaveLength(1);

    const revenueRows = await db.select().from(revenueLedger).all();
    expect(revenueRows).toHaveLength(2);
  });

  it("revenue split is correct at 10% platform", async () => {
    await completePurchase(db, intentId, undefined, 1000);

    const revenueRows = await db.select().from(revenueLedger).all();
    const publisherRow = revenueRows.find((r) => r.recipientType === "publisher");
    const platformRow = revenueRows.find((r) => r.recipientType === "platform");

    expect(publisherRow).toBeDefined();
    expect(platformRow).toBeDefined();

    // 49990000 raw amount
    // Platform: round(49990000 * 1000 / 10000) = 4999000
    // Publisher: 49990000 - 4999000 = 44991000
    expect(platformRow!.amountRaw).toBe("4999000");
    expect(publisherRow!.amountRaw).toBe("44991000");
    expect(platformRow!.shareBps).toBe(1000);
    expect(publisherRow!.shareBps).toBe(9000);
  });

  it("marks intent as completed", async () => {
    await completePurchase(db, intentId, undefined, 1000);

    const intents = await db.select().from(purchaseIntents).all();
    expect(intents[0].status).toBe("completed");
  });

  it("returns NOT_FOUND for missing intent", async () => {
    const result = await completePurchase(db, "int_nonexistent", undefined, 1000);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("returns EXPIRED for expired intent", async () => {
    db.update(purchaseIntents)
      .set({ expiresAt: "2020-01-01T00:00:00.000Z" })
      .where(eq(purchaseIntents.id, intentId))
      .run();

    const result = await completePurchase(db, intentId, undefined, 1000);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("EXPIRED");
    }
  });

  it("returns ALREADY_COMPLETED for completed intent", async () => {
    db.update(purchaseIntents)
      .set({ status: "completed" })
      .where(eq(purchaseIntents.id, intentId))
      .run();

    const result = await completePurchase(db, intentId, undefined, 1000);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("ALREADY_COMPLETED");
    }
  });

  it("stores txHash when provided", async () => {
    await completePurchase(db, intentId, "0xABC123", 1000);

    const purchaseRows = await db.select().from(purchases).all();
    expect(purchaseRows[0].txHash).toBe("0xABC123");
  });

  it("stores null txHash when not provided", async () => {
    await completePurchase(db, intentId, undefined, 1000);

    const purchaseRows = await db.select().from(purchases).all();
    expect(purchaseRows[0].txHash).toBeNull();
  });
});

describe("checkEntitlement", () => {
  beforeEach(async () => {
    // Create a completed purchase flow to get an entitlement
    const intentResult = await createPurchaseIntent(db, VALID_INTENT, PAY_TO);
    if (!intentResult.ok) throw new Error("Setup failed");
    await completePurchase(db, intentResult.value.data.intentId, undefined, 1000);
  });

  it("returns entitlement when exists", async () => {
    const result = await checkEntitlement(db, TEST_STRATEGY_ROW.id, "agent_test1");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.strategyId).toBe(TEST_STRATEGY_ROW.id);
      expect(result.value.agentId).toBe("agent_test1");
    }
  });

  it("returns NOT_ENTITLED when not exists", async () => {
    const result = await checkEntitlement(db, TEST_STRATEGY_ROW.id, "other_agent");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("NOT_ENTITLED");
    }
  });
});
