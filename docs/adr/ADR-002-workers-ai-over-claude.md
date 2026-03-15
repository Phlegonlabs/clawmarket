# ADR-002: Workers AI over Claude API

**Status**: Accepted
**Date**: 2026-03-15
**Deciders**: Project owner + Orchestrator

## Context

ClawMarket needs AI capabilities for:
1. Strategy recommendation — matching agent preferences to available strategies
2. Backtest result interpretation — natural language analysis of backtest metrics

The initial plan was to use Claude API (Haiku 4.5) via `@anthropic-ai/sdk`.

## Decision

Use **Cloudflare Workers AI** with `@cf/meta/llama-3.1-8b-instruct` as the default model instead of Claude API.

## Rationale

1. **Free tier** — Workers AI has a generous free allocation (10K neurons/day on free plan, much more on paid). Claude API charges per token from the start.
2. **Zero external dependency** — No Anthropic API key needed. One less secret to manage.
3. **Edge inference** — Workers AI runs on Cloudflare's edge network. No external API round-trip.
4. **Ecosystem unity** — Entire stack on Cloudflare (Workers, D1, Pages, Workers AI). Single vendor, single billing.
5. **Sufficient quality** — Strategy recommendation and backtest interpretation are structured tasks (not open-ended creative work). Llama 3.1 8B is adequate.

## Trade-offs

- **Model quality** — Llama 3.1 8B is less capable than Claude Haiku for nuanced reasoning. If quality is insufficient, can upgrade to `@cf/meta/llama-3.1-70b-instruct` or reconsider Claude.
- **Model availability** — Workers AI model catalog may not always have the latest models. Acceptable for our use case.
- **Vendor lock-in** — More tightly coupled to Cloudflare. Mitigated by abstracting AI calls behind a `lib/ai-client.ts` wrapper.

## Consequences

- Remove `@anthropic-ai/sdk` from dependencies
- Add Workers AI binding in `wrangler.jsonc` (`[ai] binding = "AI"`)
- AI calls go through `lib/ai-client.ts` wrapper for future model swapping
- Monitor output quality during M3 implementation; escalate to 70B model if needed
