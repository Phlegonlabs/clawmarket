# Web And OpenClaw

ClawMarket has a public web surface and an agent-first integration surface. They overlap, but they are not the same thing.

## Public Web Surface

Current Astro pages:

- `/`
- `/strategies`
- `/strategies/view?slug=...`
- `/bundles`
- `/bundles/view?slug=...`
- `/leaderboard`
- `/status`
- `/docs/openclaw`

The browser is intentionally public-only. Purchase state and entitlement checks are enforced in the API.

## OpenClaw Surface

OpenClaw integration is exposed through:

- `GET /api/openclaw/skill-manifest`
- `GET /api/openclaw/skill.md`
- strategy, recommendation, purchase, execution, analytics, identity, and bundle endpoints under `/api`

Every agent-facing success response is expected to provide:

```json
{
  "data": {},
  "display": {
    "markdown": "..."
  }
}
```

## Shared Reality

- The web app uses the same public API families that an agent can use
- The OpenClaw docs page in the web app is a human-readable version of the same flow exposed by the skill manifest and API endpoints
- Feature completeness differs by area: browsing is stronger than verification and fiat on-ramp flows

## Practical Boundary

- The browser documents the platform and reads catalog data
- The agent surface carries the actual strategy purchase workflow
- Publisher operations live mostly in API/OpenClaw space, not in the browser UI
- If a feature requires wallet-aware signing, entitlement checks, or structured machine-readable output, the API surface is the source of truth
