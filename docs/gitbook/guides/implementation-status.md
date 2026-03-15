# Implementation Status

This page is the fastest way to understand what is real in the repository today.

## Snapshot

- Progress: `30/35` tasks marked done
- Blocked items: `5`
- Main workspaces: `apps/api`, `apps/backtest`, `apps/web`
- Public browser pages: `8`
- API route files: `15`

## What Is Implemented

### Browser Surface

- Home page with featured strategy cards
- Strategy catalog and strategy detail pages
- Bundle catalog and bundle detail pages
- Leaderboard page
- Status page
- OpenClaw docs page

### API Surface

- Strategy read flow, unlocked entitlement gate, strategy publishing, and x402 purchase flow
- Bundle list/detail and bundle publishing
- Recommendation, comparison, and backtest endpoints
- Execution helpers, leaderboard reads, analytics, credits, and reputation reads
- OpenClaw skill files and `llms.txt` / `llm.txt`

### Shared Infrastructure

- D1 schema and migrations in `packages/db`
- Zod contracts in `packages/contracts`
- Workers AI binding for recommendation, comparison, and analysis text
- Separate backtest worker reached through a service binding

## What Is Partial

- Workers AI model registry exists, but every current use case still routes to `@cf/meta/llama-3.1-8b-instruct`
- Leaderboard snapshot logic exists, but scheduled refresh wiring is not configured
- Credits top-up routes exist, but Stripe on-ramp remains feature-flagged placeholder behavior
- Publisher and agent verification routes exist, but currently return "coming soon" style ERC-8004 responses
- Bundle commerce is less complete in the public route surface than single-strategy commerce

## How To Read The Repo

- Treat ClawMarket as a mostly implemented repo with explicit unfinished edges
- Do not treat it as scaffold-only
- Do not treat it as a release-complete production system
