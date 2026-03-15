# Agent And Ops Endpoints

These endpoints cover recommendation, backtests, execution utilities, credits, identity, leaderboard, and machine-readable docs.

## Recommendation / Analysis

- `POST /api/strategies/recommend`
  - Requires `agentId` and free-form `preferences`
- `POST /api/strategies/compare`
  - Accepts a `slugs` array and returns an AI-assisted comparison
- `POST /api/strategies/:slug/backtest`
  - Accepts runtime backtest params such as `period`, `initialCapital`, `tokenSymbol`, and `chainId`

## Execution Utilities

- `POST /api/execution/market-price`
- `POST /api/execution/dex-swap-intent`

These are wrapped OKX helpers rather than direct credentialed execution paths for agents.

## Credits / Leaderboard / Analytics

- `GET /api/credits/balance`
- `POST /api/credits/top-up`
- `GET /api/leaderboard`
- `GET /api/leaderboard/trending`
- `GET /api/leaderboard/:slug/rank`
- `GET /api/openclaw/publishers/:publisherId/analytics`
- `GET /api/openclaw/publishers/:publisherId/reputation`

## Identity / Verification

- `POST /api/openclaw/publishers/verify`
- `POST /api/agents/verify`

These routes currently exist, but they still return placeholder verification responses.

## Machine-Readable Docs

- `GET /api/openclaw/skill-manifest`
- `GET /api/openclaw/skill.md`
- `GET /llms.txt`
- `GET /llm.txt`

## Health

- `GET /api/health`
  - Checks API runtime plus a simple D1 query
  - Returns `200` when all checks are healthy and `503` when degraded
