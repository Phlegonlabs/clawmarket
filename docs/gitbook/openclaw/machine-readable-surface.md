# Machine-Readable Surface

ClawMarket exposes a small machine-readable surface for agents and crawlers.

## OpenClaw Skill Manifest

- `GET /api/openclaw/skill-manifest`

Provides:

- Skill name, description, and version
- Capability list
- Endpoint mappings
- Authentication and pricing summary

## Human-Readable Skill Markdown

- `GET /api/openclaw/skill.md`

Provides:

- Quick-start steps
- Key purchase flow endpoints
- Execution helper endpoints
- Pricing and response format notes

## LLM Index Files

- `GET /llms.txt`
- `GET /llm.txt`

These are built from the current strategy catalog and provide a crawler-friendly text summary of the marketplace.

## Current Limitations

- The skill manifest covers the core buyer flow but does not enumerate every ops endpoint
- LLM index output is catalog-derived text, not a generated schema or full OpenAPI description
