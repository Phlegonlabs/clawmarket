export const TEST_PUBLISHER = {
  id: "pub_test1",
  name: "Test Publisher",
  walletAddress: "0xabc123def456",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const TEST_AGENT = {
  id: "agent_test1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const TEST_NL_SPEC = {
  overview: "A momentum strategy based on price breakouts",
  entryConditions: ["Price crosses above 20-day SMA", "RSI > 50"],
  exitConditions: ["Price crosses below 20-day SMA"],
  riskManagement: "2% max position size, 5% stop loss",
};

export const TEST_RULE_SPEC = {
  rules: [
    { id: "r1", description: "Enter long on breakout", condition: "price > SMA(20)", action: "BUY" },
    { id: "r2", description: "Exit on breakdown", condition: "price < SMA(20)", action: "SELL" },
  ],
};

export const TEST_STRATEGY_ROW = {
  id: "strat_test1",
  slug: "momentum-breakout",
  title: "Momentum Breakout Strategy",
  description: "A strategy based on price breakouts above moving averages",
  family: "momentum",
  executionMode: "manual",
  tags: JSON.stringify(["breakout", "sma"]),
  priceUsd: 49.99,
  publisherId: TEST_PUBLISHER.id,
  supportedChainIds: JSON.stringify([196]),
  naturalLanguageSpec: JSON.stringify(TEST_NL_SPEC),
  ruleSpec: JSON.stringify(TEST_RULE_SPEC),
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const VALID_PUBLISH_BODY = {
  slug: "new-strategy",
  title: "New Strategy",
  description: "A new test strategy for publishing",
  family: "momentum" as const,
  executionMode: "manual" as const,
  tags: ["test"],
  priceUsd: 29.99,
  publisherId: TEST_PUBLISHER.id,
  supportedChainIds: [196],
  naturalLanguageSpec: TEST_NL_SPEC,
  ruleSpec: TEST_RULE_SPEC,
};
