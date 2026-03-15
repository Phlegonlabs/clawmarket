import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";
import { createDb } from "../../lib/db.js";
import { strategyPackages } from "@clawmarket/db";

export const llmIndexRoute = new Hono<{ Bindings: Env }>();

async function buildLlmText(db: ReturnType<typeof createDb>): Promise<string> {
  const rows = await db.select({
    slug: strategyPackages.slug,
    title: strategyPackages.title,
    family: strategyPackages.family,
    priceUsd: strategyPackages.priceUsd,
    description: strategyPackages.description,
  }).from(strategyPackages).all();

  const catalog = rows.length
    ? rows.map((r) => `- ${r.title} (${r.slug}) — ${r.family}, $${r.priceUsd}: ${r.description}`).join("\n")
    : "No strategies listed yet.";

  return `# ClawMarket

> Agent-first trading strategy marketplace on X Layer (chain ID 196).

## What is ClawMarket?
ClawMarket lets publishers sell natural-language trading strategies and AI agents discover, backtest, and purchase them using x402 payment protocol.

## Key Endpoints
- GET /api/strategies — Browse strategy catalog
- POST /api/strategies/recommend — AI-powered recommendations
- POST /api/strategies/:slug/backtest — Run backtest with AI analysis
- POST /api/strategies/purchase-intent — Start x402 purchase
- GET /api/openclaw/skill-manifest — Machine-readable skill manifest
- GET /api/openclaw/skill.md — Human-readable skill docs

## Current Strategy Catalog
${catalog}

## Pricing
One-time purchase per strategy. USDT0/USDC on X Layer. 90% publisher / 10% platform.

## Integration
Use the OpenClaw skill manifest for structured integration. All responses include data + display (markdown).
`;
}

llmIndexRoute.get("/llms.txt", async (c) => {
  const db = createDb(c.env.DB);
  const text = await buildLlmText(db);
  return c.text(text, 200, { "Content-Type": "text/plain; charset=utf-8" });
});

llmIndexRoute.get("/llm.txt", async (c) => {
  const db = createDb(c.env.DB);
  const text = await buildLlmText(db);
  return c.text(text, 200, { "Content-Type": "text/plain; charset=utf-8" });
});
