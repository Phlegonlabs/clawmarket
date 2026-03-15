import type { Result } from "@clawmarket/contracts";
import { err, ok } from "@clawmarket/contracts";
import type { Env } from "../types/bindings.js";

export interface OkxMarketPrice {
  tokenSymbol: string;
  priceUsd: number;
  timestamp: string;
}

export interface OkxSwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  priceImpact: number;
  route: string[];
  estimatedGas: string;
}

function getHeaders(env: Env): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "OK-ACCESS-PROJECT": env.OKX_PROJECT_ID ?? "",
    "OK-ACCESS-KEY": env.OKX_API_KEY ?? "",
    "OK-ACCESS-PASSPHRASE": env.OKX_PASSPHRASE ?? "",
  };
}

export async function getMarketPrice(
  env: Env,
  tokenSymbol: string,
  chainId = "196",
): Promise<Result<OkxMarketPrice, string>> {
  const baseUrl = env.OKX_ONCHAINOS_BASE_URL ?? "https://web3.okx.com";
  try {
    const resp = await fetch(`${baseUrl}/api/v5/dex/aggregator/all-tokens?chainId=${chainId}`, {
      headers: getHeaders(env),
    });
    if (!resp.ok) {
      return err(`OKX API error: ${resp.status} ${resp.statusText}`);
    }
    const body = (await resp.json()) as {
      data?: Array<{ tokenSymbol: string; tokenUnitPrice: string }>;
    };
    const token = body.data?.find((t) => t.tokenSymbol.toUpperCase() === tokenSymbol.toUpperCase());
    if (!token) {
      return err(`Token ${tokenSymbol} not found on chain ${chainId}`);
    }
    return ok({
      tokenSymbol: token.tokenSymbol,
      priceUsd: Number.parseFloat(token.tokenUnitPrice),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return err(`OKX request failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export async function getSwapQuote(
  env: Env,
  params: {
    fromToken: string;
    toToken: string;
    amount: string;
    chainId?: string;
    slippage?: string;
  },
): Promise<Result<OkxSwapQuote, string>> {
  const baseUrl = env.OKX_ONCHAINOS_BASE_URL ?? "https://web3.okx.com";
  const chainId = params.chainId ?? "196";
  const slippage = params.slippage ?? "0.5";
  try {
    const qs = new URLSearchParams({
      chainId,
      fromTokenAddress: params.fromToken,
      toTokenAddress: params.toToken,
      amount: params.amount,
      slippage,
    });
    const resp = await fetch(`${baseUrl}/api/v5/dex/aggregator/quote?${qs}`, {
      headers: getHeaders(env),
    });
    if (!resp.ok) {
      return err(`OKX API error: ${resp.status} ${resp.statusText}`);
    }
    const body = (await resp.json()) as {
      data?: Array<{
        toTokenAmount: string;
        priceImpact: string;
        routerResult?: { routes?: string[] };
        estimateGasFee: string;
      }>;
    };
    const quote = body.data?.[0];
    if (!quote) {
      return err("No swap quote returned from OKX");
    }
    return ok({
      fromToken: params.fromToken,
      toToken: params.toToken,
      fromAmount: params.amount,
      toAmount: quote.toTokenAmount,
      priceImpact: Number.parseFloat(quote.priceImpact || "0"),
      route: quote.routerResult?.routes ?? [],
      estimatedGas: quote.estimateGasFee,
    });
  } catch (e) {
    return err(`OKX request failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
