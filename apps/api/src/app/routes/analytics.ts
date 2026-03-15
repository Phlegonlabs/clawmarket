import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { getPublisherAnalytics } from "../../services/analytics.js";

export const analyticsRoute = new Hono<{ Bindings: Env }>();

analyticsRoute.get("/openclaw/publishers/:publisherId/analytics", async (c) => {
  const publisherId = c.req.param("publisherId");
  const db = createDb(c.env.DB);
  const result = await getPublisherAnalytics(db, publisherId);

  if (!result.ok) {
    return c.json({ error: result.error, message: result.message }, 404);
  }

  return c.json(result.value);
});
