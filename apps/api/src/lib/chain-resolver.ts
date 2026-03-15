import {
  type ChainConfig,
  type ChainId,
  DEFAULT_CHAIN_REGISTRY,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";

type ChainError = "CHAIN_NOT_FOUND" | "CHAIN_DISABLED";

export function resolveChain(chainId: ChainId): Result<ChainConfig, ChainError> {
  const config = DEFAULT_CHAIN_REGISTRY.find((c) => c.chainId === chainId);
  if (!config) {
    return err("CHAIN_NOT_FOUND", `Chain ${chainId} is not in the registry`);
  }
  if (!config.enabled) {
    return err("CHAIN_DISABLED", `Chain ${config.name} is currently disabled`);
  }
  return ok(config);
}

export function getEnabledChains(): ChainConfig[] {
  return DEFAULT_CHAIN_REGISTRY.filter((c) => c.enabled);
}

export function getDefaultChain(): ChainConfig {
  const def = DEFAULT_CHAIN_REGISTRY.find((c) => c.isDefault);
  if (!def) throw new Error("No default chain configured");
  return def;
}
