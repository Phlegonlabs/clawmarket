# Known Gaps

This page records the current unfinished edges that matter when reading the GitBook.

## Blocked Or Partial Items

| Area | Current reality | Impact |
|------|-----------------|--------|
| Workers AI model routing | Model registry exists, but all use cases still point to `@cf/meta/llama-3.1-8b-instruct` | Recommendation and analysis are real, but model-upgrade milestone is not complete |
| Leaderboard refresh | Snapshot logic exists, but scheduled refresh is not wired in Wrangler | Leaderboard freshness depends on data seeding or manual update paths |
| Stripe on-ramp | Stripe helper is feature-flagged and returns disabled behavior | Credits top-up is not a live fiat checkout experience |
| ERC-8004 verification | Verify routes exist, but return placeholder responses | Identity trust layer is not production-complete |
| Workspace typecheck | `bun run typecheck` still fails due to Drizzle version mismatch | Repo validation is not clean end-to-end |

## Browser-Specific Gaps

- No browser-native wallet purchase flow
- No publisher dashboard in the web app
- Homepage featured content is not leaderboard-driven
- Status page is a lightweight poller, not a historical observability product

## Documentation Rule

This GitBook documents these gaps explicitly instead of hiding them behind roadmap language.
