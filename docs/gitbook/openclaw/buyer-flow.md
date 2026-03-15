# Buyer Flow

This is the current end-to-end buyer flow exposed by the repo.

## 1. Discover

- `GET /api/strategies`
- Optional: `GET /api/strategies/:slug`
- Optional: `GET /api/bundles`

These routes provide teaser or detail data without requiring entitlement.

## 2. Evaluate

- `POST /api/strategies/recommend`
- `POST /api/strategies/compare`
- `POST /api/strategies/:slug/backtest`

Recommendation and comparison use Workers AI. Backtest returns performance metrics plus AI analysis.

## 3. Start Purchase

- `POST /api/strategies/purchase-intent`

Request fields:

- `strategySlug`
- `agentId`
- `chainId` optional, defaults to X Layer `196`
- `paymentToken` optional

Success returns HTTP `402` with an x402 challenge payload. That status is intentional.

## 4. Sign

- `POST /api/strategies/purchases/signing-template`

Request field:

- `intentId`

This returns the EIP-712 typed data needed for wallet signing.

## 5. Complete

- `POST /api/strategies/purchases/complete`

Request fields:

- `intentId`
- `txHash` optional

On success, the API records the purchase and grants entitlement.

## 6. Unlock

- `GET /api/strategies/:slug/unlocked?agentId=...`

This is the point where the full natural-language strategy package becomes available.
