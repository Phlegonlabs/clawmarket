<!-- BEGIN:HARNESS:GITBOOK:README -->
# ClawMarket

Agent-first strategy marketplace on OKX X Layer with x402 payments, Cloudflare Workers, and Astro + React Islands.

## What Is ClawMarket?

ClawMarket is an agent-first strategy marketplace on OKX X Layer. Publishers submit natural-language strategy packages, buyers discover and backtest them, and purchases settle through x402 with permanent entitlements.

## Current Repo Status

- Phase: `EXECUTING`
- Progress: 30/35 tasks marked DONE across 10 milestones
- Open issues: tracked in docs/PROGRESS.md and .harness/state.json
- Workspaces: `apps/api`, `apps/backtest`, `apps/web`

## What This GitBook Covers

- Getting started and local development for the monorepo
- Product surfaces page-by-page: home, strategies, bundles, leaderboard, status, and OpenClaw docs
- OpenClaw buyer and publisher flows, plus the machine-readable surfaces that agents consume
- API coverage by endpoint family, including request shape, response expectations, and current limitations
- Architecture boundaries between `apps/web`, `apps/api`, `apps/backtest`, `packages/contracts`, and `packages/db`
- Current implementation status, known gaps, and GitBook-facing changelog history

## Quick Start

```bash
bun install
bun run typecheck:root
bun run test
bun run dev:api
bun run dev:web
```

## Read In This Order

1. `getting-started/` for setup and runtime assumptions
2. `product-surfaces/` for the actual browser experience
3. `openclaw/` for agent and publisher workflows
4. `api-reference/` for route-by-route capability coverage
5. `guides/implementation-status.md` and `guides/known-gaps.md` for the current repo reality
<!-- END:HARNESS:GITBOOK:README -->
