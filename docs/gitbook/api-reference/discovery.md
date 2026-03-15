# Discovery

These endpoints power public reads across strategies, bundles, and basic health.

## Health

| Endpoint | Method | Purpose | Notes |
|------|--------|---------|-------|
| `/api/health` | `GET` | Runtime + D1 health check | Returns `200` when healthy and `503` when degraded |

Response notes:

- Returns `data.status`, `data.checks`, `data.version`, and `data.timestamp`
- `display.markdown` summarizes operational state

## Strategy Reads

| Endpoint | Method | Purpose | Key inputs |
|------|--------|---------|------------|
| `/api/strategies` | `GET` | List public strategy teasers | none |
| `/api/strategies/:slug` | `GET` | Read strategy detail | path `slug` |
| `/api/strategies/:slug/unlocked` | `GET` | Read full strategy package after entitlement check | path `slug`, query `agentId` |

Behavior notes:

- `/api/strategies` is the source for both the homepage featured cards and the strategy catalog
- `/api/strategies/:slug/unlocked` returns `403` when entitlement is missing

## Bundle Reads

| Endpoint | Method | Purpose | Key inputs |
|------|--------|---------|------------|
| `/api/bundles` | `GET` | List public bundle teasers | none |
| `/api/bundles/:slug` | `GET` | Read bundle detail with included strategies | path `slug` |

## Known Limitation

Discovery coverage is stronger than post-purchase or verification coverage. That is intentional to reflect the current repo state.
