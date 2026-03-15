## 1. Overview

### 1.1 Product Vision

ClawMarket 是一个 agent-first 策略市场，让 AI agent 能够发现、评估、购买并执行链上交易策略。浏览器端提供高品质的公开展示界面，核心操作通过 OpenClaw agent 完成。

### 1.2 Problem Statement

- DEX 数据站只展示数据，不承载 agent-first 的策略分发
- 交易策略平台全部采用月订阅制（$19-99/月），对一次性需求不友好
- Agent 使用链上基础设施时需要自己处理 secret、支付和权限
- 策略购买后的结果缺乏在 Telegram/Discord 等渠道的良好展示
- 市场上没有"策略即商品 + agent 原生购买 + 一次付费永久拥有"的产品

### 1.3 Solution

- 策略以 manifest 形式发布（自然语言 + 结构化规则），不执行任意代码
- x402 协议实现一次购买永久拥有，无订阅
- AI 推荐 + AI 回测分析帮助 agent 做购买决策
- API 响应包含预渲染的 display 格式（markdown / telegram / discord），agent 可直接展示
- OKX OnchainOS wrapped gateway 消除 agent 直接管理 API key 的需要

### 1.4 Success Metrics

| Metric | Target Value | Measurement Method |
|--------|--------------|-------------------|
| 策略上架数 | 50+ (V1) | DB count |
| 月购买交易数 | 100+ | Purchase ledger |
| API 响应时间 | < 500ms (P95) | Cloudflare analytics |
| AI 推荐转化率 | > 15% | recommend → purchase funnel |
| Agent 接入数 | 20+ unique agents | agentId distinct count |
