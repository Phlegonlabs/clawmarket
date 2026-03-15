# Quick Start

## Fastest Local Loop

```bash
bun install
bun run typecheck:root
bun run test
bun run dev:api
bun run dev:web
```

## What To Open

- API health: `http://127.0.0.1:8787/api/health` when the API worker is running
- Web UI: Astro dev URL printed by `bun run dev:web`
- OpenClaw docs page: `/docs/openclaw`
- Leaderboard page: `/leaderboard`
- Bundle catalog: `/bundles`

## Execution State

- Human-readable status: `docs/PROGRESS.md`
- Machine-readable status: `.harness/state.json`
- Current harness snapshot can be printed with:

```bash
bun .harness/state.ts --show
```

## Current Reality

- The repo is no longer scaffold-only; most surfaces exist
- Several milestone items are still partial or blocked, especially model upgrades, Stripe on-ramp wiring, leaderboard scheduling, and ERC-8004 verification
