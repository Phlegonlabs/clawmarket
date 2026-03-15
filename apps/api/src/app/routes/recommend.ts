import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { recommendStrategies } from "../../services/recommendation.js";

export const recommendRoute = new Hono<{ Bindings: Env }>();

recommendRoute.post("/strategies/recommend", async (c) => {
  const body = await c.req.json<{
    agentId?: string;
    preferences?: string;
    maxResults?: number;
  }>();

  if (!body.preferences || !body.agentId) {
    return c.json({ error: "VALIDATION_ERROR", message: "agentId and preferences are required" }, 400);
  }

  const db = createDb(c.env.DB);
  const result = await recommendStrategies(db, c.env.AI, {
    agentId: body.agentId,
    preferences: body.preferences,
    maxResults: body.maxResults,
  });

  if (!result.ok) {
    return c.json({ error: result.error, message: result.message }, 404);
  }

  return c.json(result.value);
});
