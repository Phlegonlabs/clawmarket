import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { getBalance, topUp } from "../../services/credits.js";

export const creditsRoute = new Hono<{ Bindings: Env }>();

creditsRoute.get("/credits/balance", async (c) => {
  const agentId = c.req.query("agentId");
  const chainId = c.req.query("chainId") ?? "196";
  if (!agentId) {
    return c.json({ error: "VALIDATION_ERROR", message: "agentId query param required" }, 400);
  }

  const db = createDb(c.env.DB);
  const result = await getBalance(db, agentId, chainId);
  return c.json(result);
});

creditsRoute.post("/credits/top-up", async (c) => {
  const body = await c.req.json<{
    agentId?: string;
    amount?: number;
    chainId?: string;
    txHash?: string;
  }>();

  if (!body.agentId || !body.amount) {
    return c.json({ error: "VALIDATION_ERROR", message: "agentId and amount required" }, 400);
  }

  const db = createDb(c.env.DB);
  const result = await topUp(db, body.agentId, body.amount, body.chainId ?? "196", body.txHash);

  if (!result.ok) {
    return c.json({ error: result.error, message: result.message }, 400);
  }

  return c.json(result.value);
});
