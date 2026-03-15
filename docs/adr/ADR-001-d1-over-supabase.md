# ADR-001: Cloudflare D1 over Supabase Postgres

**Status**: Accepted
**Date**: 2026-03-15
**Deciders**: Project owner + Orchestrator

## Context

The original project (Onchain-okxclawmarket) used Supabase Postgres as the database. For the ClawMarket rebuild, we need to choose a database that fits the architecture direction.

The entire runtime stack is on Cloudflare (Workers, Pages). Using Supabase requires an external network hop from Workers to Supabase's Postgres endpoint on every request.

## Decision

Use **Cloudflare D1** (serverless SQLite) with Drizzle ORM instead of Supabase Postgres.

## Rationale

1. **Ecosystem unity** — D1 is native to Cloudflare Workers. Zero cold-start overhead, no external connection pooling.
2. **Latency** — D1 binding is in-process. Supabase requires HTTPS round-trip to external Postgres.
3. **Cost** — D1 free tier is generous (5M reads/day, 100K writes/day). Supabase free tier is more limited for Workers use.
4. **Simplicity** — No connection strings, no Supabase client SDK, no Row Level Security config. Just a Workers binding.
5. **Multi-chain ready** — Schema design works identically. `chain_id` field handles multi-chain regardless of DB engine.

## Trade-offs

- **SQLite dialect** — No Postgres-specific features (JSONB, array columns, custom enum types). Use TEXT + JSON string, CHECK constraints for enums.
- **10GB per database limit** — Sufficient for a strategy marketplace. If exceeded, can shard by table group.
- **Write locality** — D1 writes go to a single primary. Reads are globally distributed. Acceptable for this workload (read-heavy).
- **No Supabase Realtime** — Not needed in V1 (no websocket). V2 signal engine will use its own push mechanism.

## Consequences

- Drizzle ORM driver changes from `drizzle-orm/postgres-js` to `drizzle-orm/d1`
- All JSONB columns become TEXT with JSON serialization
- Postgres enum types become TEXT with CHECK constraints
- Timestamps use TEXT (ISO 8601) instead of Postgres `timestamp`
- IDs use TEXT (nanoid) instead of Postgres `uuid`
- Migration tool: `drizzle-kit` with D1 dialect
