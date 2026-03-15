import { z } from "zod";
import { ChainIdSchema, DEFAULT_CHAIN_ID } from "./chain-registry.js";

/** Strategy family — the broad category of trading strategy */
export const StrategyFamilySchema = z.enum([
  "momentum",
  "mean-reversion",
  "arbitrage",
  "market-making",
  "trend-following",
  "volatility",
]);
export type StrategyFamily = z.infer<typeof StrategyFamilySchema>;

/** Execution mode — how the strategy is meant to be executed */
export const ExecutionModeSchema = z.enum(["manual", "semi-auto", "full-auto"]);
export type ExecutionMode = z.infer<typeof ExecutionModeSchema>;

/** Natural language specification — the core knowledge asset */
export const NaturalLanguageSpecSchema = z.object({
  overview: z.string().min(1),
  entryConditions: z.array(z.string()).min(1),
  exitConditions: z.array(z.string()).min(1),
  riskManagement: z.string().min(1),
  positionSizing: z.string().optional(),
  timeframe: z.string().optional(),
  notes: z.string().optional(),
});
export type NaturalLanguageSpec = z.infer<typeof NaturalLanguageSpecSchema>;

/** Rule specification — structured execution rules */
export const RuleSpecSchema = z.object({
  rules: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      condition: z.string(),
      action: z.string(),
      priority: z.number().int().min(1).optional(),
    }),
  ),
});
export type RuleSpec = z.infer<typeof RuleSpecSchema>;

/** Strategy package — the complete purchasable unit */
export const StrategyPackageSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  family: StrategyFamilySchema,
  executionMode: ExecutionModeSchema,
  tags: z.array(z.string()).default([]),
  priceUsd: z.number().positive(),
  publisherId: z.string(),
  supportedChainIds: z.array(ChainIdSchema).default([DEFAULT_CHAIN_ID]),
  naturalLanguageSpec: NaturalLanguageSpecSchema,
  ruleSpec: RuleSpecSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type StrategyPackage = z.infer<typeof StrategyPackageSchema>;

/** Public teaser — what unauthenticated users see */
export const StrategyTeaserSchema = StrategyPackageSchema.pick({
  id: true,
  slug: true,
  title: true,
  description: true,
  family: true,
  executionMode: true,
  tags: true,
  priceUsd: true,
  publisherId: true,
  supportedChainIds: true,
  createdAt: true,
  updatedAt: true,
});
export type StrategyTeaser = z.infer<typeof StrategyTeaserSchema>;
