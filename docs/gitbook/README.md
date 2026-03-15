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

## Quick Start

```bash
bun install
bun run typecheck:root
bun run test
bun run dev:api
bun run dev:web
```

Use `docs/PROGRESS.md` for execution status, `docs/architecture/` for system boundaries, and `docs/gitbook/api-reference/overview.md` for endpoint coverage.
<!-- END:HARNESS:GITBOOK:README -->
