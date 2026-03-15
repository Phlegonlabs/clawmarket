# Installation

## Prerequisites

- Bun 1.x+
- Node.js 20+ for tool compatibility
- Git 2.x+
- Cloudflare account plus Wrangler auth if you intend to run worker surfaces against real bindings

## Install Dependencies

```bash
bun install
```

## Baseline Checks

```bash
bun run typecheck:root
bun run test
```

## Important Caveat

The repository currently has a documented workspace typecheck failure:

- `bun run typecheck:root` passes and is useful for checking the local harness runtime
- `bun run typecheck` fails because `apps/api` depends on `drizzle-orm@^0.39` while `packages/db` uses `0.45.1`

Treat that failure as a known repo issue, not as a local setup mistake.
