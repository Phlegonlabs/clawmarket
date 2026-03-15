## 5. Non-Functional Requirements

### 5.1 Performance

- 首页加载: < 2 秒 (LCP)
- API 响应: < 500ms (P95)
- AI 推荐/回测: < 3 秒 (含 Workers AI 推理)

### 5.2 Security

- Agent 永远不直接接触 OKX API credentials
- x402 签名验证必须在链上可验
- 无浏览器登录 = 无 session/cookie 安全面
- API rate limiting by agentId

### 5.3 Usability

- 支持浏览器: Chrome, Firefox, Safari, Edge (最近 2 个版本)
- 响应式: Desktop + Tablet + Mobile
- Agent 端: 结构化 JSON + 预渲染 display

### 5.4 Maintainability

- TypeScript strict mode 全工作区
- 500 行文件上限
- 依赖方向: types → config → lib → services → app

---

## 6. Out of Scope (V1)

- [ ] 浏览器登录和个人中心
- [ ] Publisher verification / KYC
- [ ] 平台内持仓和 PnL 追踪
- [ ] 托管运行 publisher 任意代码
- [ ] 自建 DEX 或交易引擎
- [ ] 多语言 i18n (V1 英文为主)
- [ ] 平台代理执行交易（full copy-trade）

### V2 Roadmap（架构预留，V1 不实现）

#### V2-F001: 实时信号推送

- Publisher 策略引擎触发信号 → ClawMarket Signal Hub → 推送给订阅 agent
- 信号模式: Managed (平台按 rule_spec 自动评估) + Manual (Publisher API 推送)
- 信号透明度: 强制标注 PRE_TRADE / IN_TRADE / ANALYSIS / EXIT + 价格偏差
- 技术: WebSocket / SSE 长连接
- 收费: x402 per-signal 微支付

#### V2-F002: Agent 自动执行（跟单模式）

- Agent 预设执行规则: 收到信号后自动调用 wrapped OKX 执行
- 模式: signal-only（只看）/ auto-execute（自动跟单）
- 平台不代理操作 — Agent 自主决策

#### V2-F003: 多链支持

- 扩展 chainId 支持
- Payment stablecoin 按 chainId 索引

---

## 7. Technical Constraints

- **Package Manager**: Bun
- **Language**: TypeScript 5.9+ (strict)
- **Frontend**: React 19 + React Router 7 + Vite 7
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui + Radix UI + CVA + Lucide
- **Backend**: Hono on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite via Drizzle ORM)
- **Payment**: x402 (EIP-712, X Layer chain ID 196)
- **AI**: Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct` default)
- **Backtest**: 独立 backtest Worker (Service Binding)
- **OKX**: OnchainOS wrapped gateway
- **Deployment**: Cloudflare Workers (API + Backtest) + Cloudflare Pages (Web)
