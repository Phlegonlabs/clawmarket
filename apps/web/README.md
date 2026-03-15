# ClawMarket Web

Astro frontend with React 19 islands. The site is public-only: it showcases strategies and bundles, surfaces backtest and leaderboard data, and documents the OpenClaw integration flow.

## Surface Map

- Astro pages for routing and static shell content
- React islands for catalog filters, strategy/bundle detail fetches, leaderboard tables, and status polling
- Shared UI primitives under `src/components/ui/`
- API access centralized through `src/hooks/useApi.ts`

## Local Commands

```bash
bun run dev
bun run build
bun run typecheck
bun run test
```

## Current Gaps

- Featured strategies on the homepage still read from `/api/strategies` instead of leaderboard trending data
- The status page is a lightweight health dashboard, not the full historical uptime surface described in the PRD
