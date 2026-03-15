import { beforeEach, describe, expect, it, vi } from "vitest";
import { publishers, strategyPackages } from "@clawmarket/db";
import type { Database } from "../../lib/db.js";
import { recommendStrategies } from "../../services/recommendation.js";
import { TEST_PUBLISHER, TEST_STRATEGY_ROW } from "../helpers/fixtures.js";
import { createTestDb } from "../helpers/test-db.js";

let db: Database;

function createMockAi(response?: string): Ai {
  return {
    run: vi.fn().mockResolvedValue({ response }),
  } as unknown as Ai;
}

beforeEach(() => {
  db = createTestDb();
  db.insert(publishers).values(TEST_PUBLISHER).run();
});

describe("recommendStrategies", () => {
  it("returns NO_STRATEGIES when catalog is empty", async () => {
    const ai = createMockAi("[0] 90 Good match");
    const result = await recommendStrategies(db, ai, {
      agentId: "agent_1",
      preferences: "momentum trading",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("NO_STRATEGIES");
  });

  it("returns recommendations with AI-parsed output", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();
    db.insert(strategyPackages)
      .values({ ...TEST_STRATEGY_ROW, id: "strat_2", slug: "another-strat", title: "Another" })
      .run();

    const ai = createMockAi("[0] 85 Matches momentum preference\n[1] 60 Alternative option");
    const result = await recommendStrategies(db, ai, {
      agentId: "agent_1",
      preferences: "I want momentum strategies",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data).toHaveLength(2);
      expect(result.value.data[0].matchScore).toBe(85);
      expect(result.value.data[0].reason).toBe("Matches momentum preference");
    }
  });

  it("falls back to default recommendations when AI output is unparseable", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const ai = createMockAi("I cannot parse this properly");
    const result = await recommendStrategies(db, ai, {
      agentId: "agent_1",
      preferences: "something",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data).toHaveLength(1);
      expect(result.value.data[0].matchScore).toBe(50);
    }
  });

  it("respects maxResults", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();
    db.insert(strategyPackages)
      .values({ ...TEST_STRATEGY_ROW, id: "strat_2", slug: "s2" })
      .run();
    db.insert(strategyPackages)
      .values({ ...TEST_STRATEGY_ROW, id: "strat_3", slug: "s3" })
      .run();

    const ai = createMockAi("[0] 90 a\n[1] 80 b\n[2] 70 c");
    const result = await recommendStrategies(db, ai, {
      agentId: "agent_1",
      preferences: "test",
      maxResults: 2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data).toHaveLength(2);
    }
  });

  it("display includes markdown", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const ai = createMockAi("[0] 75 Nice strategy");
    const result = await recommendStrategies(db, ai, {
      agentId: "agent_1",
      preferences: "momentum",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.display.markdown).toContain("Strategy Recommendations");
      expect(result.value.display.markdown).toContain("Momentum Breakout");
    }
  });

  it("sorts by matchScore descending", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();
    db.insert(strategyPackages)
      .values({ ...TEST_STRATEGY_ROW, id: "strat_2", slug: "s2", title: "Second" })
      .run();

    const ai = createMockAi("[0] 50 ok\n[1] 90 great");
    const result = await recommendStrategies(db, ai, {
      agentId: "agent_1",
      preferences: "test",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data[0].matchScore).toBe(90);
      expect(result.value.data[1].matchScore).toBe(50);
    }
  });
});
