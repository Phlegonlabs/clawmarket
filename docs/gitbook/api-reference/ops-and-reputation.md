# Ops And Reputation

These endpoints cover execution helpers, credits, leaderboard, analytics, and identity surfaces.

## Execution Helpers

| Endpoint | Method | Purpose | Key fields |
|------|--------|---------|------------|
| `/api/execution/market-price` | `POST` | Token price lookup through OKX helpers | `tokenSymbol`, optional `chainId` |
| `/api/execution/dex-swap-intent` | `POST` | DEX swap quote through OKX helpers | `fromToken`, `toToken`, `amount`, optional `chainId`, optional `slippage` |

These are quote-oriented utilities, not direct credentialed agent execution paths.

## Credits

| Endpoint | Method | Purpose | Key inputs |
|------|--------|---------|------------|
| `/api/credits/balance` | `GET` | Read credit balance | query `agentId`, optional `chainId` |
| `/api/credits/top-up` | `POST` | Record a top-up | `agentId`, `amount`, optional `chainId`, optional `txHash` |

Current reality:

- The route surface exists
- Stripe-backed fiat on-ramp remains feature-flagged placeholder behavior

## Leaderboard

| Endpoint | Method | Purpose |
|------|--------|---------|
| `/api/leaderboard` | `GET` | Overall leaderboard, supports `category`, `limit`, `offset` |
| `/api/leaderboard/trending` | `GET` | Trending leaderboard |
| `/api/leaderboard/:slug/rank` | `GET` | Rank lookup for a single strategy |

## Publisher Analytics And Reputation

| Endpoint | Method | Purpose |
|------|--------|---------|
| `/api/openclaw/publishers/:publisherId/analytics` | `GET` | Publisher performance summary |
| `/api/openclaw/publishers/:publisherId/reputation` | `GET` | Reputation lookup |

## Verification

| Endpoint | Method | Purpose | Current status |
|------|--------|---------|----------------|
| `/api/openclaw/publishers/verify` | `POST` | Publisher verification | placeholder response |
| `/api/agents/verify` | `POST` | Agent verification | placeholder response |

These routes validate required fields, but they do not yet perform live ERC-8004 verification on X Layer.
