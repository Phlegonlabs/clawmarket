# Configuration

## Environment Files

- `.env.example` documents shared local variables
- `.env.local` is the developer override file used during local runs

## Web

- `PUBLIC_API_URL`: optional override for the API base URL consumed by the Astro frontend

## API / Workers

- `apps/api/wrangler.jsonc` configures D1, Workers AI, and the backtest service binding
- `ENVIRONMENT` and `PLATFORM_REVENUE_SHARE_BPS` are provided as non-secret defaults
- `STRIPE_ENABLED` controls whether the placeholder Stripe on-ramp code path is active

## State And Docs

- `.harness/state.json`: canonical execution snapshot
- `docs/PROGRESS.md`: human-readable recovery index
- `bun harness:sync-docs`: regenerates managed README/public/gitbook index files from harness state
