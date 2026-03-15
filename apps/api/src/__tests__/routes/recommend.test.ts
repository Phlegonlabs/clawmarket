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

vi.mock("../../services/recommendation.js", () => ({
  recommendStrategies: vi.fn(),
}));

vi.mock("../../services/backtest.js", () => ({
  runStrategyBacktest: vi.fn(),
}));

vi.mock("../../lib/okx.js", () => ({
  getMarketPrice: vi.fn(),
  getSwapQuote: vi.fn(),
}));

import { recommendStrategies } from "../../services/recommendation.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

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

describe("POST /api/strategies/recommend", () => {
  it("returns 200 with recommendations", async () => {
    vi.mocked(recommendStrategies).mockResolvedValue(
      ok({
        data: [{ matchScore: 85, reason: "Good match" }] as never,
        display: { markdown: "Recommendations" },
      }),
    );

    const res = await postJson("/api/strategies/recommend", {
      agentId: "agent_1",
      preferences: "momentum",
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data).toHaveLength(1);
    expect(body.data[0].matchScore).toBe(85);
  });

  it("returns 400 when agentId missing", async () => {
    const res = await postJson("/api/strategies/recommend", {
      preferences: "momentum",
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 when preferences missing", async () => {
    const res = await postJson("/api/strategies/recommend", {
      agentId: "agent_1",
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 when no strategies available", async () => {
    vi.mocked(recommendStrategies).mockResolvedValue(
      err("NO_STRATEGIES", "No strategies available"),
    );

    const res = await postJson("/api/strategies/recommend", {
      agentId: "agent_1",
      preferences: "anything",
    });
    expect(res.status).toBe(404);
  });
});
