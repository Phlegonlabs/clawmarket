import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { runStrategyBacktest } from "../../services/backtest.js";

export const backtestRoute = new Hono<{ Bindings: Env }>();

backtestRoute.post("/strategies/:slug/backtest", async (c) => {
  const slug = c.req.param("slug");
  const body = await c.req.json<{
    period?: string;
    initialCapital?: number;
    tokenSymbol?: string;
    chainId?: number;
  }>();

  const db = createDb(c.env.DB);
  const result = await runStrategyBacktest(db, c.env, slug, body);

  if (!result.ok) {
    const status = result.error === "NOT_FOUND" ? 404 : 502;
    return c.json({ error: result.error, message: result.message }, status);
  }

  return c.json(result.value);
});
