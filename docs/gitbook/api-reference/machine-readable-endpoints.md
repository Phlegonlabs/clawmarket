# Machine-Readable Endpoints

These endpoints are intended for agents, crawlers, or automated integrations.

## OpenClaw Skill Files

| Endpoint | Method | Purpose |
|------|--------|---------|
| `/api/openclaw/skill-manifest` | `GET` | Structured OpenClaw skill manifest |
| `/api/openclaw/skill.md` | `GET` | Markdown skill instructions |

Current coverage:

- Core discovery, evaluation, purchase, and execution helper capabilities
- Authentication and pricing summary

## LLM Index Files

| Endpoint | Method | Purpose |
|------|--------|---------|
| `/llms.txt` | `GET` | Plain-text marketplace summary for crawlers and LLM tooling |
| `/llm.txt` | `GET` | Same content as `llms.txt` |

Current behavior:

- Builds output from the live strategy catalog in D1
- Includes key endpoints, catalog summary, and pricing notes

## Current Limitation

- These files are descriptive integration surfaces, not substitutes for generated OpenAPI or exhaustive JSON schema docs
