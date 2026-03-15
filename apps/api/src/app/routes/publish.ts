import {
  ChainIdSchema,
  DEFAULT_CHAIN_ID,
  ExecutionModeSchema,
  NaturalLanguageSpecSchema,
  RuleSpecSchema,
  StrategyFamilySchema,
} from "@clawmarket/contracts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createDb } from "../../lib/db.js";
import { publishStrategy } from "../../services/strategy.js";
import type { Env } from "../../types/bindings.js";

const PublishBodySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  family: StrategyFamilySchema,
  executionMode: ExecutionModeSchema,
  tags: z.array(z.string()).optional(),
  priceUsd: z.number().positive(),
  publisherId: z.string(),
  supportedChainIds: z.array(ChainIdSchema).default([DEFAULT_CHAIN_ID]),
  naturalLanguageSpec: NaturalLanguageSpecSchema,
  ruleSpec: RuleSpecSchema,
});

export const publishRoute = new Hono<{ Bindings: Env }>();

// POST /api/openclaw/strategies/publish — publisher submits a strategy
publishRoute.post(
  "/openclaw/strategies/publish",
  zValidator("json", PublishBodySchema),
  async (c) => {
    const db = createDb(c.env.DB);
    const body = c.req.valid("json");
    const result = await publishStrategy(db, body);
    if (!result.ok) {
      const status = result.error === "SLUG_CONFLICT" ? 409 : 404;
      return c.json({ error: result.error, message: result.message }, status);
    }
    return c.json(result.value, 201);
  },
);
