# Key Decisions

- Use **Cloudflare D1** rather than Supabase for core marketplace state (`ADR-001-d1-over-supabase`)
- Use **Cloudflare Workers AI** for on-platform inference (`ADR-002-workers-ai-over-claude`)
- Keep backtesting in a **separate worker** behind a service binding (`ADR-003-backtest-microservice`)
- Standardize on the **`data` + `display`** response envelope (`ADR-004-display-response-format`)
- Use **Astro + React Islands** instead of a React SPA for the public web (`ADR-006-astro-react-islands`)
- Keep the entitlement model **chain-agnostic** while validating payment chain context through a registry (`ADR-007-multi-chain-compatibility`)

## Practical Consequences

- Public docs must distinguish clearly between browser flows and agent flows
- Route, service, and lib boundaries are a real implementation rule, not just documentation theory
- The browser intentionally stops short of owning wallet purchase state; OpenClaw and API flows carry the commerce logic
- Some ADR direction is ahead of route-level completion, so docs must call out partial implementations explicitly instead of flattening them into "done"
