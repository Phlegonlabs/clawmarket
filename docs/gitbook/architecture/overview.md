# System Overview

ClawMarket uses Astro for the public web shell, Hono on Cloudflare Workers for the API, a dedicated backtest worker for simulations, and D1 as the core data store.

## High-Level Flow

```text
Web / OpenClaw client
  -> Hono API
     -> D1
     -> Backtest Worker
     -> Workers AI
     -> x402 / X Layer / OKX helpers
```

## Practical Constraints

- The browser stays public-only; auth and entitlements are enforced server-side
- Shared contracts live in `packages/contracts`
- API routes are orchestration only; business logic lives in `services/`
- Some roadmap integrations remain partial, especially ERC-8004 verification and Stripe on-ramp support
