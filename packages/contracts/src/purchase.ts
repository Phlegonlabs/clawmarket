import { z } from "zod";
import { ChainIdSchema, DEFAULT_CHAIN_ID } from "./chain-registry.js";

/** Purchase intent request — initiates x402 payment flow */
export const PurchaseIntentRequestSchema = z.object({
  strategySlug: z.string(),
  agentId: z.string(),
  chainId: ChainIdSchema.default(DEFAULT_CHAIN_ID),
  paymentToken: z.string().optional(),
});
export type PurchaseIntentRequest = z.infer<typeof PurchaseIntentRequestSchema>;

/** Purchase intent status */
export const PurchaseIntentStatusSchema = z.enum([
  "pending",
  "challenged",
  "completed",
  "expired",
  "failed",
]);
export type PurchaseIntentStatus = z.infer<typeof PurchaseIntentStatusSchema>;

/** Completed purchase record */
export const PurchaseRecordSchema = z.object({
  id: z.string(),
  strategyId: z.string(),
  agentId: z.string(),
  publisherId: z.string(),
  chainId: ChainIdSchema,
  paymentToken: z.string(),
  tokenAddress: z.string(),
  amountRaw: z.string(),
  amountUsd: z.number(),
  txHash: z.string().optional(),
  completedAt: z.string().datetime(),
});
export type PurchaseRecord = z.infer<typeof PurchaseRecordSchema>;

/** Entitlement — chain-agnostic access right (no chain_id) */
export const EntitlementSchema = z.object({
  id: z.string(),
  strategyId: z.string(),
  agentId: z.string(),
  purchaseId: z.string(),
  grantedAt: z.string().datetime(),
});
export type Entitlement = z.infer<typeof EntitlementSchema>;
