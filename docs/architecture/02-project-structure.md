## 2. Directory Structure

```text
clawmarket/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── agents/
├── apps/
│   ├── web/                       ← Astro + React Islands (Cloudflare Pages)
│   │   ├── astro.config.mjs
│   │   ├── src/
│   │   │   ├── layouts/           ← Astro layouts (BaseLayout.astro)
│   │   │   ├── pages/             ← Astro pages (*.astro) — file-based routing
│   │   │   │   ├── index.astro
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── index.astro
│   │   │   │   │   └── [slug].astro
│   │   │   │   ├── docs/
│   │   │   │   │   └── openclaw.astro
│   │   │   │   └── status.astro
│   │   │   ├── components/
│   │   │   │   ├── astro/         ← Pure Astro components (zero JS)
│   │   │   │   ├── islands/       ← React Islands (interactive, client:*)
│   │   │   │   └── ui/            ← shadcn/ui components (used by islands)
│   │   │   ├── hooks/             ← React hooks (used by islands)
│   │   │   ├── lib/               ← Shared utilities
│   │   │   │                  ├── erc8004.ts          ← (M9) ERC-8004 Identity Registry wrapper
│   │   │   │                  └── erc8004-reputation.ts ← (M9) ERC-8004 Reputation Registry wrapper
│   │   │   └── styles/            ← Global CSS + Tailwind
│   │   └── public/
├── packages/
│   └── shared/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── PROGRESS.md
│   ├── prd/
│   ├── architecture/
│   ├── progress/
│   ├── ai/
│   ├── public/
│   ├── adr/
│   ├── design/
│   └── gitbook/
│   │   │   │   ├── leaderboard.astro     ← (M7) Leaderboard page
│   │   │   │   ├── bundles/              ← (M10) Bundle pages
│   │   │   │   │   ├── index.astro
│   │   │   │   │   └── [slug].astro
├── .harness/
│   ├── types.ts
│   ├── init.ts
│   ├── advance.ts
│   ├── state.ts
│   ├── validate.ts
│   ├── compact.ts
│   ├── resume.ts
│   ├── runtime/
│   └── state.json
├── scripts/
│   └── harness-local/
│       ├── restore.ts
│       └── manifest.json
├── .dependency-cruiser.cjs
├── bunfig.toml
├── src/
│   ├── types/
│   ├── config/
│   ├── lib/
│   ├── services/
│   └── app/
├── tests/
└── .github/workflows/
```
