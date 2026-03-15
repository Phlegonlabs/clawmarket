import { describe, expect, it } from "vitest";
import { EntitlementSchema, PurchaseIntentRequestSchema } from "../index.js";

describe("PurchaseIntentRequestSchema", () => {
  it("defaults chainId to 196 (X Layer)", () => {
    const intent = PurchaseIntentRequestSchema.parse({
      strategySlug: "btc-momentum",
      agentId: "agent-001",
    });
    expect(intent.chainId).toBe(196);
    expect(intent.paymentToken).toBeUndefined();
  });

  it("accepts explicit chainId", () => {
    const intent = PurchaseIntentRequestSchema.parse({
      strategySlug: "btc-momentum",
      agentId: "agent-001",
      chainId: 8453,
      paymentToken: "USDC",
    });
    expect(intent.chainId).toBe(8453);
    expect(intent.paymentToken).toBe("USDC");
  });
});

describe("EntitlementSchema", () => {
  it("has no chain_id field (chain-agnostic)", () => {
    const entitlement = EntitlementSchema.parse({
      id: "ent-001",
      strategyId: "strat-001",
      agentId: "agent-001",
      purchaseId: "pur-001",
      grantedAt: "2026-03-15T00:00:00.000Z",
    });
    expect(entitlement).not.toHaveProperty("chainId");
    expect(entitlement.id).toBe("ent-001");
  });
});
