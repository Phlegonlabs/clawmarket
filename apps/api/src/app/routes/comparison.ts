import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { compareStrategies } from "../../services/comparison.js";

export const comparisonRoute = new Hono<{ Bindings: Env }>();

comparisonRoute.post("/strategies/compare", async (c) => {
  const body = await c.req.json<{ slugs?: string[] }>();

  if (!body.slugs || !Array.isArray(body.slugs)) {
    return c.json({ error: "VALIDATION_ERROR", message: "slugs array is required" }, 400);
  }

  const db = createDb(c.env.DB);
  const result = await compareStrategies(db, c.env.AI, body.slugs);

  if (!result.ok) {
    const status = result.error === "NOT_FOUND" ? 404 : 400;
    return c.json({ error: result.error, message: result.message }, status);
  }

  return c.json(result.value);
});
