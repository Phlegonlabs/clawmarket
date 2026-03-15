# ADR-004: Unified data + display Response Format

**Status**: Accepted
**Date**: 2026-03-15
**Deciders**: Project owner + Orchestrator

## Context

ClawMarket is agent-first. Agents receive data from the API and need to present it to end users through various channels: Telegram bots, Discord bots, or their own UIs.

Each channel has different formatting requirements:
- Telegram: MarkdownV2 + inline keyboards
- Discord: Rich embeds with fields and colors
- Generic: Plain markdown

Forcing every agent developer to write their own rendering logic creates friction and inconsistent brand presentation.

## Decision

All agent-facing API responses return a unified format containing both structured **data** and pre-rendered **display** variants:

```typescript
interface ApiResponse<T> {
  data: T;
  display: {
    markdown: string;
    telegram: {
      text: string;
      parse_mode: "MarkdownV2";
      reply_markup?: { inline_keyboard: InlineKeyboardButton[][] };
    };
    discord: {
      embeds: Array<{
        title?: string;
        description?: string;
        fields?: Array<{ name: string; value: string; inline?: boolean }>;
        color?: number;
      }>;
    };
  };
}
```

## Rationale

1. **Zero integration cost** — Agent developers can directly forward `display.telegram` to Telegram Bot API or `display.discord` to Discord webhook. No rendering code needed.
2. **Brand consistency** — Platform controls how strategies, backtests, and recommendations look across all channels.
3. **Progressive enhancement** — Advanced agents can ignore `display` and use `data` for custom rendering.
4. **Single render pass** — Display is generated server-side once, not client-side N times.

## Trade-offs

- **Response size** — Each response includes 3 extra display variants. Acceptable for API responses (not streaming).
- **Maintenance** — Display templates must be updated when data shape changes. Mitigated by centralizing rendering in `lib/display-renderer.ts`.
- **Limited channels** — V1 supports markdown, Telegram, Discord. More channels (Slack, LINE, etc.) can be added later.

## Consequences

- New `lib/display-renderer.ts` in `apps/api` — centralized rendering logic
- New `packages/contracts/src/display.ts` — Zod schemas for display format
- All route handlers call display renderer before returning
- Error responses also include display format for agent-friendly error messages
