# Strategies

## Routes

- `/strategies`
- `/strategies/view?slug=...`

## Catalog Page

The catalog page is powered by `StrategyCatalog`.

### API dependency

- `GET /api/strategies`

### Browser-side behavior

- Family filters are applied client-side after the full list loads
- Search matches title, description, and tags
- Sort options are `newest`, `price-asc`, and `price-desc`
- The UI writes active filter state into the URL query string

## Detail Page

The detail page is powered by `StrategyDetail`.

### API dependencies

- `GET /api/strategies/:slug`
- `POST /api/strategies/:slug/backtest`

### What the page shows

- Strategy family and execution mode
- Description, price, supported chains, and tags
- Purchase guidance that points users toward OpenClaw
- Backtest panel for quick simulation runs

## Purchase Reality

- The browser does not run the x402 purchase flow directly
- The purchase CTA is documentation-oriented and points to `/docs/openclaw`
- Unlocking the full strategy package still requires the API purchase + entitlement flow
