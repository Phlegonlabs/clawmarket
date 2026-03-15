import { describe, expect, it, vi } from "vitest";
import app from "../../app/index.js";
import type { Env } from "../../types/bindings.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

function createHealthEnv(d1Ok: boolean): Env {
  const mockD1 = {
    prepare: vi.fn(() => ({
      first: d1Ok ? vi.fn().mockResolvedValue({ ok: 1 }) : vi.fn().mockRejectedValue(new Error("DB down")),
      bind: vi.fn().mockReturnThis(),
      run: vi.fn(),
      all: vi.fn(),
    })),
  };

  return {
    DB: mockD1 as unknown as D1Database,
    AI: {} as unknown as Ai,
    BACKTEST: {} as unknown as Fetcher,
    ENVIRONMENT: "test",
    PLATFORM_REVENUE_SHARE_BPS: "1000",
  };
}

describe("GET /api/health", () => {
  it("returns 200 when D1 is ok", async () => {
    const res = await app.request("/api/health", {}, createHealthEnv(true));
    expect(res.status).toBe(200);

    const body = (await res.json()) as Json;
    expect(body.data.status).toBe("operational");
    expect(body.data.checks.d1).toBe("ok");
    expect(body.data.version).toBe("0.1.0");
  });

  it("returns 503 when D1 fails", async () => {
    const res = await app.request("/api/health", {}, createHealthEnv(false));
    expect(res.status).toBe(503);

    const body = (await res.json()) as Json;
    expect(body.data.status).toBe("degraded");
    expect(body.data.checks.d1).toBe("error");
  });

  it("response has data and display", async () => {
    const res = await app.request("/api/health", {}, createHealthEnv(true));
    const body = (await res.json()) as Json;
    expect(body.data).toBeDefined();
    expect(body.display).toBeDefined();
    expect(body.display.markdown).toContain("ClawMarket API");
  });

  it("includes timestamp", async () => {
    const res = await app.request("/api/health", {}, createHealthEnv(true));
    const body = (await res.json()) as Json;
    expect(body.data.timestamp).toBeDefined();
  });
});
