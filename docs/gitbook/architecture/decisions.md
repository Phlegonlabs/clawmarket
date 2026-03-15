# Key Decisions

- Use **Cloudflare D1** for marketplace data rather than Supabase (`ADR-001-d1-over-supabase`)
- Use **Cloudflare Workers AI** for local platform AI inference (`ADR-002-workers-ai-over-claude`)
- Keep backtesting in a **separate worker** reached through a service binding (`ADR-003-backtest-microservice`)
- Standardize on the **`data` + `display`** response envelope for agent-facing consumers (`ADR-004-display-response-format`)
- Use **Astro + React Islands** for the web layer rather than a full SPA (`ADR-006-astro-react-islands`)
- Keep the entitlement model **chain-agnostic** while carrying chain registry information at payment time (`ADR-007-multi-chain-compatibility`)
