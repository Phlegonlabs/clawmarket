<!-- BEGIN:HARNESS:GITBOOK:README -->
# ClawMarket

ClawMarket prepared with the Harness Engineering and Orchestrator workflow.

## What Is clawmarket?

ClawMarket prepared with the Harness Engineering and Orchestrator workflow.

Runtime auto-dispatch currently covers `project-discovery`, `MARKET_RESEARCH`, `TECH_STACK`, `prd-architect`, `scaffold-generator`, the UI design loop, `EXECUTING`, `VALIDATING`, and `context-compactor`.
After an interactive phase is complete, advance the lifecycle with `bun harness:advance`.
`bun harness:autoflow` advances only after the current phase's required outputs exist; if scaffold artifacts are missing, it stops and surfaces the missing phase work instead of skipping ahead.
During scaffold setup, do not pre-install project frameworks such as Next.js or Tauri; add them later inside milestone tasks.

## Quick Start

```bash
bun install
bun harness:advance
bun harness:env
bun harness:audit
```
<!-- END:HARNESS:GITBOOK:README -->
