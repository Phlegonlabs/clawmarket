# ADR-007: Multi-Chain Compatibility Layer

**Status**: Accepted
**Date**: 2026-03-15
**Deciders**: Project owner + Orchestrator

## Context

ClawMarket uses the x402 payment protocol. V1 targets X Layer (chain ID 196) exclusively, while V2 will expand to multiple chains (Base, Arbitrum, Optimism). The PRD already reserves `chainId` parameters in F003/F006/V2-F003, but lacks a concrete multi-chain architecture.

Key questions:

1. **Entitlement model**: Should strategy access (entitlement) be tied to a specific chain, or be chain-agnostic?
2. **Chain configuration**: How should chain-specific settings (RPC, tokens, facilitator addresses) be managed?
3. **EIP-712 security**: How to prevent cross-chain replay attacks on payment signatures?
4. **Migration cost**: How to minimize V2 refactoring when adding new chains?

## Decision

### 1. Chain-Agnostic Entitlements

ClawMarket sells knowledge assets (natural-language strategy packages), not on-chain tokens. Strategy value is independent of which chain was used to pay. Therefore:

- **Entitlements have no `chain_id`** — a purchase on any supported chain grants the same access rights
- **Purchases, revenue, and credits track `chain_id`** — financial records must record settlement chain
- **Strategy packages list `supported_chain_ids`** — publishers declare which chains accept payment

| Entity | Has `chain_id`? | Reason |
|--------|:-:|--------|
| `purchase_intents` | Yes | Payment intent is chain-specific |
| `purchases` | Yes | Settlement record |
| `revenue_ledger` | Yes | Revenue on specific chain |
| `credit_balances` | Yes | On-chain balance is chain-specific |
| `credit_transactions` | Yes | Each transaction on specific chain |
| `strategy_packages` | Partial | `supported_chain_ids` JSON array |
| `entitlements` | **No** | Any-chain purchase → same access |
| `publishers` | No | Identity is cross-chain |
| `agent_identities` | No | Identity is cross-chain |

### 2. Static Chain Registry

Adding a new chain requires deploying an x402 facilitator contract and configuring RPC/token addresses — inherently a code change. V1 uses a static TypeScript configuration object (`ChainConfig[]`). V2 may evolve this to environment-variable-driven configuration if needed.

The Chain Registry replaces the flat `X402_PAYMENT_STABLECOINS_JSON` env var with a structured, per-chain configuration that includes:

- Payment tokens (address, decimals, signing method)
- x402 facilitator contract address
- EIP-712 domain parameters
- OKX gateway support flag
- Block explorer URL
- Native currency info

### 3. EIP-712 Domain Separator Must Include `chainId`

Every EIP-712 typed data signature **must** include `chainId` in the domain separator. This is critical to prevent cross-chain replay attacks — a signature valid on X Layer must not be replayable on Base or Arbitrum.

```typescript
// Domain separator MUST include chainId
const domain = {
  name: config.x402.eip712DomainName,
  version: config.x402.eip712DomainVersion,
  chainId: config.chainId,
  verifyingContract: config.x402.facilitatorAddress,
};
```

## Rationale

1. **Chain-agnostic entitlements reduce complexity** — No need to track "which chain gave access". A buyer who paid on Base gets the same strategy content as one who paid on X Layer.
2. **Static registry is appropriate for V1** — Adding chains is infrequent and requires contract deployment anyway. Over-engineering with dynamic registry adds complexity without value.
3. **EIP-712 chainId is a security requirement** — Not including it would create a cross-chain replay vulnerability.
4. **`supported_chain_ids` on strategies enables publisher control** — Publishers can opt into specific chains as they expand.

## V1 → V2 Migration Path

| Component | V1 | V2 Change |
|-----------|----|----|
| Chain Registry | Static config, X Layer only | Add new chain entries |
| Purchase API `chainId` | Accepts and defaults to 196 | New valid values |
| DB `chain_id` columns | Always "196" | New values appear |
| `supportedChainIds` | Always `["196"]` | Publisher selects multiple |
| EIP-712 domain | `chainId: 196` | `chainId: <selected>` |
| Entitlements | Chain-agnostic | No change needed |
| Frontend chain filter | Shows "X Layer" | Shows all enabled chains |

**V1 explicitly excludes:**
- Chain switching UI
- Cross-chain bridging logic
- Per-chain pricing (V1 uses unified USD pricing)
- Environment-variable-driven registry

## Consequences

- `packages/contracts/src/chain-registry.ts` — New file: `ChainId`, `PaymentToken`, `ChainConfig` Zod schemas + `KNOWN_CHAIN_IDS` constant
- `packages/contracts/src/chain-defaults.ts` — New file: X Layer default configuration, `DEFAULT_CHAIN_REGISTRY`
- All DB tables with financial records include `chain_id TEXT NOT NULL DEFAULT '196'`
- `entitlements` table intentionally omits `chain_id`
- `strategy_packages` table includes `supported_chain_ids TEXT DEFAULT '["196"]'`
- `X402_PAYMENT_STABLECOINS_JSON` env var deprecated in favor of chain registry
- Purchase API schemas accept `chainId` parameter with default `196`
- `apps/api/src/lib/chain-resolver.ts` and `apps/api/src/lib/x402.ts` will provide runtime chain resolution (implemented in M1)
