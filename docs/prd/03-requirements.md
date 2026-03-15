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
  - [ ] Chain Registry 类型定义就绪（`ChainId`, `ChainConfig`, `PaymentToken` Zod schemas in `packages/contracts`）
  - [ ] `entitlements` 表无 `chain_id`（链无关设计，ADR-007）
  - [ ] `strategy_packages` 表含 `supported_chain_ids` JSON 数组
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
  - [ ] EIP-712 domain separator 必须包含 `chainId`（防跨链重放攻击，ADR-007）
  - [ ] `chainId` 参数通过 Chain Registry 验证（`resolveChain()` 返回 `Result<ChainConfig, E>`）
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

#### F011: Design System + Astro + shadcn/ui Setup

- **Description**: 建立 Astro 项目 + shadcn/ui + Radix UI 的设计系统（React Islands 架构）
- **Acceptance criteria**:
  - [ ] Astro 项目初始化 + `@astrojs/react` + `@astrojs/cloudflare` 适配器
  - [ ] shadcn/ui 初始化并配置 Tailwind v4
  - [ ] 基础组件：Button、Card、Dialog、Table、Badge、Input、Select
  - [ ] 全局 Astro layout（`layouts/BaseLayout.astro`）：顶部导航、页面容器、footer
  - [ ] 设计 token（颜色、间距、字体）定义
  - [ ] 响应式断点（desktop / tablet / mobile）
- **Priority**: P0
- **Dependencies**: F001

#### F012: Home Page

- **Description**: 全新首页设计（Astro 页面，静态内容 + Featured Strategies React Island）
- **Acceptance criteria**:
  - [ ] `pages/index.astro` — Hero section：产品定位 + 核心价值
  - [ ] 能力展示：策略市场、AI 回测、一次购买、agent-first（Astro 组件，零 JS）
  - [ ] Featured strategies（React Island `client:load`，从 API 拉取）
  - [ ] Quickstart / 接入指引（Astro 组件，零 JS）
  - [ ] 响应式布局
- **Priority**: P0
- **Dependencies**: F011

#### F013: Strategy Catalog Page

- **Description**: 策略目录页，支持筛选和排序（React Island — 高交互性页面）
- **Acceptance criteria**:
  - [ ] `pages/strategies/index.astro` 外壳 + `StrategyCatalog` React Island (`client:load`)
  - [ ] 从 `GET /api/strategies` 拉取数据
  - [ ] 筛选：family、chain、execution mode、price range、tags
  - [ ] 排序：price、newest、popularity
  - [ ] Desktop：表格视图；Mobile：卡片视图
  - [ ] URL 同步筛选状态
- **Priority**: P0
- **Dependencies**: F011, F005

#### F014: Strategy Detail Page

- **Description**: 策略详情页，含回测展示（Astro 页面 + React Islands）
- **Acceptance criteria**:
  - [ ] `pages/strategies/[slug].astro` — 策略概要：title、publisher、family、execution mode、price、chains（Astro 静态渲染）
  - [ ] Rule breakdown 可视化（Astro 组件，零 JS）
  - [ ] AI 回测结果展示（`BacktestPanel` React Island `client:visible`，从 backtest API 拉取）
  - [ ] 购买引导（指向 OpenClaw 操作指引）
  - [ ] 响应式布局
- **Priority**: P0
- **Dependencies**: F011, F005, F010

#### F015: OpenClaw Docs Page

- **Description**: OpenClaw 集成文档页（纯 Astro 页面 — 静态内容，零客户端 JS）
- **Acceptance criteria**:
  - [ ] `pages/docs/openclaw.astro` — 纯 Astro 渲染
  - [ ] Buyer 操作步骤
  - [ ] Publisher 操作步骤
  - [ ] API reference 概要
  - [ ] 费用结构（90/10 split）说明
  - [ ] Sticky 侧边导航（Mobile: dropdown/sheet — Astro 组件 + CSS-only 交互）
- **Priority**: P1
- **Dependencies**: F011

#### F018: Status Page

- **Description**: API 和服务健康状态页面（Astro 页面 + React Island for 自动轮询）
- **Acceptance criteria**:
  - [ ] `pages/status.astro` 外壳 + `StatusDashboard` React Island (`client:load`)
  - [ ] 总体状态指示（Operational / Degraded / Down）
  - [ ] 各服务状态表格：Main API、Backtest Worker、Workers AI、D1、OKX OnchainOS、X Layer
  - [ ] 响应时间显示（mono font）
  - [ ] 30 天 uptime 百分比
  - [ ] 24h 响应时间 sparkline 图表
  - [ ] 最近事件日志
  - [ ] 自动轮询刷新（30s）— React Island 内处理
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

---

### Milestone 6: Marketplace Intelligence（M3 之后，M4 之前或并行）

#### V1E-F005: Workers AI Model Configuration Upgrade

- **Description**: 升级 Workers AI 模型配置，支持 GLM-4.7-Flash / Nemotron-3 等新一代模型，实现可配置模型选择
- **Acceptance criteria**:
  - [ ] `lib/workers-ai.ts` 支持模型配置映射（model registry）
  - [ ] 支持按用途选择模型：recommendation → GLM-4.7-Flash, analysis → Nemotron-3, default → Llama-3.1-8B
  - [ ] 模型配置通过环境变量或 Wrangler config 管理，不硬编码
  - [ ] 回归测试：现有 F009/F010 功能不受影响
  - [ ] 性能基准：新模型推理延迟 ≤ 旧模型 80%
- **Priority**: P1
- **Dependencies**: F004
- **Task**: T019

#### V1E-F001: Auto-Backtest & Performance Badge Service

- **Description**: 自动回测 + 绩效徽章服务 — 策略提交后自动触发回测，生成 Sharpe/DD/Win Rate 验证标签
- **Acceptance criteria**:
  - [ ] 策略发布时自动触发回测（Cron 或 publish webhook）
  - [ ] 计算并存储绩效指标：Sharpe Ratio, Max Drawdown, Win Rate, Total Return
  - [ ] 指标通过阈值验证生成徽章：`verified-sharpe`, `low-drawdown`, `high-win-rate`
  - [ ] 徽章存入 D1 `strategy_badges` 表，关联 strategy_id
  - [ ] `GET /api/strategies/:slug` 响应包含 badges 数组
  - [ ] 徽章展示在策略卡片和详情页
  - [ ] 响应包含 `data` + `display`
- **Priority**: P1
- **Dependencies**: V1E-F005, F010
- **Task**: T020

#### V1E-F004: Strategy Comparison API

- **Description**: 策略比较 API — 支持 2-4 个策略并排比较 + AI 生成对比总结
- **Acceptance criteria**:
  - [ ] `POST /api/strategies/compare` — 接受 2-4 个 strategy slug
  - [ ] 返回并排比较数据：价格、family、指标、徽章、回测结果
  - [ ] Workers AI 生成自然语言比较总结（优劣分析、适用场景推荐）
  - [ ] 比较结果缓存（KV 或 D1，TTL 1 小时）
  - [ ] 响应包含 `data` + `display`（markdown/telegram/discord）
  - [ ] 输入验证：slug 数量 2-4，策略必须存在
- **Priority**: P1
- **Dependencies**: V1E-F005, F010
- **Task**: T021

#### V1E-F003: Publisher Analytics API

- **Description**: Publisher 分析 API — 提供收入、销量、策略表现数据
- **Acceptance criteria**:
  - [ ] `GET /api/openclaw/publishers/:publisherId/analytics` — 需 publisher 身份验证
  - [ ] 返回数据：总收入、总销量、按策略分拆、时间趋势（7d/30d/all）
  - [ ] 策略表现汇总：每个策略的回测指标、徽章数、购买转化率
  - [ ] 数据从 revenue_ledger + purchases + strategy_badges 聚合
  - [ ] 响应包含 `data` + `display`
  - [ ] 按 publisherId 限流
- **Priority**: P2
- **Dependencies**: V1E-F005, F007
- **Task**: T022

---

### Milestone 7: Leaderboard & Social Proof（M4/M5 之后）

#### V2-F008a: Leaderboard Data Aggregation Service + Cron Trigger

- **Description**: Leaderboard 数据聚合服务 — Cron Trigger 定期计算策略排名
- **Acceptance criteria**:
  - [ ] D1 表：`leaderboard_snapshots`（strategy_id, rank, score, category, snapshot_date）
  - [ ] 排名维度：overall, by_family, by_chain, trending
  - [ ] 评分算法：加权公式 = 0.3 × Sharpe + 0.25 × purchases + 0.2 × win_rate + 0.15 × recency + 0.1 × badge_count
  - [ ] Cron Trigger 每 6 小时执行一次聚合
  - [ ] Trending 算法：7 天购买增速 + 回测指标变化率
  - [ ] 历史快照保留 90 天
- **Priority**: P1
- **Dependencies**: T020, F005, F007
- **Task**: T023

#### V2-F008b: Leaderboard API Endpoints + Trending Algorithm

- **Description**: Leaderboard API 端点 + Trending 算法
- **Acceptance criteria**:
  - [ ] `GET /api/leaderboard` — 返回排名列表（支持 category、limit、offset 参数）
  - [ ] `GET /api/leaderboard/trending` — 返回 trending 策略（7d 窗口）
  - [ ] `GET /api/leaderboard/:strategySlug/rank` — 单策略排名查询
  - [ ] 响应包含 `data` + `display`
  - [ ] 缓存层：KV 缓存排名结果，TTL 与 Cron 周期对齐
  - [ ] 公开免费 API
- **Priority**: P1
- **Dependencies**: T023
- **Task**: T024

#### V2-F008c: Leaderboard Page + Dynamic Featured

- **Description**: Leaderboard 页面（Astro + React Island）+ 首页动态 Featured 区域
- **Acceptance criteria**:
  - [ ] `pages/leaderboard.astro` 外壳 + `LeaderboardTable` React Island (`client:load`)
  - [ ] 排名表格：rank、策略名、publisher、Sharpe、Win Rate、购买数、趋势箭头
  - [ ] Tab 切换：Overall / By Family / Trending
  - [ ] 首页 Featured Strategies 区域从 leaderboard trending 数据拉取（替换静态 featured）
  - [ ] 响应式布局（Desktop: 表格; Mobile: 卡片）
  - [ ] URL 同步 tab 状态
- **Priority**: P1
- **Dependencies**: T024, F012
- **Task**: T025

---

### Milestone 8: x402 V2 Payment Evolution（V2 阶段）

#### V2-F006a: x402 V2 SDK Integration + Wallet Session Management

- **Description**: 集成 x402 V2 SDK，支持钱包会话管理
- **Acceptance criteria**:
  - [ ] 升级 x402 SDK 到 V2 版本
  - [ ] 支持 wallet session：创建、续期、销毁会话
  - [ ] Session-based payment：会话内购买无需重复签名
  - [ ] 向后兼容：V1 单次支付流程继续工作
  - [ ] Multi-chain session：session 绑定 chainId
  - [ ] Session 超时和安全策略配置
- **Priority**: P1
- **Dependencies**: F006
- **Task**: T026

#### V2-F006b: Credit Balance Service + Top-up Flow

- **Description**: Credit balance 服务 + 充值流程
- **Acceptance criteria**:
  - [ ] D1 表：`credit_balances`（agent_id, balance, chain_id, updated_at）
  - [ ] D1 表：`credit_transactions`（id, agent_id, type, amount, reference, created_at）
  - [ ] `POST /api/credits/top-up` — x402 充值（链上转账 → credit 入账）
  - [ ] `GET /api/credits/balance` — 查询余额
  - [ ] `POST /api/strategies/purchases/complete` 支持 credit 扣款模式
  - [ ] 余额不足时自动降级为 x402 直接支付
  - [ ] 响应包含 `data` + `display`
- **Priority**: P1
- **Dependencies**: T026
- **Task**: T027

#### V2-F006c: Stripe Fiat On-ramp (Optional, Non-blocking)

- **Description**: Stripe 法币入口 — 法币充值 credit（可选，非阻塞）
- **Acceptance criteria**:
  - [ ] Stripe Checkout Session 创建 → 充值 credit balance
  - [ ] Webhook 处理：payment_intent.succeeded → credit 入账
  - [ ] 支持 USD/EUR → credit 转换（汇率通过 Stripe 管理）
  - [ ] 充值记录写入 `credit_transactions`（type: `fiat_topup`）
  - [ ] 前端充值按钮（React Island）跳转 Stripe Checkout
  - [ ] **Feature flag 控制**：可独立开关，不影响 crypto 支付流程
- **Priority**: P2
- **Dependencies**: T027
- **Task**: T028

---

### Milestone 9: Trust & Identity Layer（V2 阶段）

#### V2-F004a: ERC-8004 Identity Registry Integration

- **Description**: 集成 ERC-8004 身份注册合约，实现链上身份验证
- **Acceptance criteria**:
  - [ ] `lib/erc8004.ts` — ERC-8004 Identity Registry 合约交互 wrapper
  - [ ] 支持身份注册：publisher 和 agent 均可注册链上身份
  - [ ] 支持身份查询：通过 address 查询注册状态和元数据
  - [ ] X Layer 合约地址配置（环境变量）
  - [ ] 身份数据缓存（D1，TTL 24 小时）
  - [ ] 错误处理：合约调用失败的 graceful degradation
- **Priority**: P1
- **Dependencies**: V1 完成
- **Task**: T029

#### V2-F004b: ERC-8004 Reputation Registry + Score Aggregation

- **Description**: 集成 ERC-8004 声誉注册 + 评分聚合
- **Acceptance criteria**:
  - [ ] `lib/erc8004-reputation.ts` — Reputation Registry 合约交互 wrapper
  - [ ] 声誉评分聚合：购买数、徽章数、策略质量、buyer 反馈 → 链上声誉分
  - [ ] 声誉分写入链上（批量更新，Cron Trigger 每日执行）
  - [ ] `GET /api/publishers/:publisherId/reputation` — 查询声誉分 + 详情
  - [ ] 声誉分展示在 publisher 资料和策略卡片
  - [ ] 响应包含 `data` + `display`
- **Priority**: P1
- **Dependencies**: T029
- **Task**: T030

#### V2-F004c: Publisher Verification API + Agent Identity Endpoint

- **Description**: Publisher 验证 API + Agent 身份验证端点
- **Acceptance criteria**:
  - [ ] `POST /api/openclaw/publishers/verify` — 提交 ERC-8004 身份证明 → 获取 verified 状态
  - [ ] `GET /api/openclaw/publishers/:publisherId/verification` — 查询验证状态
  - [ ] `POST /api/agents/verify` — Agent 身份验证（ERC-8004 签名 challenge）
  - [ ] Verified 状态写入 D1 `publishers` 表（verified_at, verification_method）
  - [ ] Verified badge 展示在策略卡片和 publisher 页面
  - [ ] 替代传统 KYC — 无需收集个人信息
  - [ ] 响应包含 `data` + `display`
- **Priority**: P1
- **Dependencies**: T030
- **Task**: T031

---

### Milestone 10: Strategy Bundles（V2 阶段）

#### V2-F005a: Bundle Schema + CRUD API

- **Description**: Strategy Bundle schema 定义 + CRUD API
- **Acceptance criteria**:
  - [ ] Zod schema：`BundleSchema`（id, name, description, strategy_slugs[], pricing, tags）— 定义在 `packages/contracts`
  - [ ] D1 表：`bundles`（id, name, slug, description, strategy_ids, price, publisher_id, created_at）
  - [ ] `GET /api/bundles` — Bundle 列表（公开）
  - [ ] `GET /api/bundles/:slug` — Bundle 详情 + 包含的策略预览
  - [ ] `POST /api/openclaw/bundles/publish` — Publisher 创建 Bundle
  - [ ] Bundle 价格须 ≤ 包含策略单独购买总价的 80%（折扣验证）
  - [ ] 响应包含 `data` + `display`
- **Priority**: P1
- **Dependencies**: F005, T020
- **Task**: T032

#### V2-F005b: Bundle x402 Payment + Multi-entitlement Minting

- **Description**: Bundle x402 支付 + 多 entitlement 铸造
- **Acceptance criteria**:
  - [ ] `POST /api/bundles/purchase-intent` — 返回 HTTP 402 + x402 challenge（Bundle 价格）
  - [ ] 支付完成后一次性铸造 Bundle 内所有策略的 entitlement
  - [ ] 事务性：所有 entitlement 要么全部创建，要么全部回滚
  - [ ] Revenue 分成：按 Bundle 内各策略价格比例分配给各 publisher
  - [ ] 支持 credit balance 扣款（如 M8 已完成）
  - [ ] 防止重复铸造：已拥有 Bundle 内某策略 entitlement 的 buyer 不重复创建
- **Priority**: P1
- **Dependencies**: T032, F006
- **Task**: T033

#### V2-F005c: Portfolio-level Combined Backtest

- **Description**: Portfolio 级别组合回测 — 将 Bundle 内多策略作为组合进行回测
- **Acceptance criteria**:
  - [ ] `POST /api/bundles/:slug/backtest` — 组合回测端点
  - [ ] 组合回测指标：portfolio return, portfolio drawdown, correlation matrix, diversification ratio
  - [ ] Workers AI 生成组合分析：策略间相关性、风险分散效果、最优权重建议
  - [ ] 回测运行在 backtest Worker（Service Binding）
  - [ ] 响应包含 `data` + `display`
  - [ ] 公开免费（转化工具）
- **Priority**: P2
- **Dependencies**: T032, F010
- **Task**: T034

#### V2-F005d: Bundle Catalog + Detail Page

- **Description**: Bundle 目录 + 详情页面（Astro + React Island）
- **Acceptance criteria**:
  - [ ] `pages/bundles/index.astro` 外壳 + `BundleCatalog` React Island (`client:load`)
  - [ ] Bundle 卡片：名称、包含策略数、价格、折扣比例、publisher
  - [ ] 筛选：family 覆盖、价格范围、策略数量
  - [ ] `pages/bundles/[slug].astro` — Bundle 详情页
  - [ ] 详情页展示：包含策略列表、组合回测结果、购买引导
  - [ ] 响应式布局
- **Priority**: P1
- **Dependencies**: T032, F013
- **Task**: T035

---

### V3 远景（仅记录，标记 Future/Proposed）

> 以下 feature 列入远景规划，V2 阶段不实现。记录以备未来评估。

#### V3-F002: NFT 策略授权

- **Description**: 购买时铸造 ERC-721 NFT 作为策略授权凭证，支持链上所有权转移和二级市场交易
- **Scope**:
  - ERC-721 合约：策略购买 → NFT 铸造 → 链上所有权证明
  - 二级市场：NFT 持有者可在 OpenSea / OKX NFT 等平台转售
  - ERC-2981 版税：二级市场交易中 publisher 自动获得版税分成（建议 5-10%）
  - 替代当前 entitlement 模型或作为可选升级
- **Status**: Future/Proposed
- **Prerequisites**: V2 完成, NFT 市场流动性评估

#### V3-F003: Hosted Per-User Agent

- **Description**: 基于 Cloudflare Agents SDK Durable Object，为每个 buyer 托管一个有状态 agent
- **Scope**:
  - Durable Object per buyer：持久化 agent 状态（持仓、偏好、执行历史）
  - Agent 自主执行：接收信号 → 评估 → 调用 wrapped OKX 执行
  - WebSocket 实时通信：buyer ↔ agent 双向交互
  - 计费：x402 按 agent 运行时长 + 信号处理次数微支付
- **Status**: Future/Proposed
- **Prerequisites**: V2-F001 (信号引擎), V2-F006 (x402 V2)

#### V3-F004: Volatility Shield

- **Description**: 实时波动监控 → 自动对冲机制，x402 微支付按激活计费
- **Scope**:
  - 波动监控：Cron + WebSocket 监控市场波动指标（VIX-equivalent, IV, realized vol）
  - 自动对冲：波动超阈值时触发对冲策略（OKX 反向仓位 / 期权对冲）
  - 微支付计费：x402 per-activation 计费（仅在触发对冲时收费）
  - 用户可配置阈值和对冲策略
- **Status**: Future/Proposed
- **Prerequisites**: V2-F002 (Agent 自动执行), V2-F006 (x402 V2)
