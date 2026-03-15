import { beforeEach, describe, expect, it, vi } from "vitest";
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

import { getMarketPrice, getSwapQuote } from "../../lib/okx.js";
import { ok, err } from "@clawmarket/contracts";

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

describe("POST /api/execution/market-price", () => {
  it("returns 200 with price data", async () => {
    vi.mocked(getMarketPrice).mockResolvedValue(
      ok({ tokenSymbol: "ETH", priceUsd: 3500.5, timestamp: "2026-01-01T00:00:00.000Z" }),
    );

    const res = await postJson("/api/execution/market-price", {
      tokenSymbol: "ETH",
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data.tokenSymbol).toBe("ETH");
    expect(body.data.priceUsd).toBeCloseTo(3500.5);
  });

  it("returns 502 on OKX error", async () => {
    vi.mocked(getMarketPrice).mockResolvedValue(err("OKX API error: 500"));

    const res = await postJson("/api/execution/market-price", {
      tokenSymbol: "ETH",
    });
    expect(res.status).toBe(502);

    const body = (await res.json()) as Json;
    expect(body.error).toBe("OKX_ERROR");
  });

  it("response has data + display format", async () => {
    vi.mocked(getMarketPrice).mockResolvedValue(
      ok({ tokenSymbol: "ETH", priceUsd: 3500, timestamp: "2026-01-01T00:00:00.000Z" }),
    );

    const res = await postJson("/api/execution/market-price", {
      tokenSymbol: "ETH",
    });
    const body = (await res.json()) as Json;
    expect(body.data).toBeDefined();
    expect(body.display).toBeDefined();
    expect(body.display.markdown).toContain("ETH");
  });
});

describe("POST /api/execution/dex-swap-intent", () => {
  it("returns 200 with quote data", async () => {
    vi.mocked(getSwapQuote).mockResolvedValue(
      ok({
        fromToken: "0xA",
        toToken: "0xB",
        fromAmount: "500000",
        toAmount: "1000000",
        priceImpact: 0.1,
        route: ["route1"],
        estimatedGas: "50000",
      }),
    );

    const res = await postJson("/api/execution/dex-swap-intent", {
      fromToken: "0xA",
      toToken: "0xB",
      amount: "500000",
    });
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data.toAmount).toBe("1000000");
  });

  it("returns 502 on OKX error", async () => {
    vi.mocked(getSwapQuote).mockResolvedValue(err("No swap quote"));

    const res = await postJson("/api/execution/dex-swap-intent", {
      fromToken: "0xA",
      toToken: "0xB",
      amount: "500000",
    });
    expect(res.status).toBe(502);
  });

  it("response has data + display format", async () => {
    vi.mocked(getSwapQuote).mockResolvedValue(
      ok({
        fromToken: "0xA",
        toToken: "0xB",
        fromAmount: "500000",
        toAmount: "1000000",
        priceImpact: 0.1,
        route: [],
        estimatedGas: "50000",
      }),
    );

    const res = await postJson("/api/execution/dex-swap-intent", {
      fromToken: "0xA",
      toToken: "0xB",
      amount: "500000",
    });
    const body = (await res.json()) as Json;
    expect(body.data).toBeDefined();
    expect(body.display).toBeDefined();
    expect(body.display.markdown).toContain("Swap Quote");
  });
});
