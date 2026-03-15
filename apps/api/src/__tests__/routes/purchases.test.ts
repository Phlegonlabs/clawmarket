import { beforeEach, describe, expect, it, vi } from "vitest";
import { ok, err } from "@clawmarket/contracts";
import app from "../../app/index.js";
import { createMockEnv } from "../helpers/mock-env.js";

vi.mock("../../lib/db.js", () => ({
  createDb: vi.fn(() => ({})),
}));

vi.mock("../../services/strategy.js", () => ({
  listStrategies: vi.fn(),
  getStrategyBySlug: vi.fn(),
  getUnlockedStrategy: vi.fn(),
  publishStrategy: vi.fn(),
}));

vi.mock("../../services/purchase.js", () => ({
  checkEntitlement: vi.fn(),
  createPurchaseIntent: vi.fn(),
  getSigningTemplate: vi.fn(),
  completePurchase: vi.fn(),
}));

import {
  createPurchaseIntent,
  getSigningTemplate,
  completePurchase,
} from "../../services/purchase.js";

const env = createMockEnv();

function postJson(path: string, body: unknown) {
  return app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }, env);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/strategies/purchase-intent", () => {
  it("returns 402 on success", async () => {
    vi.mocked(createPurchaseIntent).mockResolvedValue(
      ok({
        data: {
          intentId: "int_1",
          challenge: {
            payTo: "0xTREASURY",
            amount: "49990000",
            token: "USDT0",
            tokenAddress: "0x779D",
            chainId: 196,
            eip712Domain: { name: "ClawMarket", version: "1", chainId: 196, verifyingContract: "0x0" },
            facilitatorAddress: "0x0",
            expiresAt: "2026-12-31T00:00:00.000Z",
          },
        },
        display: { markdown: "Payment Required" },
      }),
    );

    const res = await postJson("/api/strategies/purchase-intent", {
      strategySlug: "test-strat",
      agentId: "agent_1",
    });
    expect(res.status).toBe(402);
  });

  it("returns 404 on STRATEGY_NOT_FOUND", async () => {
    vi.mocked(createPurchaseIntent).mockResolvedValue(
      err("STRATEGY_NOT_FOUND", "Not found"),
    );

    const res = await postJson("/api/strategies/purchase-intent", {
      strategySlug: "nonexistent",
      agentId: "agent_1",
    });
    expect(res.status).toBe(404);
  });

  it("returns 409 on ALREADY_OWNED", async () => {
    vi.mocked(createPurchaseIntent).mockResolvedValue(
      err("ALREADY_OWNED", "Already owned"),
    );

    const res = await postJson("/api/strategies/purchase-intent", {
      strategySlug: "test-strat",
      agentId: "agent_1",
    });
    expect(res.status).toBe(409);
  });

  it("returns 400 on CHAIN_ERROR", async () => {
    vi.mocked(createPurchaseIntent).mockResolvedValue(
      err("CHAIN_ERROR", "Bad chain"),
    );

    const res = await postJson("/api/strategies/purchase-intent", {
      strategySlug: "test-strat",
      agentId: "agent_1",
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/strategies/purchases/signing-template", () => {
  it("returns 200 on success", async () => {
    vi.mocked(getSigningTemplate).mockResolvedValue(
      ok({
        data: { intentId: "int_1", eip712TypedData: { types: {} } },
        display: { markdown: "Template" },
      }),
    );

    const res = await postJson("/api/strategies/purchases/signing-template", {
      intentId: "int_1",
    });
    expect(res.status).toBe(200);
  });

  it("returns 404 on NOT_FOUND", async () => {
    vi.mocked(getSigningTemplate).mockResolvedValue(
      err("NOT_FOUND", "Intent not found"),
    );

    const res = await postJson("/api/strategies/purchases/signing-template", {
      intentId: "int_missing",
    });
    expect(res.status).toBe(404);
  });

  it("returns 410 on EXPIRED", async () => {
    vi.mocked(getSigningTemplate).mockResolvedValue(
      err("EXPIRED", "Intent expired"),
    );

    const res = await postJson("/api/strategies/purchases/signing-template", {
      intentId: "int_expired",
    });
    expect(res.status).toBe(410);
  });

  it("returns 400 without intentId", async () => {
    const res = await postJson("/api/strategies/purchases/signing-template", {});
    expect(res.status).toBe(400);
  });
});

describe("POST /api/strategies/purchases/complete", () => {
  it("returns 200 on success", async () => {
    vi.mocked(completePurchase).mockResolvedValue(
      ok({
        data: { purchaseId: "pur_1", entitlementId: "ent_1" },
        display: { markdown: "Complete" },
      }),
    );

    const res = await postJson("/api/strategies/purchases/complete", {
      intentId: "int_1",
      txHash: "0xABC",
    });
    expect(res.status).toBe(200);
  });

  it("returns 404 on NOT_FOUND", async () => {
    vi.mocked(completePurchase).mockResolvedValue(
      err("NOT_FOUND", "Not found"),
    );

    const res = await postJson("/api/strategies/purchases/complete", {
      intentId: "int_missing",
    });
    expect(res.status).toBe(404);
  });

  it("returns 410 on EXPIRED", async () => {
    vi.mocked(completePurchase).mockResolvedValue(
      err("EXPIRED", "Expired"),
    );

    const res = await postJson("/api/strategies/purchases/complete", {
      intentId: "int_expired",
    });
    expect(res.status).toBe(410);
  });

  it("returns 409 on ALREADY_COMPLETED", async () => {
    vi.mocked(completePurchase).mockResolvedValue(
      err("ALREADY_COMPLETED", "Already completed"),
    );

    const res = await postJson("/api/strategies/purchases/complete", {
      intentId: "int_done",
    });
    expect(res.status).toBe(409);
  });
});
