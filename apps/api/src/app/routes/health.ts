import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";

export const healthRoute = new Hono<{ Bindings: Env }>();

healthRoute.get("/health", async (c) => {
  const checks: Record<string, string> = {
    api: "ok",
  };

  let d1Status = "unknown";
  try {
    const result = await c.env.DB.prepare("SELECT 1 as ok").first<{ ok: number }>();
    d1Status = result?.ok === 1 ? "ok" : "error";
  } catch {
    d1Status = "error";
  }
  checks.d1 = d1Status;

  const allOk = Object.values(checks).every((s) => s === "ok");

  return c.json(
    {
      data: {
        status: allOk ? "operational" : "degraded",
        checks,
        version: "0.1.0",
        timestamp: new Date().toISOString(),
      },
      display: {
        markdown: allOk ? "**ClawMarket API** — Operational" : "**ClawMarket API** — Degraded",
      },
    },
    allOk ? 200 : 503,
  );
});
