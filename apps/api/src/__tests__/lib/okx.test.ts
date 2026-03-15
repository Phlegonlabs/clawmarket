import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMarketPrice, getSwapQuote } from "../../lib/okx.js";
import { createMockEnv } from "../helpers/mock-env.js";

describe("getMarketPrice", () => {
  const env = createMockEnv();

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns price for known token", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            { tokenSymbol: "USDT", tokenUnitPrice: "1.0001" },
            { tokenSymbol: "ETH", tokenUnitPrice: "3500.50" },
          ],
        }),
        { status: 200 },
      ),
    );

    const result = await getMarketPrice(env, "ETH");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.tokenSymbol).toBe("ETH");
      expect(result.value.priceUsd).toBeCloseTo(3500.5);
      expect(result.value.timestamp).toBeDefined();
    }
  });

  it("matches token symbol case-insensitively", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ data: [{ tokenSymbol: "USDT", tokenUnitPrice: "1.0" }] }), {
        status: 200,
      }),
    );

    const result = await getMarketPrice(env, "usdt");
    expect(result.ok).toBe(true);
  });

  it("returns error when token not found", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ data: [{ tokenSymbol: "USDT", tokenUnitPrice: "1.0" }] }), {
        status: 200,
      }),
    );

    const result = await getMarketPrice(env, "UNKNOWN");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("not found");
    }
  });

  it("returns error on HTTP failure", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("Server Error", { status: 500, statusText: "Internal Server Error" }));

    const result = await getMarketPrice(env, "ETH");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("500");
    }
  });

  it("returns error on network failure", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const result = await getMarketPrice(env, "ETH");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Network error");
    }
  });

  it("sends correct OKX headers", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ data: [{ tokenSymbol: "ETH", tokenUnitPrice: "3000" }] }), {
        status: 200,
      }),
    );

    await getMarketPrice(env, "ETH");

    expect(fetch).toHaveBeenCalledOnce();
    const call = vi.mocked(fetch).mock.calls[0];
    const headers = call[1]?.headers as Record<string, string>;
    expect(headers["OK-ACCESS-PROJECT"]).toBe("test-project");
    expect(headers["OK-ACCESS-KEY"]).toBe("test-key");
    expect(headers["OK-ACCESS-PASSPHRASE"]).toBe("test-passphrase");
  });
});

describe("getSwapQuote", () => {
  const env = createMockEnv();

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns quote data", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              toTokenAmount: "1000000",
              priceImpact: "0.1",
              routerResult: { routes: ["route1"] },
              estimateGasFee: "50000",
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const result = await getSwapQuote(env, {
      fromToken: "0xA",
      toToken: "0xB",
      amount: "500000",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fromToken).toBe("0xA");
      expect(result.value.toToken).toBe("0xB");
      expect(result.value.fromAmount).toBe("500000");
      expect(result.value.toAmount).toBe("1000000");
      expect(result.value.priceImpact).toBeCloseTo(0.1);
      expect(result.value.estimatedGas).toBe("50000");
    }
  });

  it("returns error when no quote returned", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), { status: 200 }),
    );

    const result = await getSwapQuote(env, {
      fromToken: "0xA",
      toToken: "0xB",
      amount: "500000",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("No swap quote");
    }
  });

  it("returns error on HTTP failure", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("Bad Gateway", { status: 502, statusText: "Bad Gateway" }),
    );

    const result = await getSwapQuote(env, {
      fromToken: "0xA",
      toToken: "0xB",
      amount: "500000",
    });
    expect(result.ok).toBe(false);
  });
});
