import { PurchaseIntentRequestSchema } from "@clawmarket/contracts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createDb } from "../../lib/db.js";
import {
  completePurchase,
  createPurchaseIntent,
  getSigningTemplate,
} from "../../services/purchase.js";
import type { Env } from "../../types/bindings.js";

export const purchasesRoute = new Hono<{ Bindings: Env }>();

// POST /api/strategies/purchase-intent — returns 402 + x402 challenge
purchasesRoute.post(
  "/strategies/purchase-intent",
  zValidator("json", PurchaseIntentRequestSchema),
  async (c) => {
    const db = createDb(c.env.DB);
    const body = c.req.valid("json");
    const payTo = c.env.X402_PAY_TO ?? "0x0000000000000000000000000000000000000000";

    const result = await createPurchaseIntent(db, body, payTo);
    if (!result.ok) {
      const statusMap: Record<string, number> = {
        VALIDATION: 400,
        STRATEGY_NOT_FOUND: 404,
        CHAIN_ERROR: 400,
        ALREADY_OWNED: 409,
      };
      return c.json(
        { error: result.error, message: result.message },
        (statusMap[result.error] ?? 400) as 400,
      );
    }
    return c.json(result.value, 402);
  },
);

// POST /api/strategies/purchases/signing-template — EIP-712 typed data
purchasesRoute.post(
  "/strategies/purchases/signing-template",
  zValidator("json", z.object({ intentId: z.string() })),
  async (c) => {
    const db = createDb(c.env.DB);
    const { intentId } = c.req.valid("json");

    const result = await getSigningTemplate(db, intentId);
    if (!result.ok) {
      const status = result.error === "EXPIRED" ? 410 : 404;
      return c.json({ error: result.error, message: result.message }, status);
    }
    return c.json(result.value);
  },
);

// POST /api/strategies/purchases/complete — verify signature + settle
purchasesRoute.post(
  "/strategies/purchases/complete",
  zValidator("json", z.object({ intentId: z.string(), txHash: z.string().optional() })),
  async (c) => {
    const db = createDb(c.env.DB);
    const { intentId, txHash } = c.req.valid("json");
    const platformShareBps = Number.parseInt(c.env.PLATFORM_REVENUE_SHARE_BPS ?? "1000", 10);

    const result = await completePurchase(db, intentId, txHash, platformShareBps);
    if (!result.ok) {
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        EXPIRED: 410,
        ALREADY_COMPLETED: 409,
      };
      return c.json(
        { error: result.error, message: result.message },
        (statusMap[result.error] ?? 400) as 400,
      );
    }
    return c.json(result.value);
  },
);
