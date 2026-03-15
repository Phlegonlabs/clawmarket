import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createDb } from "../../lib/db.js";
import { checkEntitlement } from "../../services/purchase.js";
import { getStrategyBySlug, getUnlockedStrategy, listStrategies } from "../../services/strategy.js";
import type { Env } from "../../types/bindings.js";

export const strategiesRoute = new Hono<{ Bindings: Env }>();

// GET /api/strategies — public strategy list (teasers)
strategiesRoute.get("/strategies", async (c) => {
  const db = createDb(c.env.DB);
  const result = await listStrategies(db);
  return c.json(result);
});

// GET /api/strategies/:slug — strategy detail + rule outline
strategiesRoute.get("/strategies/:slug", async (c) => {
  const db = createDb(c.env.DB);
  const result = await getStrategyBySlug(db, c.req.param("slug"));
  if (!result.ok) {
    return c.json({ error: result.error, message: result.message }, 404);
  }
  return c.json(result.value);
});

// GET /api/strategies/:slug/unlocked — full strategy (requires entitlement)
strategiesRoute.get(
  "/strategies/:slug/unlocked",
  zValidator("query", z.object({ agentId: z.string() })),
  async (c) => {
    const db = createDb(c.env.DB);
    const { agentId } = c.req.valid("query");
    const slug = c.req.param("slug");

    // Find strategy id from slug
    const stratResult = await getStrategyBySlug(db, slug);
    if (!stratResult.ok) {
      return c.json({ error: stratResult.error, message: stratResult.message }, 404);
    }

    // Check entitlement
    const entResult = await checkEntitlement(db, stratResult.value.data.id, agentId);
    if (!entResult.ok) {
      return c.json({ error: entResult.error, message: entResult.message }, 403);
    }

    // Return full package
    const fullResult = await getUnlockedStrategy(db, slug);
    if (!fullResult.ok) {
      return c.json({ error: fullResult.error, message: fullResult.message }, 404);
    }
    return c.json(fullResult.value);
  },
);
