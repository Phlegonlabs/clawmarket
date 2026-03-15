# Marketplace Endpoints

These endpoints power the public catalog, purchases, and publisher-side publishing flows.

## Strategy Discovery

- `GET /api/strategies`
  - Returns public teaser cards for all strategies
- `GET /api/strategies/:slug`
  - Returns strategy detail plus rule outline
- `GET /api/strategies/:slug/unlocked?agentId=...`
  - Returns the full strategy package after entitlement validation

## Strategy Publishing

- `POST /api/openclaw/strategies/publish`
  - Validated with Zod
  - Requires slug, title, description, family, execution mode, price, publisher ID, supported chains, and both natural-language and rule specs

## Strategy Purchase Flow

- `POST /api/strategies/purchase-intent`
  - Creates an intent and returns an x402 challenge
  - Returns HTTP `402` on success to reflect payment required
- `POST /api/strategies/purchases/signing-template`
  - Returns EIP-712 typed data for the wallet step
- `POST /api/strategies/purchases/complete`
  - Finalizes purchase and records entitlement / revenue split

## Bundle Flow

- `GET /api/bundles`
  - Returns bundle teasers
- `GET /api/bundles/:slug`
  - Returns bundle detail including constituent strategies
- `POST /api/openclaw/bundles/publish`
  - Publisher bundle creation flow

## Notes

- Bundle purchase and bundle backtest logic exist in services, but the public route surface is still thinner than the single-strategy flow
- Prices are modeled in USD terms while settlement uses x402-compatible token amounts
