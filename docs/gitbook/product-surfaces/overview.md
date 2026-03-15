# Product Surfaces Overview

ClawMarket currently exposes two human-facing surfaces:

- The public browser app in `apps/web`
- The OpenClaw-facing documentation and API surface for agents and publishers

This section focuses on the browser side of the product.

## Current Browser Routes

| Route | Purpose | Primary UI |
|------|---------|------------|
| `/` | Product introduction and featured strategies | Astro shell + `FeaturedStrategies` island |
| `/strategies` | Search and filter strategy catalog | `StrategyCatalog` island |
| `/strategies/view?slug=...` | Strategy detail and backtest entry point | `StrategyDetail` + `BacktestPanel` |
| `/bundles` | Browse discounted bundles | `BundleCatalog` island |
| `/bundles/view?slug=...` | Bundle detail and included strategy list | `BundleDetail` island |
| `/leaderboard` | Rank strategies by score or trending view | `LeaderboardTable` island |
| `/status` | Lightweight service health display | `StatusDashboard` island |
| `/docs/openclaw` | Human-readable OpenClaw integration docs | Astro page |

## Important Constraint

The browser is public-only. It does not own wallet purchase state, entitlement state, or private user dashboards. Purchase and unlock flows remain API and agent driven.
