import { beforeEach, describe, expect, it, vi } from "vitest";
import { ok, err } from "@clawmarket/contracts";
import app from "../../app/index.js";
import { createMockEnv } from "../helpers/mock-env.js";
import { VALID_PUBLISH_BODY } from "../helpers/fixtures.js";

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

import { publishStrategy } from "../../services/strategy.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

const env = createMockEnv();

function postPublish(body: unknown) {
  return app.request("/api/openclaw/strategies/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }, env);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/openclaw/strategies/publish", () => {
  it("returns 201 on success", async () => {
    vi.mocked(publishStrategy).mockResolvedValue(
      ok({
        data: {
          id: "strat_new",
          slug: "new-strategy",
          title: "New Strategy",
          description: "A new strategy",
          family: "momentum",
          executionMode: "manual",
          tags: ["test"],
          priceUsd: 29.99,
          publisherId: "pub_test1",
          supportedChainIds: [196],
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        display: { markdown: "Published" },
      }),
    );

    const res = await postPublish(VALID_PUBLISH_BODY);
    expect(res.status).toBe(201);

    const body = (await res.json()) as Json;
    expect(body.data.slug).toBe("new-strategy");
  });

  it("returns 409 on SLUG_CONFLICT", async () => {
    vi.mocked(publishStrategy).mockResolvedValue(
      err("SLUG_CONFLICT", "Slug already exists"),
    );

    const res = await postPublish(VALID_PUBLISH_BODY);
    expect(res.status).toBe(409);
  });

  it("returns 404 on PUBLISHER_NOT_FOUND", async () => {
    vi.mocked(publishStrategy).mockResolvedValue(
      err("PUBLISHER_NOT_FOUND", "Publisher not found"),
    );

    const res = await postPublish(VALID_PUBLISH_BODY);
    expect(res.status).toBe(404);
  });

  it("returns 400 on invalid slug format", async () => {
    const res = await postPublish({
      ...VALID_PUBLISH_BODY,
      slug: "HAS SPACES",
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 on missing required fields", async () => {
    const res = await postPublish({ slug: "test" });
    expect(res.status).toBe(400);
  });
});
