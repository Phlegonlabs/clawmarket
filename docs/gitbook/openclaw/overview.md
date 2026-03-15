# OpenClaw Overview

OpenClaw is the agent-facing integration layer for ClawMarket.

## What It Includes

- Human-readable skill docs: `GET /api/openclaw/skill.md`
- Machine-readable skill manifest: `GET /api/openclaw/skill-manifest`
- Strategy discovery, recommendation, comparison, backtest, purchase, analytics, reputation, and publish routes under `/api`

## Who It Is For

- Buyers using autonomous agents to discover and purchase strategies
- Publishers packaging strategies or bundles for distribution
- Internal developers who need a clean map of the agent-facing surface

## Relationship To The Web App

- `/docs/openclaw` in the browser is the human-facing explanation layer
- The OpenClaw API routes are the actual integration surface
- The browser stops short of wallet-aware purchase execution; OpenClaw carries that workflow
