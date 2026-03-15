import { describe, expect, it } from "vitest";
import { runBacktest, type BacktestConfig, type StrategyRules } from "../lib/backtest-engine.js";

const BASE_CONFIG: BacktestConfig = {
  period: "30d",
  initialCapital: 10000,
  tokenSymbol: "ETH",
};

const MOMENTUM_STRATEGY: StrategyRules = {
  family: "momentum",
  executionMode: "manual",
  rules: [
    { id: "r1", description: "Buy on breakout", condition: "price > SMA(10) * 1.01", action: "buy" },
    { id: "r2", description: "Sell on breakdown", condition: "price < SMA(10) * 0.99", action: "sell" },
  ],
};

describe("runBacktest", () => {
  it("returns valid metrics", () => {
    const result = runBacktest(BASE_CONFIG, MOMENTUM_STRATEGY);
    expect(result.metrics.totalReturn).toBeDefined();
    expect(result.metrics.maxDrawdown).toBeGreaterThanOrEqual(0);
    expect(result.metrics.sharpeRatio).toBeDefined();
    expect(result.metrics.winRate).toBeGreaterThanOrEqual(0);
    expect(result.metrics.winRate).toBeLessThanOrEqual(100);
    expect(result.metrics.totalTrades).toBeGreaterThanOrEqual(0);
    expect(result.metrics.averageHoldingPeriod).toMatch(/^\d+d$/);
  });

  it("generates equity curve with correct length", () => {
    const result = runBacktest(BASE_CONFIG, MOMENTUM_STRATEGY);
    expect(result.equity).toHaveLength(30);
    expect(result.equity[0].value).toBeCloseTo(BASE_CONFIG.initialCapital, -1);
  });

  it("produces deterministic results for same inputs", () => {
    const r1 = runBacktest(BASE_CONFIG, MOMENTUM_STRATEGY);
    const r2 = runBacktest(BASE_CONFIG, MOMENTUM_STRATEGY);
    expect(r1.metrics.totalReturn).toBe(r2.metrics.totalReturn);
    expect(r1.metrics.sharpeRatio).toBe(r2.metrics.sharpeRatio);
  });

  it("works with different strategy families", () => {
    const families = ["momentum", "mean-reversion", "arbitrage", "market-making", "trend-following", "volatility"];
    for (const family of families) {
      const result = runBacktest(BASE_CONFIG, { ...MOMENTUM_STRATEGY, family });
      expect(result.metrics).toBeDefined();
      expect(result.equity.length).toBeGreaterThan(0);
    }
  });

  it("supports different periods", () => {
    const r7 = runBacktest({ ...BASE_CONFIG, period: "7d" }, MOMENTUM_STRATEGY);
    const r90 = runBacktest({ ...BASE_CONFIG, period: "90d" }, MOMENTUM_STRATEGY);
    expect(r7.equity).toHaveLength(7);
    expect(r90.equity).toHaveLength(90);
  });

  it("trades array contains buy and sell pairs", () => {
    const result = runBacktest({ ...BASE_CONFIG, period: "90d" }, MOMENTUM_STRATEGY);
    const buys = result.trades.filter((t) => t.type === "buy");
    const sells = result.trades.filter((t) => t.type === "sell");
    expect(sells.length).toBeLessThanOrEqual(buys.length);
    expect(sells.length).toBeGreaterThanOrEqual(buys.length - 1);
  });

  it("sell trades have pnl set", () => {
    const result = runBacktest({ ...BASE_CONFIG, period: "90d" }, MOMENTUM_STRATEGY);
    const sells = result.trades.filter((t) => t.type === "sell");
    for (const t of sells) {
      expect(t.pnl).not.toBeNull();
    }
  });

  it("maxDrawdown is between 0 and 100", () => {
    const result = runBacktest(BASE_CONFIG, MOMENTUM_STRATEGY);
    expect(result.metrics.maxDrawdown).toBeGreaterThanOrEqual(0);
    expect(result.metrics.maxDrawdown).toBeLessThanOrEqual(100);
  });
});
