import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { getPublisherReputation } from "../../services/reputation.js";

export const identityRoute = new Hono<{ Bindings: Env }>();

identityRoute.get("/openclaw/publishers/:publisherId/reputation", async (c) => {
  const publisherId = c.req.param("publisherId");
  const db = createDb(c.env.DB);
  const result = await getPublisherReputation(db, publisherId);

  if (!result.ok) {
    return c.json({ error: result.error, message: result.message }, 404);
  }

  return c.json(result.value);
});

identityRoute.post("/openclaw/publishers/verify", async (c) => {
  const body = await c.req.json<{ publisherId?: string; walletAddress?: string }>();

  if (!body.publisherId || !body.walletAddress) {
    return c.json({ error: "VALIDATION_ERROR", message: "publisherId and walletAddress required" }, 400);
  }

  // Placeholder — actual ERC-8004 verification in production
  return c.json({
    data: {
      publisherId: body.publisherId,
      verified: false,
      method: "erc8004",
      message: "ERC-8004 verification not yet available on X Layer",
    },
    display: { markdown: "Publisher verification via ERC-8004 is coming soon." },
  });
});

identityRoute.post("/agents/verify", async (c) => {
  const body = await c.req.json<{ agentId?: string; walletAddress?: string }>();

  if (!body.agentId || !body.walletAddress) {
    return c.json({ error: "VALIDATION_ERROR", message: "agentId and walletAddress required" }, 400);
  }

  return c.json({
    data: {
      agentId: body.agentId,
      verified: false,
      method: "erc8004",
      message: "Agent identity verification via ERC-8004 is coming soon.",
    },
    display: { markdown: "Agent verification via ERC-8004 is coming soon." },
  });
});
