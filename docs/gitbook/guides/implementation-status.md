# Implementation Status

This page is the fastest way to understand what is real in the repository today.

## Implemented Surfaces

- **Marketplace reads**: strategy list/detail/unlocked flow, bundle list/detail flow, leaderboard reads, publisher analytics, publisher reputation
- **Agent flows**: OpenClaw skill manifest, recommendation, comparison, backtest, purchase intent, signing template, purchase completion
- **Web experience**: home, strategy catalog/detail, bundle catalog/detail, leaderboard, OpenClaw docs, status page
- **Infrastructure**: D1 schema, Workers AI binding, backtest service binding, llm index endpoints

## Partial Or Blocked Areas

- **Workers AI model routing**: the model registry still maps use-cases to `@cf/meta/llama-3.1-8b-instruct`
- **Leaderboard scheduling**: aggregation code exists, but no scheduled trigger is configured in Wrangler
- **Stripe on-ramp**: code path is feature-flagged and returns disabled / placeholder behavior
- **ERC-8004 verification**: helper and routes exist, but verification endpoints still return placeholder responses
- **Workspace typecheck**: root workspace typecheck remains red because of a Drizzle version mismatch

## How To Read Progress

- `docs/PROGRESS.md` is the human recovery index
- `docs/progress/03-backlog.md` shows the current local task snapshot
- The current harness snapshot marks `30/35` tasks done and `5` blocked

## Recommended Interpretation

Treat ClawMarket as a mostly implemented repo with explicit unfinished edges, not as a pristine scaffold and not as a fully closed-out release candidate.
