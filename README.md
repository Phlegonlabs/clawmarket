<!-- BEGIN:HARNESS:README -->
# ClawMarket

Agent-first strategy marketplace on OKX X Layer with x402 payments, Cloudflare Workers, and Astro + React Islands.

## Repository Status

- Phase: `EXECUTING`
- Progress: 30/35 tasks marked DONE across 10 milestones
- Status note: Execution snapshot: 30/35 tasks marked DONE, 5 blocked, 0 still active or pending.
- Source of truth: [docs/PROGRESS.md](docs/PROGRESS.md) + [.harness/state.json](.harness/state.json)

## Start Here

- Quick start: [docs/public/quick-start.md](docs/public/quick-start.md)
- Documentation map: [docs/public/documentation-map.md](docs/public/documentation-map.md)
- Tech stack: [docs/public/tech-stack.md](docs/public/tech-stack.md)

## Core Docs

- Product requirements: [docs/PRD.md](docs/PRD.md)
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Progress: [docs/PROGRESS.md](docs/PROGRESS.md)
- AI workflow: [AGENTS.md](AGENTS.md)
- GitBook: [docs/gitbook/README.md](docs/gitbook/README.md)

## Common Commands

```bash
bun install
bun run typecheck:root
bun run typecheck
bun run test
bun run dev:api
bun run dev:web
bun harness:sync-docs
```

## Workspaces

- `apps/`: current surfaces -> api, backtest, web
- `packages/`: contracts, db, shared
<!-- END:HARNESS:README -->
