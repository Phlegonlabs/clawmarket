## 8. Open Questions

| Question | Owner | Deadline | Status |
|----------|-------|----------|--------|
| 前端设计语言细节（动画/交互规范） | Dev | M4 前 | 基本方向已定，细节待定 |
| 多链扩展具体时间线 | User | 待定 | V1 先 X Layer，架构预留 |
| AI 回测的 OKX OnchainOS 具体数据端点 | Dev | M3 前 | 待调研 |
| Telegram/Discord display 格式细节 | Dev | M2 前 | 待设计 |
| V2 信号引擎的 cron 频率和触发机制 | User | V2 前 | 待定 |
| Workers AI 模型输出质量评估 | Dev | M3 中 | 待测试 |
| ERC-8004 X Layer 合约部署与跨链验证方案 | Dev | M9 前 | 待调研 — 需评估 X Layer 上 ERC-8004 bridge 合约的 gas 成本与延迟 |
| x402 V2 SDK 可用性与 Bun 兼容性 | Dev | M8 前 | 待测试 — x402 V2 SDK 是否有 Bun-compatible 版本 |
| Stripe x402 Credit 充值集成时间线 | User | M8 中 | 待确认 — x402 Foundation 与 Stripe 合作进度，预计 2026 Q2-Q3 |
| Workers AI 新模型评估（GLM-4.7-Flash / Nemotron-3） | Dev | M6 前 | 待基准测试 — 推理质量、延迟、token 成本对比 |
| Bundle 折扣策略与 publisher 激励机制 | User | M10 前 | 待定 — 最大折扣比例、publisher 是否可自定义 Bundle |
| Leaderboard 评分算法权重调优 | Dev | M7 中 | 待 A/B 测试 — 初始权重: Sharpe 0.3, purchases 0.25, win_rate 0.2, recency 0.15, badges 0.1 |
| V2 多链优先级排序（Base vs Arbitrum vs Optimism） | User | V2 前 | 待评估 — 需考虑：x402 facilitator 部署状态、链上稳定币流动性、OKX OnchainOS 支持、gas 成本、用户分布。Chain Registry 架构已就绪（ADR-007） |
