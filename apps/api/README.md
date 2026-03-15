# ClawMarket API

Hono API deployed to Cloudflare Workers. It owns marketplace reads/writes, payment orchestration, recommendation flows, entitlement handling, and agent-facing display payloads.

## Responsibilities

- Public discovery endpoints for strategies, bundles, leaderboard data, and publisher analytics
- Purchase orchestration for strategy and bundle entitlements
- Workers AI recommendation/comparison responses with `data` + `display`
- Service-bound calls into the backtest worker
- Wrapped execution utilities for OKX/X Layer flows

## Local Commands

```bash
bun run dev
bun run typecheck
bun run test
```

## Current Gaps

- Root `bun run typecheck` fails because `apps/api` depends on `drizzle-orm@^0.39` while `packages/db` uses `0.45.1`
- ERC-8004 verification endpoints currently return placeholder "coming soon" responses
- Stripe fiat on-ramp is feature-flagged and not wired to a real checkout provider yet
