# Publisher Flow

This is the current publisher-side surface exposed by the repo.

## Strategy Publish

- `POST /api/openclaw/strategies/publish`

Required top-level fields:

- `slug`
- `title`
- `description`
- `family`
- `executionMode`
- `priceUsd`
- `publisherId`
- `supportedChainIds`
- `naturalLanguageSpec`
- `ruleSpec`

The request is Zod-validated in the route layer.

## Bundle Publish

- `POST /api/openclaw/bundles/publish`

Required fields:

- `slug`
- `name`
- `description`
- `strategySlugs`
- `priceUsd`
- `publisherId`

## Analytics And Reputation

- `GET /api/openclaw/publishers/:publisherId/analytics`
- `GET /api/openclaw/publishers/:publisherId/reputation`

These routes support publisher dashboards or agent-side summaries, even though the browser does not yet expose a dedicated publisher console.

## Verification Reality

- `POST /api/openclaw/publishers/verify`
- `POST /api/agents/verify`

These routes exist, but they currently return placeholder ERC-8004 "coming soon" style responses rather than real on-chain verification results.
