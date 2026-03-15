# Configuration

## Environment Files

- `.env.example`: shared example values
- `.env.local`: developer override file for local runs

## Web Configuration

- `PUBLIC_API_URL`: optional override for the API base URL used by the Astro frontend

If unset, the web app assumes `/api` relative to the current origin.

## API / Worker Configuration

`apps/api/wrangler.jsonc` currently defines:

- D1 binding: `DB`
- Workers AI binding: `AI`
- Backtest service binding: `BACKTEST`
- Non-secret vars: `ENVIRONMENT`, `PLATFORM_REVENUE_SHARE_BPS`

## Optional / Partial Features

- `STRIPE_ENABLED`: toggles the placeholder Stripe on-ramp path
- ERC-8004 verification flows are present in the route surface but not fully wired to production-grade contract calls

## Docs And State

- `docs/PROGRESS.md`: current human-readable execution index
- `docs/progress/`: generated recovery modules
- `bun harness:sync-docs`: regenerates managed README/public index docs

GitBook pages themselves are tracked Markdown files under `docs/gitbook/`.
