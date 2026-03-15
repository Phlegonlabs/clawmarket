import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMarketPrice, getSwapQuote } from "../../lib/okx.js";
import type { Env } from "../../types/bindings.js";

export const executionRoute = new Hono<{ Bindings: Env }>();

// POST /api/execution/market-price — token price query
executionRoute.post(
  "/execution/market-price",
  zValidator(
    "json",
    z.object({
      tokenSymbol: z.string(),
      chainId: z.string().default("196"),
    }),
  ),
  async (c) => {
    const { tokenSymbol, chainId } = c.req.valid("json");
    const result = await getMarketPrice(c.env, tokenSymbol, chainId);

    if (!result.ok) {
      return c.json({ error: "OKX_ERROR", message: result.error }, 502);
    }

    return c.json({
      data: result.value,
      display: {
        markdown: `**${result.value.tokenSymbol}** — $${result.value.priceUsd.toFixed(4)}`,
      },
    });
  },
);

// POST /api/execution/dex-swap-intent — DEX swap route
executionRoute.post(
  "/execution/dex-swap-intent",
  zValidator(
    "json",
    z.object({
      fromToken: z.string(),
      toToken: z.string(),
      amount: z.string(),
      chainId: z.string().default("196"),
      slippage: z.string().default("0.5"),
    }),
  ),
  async (c) => {
    const params = c.req.valid("json");
    const result = await getSwapQuote(c.env, params);

    if (!result.ok) {
      return c.json({ error: "OKX_ERROR", message: result.error }, 502);
    }

    return c.json({
      data: result.value,
      display: {
        markdown: `**Swap Quote** ${result.value.fromAmount} → ${result.value.toAmount}\nImpact: ${result.value.priceImpact}% · Gas: ${result.value.estimatedGas}`,
      },
    });
  },
);
