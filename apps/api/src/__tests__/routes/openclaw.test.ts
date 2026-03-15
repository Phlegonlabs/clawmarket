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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

const env = createMockEnv();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/openclaw/skill-manifest", () => {
  it("returns JSON manifest with capabilities", async () => {
    const res = await app.request("/api/openclaw/skill-manifest", {}, env);
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.name).toBe("ClawMarket");
    expect(body.capabilities).toBeDefined();
    expect(body.capabilities.length).toBeGreaterThan(0);
    expect(body.authentication.type).toBe("x402");
  });
});

describe("GET /api/openclaw/skill.md", () => {
  it("returns markdown skill documentation", async () => {
    const res = await app.request("/api/openclaw/skill.md", {}, env);
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text).toContain("ClawMarket");
    expect(text).toContain("Quick Start");
    expect(text).toContain("/api/strategies");
  });
});
