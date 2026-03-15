import { z } from "zod";

/** Branded chain ID — positive integer */
export const ChainIdSchema = z.number().int().positive();
export type ChainId = z.infer<typeof ChainIdSchema>;

/** Well-known chain IDs supported or planned */
export const KNOWN_CHAIN_IDS = {
  X_LAYER: 196,
  BASE: 8453,
  ARBITRUM_ONE: 42161,
  OPTIMISM: 10,
} as const satisfies Record<string, ChainId>;

/** V1 default chain */
export const DEFAULT_CHAIN_ID: ChainId = KNOWN_CHAIN_IDS.X_LAYER;

/** Payment token available on a chain */
export const PaymentTokenSchema = z.object({
  symbol: z.string(),
  address: z.string().startsWith("0x"),
  decimals: z.number().int().default(6),
  signingMethod: z.enum(["self", "facilitated"]),
});
export type PaymentToken = z.infer<typeof PaymentTokenSchema>;

/** Complete configuration for a single chain */
export const ChainConfigSchema = z.object({
  chainId: ChainIdSchema,
  name: z.string(),
  shortName: z.string(),
  enabled: z.boolean(),
  isDefault: z.boolean(),
  rpcUrl: z.string().url(),
  blockExplorerUrl: z.string().url(),
  paymentTokens: z.array(PaymentTokenSchema).min(1),
  defaultPaymentToken: z.string(),
  x402: z.object({
    facilitatorAddress: z.string().startsWith("0x"),
    eip712DomainName: z.string(),
    eip712DomainVersion: z.string(),
  }),
  okxGateway: z.object({
    supported: z.boolean(),
    baseUrl: z.string().url().optional(),
  }),
  nativeCurrency: z.object({
    name: z.string(),
    symbol: z.string(),
    decimals: z.number().int(),
  }),
});
export type ChainConfig = z.infer<typeof ChainConfigSchema>;
