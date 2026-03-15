import { z } from "zod";

/** OpenClaw skill manifest — machine-readable skill definition */
export const SkillManifestSchema = z.object({
  name: z.string(),
  namespace: z.string(),
  version: z.string(),
  description: z.string(),
  capabilities: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      endpoint: z.string(),
      method: z.enum(["GET", "POST", "PUT", "DELETE"]),
      parameters: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
  authentication: z.object({
    type: z.enum(["none", "x402", "api-key"]),
    description: z.string(),
  }),
});
export type SkillManifest = z.infer<typeof SkillManifestSchema>;

/** Publisher identity */
export const PublisherSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  walletAddress: z.string().startsWith("0x"),
  createdAt: z.string().datetime(),
});
export type Publisher = z.infer<typeof PublisherSchema>;

/** Agent identity */
export const AgentIdentitySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  walletAddress: z.string().startsWith("0x").optional(),
  createdAt: z.string().datetime(),
});
export type AgentIdentity = z.infer<typeof AgentIdentitySchema>;
