import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { getBundleBySlug, listBundles, publishBundle } from "../../services/bundles.js";

export const bundlesRoute = new Hono<{ Bindings: Env }>();

bundlesRoute.get("/bundles", async (c) => {
  const db = createDb(c.env.DB);
  const result = await listBundles(db);
  return c.json(result);
});

bundlesRoute.get("/bundles/:slug", async (c) => {
  const slug = c.req.param("slug");
  const db = createDb(c.env.DB);
  const result = await getBundleBySlug(db, slug);

  if (!result.ok) {
    return c.json({ error: result.error, message: result.message }, 404);
  }

  return c.json(result.value);
});

bundlesRoute.post("/openclaw/bundles/publish", async (c) => {
  const body = await c.req.json<{
    slug?: string;
    name?: string;
    description?: string;
    strategySlugs?: string[];
    priceUsd?: number;
    publisherId?: string;
    tags?: string[];
  }>();

  if (!body.slug || !body.name || !body.description || !body.strategySlugs || !body.priceUsd || !body.publisherId) {
    return c.json({ error: "VALIDATION_ERROR", message: "Missing required fields" }, 400);
  }

  const db = createDb(c.env.DB);
  const result = await publishBundle(db, {
    slug: body.slug,
    name: body.name,
    description: body.description,
    strategySlugs: body.strategySlugs,
    priceUsd: body.priceUsd,
    publisherId: body.publisherId,
    tags: body.tags,
  });

  if (!result.ok) {
    if (result.error === "SLUG_CONFLICT") {
      return c.json({ error: result.error, message: result.message }, 409);
    }
    if (result.error === "PUBLISHER_NOT_FOUND" || result.error === "STRATEGY_NOT_FOUND") {
      return c.json({ error: result.error, message: result.message }, 404);
    }
    return c.json({ error: result.error, message: result.message }, 400);
  }

  return c.json(result.value, 201);
});
