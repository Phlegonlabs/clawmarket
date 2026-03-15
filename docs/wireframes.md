# Wireframes — ClawMarket

> **Version**: v1.0
> **Last updated**: 2026-03-14
> **Design Language**: Dark Terminal/Fintech + Emerald accent

---

## Navigation (Global)

```
┌──────────────────────────────────────────────────────────────────┐
│  🐲 ClawMarket          Strategies    Docs    Status   [GitHub] │
└──────────────────────────────────────────────────────────────────┘
```

- Logo 点击回首页
- 当前页 nav item 带 emerald underline
- GitHub icon 外链
- Mobile: hamburger menu

---

## Page 1: Home `/`

**目的**: 产品价值传达 + 引导去 Strategies 或 Docs

```
┌──────────────────────────────────────────────────────────────────┐
│  NAV                                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                        HERO SECTION                        │  │
│  │                                                            │  │
│  │   Agent-First Strategy Marketplace                         │  │
│  │   on OKX X Layer                                           │  │
│  │                                                            │  │
│  │   Discover, backtest, and purchase trading strategies      │  │
│  │   with one payment. Permanent access. No subscriptions.    │  │
│  │                                                            │  │
│  │   [Browse Strategies]  [Read Docs]                         │  │
│  │                  (emerald btn)   (ghost btn)               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─── STATS BAR ─────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │   50+              $2.3M             99.8%        20+      │  │
│  │   Strategies       Volume            Uptime       Agents   │  │
│  │   (mono font)      (mono font)       (mono font)          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ── HOW IT WORKS ──────────────────────────────────────────────  │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  1. Discover  │  │  2. Backtest  │  │  3. Purchase  │         │
│  │              │  │              │  │              │          │
│  │  Browse the   │  │  AI-powered   │  │  One x402     │         │
│  │  strategy     │  │  backtest     │  │  payment.     │         │
│  │  catalog.     │  │  with real    │  │  Permanent    │         │
│  │  Filter by    │  │  on-chain     │  │  access.      │         │
│  │  family,      │  │  data from    │  │  No subs.     │         │
│  │  chain,       │  │  OKX.         │  │               │         │
│  │  price.       │  │              │  │               │         │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ── FEATURED STRATEGIES ───────────────────────────────────────  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Title              │ Family      │ Mode     │ Price │  →   │  │
│  ├────────────────────┼─────────────┼──────────┼───────┼──────┤  │
│  │ ETH Momentum RSI   │ indicator   │ signal   │ $25   │  →   │  │
│  │ Whale Tracker Pro   │ smart_money │ trade    │ $50   │  →   │  │
│  │ BTC Hedge Shield    │ hedge       │ overlay  │ $35   │  →   │  │
│  └────────────────────┴─────────────┴──────────┴───────┴──────┘  │
│  (mono font for data cells)                                      │
│                                                                  │
│  [View All Strategies →]                                         │
│                                                                  │
│  ── FOR PUBLISHERS ────────────────────────────────────────────  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │   Publish your strategies. Keep 90%.                       │  │
│  │                                                            │  │
│  │   Submit via OpenClaw. No code execution.                  │  │
│  │   Natural language + structured rules.                     │  │
│  │                                                            │  │
│  │   [Learn More →]                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ── QUICKSTART ────────────────────────────────────────────────  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  # Install the ClawMarket skill                            │  │
│  │  /install-skill clawmarket                                 │  │
│  │                                                            │  │
│  │  # Browse strategies                                       │  │
│  │  GET https://api.clawmarket.com/api/strategies             │  │
│  │                                                            │  │
│  │  # Purchase a strategy                                     │  │
│  │  POST /api/strategies/purchase-intent                      │  │
│  │  { "slug": "eth-momentum-rsi", "agentId": "..." }         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  (terminal-style code block, mono font, dark surface bg)         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  FOOTER                                                          │
│  ClawMarket · Built on OKX X Layer · x402 Protocol               │
│  [GitHub]  [Docs]  [Status]                                      │
└──────────────────────────────────────────────────────────────────┘
```

### Home Page Sections

| Section | 内容 | 组件 |
|---------|------|------|
| Hero | 标题 + 描述 + 2 CTA | 自定义 |
| Stats Bar | 4 个关键指标 (mono font) | Badge/自定义 |
| How It Works | 3 步骤卡片 | Card |
| Featured Strategies | 3-5 条精选策略表格 | Table |
| For Publishers | 发布者引导 banner | Card |
| Quickstart | 代码示例 (terminal 风格) | 自定义 code block |
| Footer | 链接 + 版权 | 自定义 |

---

## Page 2: Strategy Catalog `/strategies`

**目的**: 浏览和筛选所有策略（teaser 级别）

```
┌──────────────────────────────────────────────────────────────────┐
│  NAV                                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Strategy Catalog                               XX strategies    │
│                                                                  │
│  ┌── FILTER BAR ─────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  [Family ▾]  [Chain ▾]  [Mode ▾]  [Price ▾]  [Sort ▾]    │  │
│  │                                                            │  │
│  │  Active: indicator_rule × | xlayer × | Clear All           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── DESKTOP: TABLE VIEW ────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Strategy          Family        Mode       Chains  Price  │  │
│  │  ─────────────────────────────────────────────────────────  │  │
│  │                                                            │  │
│  │  ETH Momentum RSI  ┌──────────┐  signal     XL     $25    │  │
│  │  by @alphalab      │indicator │  only              mono   │  │
│  │  Short desc...     └──────────┘                            │  │
│  │                                                            │  │
│  │  ─────────────────────────────────────────────────────────  │  │
│  │                                                            │  │
│  │  Whale Tracker     ┌───────────┐ actionable  XL     $50   │  │
│  │  by @onchainpro    │smart_money│ trade              mono  │  │
│  │  Short desc...     └───────────┘                           │  │
│  │                                                            │  │
│  │  ─────────────────────────────────────────────────────────  │  │
│  │                                                            │  │
│  │  BTC Hedge Shield  ┌──────────┐  portfolio   XL     $35   │  │
│  │  by @hedgemaster   │  hedge   │  overlay            mono  │  │
│  │  Short desc...     └──────────┘                            │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── MOBILE: CARD VIEW ──────────────────────────────────────┐  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────┐               │  │
│  │  │  ETH Momentum RSI              $25     │               │  │
│  │  │  @alphalab                             │               │  │
│  │  │  ┌──────────┐ ┌────────────┐ ┌─────┐  │               │  │
│  │  │  │indicator │ │signal_only │ │ XL  │  │               │  │
│  │  │  └──────────┘ └────────────┘ └─────┘  │               │  │
│  │  │  Short description text here...        │               │  │
│  │  └────────────────────────────────────────┘               │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────┐               │  │
│  │  │  Whale Tracker Pro              $50    │               │  │
│  │  │  ...                                   │               │  │
│  │  └────────────────────────────────────────┘               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  FOOTER                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### Catalog Page Components

| 组件 | shadcn/ui | 说明 |
|------|-----------|------|
| Filter dropdowns | Select / DropdownMenu | 多选筛选 |
| Active filter tags | Badge + X button | 可清除 |
| Strategy table | Table | Desktop, mono font 数据列 |
| Strategy card | Card | Mobile 堆叠 |
| Family badge | Badge (outline) | 彩色边框区分类型 |
| Mode badge | Badge (secondary) | |
| Price | mono font | 右对齐 |
| Empty state | 自定义 | "No strategies match your filters" |

### Family Badge Colors

```
threshold_rule        → zinc border
indicator_rule        → blue border
relative_condition    → purple border
onchain_signal        → amber border
smart_money_tracking  → emerald border
hedge_rule            → cyan border
```

---

## Page 3: Strategy Detail `/strategies/:slug`

**目的**: 单策略深度展示 + AI 回测 + 引导购买

```
┌──────────────────────────────────────────────────────────────────┐
│  NAV                                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ← Back to Strategies                                            │
│                                                                  │
│  ┌──────────────────────────────────┬─────────────────────────┐  │
│  │         LEFT COLUMN (60%)        │   RIGHT COLUMN (40%)    │  │
│  │                                  │                         │  │
│  │  ┌── HEADER ──────────────────┐  │  ┌── PURCHASE CARD ──┐ │  │
│  │  │                            │  │  │                    │ │  │
│  │  │  ETH Momentum RSI          │  │  │  $25.00           │ │  │
│  │  │  by @alphalab              │  │  │  (mono, large)     │ │  │
│  │  │                            │  │  │                    │ │  │
│  │  │  ┌──────────┐ ┌────────┐  │  │  │  One-time purchase │ │  │
│  │  │  │indicator │ │signal  │  │  │  │  Permanent access  │ │  │
│  │  │  └──────────┘ └────────┘  │  │  │                    │ │  │
│  │  └────────────────────────────┘  │  │  Chain: X Layer    │ │  │
│  │                                  │  │  Asset: USDT0      │ │  │
│  │  ┌── SUMMARY ─────────────────┐  │  │                    │ │  │
│  │  │                            │  │  │  ┌──────────────┐ │ │  │
│  │  │  This strategy monitors    │  │  │  │ Purchase via │ │ │  │
│  │  │  ETH RSI levels and...     │  │  │  │  OpenClaw    │ │ │  │
│  │  │  (natural language teaser)  │  │  │  └──────────────┘ │ │  │
│  │  │                            │  │  │  (emerald button)  │ │  │
│  │  └────────────────────────────┘  │  │                    │ │  │
│  │                                  │  │  How to purchase → │ │  │
│  │  ┌── FACTS GRID ─────────────┐  │  └────────────────────┘ │  │
│  │  │                            │  │                         │  │
│  │  │  Family     indicator_rule │  │  ┌── PUBLISHER ──────┐ │  │
│  │  │  Mode       signal_only    │  │  │                    │ │  │
│  │  │  Chains     X Layer        │  │  │  @alphalab        │ │  │
│  │  │  Tags       ETH, RSI, DeFi│  │  │  12 strategies    │ │  │
│  │  │  Published  2026-03-10     │  │  │  $1.2k volume     │ │  │
│  │  │  (mono font values)        │  │  │                    │ │  │
│  │  └────────────────────────────┘  │  └────────────────────┘ │  │
│  │                                  │                         │  │
│  │  ┌── RULE BREAKDOWN ─────────┐  │                         │  │
│  │  │                            │  │                         │  │
│  │  │  Conditions (public)       │  │                         │  │
│  │  │  ┌──────────────────────┐  │  │                         │  │
│  │  │  │ IF RSI(14) < 30      │  │  │                         │  │
│  │  │  │ AND volume > avg_20d │  │  │                         │  │
│  │  │  │ THEN signal: BUY     │  │  │                         │  │
│  │  │  └──────────────────────┘  │  │                         │  │
│  │  │  (terminal-style block)    │  │                         │  │
│  │  │                            │  │                         │  │
│  │  │  🔒 Full spec unlocked     │  │                         │  │
│  │  │     after purchase         │  │                         │  │
│  │  └────────────────────────────┘  │                         │  │
│  │                                  │                         │  │
│  │  ┌── AI BACKTEST ─────────────┐  │                         │  │
│  │  │                            │  │                         │  │
│  │  │  Backtest Results (90d)    │  │                         │  │
│  │  │                            │  │                         │  │
│  │  │  Return     +12.5%  ██████ │  │                         │  │
│  │  │  Drawdown   -3.2%   ██     │  │                         │  │
│  │  │  Sharpe     1.8     █████  │  │                         │  │
│  │  │  Win Rate   68%     █████  │  │                         │  │
│  │  │  Trades     47             │  │                         │  │
│  │  │  (mono font + mini bars)   │  │                         │  │
│  │  │                            │  │                         │  │
│  │  │  ┌─ AI Analysis ────────┐  │  │                         │  │
│  │  │  │ This strategy showed │  │  │                         │  │
│  │  │  │ consistent returns   │  │  │                         │  │
│  │  │  │ with low drawdown... │  │  │                         │  │
│  │  │  └──────────────────────┘  │  │                         │  │
│  │  │                            │  │                         │  │
│  │  │  [Run Custom Backtest ▾]   │  │                         │  │
│  │  │  Period: [30d][90d][180d]  │  │                         │  │
│  │  │  Capital: [$10,000]        │  │                         │  │
│  │  └────────────────────────────┘  │                         │  │
│  └──────────────────────────────────┴─────────────────────────┘  │
│                                                                  │
│  ── Mobile: 右侧卡片堆叠到顶部 ──                                │
│                                                                  │
│  FOOTER                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### Detail Page Components

| 区域 | 组件 | 说明 |
|------|------|------|
| Header | 自定义 | Title + publisher + badges |
| Purchase Card | Card (sticky on desktop) | 价格 + CTA + 购买信息 |
| Summary | 文本 | Natural language teaser |
| Facts Grid | 自定义 key-value | Mono font values |
| Rule Breakdown | Code block (terminal style) | 公开部分 + 锁定提示 |
| AI Backtest | Card + mini bar charts | Metrics mono font + AI 解读文本 |
| Custom Backtest | Collapsible + Select + Input | 用户可调参数 |
| Publisher Card | Card | Publisher 概要 |

---

## Page 4: OpenClaw Docs `/docs/openclaw`

**目的**: Agent 开发者的集成文档

```
┌──────────────────────────────────────────────────────────────────┐
│  NAV                                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌── SIDEBAR (sticky) ──┬── MAIN CONTENT ────────────────────┐  │
│  │                      │                                     │  │
│  │  Overview            │  # ClawMarket Integration Guide     │  │
│  │  ── Buyer Guide      │                                     │  │
│  │    Quick Start       │  ## Overview                        │  │
│  │    Browse            │                                     │  │
│  │    Backtest          │  ClawMarket is an agent-first       │  │
│  │    Purchase Flow     │  strategy marketplace...             │  │
│  │    Execute           │                                     │  │
│  │  ── Publisher Guide  │  ────────────────────────────────    │  │
│  │    Submit Strategy   │                                     │  │
│  │    Pricing           │  ## Buyer Guide                     │  │
│  │    Revenue           │                                     │  │
│  │  ── API Reference    │  ### Quick Start                    │  │
│  │    Strategies        │                                     │  │
│  │    Purchases         │  ┌────────────────────────────────┐ │  │
│  │    Execution         │  │ # 1. Install skill             │ │  │
│  │    AI Endpoints      │  │ /install-skill clawmarket      │ │  │
│  │  ── Fee Structure    │  │                                │ │  │
│  │  ── Errors           │  │ # 2. Browse strategies         │ │  │
│  │                      │  │ GET /api/strategies            │ │  │
│  │                      │  │                                │ │  │
│  │                      │  │ # 3. Run backtest              │ │  │
│  │                      │  │ POST /api/strategies/:slug/    │ │  │
│  │                      │  │   backtest                     │ │  │
│  │                      │  │ { "period": "90d" }            │ │  │
│  │                      │  └────────────────────────────────┘ │  │
│  │                      │  (terminal code blocks)             │  │
│  │                      │                                     │  │
│  │                      │  ### Purchase Flow                  │  │
│  │                      │                                     │  │
│  │                      │  ┌─────┐    ┌─────┐    ┌─────┐     │  │
│  │                      │  │Step1│ →  │Step2│ →  │Step3│     │  │
│  │                      │  │ 402 │    │Sign │    │Done │     │  │
│  │                      │  └─────┘    └─────┘    └─────┘     │  │
│  │                      │                                     │  │
│  │                      │  ────────────────────────────────    │  │
│  │                      │                                     │  │
│  │                      │  ## API Reference                   │  │
│  │                      │                                     │  │
│  │                      │  ┌────────────────────────────────┐ │  │
│  │                      │  │ GET /api/strategies            │ │  │
│  │                      │  │                                │ │  │
│  │                      │  │ Response:                      │ │  │
│  │                      │  │ {                              │ │  │
│  │                      │  │   "data": [...],              │ │  │
│  │                      │  │   "display": {                │ │  │
│  │                      │  │     "markdown": "...",        │ │  │
│  │                      │  │     "telegram": {...},        │ │  │
│  │                      │  │     "discord": {...}          │ │  │
│  │                      │  │   }                           │ │  │
│  │                      │  │ }                              │ │  │
│  │                      │  └────────────────────────────────┘ │  │
│  │                      │                                     │  │
│  │                      │  ────────────────────────────────    │  │
│  │                      │                                     │  │
│  │                      │  ## Fee Structure                   │  │
│  │                      │                                     │  │
│  │                      │  ┌────────┬──────────┐              │  │
│  │                      │  │ Party  │ Share    │              │  │
│  │                      │  ├────────┼──────────┤              │  │
│  │                      │  │ Pub.   │ 90%     │              │  │
│  │                      │  │ Plat.  │ 10%     │              │  │
│  │                      │  └────────┴──────────┘              │  │
│  │                      │                                     │  │
│  └──────────────────────┴─────────────────────────────────────┘  │
│                                                                  │
│  ── Mobile: Sidebar 变顶部 dropdown ──                           │
│                                                                  │
│  FOOTER                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### Docs Page Components

| 组件 | shadcn/ui | 说明 |
|------|-----------|------|
| Sidebar nav | ScrollArea + links | Sticky, 当前 section 高亮 |
| Code blocks | 自定义 terminal style | Mono font, copy button |
| API endpoint | Card | Method badge + path + response |
| Step flow | 自定义 | 编号步骤横排 |
| Fee table | Table | 简洁 2 列 |
| Mobile sidebar | Sheet / Collapsible | 顶部下拉替代侧边 |

---

## Page 5: Status `/status`

**目的**: 实时 API 和服务健康状态

```
┌──────────────────────────────────────────────────────────────────┐
│  NAV                                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  System Status                                                   │
│                                                                  │
│  ┌── OVERALL STATUS ─────────────────────────────────────────┐  │
│  │                                                            │  │
│  │   ● All Systems Operational                                │  │
│  │   (emerald dot + text)                                     │  │
│  │                                                            │  │
│  │   Last checked: 2 seconds ago                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── SERVICE TABLE ──────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  Service              Status      Response    Uptime(30d)  │  │
│  │  ──────────────────────────────────────────────────────────  │  │
│  │  ● Main API           Operational   45ms       99.9%       │  │
│  │  ● Backtest Worker    Operational   62ms       99.8%       │  │
│  │  ● Workers AI         Operational   89ms       99.7%       │  │
│  │  ● D1 Database        Operational   12ms       99.9%       │  │
│  │  ● OKX OnchainOS     Operational  210ms       98.5%       │  │
│  │  ● X Layer (196)      Operational  150ms       99.2%       │  │
│  │                                                            │  │
│  │  (mono font for numbers, emerald/red/amber dots)           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── RESPONSE TIME CHART ────────────────────────────────────┐  │
│  │                                                            │  │
│  │  API Response Time (24h)                                   │  │
│  │                                                            │  │
│  │  500ms ┤                                                   │  │
│  │  400ms ┤                                                   │  │
│  │  300ms ┤          ╭─╮                                      │  │
│  │  200ms ┤    ╭─────╯ ╰──╮                                  │  │
│  │  100ms ┤╭───╯          ╰───────────────╮                  │  │
│  │    0ms ┤╯                              ╰─────             │  │
│  │        └──────────────────────────────────────             │  │
│  │         00:00   06:00   12:00   18:00   now               │  │
│  │                                                            │  │
│  │  (minimal sparkline / area chart, emerald fill)            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌── RECENT INCIDENTS ───────────────────────────────────────┐  │
│  │                                                            │  │
│  │  No incidents in the last 30 days.                         │  │
│  │                                                            │  │
│  │  ── OR ──                                                  │  │
│  │                                                            │  │
│  │  2026-03-12 14:30 UTC                                      │  │
│  │  OKX OnchainOS - Elevated latency                          │  │
│  │  Duration: 12 minutes | Resolved                           │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  FOOTER                                                          │
└──────────────────────────────────────────────────────────────────┘
```

### Status Page Components

| 组件 | shadcn/ui | 说明 |
|------|-----------|------|
| Overall status | Badge (emerald/red/amber) | 总体状态 |
| Service table | Table | Status dot + mono font metrics |
| Status dot | 自定义 | ● emerald=up, red=down, amber=degraded |
| Response chart | 轻量 chart (recharts or 自定义 SVG) | 24h sparkline |
| Incident log | Card / timeline | 倒序，最近 30 天 |
| Auto refresh | 自动轮询 | 每 30s 刷新 |

---

## Responsive Strategy

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | 单列堆叠，Card 视图，Sidebar 变 Sheet |
| Tablet | 640-1024px | 紧凑双列，Table 可横滚 |
| Desktop | > 1024px | 完整布局，Table + Sidebar |

### Mobile Adaptations

- Nav → Hamburger menu
- Strategy Catalog: Table → Card 堆叠
- Strategy Detail: 双列 → 单列（Purchase Card 在顶部）
- Docs: Sidebar → 顶部 dropdown/sheet
- Status: Table 紧凑化

---

## Component Inventory (shadcn/ui)

### Required Components

| Component | Pages Used |
|-----------|-----------|
| Button | All |
| Card | Home, Detail, Status |
| Table | Catalog, Status, Docs |
| Badge | Catalog, Detail |
| Select | Catalog (filters) |
| Dialog | — |
| Sheet | Mobile nav, Mobile docs sidebar |
| ScrollArea | Docs sidebar |
| Collapsible | Detail (custom backtest), Docs |
| Input | Detail (backtest capital) |
| Separator | All (section dividers) |
| Skeleton | All (loading states) |
| Tooltip | Catalog, Detail (info icons) |

### Custom Components

| Component | Description |
|-----------|-------------|
| SiteLayout | Nav + main + footer |
| NavBar | Top navigation |
| MobileNav | Hamburger + Sheet |
| TerminalBlock | Terminal-style code display |
| StatCard | Mono font metric display |
| StatusDot | ● with color states |
| FamilyBadge | Color-coded strategy family |
| MetricBar | Mini horizontal bar for backtest |
| SparklineChart | Minimal line/area chart |
| FilterBar | Multi-select filter with active tags |

---

## User Flow (Browser)

```
                    ┌─────────┐
                    │  Home   │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌──────────┐ ┌──────┐ ┌────────┐
        │Strategies│ │ Docs │ │ Status │
        └────┬─────┘ └──────┘ └────────┘
             │
             ▼
       ┌───────────┐
       │  Detail   │
       │  + AI     │
       │  Backtest │
       └─────┬─────┘
             │
             ▼
    ┌─────────────────┐
    │ "Purchase via   │
    │  OpenClaw" CTA  │──→ 跳转 Docs 或展示 install 指引
    └─────────────────┘
```

浏览器用户永远不做购买操作，CTA 引导至 OpenClaw 接入方式。
