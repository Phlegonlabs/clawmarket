/**
 * @clawmarket/contracts
 *
 * Shared Zod schemas and TypeScript types for ClawMarket.
 * Zero runtime dependencies beyond Zod.
 */

export {
  DEFAULT_CHAIN_REGISTRY,
  X_LAYER_CONFIG,
} from "./chain-defaults.js";

// Chain registry
export {
  type ChainConfig,
  ChainConfigSchema,
  type ChainId,
  ChainIdSchema,
  DEFAULT_CHAIN_ID,
  KNOWN_CHAIN_IDS,
  type PaymentToken,
  PaymentTokenSchema,
} from "./chain-registry.js";
// Display
export {
  type AgentResponse,
  AgentResponseSchema,
  type DisplayFormat,
  DisplayFormatSchema,
} from "./display.js";
// OpenClaw & Identity
export {
  type AgentIdentity,
  AgentIdentitySchema,
  type Publisher,
  PublisherSchema,
  type SkillManifest,
  SkillManifestSchema,
} from "./openclaw.js";
// Purchase & Entitlement
export {
  type Entitlement,
  EntitlementSchema,
  type PurchaseIntentRequest,
  PurchaseIntentRequestSchema,
  type PurchaseIntentStatus,
  PurchaseIntentStatusSchema,
  type PurchaseRecord,
  PurchaseRecordSchema,
} from "./purchase.js";
// Result type
export { err, ok, type Result } from "./result.js";
// Strategy
export {
  type ExecutionMode,
  ExecutionModeSchema,
  type NaturalLanguageSpec,
  NaturalLanguageSpecSchema,
  type RuleSpec,
  RuleSpecSchema,
  type StrategyFamily,
  StrategyFamilySchema,
  type StrategyPackage,
  StrategyPackageSchema,
  type StrategyTeaser,
  StrategyTeaserSchema,
} from "./strategy.js";
