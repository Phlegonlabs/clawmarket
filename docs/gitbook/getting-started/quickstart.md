# Quick Start

```bash
bun install
bun run typecheck:root
bun run test
bun run dev:api
bun run dev:web
```

## State And Recovery

- Read `docs/PROGRESS.md` first for the current execution snapshot
- Use `.harness/state.json` as the machine-readable source of truth
- Run `bun .harness/state.ts --show` to inspect the current harness state

## Notes

- The web app expects `PUBLIC_API_URL` when pointing at a non-default API origin
- Workspace-wide `bun run typecheck` is still red because of Drizzle version drift between `apps/api` and `packages/db`
