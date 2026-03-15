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

## API (`apps/api`)

Responsibilities:

- Catalog, publishing, purchase, analytics, identity, leaderboard, and execution endpoints
- Response shaping for agents (`data` + `display`)
- Delegation to D1, Workers AI, and the backtest worker

Implementation notes:

- Routes live under `src/app/routes/`
- Business logic lives under `src/services/`
- External helpers live under `src/lib/`

## Backtest Worker (`apps/backtest`)

Responsibilities:

- Run strategy or bundle backtest calculations
- Return metrics that the API can enrich with AI-generated analysis

Implementation notes:

- Reached from the API through a service binding
- Kept separate from the main API to isolate compute-heavy simulation logic
