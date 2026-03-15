# Progress — ClawMarket

> **Last updated**: 2026-03-15
> **Phase**: IMPLEMENTATION (M6 next)

---

## Milestones

### M1: Foundation — 项目基础 + 后端移植
- **Status**: DONE
- **Features**: F001-F004
- **Branch**: milestone/m1-foundation (merged to main)

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T001 | F001 | Monorepo scaffold | DONE |
| T002 | F002 | Shared contracts (Zod schemas) | DONE |
| T003 | F003 | D1 database schema (Drizzle) | DONE |
| T004 | F004 | API core (Hono + D1 binding) | DONE |

### M2: Core API — 策略 CRUD + 支付流程
- **Status**: DONE
- **Features**: F005-F008
- **Branch**: milestone/m2-core-api (merged to main)

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T005 | F005 | Strategy CRUD API + display format | DONE |
| T006 | F006 | x402 purchase flow | DONE |
| T007 | F007 | Entitlement & revenue ledger | DONE |
| T008 | F008 | Wrapped OKX execution | DONE |

### M3: AI Features — 推荐 + 回测
- **Status**: DONE
- **Features**: F009-F010
- **Branch**: milestone/m3-ai-features (merged to main)

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T009 | F009 | AI strategy recommendation (Workers AI) | DONE |
| T010 | F010 | Backtest Worker microservice (Workers AI + OKX) | DONE |

### M4: Frontend — 全新 UI
- **Status**: DONE
- **Features**: F011-F015, F018
- **Branch**: milestone/m4-frontend (merged to main)

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T011 | F011 | Design system + Astro + shadcn/ui setup | DONE |
| T012 | F012 | Home page (Astro + React Island) | DONE |
| T013 | F013 | Strategy catalog page (React Island) | DONE |
| T014 | F014 | Strategy detail page (Astro + React Islands) | DONE |
| T015 | F015 | OpenClaw docs page (pure Astro) | DONE |
| T018 | F018 | Status page (Astro + React Island) | DONE |

### M5: OpenClaw Skill + Polish
- **Status**: DONE
- **Features**: F016-F017
- **Branch**: milestone/m5-polish (merged to main)

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T016 | F016 | OpenClaw skill manifest | DONE |
| T017 | F017 | LLM index files | DONE |

### M6: Marketplace Intelligence
- **Status**: DONE
- **Features**: V1E-F005, V1E-F001, V1E-F004, V1E-F003
- **Branch**: milestone/m6-marketplace-intelligence (merged to main)

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T019 | V1E-F005 | Workers AI model configuration upgrade (GLM-4.7-Flash / Nemotron-3) | DONE |
| T020 | V1E-F001 | Auto-backtest + performance badge service | DONE |
| T021 | V1E-F004 | Strategy comparison API (2-4 side-by-side + AI summary) | DONE |
| T022 | V1E-F003 | Publisher analytics API | DONE |

### M7: Leaderboard & Social Proof
- **Status**: NOT_STARTED
- **Features**: V2-F008
- **Branch**: milestone/m7-leaderboard

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T023 | V2-F008a | Leaderboard data aggregation service + Cron Trigger | NOT_STARTED |
| T024 | V2-F008b | Leaderboard API endpoints + trending algorithm | NOT_STARTED |
| T025 | V2-F008c | Leaderboard page (Astro + React Island) + dynamic featured | NOT_STARTED |

### M8: x402 V2 Payment Evolution
- **Status**: NOT_STARTED
- **Features**: V2-F006
- **Branch**: milestone/m8-x402-v2

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T026 | V2-F006a | x402 V2 SDK integration + wallet session management | NOT_STARTED |
| T027 | V2-F006b | Credit balance service + top-up flow | NOT_STARTED |
| T028 | V2-F006c | Stripe fiat on-ramp (optional, non-blocking) | NOT_STARTED |

### M9: Trust & Identity Layer
- **Status**: NOT_STARTED
- **Features**: V2-F004
- **Branch**: milestone/m9-trust-identity

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T029 | V2-F004a | ERC-8004 Identity Registry integration | NOT_STARTED |
| T030 | V2-F004b | ERC-8004 Reputation Registry + score aggregation | NOT_STARTED |
| T031 | V2-F004c | Publisher verification API + agent identity endpoint | NOT_STARTED |

### M10: Strategy Bundles
- **Status**: NOT_STARTED
- **Features**: V2-F005
- **Branch**: milestone/m10-strategy-bundles

| Task | Feature | Description | Status |
|------|---------|-------------|--------|
| T032 | V2-F005a | Bundle schema + CRUD API | NOT_STARTED |
| T033 | V2-F005b | Bundle x402 payment + multi-entitlement minting | NOT_STARTED |
| T034 | V2-F005c | Portfolio-level combined backtest | NOT_STARTED |
| T035 | V2-F005d | Bundle catalog + detail page (Astro + React Island) | NOT_STARTED |

---

## Summary

| Milestone | Tasks | Completed | Progress |
|-----------|-------|-----------|----------|
| M1: Foundation | 4 | 4 | 100% |
| M2: Core API | 4 | 4 | 100% |
| M3: AI Features | 2 | 2 | 100% |
| M4: Frontend | 6 | 6 | 100% |
| M5: Polish | 2 | 2 | 100% |
| M6: Marketplace Intelligence | 4 | 4 | 100% |
| M7: Leaderboard & Social Proof | 3 | 0 | 0% |
| M8: x402 V2 Payment Evolution | 3 | 0 | 0% |
| M9: Trust & Identity Layer | 3 | 0 | 0% |
| M10: Strategy Bundles | 4 | 0 | 0% |
| **Total** | **35** | **22** | **63%** |
