# Intelligence

These endpoints cover AI-assisted recommendation, comparison, and backtesting.

## Recommendation

| Endpoint | Method | Purpose |
|------|--------|---------|
| `/api/strategies/recommend` | `POST` | Recommend strategies from free-form buyer preferences |

Request fields:

- `agentId`
- `preferences`
- `maxResults` optional

Failure behavior:

- Returns `400` when `agentId` or `preferences` are missing
- Returns `404` when the recommendation layer cannot produce a valid result

## Comparison

| Endpoint | Method | Purpose |
|------|--------|---------|
| `/api/strategies/compare` | `POST` | Compare multiple strategies and return an AI-assisted summary |

Request fields:

- `slugs` array

## Backtest

| Endpoint | Method | Purpose |
|------|--------|---------|
| `/api/strategies/:slug/backtest` | `POST` | Run a strategy backtest and return metrics plus analysis |

Request fields:

- `period` optional
- `initialCapital` optional
- `tokenSymbol` optional
- `chainId` optional

## Current Limitation

- The Workers AI model registry exists, but recommendation, comparison, and analysis all currently route to `@cf/meta/llama-3.1-8b-instruct`
