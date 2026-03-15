# Installation

## Prerequisites

- Bun 1.x+
- Node.js 20+ for tooling compatibility
- Cloudflare account / Wrangler auth if you intend to run or deploy worker surfaces

## Install Dependencies

```bash
bun install
```

## Sanity Checks

```bash
bun run typecheck:root
bun run test
```

`bun run typecheck` is currently expected to fail until the Drizzle dependency versions are aligned across the workspace.
