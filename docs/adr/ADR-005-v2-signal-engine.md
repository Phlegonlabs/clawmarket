# ADR-005: V2 Signal Engine — Managed + Manual Hybrid

**Status**: Proposed (V2 — not implemented in V1)
**Date**: 2026-03-15
**Deciders**: Project owner + Orchestrator

## Context

V2 introduces real-time signal delivery — a "follow trading" mechanism where buyers subscribe to strategy signals and optionally auto-execute trades.

Key challenge: Publishers may run their own bots that trade first, then emit signals. For thin-liquidity assets (meme coins), late signals are worthless or harmful to followers.

## Decision

Adopt a **managed-first, manual-supplement** hybrid model:

1. **Managed signals (primary)** — Platform evaluates Publisher's `rule_spec` against real-time OKX OnchainOS data on a cron schedule. When conditions match, a signal is generated and pushed to subscribers.
2. **Manual signals (supplement)** — Publishers can also push signals via `POST /api/signals/publish` for situations not covered by rule_spec (discretionary calls, breaking news, etc.).

## Signal Transparency Requirements

All signals must include:

| Field | Required | Purpose |
|-------|----------|---------|
| `signal_type` | Yes | `PRE_TRADE` / `IN_TRADE` / `ANALYSIS` / `EXIT` |
| `publisher_entry_price` | If IN_TRADE | Transparency — what price did publisher get? |
| `publisher_entry_time` | If IN_TRADE | How long ago did publisher enter? |
| `current_price` | Yes | Real-time price at signal generation |
| `price_deviation_pct` | Auto-calculated | Current vs publisher entry — how late is follower? |
| `liquidity_warning` | Auto-calculated | Thin liquidity / high slippage flags |
| `tx_hash` | Optional | On-chain proof of publisher's trade (verifiable via OKX) |

## Rationale

1. **Managed signals are fair** — Platform evaluates rules, not Publisher's bot. Everyone receives the signal at the same time.
2. **rule_spec is already structured** — V1's 6 strategy families define machine-evaluable conditions. V2 signal engine can consume them directly.
3. **Manual supplement preserves flexibility** — Not all trading decisions follow rules. Discretionary signals are valuable too, but clearly labeled.
4. **Transparency builds trust** — Forced disclosure of publisher's position prevents "pump and dump" signal abuse.
5. **Chain verification is possible** — On X Layer, publisher trades are on-chain. OKX OnchainOS can verify tx_hash.

## V1 Architecture Implications

To make V2 possible, V1 must:

1. **Design rule_spec as machine-evaluable** — Conditions must specify data source, operator, value, and action. Not just display text.
2. **Reserve `signalConfig` in strategy schema** — Optional field for V2 signal preferences:
   ```typescript
   type StrategySignalConfig = {
     signalMode: "mirror" | "broadcast" | "research";
     autoSignal: boolean;
     publisherCanOverride: boolean;
     requireTxProof: boolean;
   };
   ```
3. **Backtest Worker reuse** — V2 signal engine reuses the same OKX data fetching and rule evaluation logic from the backtest Worker.

## V2 Architecture (Future)

```
Signal Engine (Cron Worker)
  ├── Read active strategies with subscribers from D1
  ├── Fetch real-time data from OKX OnchainOS
  ├── Evaluate each rule_spec
  ├── Generate Signal if conditions match
  ├── Attach transparency metadata
  └── Push to Signal Hub → WebSocket/SSE → Agents
```

## Trade-offs

- **Managed signals have latency** — Cron interval (e.g., every 10-30 seconds) adds delay vs Publisher's own bot. Acceptable for most strategies; meme coin sniping may need sub-second which managed mode can't guarantee.
- **Compute cost** — Evaluating all active strategies on a cron is CPU-intensive. Mitigated by only evaluating strategies with active subscribers.
- **Publisher trust** — Even with transparency, some publishers may game the system. Reputation/rating system is a V3 concern.

## Consequences (V2)

- New `apps/signal-worker/` — Cron-triggered Worker for signal evaluation
- New WebSocket/SSE endpoint for signal subscription
- x402 per-signal micropayment flow
- Signal transparency enforcement in all push messages
- V1 rule_spec schema must be stable and machine-evaluable by V2 launch
