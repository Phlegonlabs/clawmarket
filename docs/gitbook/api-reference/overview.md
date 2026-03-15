# API Reference Overview

ClawMarket already exposes a real API. It is organized by capability rather than by a generated OpenAPI spec.

## Response Shape

Most successful agent-facing endpoints return:

```json
{
  "data": {},
  "display": {
    "markdown": "..."
  }
}
```

Validation and missing-resource failures usually return plain error objects with HTTP status codes.

## Main Families

- Marketplace discovery and reads
- Publishing and purchases
- Recommendation, comparison, and backtest
- Execution, credits, analytics, identity, and leaderboard
- OpenClaw skill and LLM index endpoints

## Read Next

- [Marketplace Endpoints](marketplace.md)
- [Agent And Ops Endpoints](agent-and-ops.md)

## Current Gap

There is still no generated OpenAPI document or request/response schema site. This GitBook is the hand-maintained reference.
