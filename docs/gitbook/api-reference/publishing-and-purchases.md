# Publishing And Purchases

These endpoints cover publisher submission and single-strategy commerce.

## Strategy Publish

| Endpoint | Method | Purpose | Status |
|------|--------|---------|--------|
| `/api/openclaw/strategies/publish` | `POST` | Create a new strategy package | implemented |

Top-level request fields:

- `slug`, `title`, `description`
- `family`, `executionMode`
- `priceUsd`, `publisherId`
- `supportedChainIds`
- `naturalLanguageSpec`
- `ruleSpec`
- `tags` optional

Validation notes:

- The route uses Zod validation before entering the service layer
- `slug` must match `^[a-z0-9-]+$`

## Bundle Publish

| Endpoint | Method | Purpose | Status |
|------|--------|---------|--------|
| `/api/openclaw/bundles/publish` | `POST` | Create a new bundle | implemented |

Top-level request fields:

- `slug`, `name`, `description`
- `strategySlugs`
- `priceUsd`
- `publisherId`
- `tags` optional

## Purchase Intent

| Endpoint | Method | Purpose | Success status |
|------|--------|---------|----------------|
| `/api/strategies/purchase-intent` | `POST` | Start x402 purchase flow | `402` |

Request fields:

- `strategySlug`
- `agentId`
- `chainId` optional, defaults to `196`
- `paymentToken` optional

Error notes:

- `404` when the strategy is missing
- `409` when the strategy is already owned

## Signing Template

| Endpoint | Method | Purpose | Notes |
|------|--------|---------|-------|
| `/api/strategies/purchases/signing-template` | `POST` | Return EIP-712 typed data | requires `intentId` |

## Complete Purchase

| Endpoint | Method | Purpose | Notes |
|------|--------|---------|-------|
| `/api/strategies/purchases/complete` | `POST` | Finalize purchase and entitlement | requires `intentId`, accepts optional `txHash` |

## Current Limitation

- Bundle publishing exists, but bundle purchase is not exposed through an equally complete public route flow
