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

- How to install and run the monorepo locally
- How the web, API, backtest worker, contracts, and D1 schema fit together
- Which routes and pages exist today
- Which roadmap areas are still partial or blocked

## Quick Start

```bash
bun install
bun run typecheck:root
bun run test
bun run dev:api
bun run dev:web
```

Start with `getting-started/` for setup, `api-reference/` for route coverage, and `guides/implementation-status.md` for the current repo reality.
<!-- END:HARNESS:GITBOOK:README -->
