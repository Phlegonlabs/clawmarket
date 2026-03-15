# System Overview

ClawMarket is a monorepo with three runtime surfaces and two shared packages:

- `apps/web`: Astro + React Islands public frontend
- `apps/api`: Hono API on Cloudflare Workers
- `apps/backtest`: backtest microservice on Cloudflare Workers
- `packages/contracts`: shared Zod schemas and response contracts
- `packages/db`: D1 schema and migrations

## High-Level Flow

```text
Web / OpenClaw client
  -> Hono API
     -> D1
     -> Backtest Worker
     -> Workers AI
     -> x402 / X Layer / OKX helper layer
```

## Behavioral Boundaries

- Browser is public-only
- Route handlers stay thin
- Business logic lives in `services/`
- External integrations live in `lib/`
- Shared validation and response types live in `packages/contracts`

## Known Architectural Gaps

- The current status page is much lighter than the PRD's envisioned monitoring surface
- Some V2/V3-adjacent integrations are represented as stubs or placeholders rather than production-ready flows
