# System Overview

ClawMarket is a monorepo with three runtime surfaces and two shared packages:

- `apps/web`: Astro + React Islands public frontend
- `apps/api`: Hono API on Cloudflare Workers
- `apps/backtest`: backtest microservice on Cloudflare Workers
- `packages/contracts`: shared Zod schemas and response contracts
- `packages/db`: D1 schema and migrations

## High-Level Flow

```text
Browser / OpenClaw client
  -> Hono API
     -> D1
     -> Backtest Worker
     -> Workers AI
     -> x402 / X Layer / OKX helper layer
```

## Behavioral Boundaries

- Browser is public-only; purchase state and entitlement enforcement stay in the API
- Route handlers stay thin and mount under `/api` from `apps/api/src/app/index.ts`
- Business logic lives in `services/`
- External integrations live in `lib/`
- Shared validation and response types live in `packages/contracts`
- D1 schema and migrations live in `packages/db`

## Current Surface Inventory

- Web routes: `/`, `/strategies`, `/strategies/view`, `/bundles`, `/bundles/view`, `/leaderboard`, `/status`, `/docs/openclaw`
- API families: health, strategies, purchases, publish, bundles, recommendation, comparison, backtest, execution, credits, analytics, identity, leaderboard, OpenClaw docs, LLM index
- Backtest is isolated in its own worker and reached through a service binding

## Known Architectural Gaps

- The status page is a lightweight poller, not a full monitoring product
- Verification and fiat on-ramp surfaces are represented in the route layer but are not production-complete
- Workers AI model selection exists as a registry, but every use case still resolves to the same model today
