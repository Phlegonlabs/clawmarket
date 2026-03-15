import { describe, expect, it } from "vitest";
import { getPaymentAdapter } from "../../lib/x402.js";

describe("getPaymentAdapter", () => {
  it("returns adapter for X Layer (196)", () => {
    const result = getPaymentAdapter(196);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.chainConfig.chainId).toBe(196);
    }
  });

  it("returns error for unknown chain", () => {
    const result = getPaymentAdapter(999);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("CHAIN_NOT_FOUND");
    }
  });
});

describe("ChainPaymentAdapter", () => {
  function getAdapter() {
    const result = getPaymentAdapter(196);
    if (!result.ok) throw new Error("Expected ok");
    return result.value;
  }

  describe("getEIP712Domain", () => {
    it("returns correct domain with chainId", () => {
      const domain = getAdapter().getEIP712Domain();
      expect(domain.name).toBe("ClawMarket");
      expect(domain.version).toBe("1");
      expect(domain.chainId).toBe(196);
      expect(domain.verifyingContract).toMatch(/^0x/);
    });
  });

  describe("getPaymentToken", () => {
    it("returns USDT0 by default", () => {
      const result = getAdapter().getPaymentToken();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.address).toMatch(/^0x/);
        expect(result.value.decimals).toBe(6);
      }
    });

    it("returns USDC explicitly", () => {
      const result = getAdapter().getPaymentToken("USDC");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.decimals).toBe(6);
      }
    });

    it("returns error for unknown token", () => {
      const result = getAdapter().getPaymentToken("DAI");
      expect(result.ok).toBe(false);
    });
  });

  describe("getFacilitatorAddress", () => {
    it("returns x402 facilitator address", () => {
      const addr = getAdapter().getFacilitatorAddress();
      expect(addr).toMatch(/^0x/);
    });
  });

  describe("buildChallenge", () => {
    it("produces valid challenge with default token", () => {
      const result = getAdapter().buildChallenge({
        payTo: "0xTREASURY",
        amountUsd: 49.99,
        expiresAt: "2026-12-31T00:00:00.000Z",
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.payTo).toBe("0xTREASURY");
        expect(result.value.token).toBe("USDT0");
        expect(result.value.chainId).toBe(196);
        expect(result.value.facilitatorAddress).toMatch(/^0x/);
        expect(result.value.eip712Domain.chainId).toBe(196);
      }
    });

    it("calculates raw amount correctly (USD * 10^decimals)", () => {
      const result = getAdapter().buildChallenge({
        payTo: "0xTREASURY",
        amountUsd: 49.99,
        expiresAt: "2026-12-31T00:00:00.000Z",
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        // 49.99 * 10^6 = 49990000
        expect(result.value.amount).toBe("49990000");
      }
    });

    it("returns error for unknown token", () => {
      const result = getAdapter().buildChallenge({
        payTo: "0xTREASURY",
        amountUsd: 10,
        tokenSymbol: "DAI",
        expiresAt: "2026-12-31T00:00:00.000Z",
      });
      expect(result.ok).toBe(false);
    });
  });
});
