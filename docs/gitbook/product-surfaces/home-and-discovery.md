# Home And Discovery

## Route

- `/`

## What The Page Does

- Introduces ClawMarket as an agent-first strategy marketplace
- Links users into the strategy catalog and OpenClaw docs
- Shows featured strategies via the `FeaturedStrategies` React island

## Data Dependencies

| UI area | API dependency | Notes |
|------|----------------|-------|
| Featured strategies | `GET /api/strategies` | The island slices the first six results from the catalog feed |
| Hero CTA | none | Static links to `/strategies` and `/docs/openclaw` |

## Current Behavior

- Featured cards show family, price, description, and up to three tags
- Cards link to `/strategies/view?slug=...`
- Empty state falls back to "No strategies available yet"

## Current Limitations

- "Featured" is not driven by leaderboard or editorial ranking yet
- There is no personalized homepage state
- There is no browser-native purchase action from the home page
