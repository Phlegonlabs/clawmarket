# AGENTS.md — ClawMarket

> This file is identical to CLAUDE.md. Keep them in sync.

## Project Overview

ClawMarket is an agent-first strategy marketplace on OKX X Layer using x402 payment protocol. Publishers submit natural-language strategy packages, buyers discover, backtest, and purchase them with one-time payment for permanent access.

## Tech Stack

- **Runtime**: Bun + Cloudflare Workers
- **API**: Hono
- **Frontend**: Astro + React 19 (Islands) + @astrojs/cloudflare
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui + Radix UI + CVA + Lucide
- **Database**: Cloudflare D1 (SQLite via Drizzle ORM)
- **AI**: Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`)
- **Payment**: x402 (EIP-712, X Layer chain ID 196)
- **OKX**: OnchainOS wrapped gateway
- **Validation**: Zod
- **Testing**: Vitest

## Monorepo Structure

```
apps/api         → Hono API (Cloudflare Workers)
apps/backtest    → Backtest microservice (Cloudflare Workers)
apps/web         → Astro + React Islands frontend (Cloudflare Pages)
packages/contracts → Shared Zod schemas & types
packages/db      → Drizzle ORM schema for D1
```

## Dependency Direction (Enforced)

```
types → config → lib → services → app
```

- Higher layers may reference lower layers
- Lower layers must NEVER reference higher layers
- Circular dependencies are prohibited

Workspace dependency:
```
packages/contracts ← packages/db ← apps/api
packages/contracts ← apps/backtest
packages/contracts ← apps/web
apps/api ──Service Binding──→ apps/backtest
```

## Code Rules

### General

- TypeScript strict mode in all workspaces
- 500-line file ceiling — split if exceeded
- No `any` types — use `unknown` and narrow
- No `console.log` in production code — use structured logger
- No secrets or `.env` material in the repo
- Prefer `Result<T, E>` pattern over throw for expected errors

### API (apps/api)

- Routes are thin orchestration — no business logic in route handlers
- All business logic lives in `services/`
- All external calls (D1, OKX, Workers AI) go through `lib/` wrappers
- All agent-facing responses must include `data` + `display` format:
  ```typescript
  { data: T, display: { markdown, telegram, discord } }
  ```
- Validate all inputs with Zod schemas from `packages/contracts`
- Use `Env` type from `types/bindings.ts` for Cloudflare bindings

### Frontend (apps/web) — Astro + React Islands

- **Astro pages** (`src/pages/*.astro`) handle routing and static shell
- **Astro components** (`src/components/astro/`) for static UI — zero client JS
- **React Islands** (`src/components/islands/`) for interactive sections — use `client:load` or `client:visible`
- **shadcn/ui components** (`src/components/ui/`) used inside React Islands only
- Pages are thin Astro shells — delegate interactive parts to React Islands
- No API calls in components — use React hooks in `src/hooks/` (inside islands)
- Use Tailwind v4 utility classes, no inline styles
- Design tokens: zinc dark palette + emerald accent
- Default to Astro component (zero JS); only use React Island when interactivity is required

### Database (packages/db)

- Drizzle ORM for all D1 queries
- No raw SQL outside migration files
- All IDs are TEXT (nanoid/uuid), not autoincrement
- Timestamps are TEXT (ISO 8601 strings)
- JSON fields are TEXT (JSON.stringify/parse)
- Multi-chain: `chain_id` field with default 196 (X Layer)

### Contracts (packages/contracts)

- All shared types defined here with Zod
- Export both Zod schemas and inferred TypeScript types
- Zero runtime dependencies beyond Zod

## Architectural Rules

1. Browser is public-only — no purchase state or auth
2. Strategy is manifest, not arbitrary code
3. OpenClaw is the primary client for publishers and buyers
4. x402 / X Layer handles settlement, entitlement ledger handles access
5. OKX execution always through platform gateway — never direct agent credentials
6. All agent-facing responses include `data` + `display` (markdown/telegram/discord)
7. No real-time websocket in V1
8. AI inference uses Workers AI binding, no external AI API keys

## Branch Strategy

```
main                          ← Always deployable
  ├── milestone/m1-foundation
  ├── milestone/m2-core-api
  ├── milestone/m3-ai-features
  ├── milestone/m4-frontend
  ├── milestone/m5-polish
  ├── milestone/m6-marketplace-intelligence
  ├── milestone/m7-leaderboard
  ├── milestone/m8-x402-v2
  ├── milestone/m9-trust-identity
  ├── milestone/m10-strategy-bundles
  └── fix/[issue-id]
```

## Testing

- Unit tests: `bun test` (Vitest)
- API integration: Vitest + miniflare
- Frontend: Vitest + @testing-library/react
- Run `bun run test` before committing

## Common Commands

```bash
bun install                  # Install all dependencies
bun run dev:api              # Start API dev server (wrangler)
bun run dev:web              # Start web dev server (Astro)
bun run build                # Build all workspaces
bun run typecheck            # Type check all workspaces
bun run lint                 # Lint all workspaces
bun run test                 # Run all tests
bun run db:generate          # Generate D1 migrations
bun run db:migrate:local     # Apply migrations to local D1
```
