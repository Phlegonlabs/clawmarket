# ADR-006: Astro + React Islands over React SPA

**Status**: Accepted
**Date**: 2026-03-15
**Deciders**: Project owner + Orchestrator

## Context

ClawMarket's frontend has 5 pages with varying interactivity levels:

| Page | Interactivity | Primary Content |
|------|--------------|-----------------|
| Home `/` | Low | Static marketing, featured strategies (API fetch) |
| Strategy Catalog `/strategies` | High | Filters, sorting, table/card toggle, URL sync |
| Strategy Detail `/strategies/:slug` | Medium | Static header + interactive backtest panel |
| Docs `/docs/openclaw` | None | Static documentation, sidebar nav |
| Status `/status` | Medium | Auto-polling dashboard (30s refresh) |

The original plan used React 19 + React Router 7 + Vite 7 as a full SPA. This ships a React runtime and router to every page, even those that are 90%+ static content.

## Decision

Replace the React SPA with **Astro + React Islands**:

- **Astro** handles routing (file-based), layouts, and static content rendering — ships zero JS by default
- **React Islands** (via `@astrojs/react`) hydrate only the interactive portions of each page using `client:load` or `client:visible` directives
- **@astrojs/cloudflare** adapter for Cloudflare Pages deployment

### Per-Page Architecture

| Page | Rendering | React Islands |
|------|-----------|---------------|
| Home | Astro static | `FeaturedStrategies` (`client:load`) |
| Catalog | Astro shell | `StrategyCatalog` (`client:load`) — full-page island |
| Detail | Astro static | `BacktestPanel` (`client:visible`) |
| Docs | Pure Astro | None — zero client JS |
| Status | Astro shell | `StatusDashboard` (`client:load`) |

## Rationale

1. **Reduced JS bundle** — 3 of 5 pages ship zero or minimal client JS. Only Catalog and Status need full React hydration.
2. **Better LCP** — Static pages render immediately as HTML. No JS parse/execute required before first paint.
3. **Native SEO** — Astro generates real HTML at build/request time. No SSR hydration mismatch risks.
4. **Cloudflare Pages compatibility** — `@astrojs/cloudflare` is a first-class adapter. Deployment model unchanged.
5. **React ecosystem preserved** — shadcn/ui, Radix UI, and all React hooks work inside islands. No component library migration needed.
6. **Progressive enhancement** — Interactive components enhance the page; static content works without JS.

## Trade-offs

- **Two component models** — Developers must understand both Astro components (`.astro`) and React components (`.tsx`). Clear directory separation (`components/astro/` vs `components/islands/`) mitigates confusion.
- **No client-side routing** — Page transitions are full navigations, not SPA transitions. Acceptable for 5 pages with distinct purposes.
- **Island boundaries** — State cannot be shared between islands without external stores. Each island is self-contained. This is fine for our use case — no cross-page state needed (browser is public-only, no auth).

## Consequences

- `apps/web/` restructured: `pages/*.astro`, `components/astro/`, `components/islands/`, `components/ui/`
- React Router 7 removed — Astro file-based routing replaces it
- Vite 7 still used under the hood (Astro uses Vite internally) but not a direct dependency
- `@astrojs/react` and `@astrojs/cloudflare` added as dependencies
- Frontend testing: Vitest for React islands, Astro's built-in test support for pages
