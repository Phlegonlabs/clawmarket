# Page To API Map

This page ties the browser experience to the backend routes it actually consumes.

| Browser route | Primary UI | API dependencies | Notes |
|------|------------|------------------|-------|
| `/` | `FeaturedStrategies` | `GET /api/strategies` | Uses the catalog feed as featured content |
| `/strategies` | `StrategyCatalog` | `GET /api/strategies` | Filtering and sorting happen client-side |
| `/strategies/view?slug=...` | `StrategyDetail`, `BacktestPanel` | `GET /api/strategies/:slug`, `POST /api/strategies/:slug/backtest` | Purchase CTA points users to OpenClaw docs |
| `/bundles` | `BundleCatalog` | `GET /api/bundles` | Public read-only browser flow |
| `/bundles/view?slug=...` | `BundleDetail` | `GET /api/bundles/:slug` | No browser-native checkout flow |
| `/leaderboard` | `LeaderboardTable` | `GET /api/leaderboard`, `GET /api/leaderboard/trending` | Toggle between overall and trending |
| `/status` | `StatusDashboard` | `GET /api/health` | Additional service rows are inferred |
| `/docs/openclaw` | Astro page | none directly; documents `/api` routes | Human-readable explanation layer |
