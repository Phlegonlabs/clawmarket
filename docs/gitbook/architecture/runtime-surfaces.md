# Runtime Surfaces

## Web (`apps/web`)

Responsibilities:

- Public discovery pages
- Strategy and bundle browsing
- OpenClaw documentation
- Leaderboard and lightweight status display

Implementation notes:

- Astro provides routing and static page shells
- React islands handle API-driven interactivity
- API calls are centralized through `src/hooks/useApi.ts`
- Current islands: `FeaturedStrategies`, `StrategyCatalog`, `StrategyDetail`, `BundleCatalog`, `BundleDetail`, `LeaderboardTable`, `StatusDashboard`, `BacktestPanel`

## API (`apps/api`)

Responsibilities:

- Catalog, publishing, purchase, analytics, identity, leaderboard, and execution endpoints
- Response shaping for agents (`data` + `display`)
- Delegation to D1, Workers AI, and the backtest worker

Implementation notes:

- Routes live under `src/app/routes/`
- Business logic lives under `src/services/`
- External helpers live under `src/lib/`
- All route groups mount under `/api`, except `llms.txt` and `llm.txt`, which are rooted at `/`

## Backtest Worker (`apps/backtest`)

Responsibilities:

- Run strategy or bundle backtest calculations
- Return metrics that the API can enrich with AI-generated analysis

Implementation notes:

- Reached from the API through a service binding
- Kept separate from the main API to isolate compute-heavy simulation logic

## Shared Packages

### Contracts (`packages/contracts`)

- Shared Zod schemas for strategies, purchases, display formats, identity, and chain registry
- Source of truth for publish and purchase validation

### Database (`packages/db`)

- D1 tables and migrations
- Schema used by API services for strategies, purchases, bundles, leaderboard snapshots, and related entities
