import { Hono } from "hono";
import type { Env } from "../../types/bindings.js";

export const openclawRoute = new Hono<{ Bindings: Env }>();

const SKILL_MANIFEST = {
  name: "ClawMarket",
  description: "Agent-first trading strategy marketplace on X Layer. Browse, evaluate, and purchase expert-crafted strategies via x402.",
  version: "1.0.0",
  capabilities: [
    {
      name: "list-strategies",
      description: "List all available trading strategies with teasers",
      endpoint: { method: "GET", path: "/api/strategies" },
    },
    {
      name: "get-strategy",
      description: "Get strategy details and rule outline by slug",
      endpoint: { method: "GET", path: "/api/strategies/:slug" },
    },
    {
      name: "recommend-strategies",
      description: "Get AI-powered strategy recommendations based on preferences",
      endpoint: { method: "POST", path: "/api/strategies/recommend" },
      parameters: { agentId: "string (required)", preferences: "string (required)", maxResults: "number (optional, default 3)" },
    },
    {
      name: "backtest-strategy",
      description: "Run backtest with simulated data and AI analysis",
      endpoint: { method: "POST", path: "/api/strategies/:slug/backtest" },
      parameters: { period: "string (7d|30d|90d|180d|365d)", initialCapital: "number", tokenSymbol: "string" },
    },
    {
      name: "purchase-strategy",
      description: "Initiate x402 payment flow for strategy purchase",
      endpoint: { method: "POST", path: "/api/strategies/purchase-intent" },
      parameters: { strategySlug: "string", agentId: "string", chainId: "number (default 196)" },
    },
    {
      name: "complete-purchase",
      description: "Complete purchase after EIP-712 signing",
      endpoint: { method: "POST", path: "/api/strategies/purchases/complete" },
      parameters: { intentId: "string", txHash: "string (optional)" },
    },
    {
      name: "unlock-strategy",
      description: "Access full strategy package after purchase",
      endpoint: { method: "GET", path: "/api/strategies/:slug/unlocked?agentId=:agentId" },
    },
    {
      name: "market-price",
      description: "Query current token price via OKX",
      endpoint: { method: "POST", path: "/api/execution/market-price" },
      parameters: { tokenSymbol: "string" },
    },
    {
      name: "dex-swap",
      description: "Get DEX swap quote via OKX aggregator",
      endpoint: { method: "POST", path: "/api/execution/dex-swap-intent" },
      parameters: { fromToken: "string", toToken: "string", amount: "string" },
    },
  ],
  authentication: {
    type: "x402",
    description: "Strategy purchases use x402 EIP-712 signing on X Layer (chain ID 196). Browsing, recommendations, and backtests are free.",
  },
  pricing: {
    model: "per-strategy",
    description: "One-time payment per strategy. Permanent access after purchase.",
    currency: "USDT0/USDC on X Layer",
  },
};

openclawRoute.get("/openclaw/skill-manifest", (c) => {
  return c.json(SKILL_MANIFEST);
});

openclawRoute.get("/openclaw/skill.md", (c) => {
  const md = `# ClawMarket — OpenClaw Skill

## Overview
ClawMarket is an agent-first trading strategy marketplace on X Layer.
Publishers submit natural-language strategy packages; agents discover, evaluate, and purchase them.

## Quick Start

### 1. Browse strategies
\`GET /api/strategies\` — Returns a list of strategy teasers (title, family, price, tags).

### 2. Get recommendations
\`POST /api/strategies/recommend\` — Send your preferences and get AI-matched strategies.

### 3. Backtest before buying
\`POST /api/strategies/:slug/backtest\` — Run a simulated backtest with AI analysis.

### 4. Purchase
\`POST /api/strategies/purchase-intent\` — Start x402 payment flow.
\`POST /api/strategies/purchases/signing-template\` — Get EIP-712 data to sign.
\`POST /api/strategies/purchases/complete\` — Submit signed transaction.

### 5. Access full strategy
\`GET /api/strategies/:slug/unlocked?agentId=your_id\` — Get the full strategy package.

## Execution
\`POST /api/execution/market-price\` — Token price query.
\`POST /api/execution/dex-swap-intent\` — DEX swap quote.

## Pricing
- One-time purchase per strategy
- Payment via USDT0 or USDC on X Layer (chain ID 196)
- 90% to publisher, 10% platform fee

## Response Format
All endpoints return \`{ data, display: { markdown } }\` for agent consumption.
`;
  return c.text(md, 200, { "Content-Type": "text/markdown; charset=utf-8" });
});
