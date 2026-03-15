import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { getLeaderboard, getStrategyRank } from "../../services/leaderboard.js";

export const leaderboardRoute = new Hono<{ Bindings: Env }>();

leaderboardRoute.get("/leaderboard", async (c) => {
  const category = c.req.query("category") ?? "overall";
  const limit = Number.parseInt(c.req.query("limit") ?? "20", 10);
  const offset = Number.parseInt(c.req.query("offset") ?? "0", 10);

  const db = createDb(c.env.DB);
  const result = await getLeaderboard(db, category, limit, offset);
  return c.json(result);
});

leaderboardRoute.get("/leaderboard/trending", async (c) => {
  const limit = Number.parseInt(c.req.query("limit") ?? "10", 10);
  const db = createDb(c.env.DB);
  const result = await getLeaderboard(db, "trending", limit, 0);
  return c.json(result);
});

leaderboardRoute.get("/leaderboard/:slug/rank", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);
  const result = await getStrategyRank(db, slug);

  if (!result.ok) {
    return c.json({ error: result.error, message: result.message }, 404);
  }

  return c.json(result.value);
});
