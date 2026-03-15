import { describe, expect, it } from "vitest";
import { ExecutionModeSchema, StrategyFamilySchema, StrategyPackageSchema } from "../index.js";

describe("StrategyFamilySchema", () => {
  it("accepts valid families", () => {
    const families = [
      "momentum",
      "mean-reversion",
      "arbitrage",
      "market-making",
      "trend-following",
      "volatility",
    ];
    for (const f of families) {
      expect(StrategyFamilySchema.parse(f)).toBe(f);
    }
  });

  it("rejects unknown family", () => {
    expect(() => StrategyFamilySchema.parse("unknown")).toThrow();
  });
});

describe("ExecutionModeSchema", () => {
  it("accepts valid modes", () => {
    expect(ExecutionModeSchema.parse("manual")).toBe("manual");
    expect(ExecutionModeSchema.parse("semi-auto")).toBe("semi-auto");
    expect(ExecutionModeSchema.parse("full-auto")).toBe("full-auto");
  });
});

describe("StrategyPackageSchema", () => {
  it("validates a complete strategy package", () => {
    const pkg = StrategyPackageSchema.parse({
      id: "strat-001",
      slug: "btc-momentum-daily",
      title: "BTC Momentum Daily",
      description: "A momentum strategy for BTC on daily timeframe",
      family: "momentum",
      executionMode: "semi-auto",
      tags: ["btc", "daily"],
      priceUsd: 49.99,
      publisherId: "pub-001",
      naturalLanguageSpec: {
        overview: "Buy BTC when momentum is positive",
        entryConditions: ["RSI > 50", "Price above 20 EMA"],
        exitConditions: ["RSI < 30", "Price below 20 EMA"],
        riskManagement: "2% per trade max risk",
      },
      ruleSpec: {
        rules: [
          {
            id: "r1",
            description: "Entry rule",
            condition: "RSI > 50 AND price > EMA20",
            action: "BUY",
          },
        ],
      },
      createdAt: "2026-03-15T00:00:00.000Z",
      updatedAt: "2026-03-15T00:00:00.000Z",
    });
    expect(pkg.supportedChainIds).toEqual([196]);
  });

  it("defaults supportedChainIds to X Layer", () => {
    const pkg = StrategyPackageSchema.parse({
      id: "strat-002",
      slug: "eth-arb",
      title: "ETH Arbitrage",
      description: "Cross-exchange arbitrage",
      family: "arbitrage",
      executionMode: "full-auto",
      priceUsd: 99,
      publisherId: "pub-001",
      naturalLanguageSpec: {
        overview: "Find arb opportunities",
        entryConditions: ["Spread > 0.5%"],
        exitConditions: ["Spread < 0.1%"],
        riskManagement: "1% max exposure",
      },
      ruleSpec: { rules: [] },
      createdAt: "2026-03-15T00:00:00.000Z",
      updatedAt: "2026-03-15T00:00:00.000Z",
    });
    expect(pkg.supportedChainIds).toEqual([196]);
  });
});
