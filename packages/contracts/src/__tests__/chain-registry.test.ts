import { describe, expect, it } from "vitest";
import {
  ChainConfigSchema,
  ChainIdSchema,
  DEFAULT_CHAIN_ID,
  DEFAULT_CHAIN_REGISTRY,
  KNOWN_CHAIN_IDS,
  PaymentTokenSchema,
  X_LAYER_CONFIG,
} from "../index.js";

describe("ChainIdSchema", () => {
  it("accepts positive integers", () => {
    expect(ChainIdSchema.parse(196)).toBe(196);
    expect(ChainIdSchema.parse(8453)).toBe(8453);
  });

  it("rejects non-positive values", () => {
    expect(() => ChainIdSchema.parse(0)).toThrow();
    expect(() => ChainIdSchema.parse(-1)).toThrow();
    expect(() => ChainIdSchema.parse(1.5)).toThrow();
  });
});

describe("KNOWN_CHAIN_IDS", () => {
  it("has X Layer as 196", () => {
    expect(KNOWN_CHAIN_IDS.X_LAYER).toBe(196);
  });

  it("DEFAULT_CHAIN_ID is X Layer", () => {
    expect(DEFAULT_CHAIN_ID).toBe(196);
  });
});

describe("PaymentTokenSchema", () => {
  it("validates a valid token", () => {
    const token = PaymentTokenSchema.parse({
      symbol: "USDT0",
      address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
      decimals: 6,
      signingMethod: "self",
    });
    expect(token.symbol).toBe("USDT0");
  });

  it("defaults decimals to 6", () => {
    const token = PaymentTokenSchema.parse({
      symbol: "USDC",
      address: "0x74b7f16337b8972027f6196a17a631ac6de26d22",
      signingMethod: "facilitated",
    });
    expect(token.decimals).toBe(6);
  });

  it("rejects address without 0x prefix", () => {
    expect(() =>
      PaymentTokenSchema.parse({
        symbol: "BAD",
        address: "no-prefix",
        signingMethod: "self",
      }),
    ).toThrow();
  });
});

describe("ChainConfigSchema", () => {
  it("validates X Layer config", () => {
    const result = ChainConfigSchema.safeParse(X_LAYER_CONFIG);
    expect(result.success).toBe(true);
  });
});

describe("DEFAULT_CHAIN_REGISTRY", () => {
  it("contains only X Layer for V1", () => {
    expect(DEFAULT_CHAIN_REGISTRY).toHaveLength(1);
    expect(DEFAULT_CHAIN_REGISTRY[0].chainId).toBe(196);
    expect(DEFAULT_CHAIN_REGISTRY[0].isDefault).toBe(true);
  });
});
