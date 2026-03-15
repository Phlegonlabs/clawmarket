# Key Decisions

- Use **Cloudflare D1** rather than Supabase for core marketplace state (`ADR-001-d1-over-supabase`)
- Use **Cloudflare Workers AI** for on-platform inference (`ADR-002-workers-ai-over-claude`)
- Keep backtesting in a **separate worker** behind a service binding (`ADR-003-backtest-microservice`)
- Standardize on the **`data` + `display`** response envelope (`ADR-004-display-response-format`)
- Use **Astro + React Islands** instead of a React SPA for the public web (`ADR-006-astro-react-islands`)
- Keep the entitlement model **chain-agnostic** while validating payment chain context through a registry (`ADR-007-multi-chain-compatibility`)

## Practical Consequences

- Public docs must distinguish clearly between browser flows and agent flows
- Many docs need to describe partial implementations honestly because the ADR direction is ahead of some route-level completion
- Route, service, and lib boundaries are an important part of the codebase, not just documentation theory
