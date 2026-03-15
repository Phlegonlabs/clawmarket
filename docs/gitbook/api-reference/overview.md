# API Reference Overview

ClawMarket already exposes a public API. The current surface is organized by route family rather than a generated OpenAPI spec.

| Family | Representative endpoints | Notes |
|------|--------|-------|
| Health | `GET /api/health` | Main runtime and D1 health |
| Strategies | `GET /api/strategies`, `GET /api/strategies/:slug`, `GET /api/strategies/:slug/unlocked` | Public catalog + entitlement-gated reads |
| Publishing | `POST /api/openclaw/strategies/publish`, `POST /api/openclaw/bundles/publish` | Publisher-facing creation flows |
| Purchases | `POST /api/strategies/purchase-intent`, `POST /api/strategies/purchases/signing-template`, `POST /api/strategies/purchases/complete` | Strategy purchase flow |
| Recommendation / comparison | `POST /api/strategies/recommend`, `POST /api/strategies/compare` | Workers AI-backed summaries |
| Backtest | `POST /api/strategies/:slug/backtest`, `POST /api/bundles/:slug/backtest` | Delegates to the backtest worker |
| Execution | `POST /api/execution/market-price`, `POST /api/execution/dex-swap-intent` | Wrapped OKX / market utility endpoints |
| Credits | `GET /api/credits/balance`, `POST /api/credits/top-up` | Credit balance ledger; Stripe on-ramp is still separate/partial |
| Analytics / identity | `GET /api/openclaw/publishers/:publisherId/analytics`, `GET /api/openclaw/publishers/:publisherId/reputation`, `POST /api/openclaw/publishers/verify`, `POST /api/agents/verify` | Verification endpoints currently return placeholder responses |
| Bundles / leaderboard | `GET /api/bundles`, `GET /api/bundles/:slug`, `GET /api/leaderboard`, `GET /api/leaderboard/trending` | Discovery and ranking surfaces |
| LLM index | `GET /llms.txt`, `GET /llm.txt` | Root-level machine-readable docs |

## Current Documentation Gap

- There is no generated OpenAPI or schema reference page yet.
- Endpoint coverage is real, but some roadmap endpoints remain partial or feature-flagged.
