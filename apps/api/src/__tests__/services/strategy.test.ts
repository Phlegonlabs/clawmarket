import { beforeEach, describe, expect, it } from "vitest";
import { publishers, strategyPackages } from "@clawmarket/db";
import type { Database } from "../../lib/db.js";
import {
  getStrategyBySlug,
  getUnlockedStrategy,
  listStrategies,
  publishStrategy,
} from "../../services/strategy.js";
import { TEST_PUBLISHER, TEST_STRATEGY_ROW, VALID_PUBLISH_BODY } from "../helpers/fixtures.js";
import { createTestDb } from "../helpers/test-db.js";

let db: Database;

beforeEach(() => {
  db = createTestDb();
  // Seed publisher
  db.insert(publishers).values(TEST_PUBLISHER).run();
});

describe("listStrategies", () => {
  it("returns empty list when no strategies", async () => {
    const result = await listStrategies(db);
    expect(result.data).toEqual([]);
    expect(result.display.markdown).toContain("No strategies");
  });

  it("returns teasers for all strategies", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();
    db.insert(strategyPackages)
      .values({ ...TEST_STRATEGY_ROW, id: "strat_test2", slug: "another-strat" })
      .run();

    const result = await listStrategies(db);
    expect(result.data).toHaveLength(2);
  });

  it("teasers do not include naturalLanguageSpec or ruleSpec", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const result = await listStrategies(db);
    const teaser = result.data[0];
    expect(teaser).not.toHaveProperty("naturalLanguageSpec");
    expect(teaser).not.toHaveProperty("ruleSpec");
  });

  it("response includes display.markdown", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const result = await listStrategies(db);
    expect(result.display.markdown).toContain("Momentum Breakout");
  });

  it("parses JSON fields correctly", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const result = await listStrategies(db);
    expect(result.data[0].tags).toEqual(["breakout", "sma"]);
    expect(result.data[0].supportedChainIds).toEqual([196]);
  });
});

describe("getStrategyBySlug", () => {
  it("returns ok with teaser for existing slug", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const result = await getStrategyBySlug(db, "momentum-breakout");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.slug).toBe("momentum-breakout");
    }
  });

  it("returns NOT_FOUND for missing slug", async () => {
    const result = await getStrategyBySlug(db, "nonexistent");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });

  it("display includes rule outline", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const result = await getStrategyBySlug(db, "momentum-breakout");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.display.markdown).toContain("Rules outline");
      expect(result.value.display.markdown).toContain("Enter long on breakout");
    }
  });
});

describe("getUnlockedStrategy", () => {
  it("returns full package with specs for existing slug", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const result = await getUnlockedStrategy(db, "momentum-breakout");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.naturalLanguageSpec).toBeDefined();
      expect(result.value.data.naturalLanguageSpec.overview).toContain("momentum");
      expect(result.value.data.ruleSpec.rules).toHaveLength(2);
    }
  });

  it("returns NOT_FOUND for missing slug", async () => {
    const result = await getUnlockedStrategy(db, "nonexistent");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("NOT_FOUND");
    }
  });
});

describe("publishStrategy", () => {
  it("creates strategy and returns teaser", async () => {
    const result = await publishStrategy(db, VALID_PUBLISH_BODY);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.slug).toBe("new-strategy");
      expect(result.value.data.title).toBe("New Strategy");
      expect(result.value.data.priceUsd).toBe(29.99);
    }
  });

  it("persists strategy in database", async () => {
    await publishStrategy(db, VALID_PUBLISH_BODY);

    const rows = await db.select().from(strategyPackages).all();
    expect(rows).toHaveLength(1);
    expect(rows[0].slug).toBe("new-strategy");
  });

  it("returns PUBLISHER_NOT_FOUND for invalid publisherId", async () => {
    const result = await publishStrategy(db, {
      ...VALID_PUBLISH_BODY,
      publisherId: "nonexistent",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("PUBLISHER_NOT_FOUND");
    }
  });

  it("returns SLUG_CONFLICT for duplicate slug", async () => {
    db.insert(strategyPackages).values(TEST_STRATEGY_ROW).run();

    const result = await publishStrategy(db, {
      ...VALID_PUBLISH_BODY,
      slug: "momentum-breakout", // already exists
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("SLUG_CONFLICT");
    }
  });

  it("defaults tags to empty array", async () => {
    const { tags: _, ...bodyWithoutTags } = VALID_PUBLISH_BODY;
    const result = await publishStrategy(db, bodyWithoutTags);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.tags).toEqual([]);
    }
  });

  it("defaults supportedChainIds to [196]", async () => {
    const { supportedChainIds: _, ...bodyWithoutChains } = VALID_PUBLISH_BODY;
    const result = await publishStrategy(db, bodyWithoutChains);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.data.supportedChainIds).toEqual([196]);
    }
  });
});
