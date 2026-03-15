## 5. Initial Decisions

- Use **Bun workspaces** for the monorepo and keep all surfaces in a single repository.
- Use **Cloudflare Workers + Pages** as the deployment target for API, backtest, and web.
- Use **Hono** for the API and keep business logic inside `services/` with thin route handlers.
- Use **Astro + React Islands** for the web surface to keep most pages static and hydrate only interactive sections.
- Use **Cloudflare D1 + Drizzle ORM** for marketplace state, entitlements, revenue, leaderboard snapshots, credits, and bundles.
- Use **Cloudflare Workers AI** for recommendation/comparison text generation, while keeping model selection explicit in a local registry.
- Use a dedicated **backtest microservice** behind a Worker service binding instead of embedding backtest logic directly into the main API.
- Standardize on the **`data` + `display` response envelope** for agent-facing responses.
- Preserve a local **harness state/document generation loop** so progress, public docs, and recovery material stay synchronized.
