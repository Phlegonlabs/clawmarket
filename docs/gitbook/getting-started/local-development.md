# Local Development

## Workspace Commands

Root:

```bash
bun run typecheck:root
bun run test
```

API:

```bash
cd apps/api
bun run dev
bun run test
```

Web:

```bash
cd apps/web
bun run dev
bun run typecheck
```

Backtest worker:

```bash
cd apps/backtest
bun run dev
```

## Practical Notes

- `apps/web` consumes the API through `src/hooks/useApi.ts`
- `apps/api` mounts all route groups under `/api`, except `llms.txt` and `llm.txt`, which are rooted at `/`
- The status page is a lightweight runtime poller, not a historical uptime analytics system
- The homepage still sources featured strategies from `/api/strategies`, not leaderboard trending data

## Recommended Workflow

1. Start the API worker
2. Start the Astro frontend
3. Hit `/api/health` first
4. Verify the main user-facing pages: home, strategies, bundles, leaderboard, docs/openclaw, status
