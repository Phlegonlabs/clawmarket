# ADR-003: Backtest as Independent Worker (Microservice)

**Status**: Accepted
**Date**: 2026-03-15
**Deciders**: Project owner + Orchestrator

## Context

Backtesting involves:
1. Fetching historical price data from OKX OnchainOS
2. Simulating strategy execution against that data
3. Computing metrics (return, drawdown, Sharpe, win rate)
4. Generating AI-powered natural language analysis

This is CPU-intensive and I/O-heavy compared to normal API requests.

## Decision

Implement the backtest engine as an **independent Cloudflare Worker** (`apps/backtest`), connected to the main API via **Service Binding** (zero-latency internal RPC).

## Rationale

1. **Isolation** — Backtest computation doesn't affect main API latency or CPU budget
2. **Independent scaling** — Backtest Worker can have different CPU limits, timeouts, and rate limits
3. **Service Binding** — Zero-latency internal call between Workers. No HTTP overhead, no public endpoint needed.
4. **Separation of concerns** — Backtest logic (OKX data fetching, simulation engine, metrics calculation) is a distinct domain from the marketplace CRUD API
5. **V2 ready** — The same Worker can evolve into the signal engine's evaluation engine

## Trade-offs

- **Deployment complexity** — Two Workers to deploy instead of one. Mitigated by Wrangler's multi-worker support.
- **Shared types** — Backtest Worker and main API share types from `packages/contracts`. Workspace structure handles this.
- **D1 access** — If backtest needs DB access (e.g., reading rule_spec), it either receives data via Service Binding call params, or gets its own D1 binding.

## Consequences

- New workspace: `apps/backtest/` with its own `wrangler.jsonc` and `package.json`
- Main API's `wrangler.jsonc` declares Service Binding to backtest Worker
- `packages/contracts` adds backtest request/response schemas
- Main API's `recommendation-service.ts` calls backtest Worker via Service Binding
- Backtest Worker has Workers AI binding for result interpretation
