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

import { listStrategies, getStrategyBySlug, getUnlockedStrategy } from "../../services/strategy.js";
import { checkEntitlement } from "../../services/purchase.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

const env = createMockEnv();

const MOCK_TEASER = {
  id: "strat_1",
  slug: "test-strat",
  title: "Test Strategy",
  description: "A test strategy",
  family: "momentum" as const,
  executionMode: "manual" as const,
  tags: [],
  priceUsd: 49.99,
  publisherId: "pub_1",
  supportedChainIds: [196],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/strategies", () => {
  it("returns 200 with strategy list", async () => {
    vi.mocked(listStrategies).mockResolvedValue({
      data: [MOCK_TEASER],
      display: { markdown: "1. Test Strategy" },
    });

    const res = await app.request("/api/strategies", {}, env);
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data).toHaveLength(1);
    expect(body.data[0].slug).toBe("test-strat");
  });
});

describe("GET /api/strategies/:slug", () => {
  it("returns 200 for existing strategy", async () => {
    vi.mocked(getStrategyBySlug).mockResolvedValue(
      ok({ data: MOCK_TEASER, display: { markdown: "Test" } }),
    );

    const res = await app.request("/api/strategies/test-strat", {}, env);
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data.slug).toBe("test-strat");
  });

  it("returns 404 for missing strategy", async () => {
    vi.mocked(getStrategyBySlug).mockResolvedValue(
      err("NOT_FOUND", "Strategy not found"),
    );

    const res = await app.request("/api/strategies/nonexistent", {}, env);
    expect(res.status).toBe(404);

    const body = (await res.json()) as Json;
    expect(body.error).toBe("NOT_FOUND");
  });
});

describe("GET /api/strategies/:slug/unlocked", () => {
  it("returns 200 with entitlement", async () => {
    vi.mocked(getStrategyBySlug).mockResolvedValue(
      ok({ data: MOCK_TEASER, display: { markdown: "Test" } }),
    );
    vi.mocked(checkEntitlement).mockResolvedValue(
      ok({
        id: "ent_1",
        strategyId: "strat_1",
        agentId: "agent_1",
        purchaseId: "pur_1",
        grantedAt: "2026-01-01T00:00:00.000Z",
      }),
    );
    vi.mocked(getUnlockedStrategy).mockResolvedValue(
      ok({
        data: {
          ...MOCK_TEASER,
          naturalLanguageSpec: {
            overview: "test",
            entryConditions: ["c1"],
            exitConditions: ["c2"],
            riskManagement: "rm",
          },
          ruleSpec: { rules: [] },
        },
        display: { markdown: "Full" },
      }),
    );

    const res = await app.request("/api/strategies/test-strat/unlocked?agentId=agent_1", {}, env);
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data.naturalLanguageSpec).toBeDefined();
  });

  it("returns 403 without entitlement", async () => {
    vi.mocked(getStrategyBySlug).mockResolvedValue(
      ok({ data: MOCK_TEASER, display: { markdown: "Test" } }),
    );
    vi.mocked(checkEntitlement).mockResolvedValue(
      err("NOT_ENTITLED", "No access"),
    );

    const res = await app.request("/api/strategies/test-strat/unlocked?agentId=agent_1", {}, env);
    expect(res.status).toBe(403);
  });

  it("returns 404 when strategy not found", async () => {
    vi.mocked(getStrategyBySlug).mockResolvedValue(
      err("NOT_FOUND", "Not found"),
    );

    const res = await app.request("/api/strategies/nonexistent/unlocked?agentId=agent_1", {}, env);
    expect(res.status).toBe(404);
  });

  it("returns 400 when agentId query param missing", async () => {
    const res = await app.request("/api/strategies/test-strat/unlocked", {}, env);
    expect(res.status).toBe(400);
  });
});
