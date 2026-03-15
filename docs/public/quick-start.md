<!-- BEGIN:HARNESS:PUBLIC:QUICKSTART -->
## Quick Start

```bash
bun install
bun run typecheck:root
bun run test
bun run dev:api
bun run dev:web
bun .harness/state.ts --show
bun harness:sync-docs
```

Use `docs/PROGRESS.md`, `docs/progress/`, and `.harness/state.json` for execution recovery.
`.env.local` is scaffolded for local use; populate it from `.env.example` before integrating external services.
<!-- END:HARNESS:PUBLIC:QUICKSTART -->
