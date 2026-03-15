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

import { runStrategyBacktest } from "../../services/backtest.js";

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

describe("POST /api/strategies/:slug/backtest", () => {
  it("returns 200 with backtest results", async () => {
    vi.mocked(runStrategyBacktest).mockResolvedValue(
      ok({
        data: {
          metrics: {
            totalReturn: 12.5,
            maxDrawdown: 5.2,
            sharpeRatio: 1.8,
            winRate: 65,
            totalTrades: 20,
            profitFactor: 2.1,
            averageHoldingPeriod: "3d",
          },
          equity: [],
          trades: [],
          analysis: "Good performance.",
        },
        display: { markdown: "Backtest results" },
      }),
    );

    const res = await postJson("/api/strategies/test-strat/backtest", {
      period: "30d",
      initialCapital: 10000,
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data.metrics.totalReturn).toBe(12.5);
    expect(body.data.analysis).toBe("Good performance.");
  });

  it("returns 404 for missing strategy", async () => {
    vi.mocked(runStrategyBacktest).mockResolvedValue(
      err("NOT_FOUND", "Strategy not found"),
    );

    const res = await postJson("/api/strategies/nonexistent/backtest", {});
    expect(res.status).toBe(404);
  });

  it("returns 502 on backtest worker error", async () => {
    vi.mocked(runStrategyBacktest).mockResolvedValue(
      err("BACKTEST_ERROR", "Worker unreachable"),
    );

    const res = await postJson("/api/strategies/test-strat/backtest", {});
    expect(res.status).toBe(502);
  });

  it("response includes data and display", async () => {
    vi.mocked(runStrategyBacktest).mockResolvedValue(
      ok({
        data: {
          metrics: {
            totalReturn: 5,
            maxDrawdown: 3,
            sharpeRatio: 1,
            winRate: 50,
            totalTrades: 10,
            profitFactor: 1.5,
            averageHoldingPeriod: "5d",
          },
          equity: [],
          trades: [],
          analysis: "Moderate performance.",
        },
        display: { markdown: "Results" },
      }),
    );

    const res = await postJson("/api/strategies/test-strat/backtest", {});
    const body = (await res.json()) as Json;
    expect(body.data).toBeDefined();
    expect(body.display).toBeDefined();
  });
});
