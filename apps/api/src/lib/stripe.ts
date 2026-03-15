import type { Result } from "@clawmarket/contracts";
import { err, ok } from "@clawmarket/contracts";

/**
 * Stripe fiat on-ramp integration (V2, feature-flagged).
 *
 * When enabled, creates a Stripe Checkout session for fiat → credit conversion.
 * Webhook handler processes payment_intent.succeeded → credit topup.
 *
 * Feature flag: STRIPE_ENABLED env var.
 */

export function isStripeEnabled(env: { STRIPE_ENABLED?: string }): boolean {
  return env.STRIPE_ENABLED === "true";
}

export interface StripeCheckoutParams {
  agentId: string;
  amountUsd: number;
  chainId: string;
}

export async function createCheckoutSession(
  _params: StripeCheckoutParams,
): Promise<Result<{ checkoutUrl: string; sessionId: string }, "STRIPE_DISABLED">> {
  // Placeholder — actual Stripe SDK integration in production
  return err("STRIPE_DISABLED", "Stripe fiat on-ramp is not enabled in this environment");
}
