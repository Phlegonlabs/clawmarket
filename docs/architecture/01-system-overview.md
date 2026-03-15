## 1. System Overview

### 1.1 Runtime Shape

- **Web**: Astro + React Islands on Cloudflare Pages for public marketplace browsing
- **API**: Hono on Cloudflare Workers for marketplace, payment, identity, analytics, and agent-facing responses
- **Backtest**: Dedicated Worker reached through a service binding from the API
- **Data**: Cloudflare D1 via Drizzle ORM schemas in `packages/db`
- **Shared contracts**: Zod schemas and types in `packages/contracts`

### 1.2 Primary Flow

```text
Browser / OpenClaw client
  -> Astro web or direct API call
  -> Hono API
     -> D1 (strategies, purchases, entitlements, leaderboard, bundles, credits)
     -> Backtest Worker (simulation + summary payload)
     -> Workers AI (recommendation / comparison / analysis text)
     -> Wrapped x402 / X Layer / OKX helpers
```

### 1.3 Architectural Boundaries

- Browser is public-only. Purchase state and entitlement enforcement live in the API.
- Strategies are manifests plus structured metadata, not arbitrary user code.
- Agent-facing responses use the `data` + `display` envelope from `packages/contracts`.
- Multi-chain support is represented through the chain registry and `chainId` fields, while entitlements remain chain-agnostic.

### 1.4 Current Delivery Posture

- Core marketplace surfaces are present across web, API, backtest worker, contracts, and DB schema.
- Several roadmap items remain partial: Workers AI model upgrades, ERC-8004 verification flows, Stripe on-ramp wiring, and some leaderboard/status polish.
- Repository validation is not closed yet because workspace typecheck currently fails on a Drizzle version mismatch.
