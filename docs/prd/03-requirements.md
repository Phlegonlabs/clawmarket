## 4. Functional Requirements

### Milestone 1: Foundation — 项目基础 + 后端移植

#### F001: Monorepo Scaffold

- **Description**: 建立 Bun monorepo 工作区，配置 TypeScript strict、ESLint、Prettier、Husky
- **Acceptance criteria**:
  - [ ] `apps/api`、`apps/web`、`apps/backtest`、`packages/contracts`、`packages/db` 工作区就绪
  - [ ] `bun install` + `bun run build` + `bun run typecheck` 通过
  - [ ] Git hooks (lint-staged) 工作正常
- **Priority**: P0
- **Dependencies**: None

#### F002: Shared Contracts (移植)

- **Description**: 移植策略 taxonomy、execution mode、manifest schema 到 `packages/contracts`
- **Acceptance criteria**:
  - [ ] 6 个 strategy family + 3 个 execution mode 的 Zod schema 定义完成
  - [ ] Strategy package 完整类型（含 naturalLanguageSpec + ruleSpec）
  - [ ] Display response schema (data + display format)
  - [ ] OpenClaw skill manifest 类型
  - [ ] 单元测试通过
- **Priority**: P0
- **Dependencies**: F001

#### F003: Database Schema (D1)

- **Description**: 基于 Drizzle ORM 建立 Cloudflare D1 数据库 schema
- **Acceptance criteria**:
  - [ ] 核心表：agent_identities、publishers、strategy_packages、purchase_intents、purchases、entitlements、revenue_ledger
  - [ ] Drizzle migration 生成并可应用到 D1
  - [ ] 多链预留：purchases/purchase_intents 包含 chainId 字段
- **Priority**: P0
- **Dependencies**: F002

#### F004: API Core (移植)

- **Description**: 移植 Hono API 核心框架、error handling、logging、bindings
- **Acceptance criteria**:
  - [ ] Hono app 配置完成，Cloudflare Workers 兼容
  - [ ] D1 binding + Workers AI binding 配置
  - [ ] `GET /api/health` 返回平台状态
  - [ ] Wrangler dev 可本地运行
- **Priority**: P0
- **Dependencies**: F003

### Milestone 2: Core API — 策略 CRUD + 支付流程

#### F005: Strategy CRUD API

- **Description**: 策略的公开读取和 publisher 提交接口
- **Acceptance criteria**:
  - [ ] `GET /api/strategies` — 公开策略列表（teaser）
  - [ ] `GET /api/strategies/:slug` — 策略详情 + rule outline
  - [ ] `POST /api/openclaw/strategies/publish` — publisher 提交
  - [ ] 响应包含 `data` + `display`（markdown / telegram / discord 预渲染）
- **Priority**: P0
- **Dependencies**: F004

#### F006: x402 Purchase Flow (移植)

- **Description**: 移植 x402 支付流程，支持 X Layer 上的 USDT0/USDC
- **Acceptance criteria**:
  - [ ] `POST /api/strategies/purchase-intent` — 返回 HTTP 402 + x402 challenge
  - [ ] `POST /api/strategies/purchases/signing-template` — EIP-712 typed data
  - [ ] `POST /api/strategies/purchases/complete` — 签名验证 + 结算
  - [ ] `GET /api/strategies/:slug/unlocked` — 需 entitlement 后返回完整包
  - [ ] 多链 chainId 参数预留
- **Priority**: P0
- **Dependencies**: F005

#### F007: Entitlement & Revenue

- **Description**: 永久 entitlement 模型 + 90/10 收益分成
- **Acceptance criteria**:
  - [ ] 一次购买 → entitlement 记录 → 永久读取权
  - [ ] Revenue ledger 记录 90% publisher / 10% platform 分成
  - [ ] 同一 agent 重复购买不重复收费
- **Priority**: P0
- **Dependencies**: F006

#### F008: Wrapped OKX Execution

- **Description**: 移植 OKX OnchainOS wrapped gateway
- **Acceptance criteria**:
  - [ ] `POST /api/execution/market-price` — token 价格查询
  - [ ] `POST /api/execution/dex-swap-intent` — DEX swap 路由
  - [ ] Agent 永远不需要直接持有 OKX credentials
- **Priority**: P0
- **Dependencies**: F004

### Milestone 3: AI Features — 推荐 + 回测

#### F009: AI Strategy Recommendation

- **Description**: 基于 Workers AI 的策略推荐引擎
- **Acceptance criteria**:
  - [ ] `POST /api/strategies/recommend` — 接受 agent 偏好描述
  - [ ] 使用 Workers AI 匹配策略 + 生成推荐理由
  - [ ] 响应包含 `data`（结构化）+ `display`（预渲染 markdown/telegram/discord）
  - [ ] 公开免费，按 agentId 限流
- **Priority**: P1
- **Dependencies**: F005

#### F010: AI Backtest Analysis

- **Description**: 独立 backtest Worker 微服务，基于 OKX OnchainOS 链上数据
- **Acceptance criteria**:
  - [ ] `POST /api/strategies/:slug/backtest` — 接受 period、initialCapital、chain 参数
  - [ ] 通过 OKX OnchainOS API 拉取真实链上价格数据
  - [ ] 计算 return、drawdown、sharpe、winRate 等指标
  - [ ] Workers AI 生成自然语言分析解读
  - [ ] 回测运行在独立 backtest Worker（Service Binding 调用）
  - [ ] 响应包含 `data` + `display`
  - [ ] 公开免费（转化工具，促进购买）
- **Priority**: P1
- **Dependencies**: F008, F005

### Milestone 4: Frontend — 全新 UI

#### F011: Design System + shadcn/ui Setup

- **Description**: 建立基于 shadcn/ui + Radix UI 的设计系统
- **Acceptance criteria**:
  - [ ] shadcn/ui 初始化并配置 Tailwind v4
  - [ ] 基础组件：Button、Card、Dialog、Table、Badge、Input、Select
  - [ ] 全局 layout：顶部导航、页面容器、footer
  - [ ] 设计 token（颜色、间距、字体）定义
  - [ ] 响应式断点（desktop / tablet / mobile）
- **Priority**: P0
- **Dependencies**: F001

#### F012: Home Page

- **Description**: 全新首页设计
- **Acceptance criteria**:
  - [ ] Hero section：产品定位 + 核心价值
  - [ ] 能力展示：策略市场、AI 回测、一次购买、agent-first
  - [ ] Featured strategies（从 API 拉取）
  - [ ] Quickstart / 接入指引
  - [ ] 响应式布局
- **Priority**: P0
- **Dependencies**: F011

#### F013: Strategy Catalog Page

- **Description**: 策略目录页，支持筛选和排序
- **Acceptance criteria**:
  - [ ] 从 `GET /api/strategies` 拉取数据
  - [ ] 筛选：family、chain、execution mode、price range、tags
  - [ ] 排序：price、newest、popularity
  - [ ] Desktop：表格视图；Mobile：卡片视图
  - [ ] URL 同步筛选状态
- **Priority**: P0
- **Dependencies**: F011, F005

#### F014: Strategy Detail Page

- **Description**: 策略详情页，含回测展示
- **Acceptance criteria**:
  - [ ] 策略概要：title、publisher、family、execution mode、price、chains
  - [ ] Rule breakdown 可视化
  - [ ] AI 回测结果展示（从 backtest API 拉取）
  - [ ] 购买引导（指向 OpenClaw 操作指引）
  - [ ] 响应式布局
- **Priority**: P0
- **Dependencies**: F011, F005, F010

#### F015: OpenClaw Docs Page

- **Description**: OpenClaw 集成文档页
- **Acceptance criteria**:
  - [ ] Buyer 操作步骤
  - [ ] Publisher 操作步骤
  - [ ] API reference 概要
  - [ ] 费用结构（90/10 split）说明
  - [ ] Sticky 侧边导航（Mobile: dropdown/sheet）
- **Priority**: P1
- **Dependencies**: F011

#### F018: Status Page

- **Description**: API 和服务健康状态页面
- **Acceptance criteria**:
  - [ ] 总体状态指示（Operational / Degraded / Down）
  - [ ] 各服务状态表格：Main API、Backtest Worker、Workers AI、D1、OKX OnchainOS、X Layer
  - [ ] 响应时间显示（mono font）
  - [ ] 30 天 uptime 百分比
  - [ ] 24h 响应时间 sparkline 图表
  - [ ] 最近事件日志
  - [ ] 自动轮询刷新（30s）
  - [ ] 响应式布局
- **Priority**: P1
- **Dependencies**: F011, F004

### Milestone 5: OpenClaw Skill + Polish

#### F016: OpenClaw Skill Manifest

- **Description**: 机器可读的 skill manifest + 人类可读的 skill.md
- **Acceptance criteria**:
  - [ ] `GET /api/openclaw/skill-manifest` — JSON manifest
  - [ ] `GET /api/openclaw/skill.md` — Markdown 操作手册
  - [ ] Skill 安装指引
- **Priority**: P1
- **Dependencies**: F005, F006

#### F017: LLM Index Files

- **Description**: 提供 llms.txt / llm.txt 给 LLM 使用
- **Acceptance criteria**:
  - [ ] `/llms.txt` 和 `/llm.txt` 返回项目概要
  - [ ] 内容自动同步最新策略目录信息
- **Priority**: P2
- **Dependencies**: F012
