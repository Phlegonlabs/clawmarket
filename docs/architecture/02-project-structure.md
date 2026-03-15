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
