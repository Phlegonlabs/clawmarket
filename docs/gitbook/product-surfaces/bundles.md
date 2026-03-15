# Bundles

## Routes

- `/bundles`
- `/bundles/view?slug=...`

## Catalog Page

The catalog page is powered by `BundleCatalog`.

### API dependency

- `GET /api/bundles`

### What it shows

- Bundle name and description
- Strategy count
- Bundle price
- Tag list

## Detail Page

The detail page is powered by `BundleDetail`.

### API dependency

- `GET /api/bundles/:slug`

### What it shows

- Bundle price vs total individual price
- Discount percentage
- Included strategy list with links back to strategy detail pages
- OpenClaw-directed purchase guidance

## Current Limitations

- The web app does not expose a first-class bundle purchase checkout flow
- Bundle purchase routes are thinner than single-strategy purchase routes
- Portfolio-level bundle backtest logic exists deeper in the repo, but it is not exposed through a dedicated browser workflow
