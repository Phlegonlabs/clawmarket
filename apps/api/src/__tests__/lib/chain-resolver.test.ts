import { describe, expect, it } from "vitest";
import { resolveChain, getEnabledChains, getDefaultChain } from "../../lib/chain-resolver.js";

describe("resolveChain", () => {
  it("returns ok for X Layer (196)", () => {
    const result = resolveChain(196);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.chainId).toBe(196);
      expect(result.value.name).toBe("X Layer");
    }
  });

  it("returns CHAIN_NOT_FOUND for unknown chain", () => {
    const result = resolveChain(999);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("CHAIN_NOT_FOUND");
    }
  });
});

describe("getEnabledChains", () => {
  it("returns only enabled chains", () => {
    const chains = getEnabledChains();
    expect(chains.length).toBeGreaterThan(0);
    expect(chains.every((c) => c.enabled)).toBe(true);
  });

  it("includes X Layer in V1", () => {
    const chains = getEnabledChains();
    expect(chains.some((c) => c.chainId === 196)).toBe(true);
  });
});

describe("getDefaultChain", () => {
  it("returns X Layer as default", () => {
    const chain = getDefaultChain();
    expect(chain.chainId).toBe(196);
    expect(chain.isDefault).toBe(true);
  });
});
