## 2. Project Structure

```text
clawmarket/
├── apps/
│   ├── api/
│   │   ├── src/app/routes/        ← health, strategies, purchases, execution, identity, analytics, bundles, credits, leaderboard
│   │   ├── src/services/          ← business logic
│   │   ├── src/lib/               ← D1, Workers AI, x402, OKX, ERC-8004, Stripe helpers
│   │   └── src/__tests__/         ← route/service/lib coverage
│   ├── backtest/
│   │   └── src/                   ← worker entry + backtest engine
│   └── web/
│       ├── src/pages/             ← Astro routes (`index`, `strategies`, `bundles`, `leaderboard`, `status`, `docs/openclaw`)
│       ├── src/components/astro/  ← static UI
│       ├── src/components/islands/← interactive React islands
│       ├── src/components/ui/     ← shared UI primitives
│       └── src/hooks/             ← API-fetch hooks for islands
├── packages/
│   ├── contracts/                 ← shared Zod schemas and TypeScript types
│   ├── db/                        ← Drizzle schema + migrations
│   └── shared/                    ← placeholder for future shared runtime helpers / wrappers
├── docs/
│   ├── architecture/              ← internal architecture notes
│   ├── adr/                       ← architectural decisions
│   ├── gitbook/                   ← public-facing docs
│   ├── prd/                       ← working product spec
│   └── progress/                  ← generated execution recovery modules
└── .harness/                      ← local project state and doc generation runtime
```

### 2.1 Route and Page Shape

- API route groups are organized by capability, not by consumer.
- Astro pages are thin shells; interactive behavior lives in islands.
- The backtest worker remains isolated from the main API and is reached through a service binding rather than direct shared runtime state.

### 2.2 Documentation Shape

- `README.md`, `docs/public/*`, `docs/PRD.md`, and `docs/ARCHITECTURE.md` are managed through the local harness doc generator.
- `docs/PROGRESS.md` and `docs/progress/*` are generated from `.harness/state.json`.
- GitBook pages are hand-maintained summaries and should not claim features that only exist as placeholders or stubs.
