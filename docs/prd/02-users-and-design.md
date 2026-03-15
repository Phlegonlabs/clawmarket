## 2. Target Users

### 2.1 Primary: Strategy Buyers (AI Agents)

**Role**: 通过 OpenClaw 运行的 AI trading agent
**Description**: 需要链上交易策略来指导决策的自动化代理，运行在 Telegram/Discord bot 或独立 agent 环境中
**Pain points**: 缺乏统一的策略发现和购买入口；需要结构化且可直接展示的数据格式
**Expectations**: 发现策略 → AI 回测验证 → 一次购买 → 永久使用 → 结果在 Telegram/Discord 展示

### 2.2 Secondary: Strategy Publishers

**Role**: 链上研究员、量化分析师
**Description**: 有自己的链上研究方法，想发布并出售策略包
**Pain points**: 缺少面向 agent 市场的策略分发渠道
**Expectations**: 通过 OpenClaw 提交策略 → 自动上架 → 获得 90% 收益分成

### 2.3 Tertiary: Human Browsers

**Role**: 对链上策略感兴趣的普通用户
**Description**: 通过浏览器浏览策略目录、了解平台能力
**Pain points**: 需要高品质的展示界面来了解策略内容
**Expectations**: 优质的视觉体验 + 清晰的策略信息

---

## 3. Visual Design Language

### 3.1 Design Style

**Choice**: Terminal / Data-first + Minimal Fintech 混合

**Reference**: Linear, Raycast, Stripe Dashboard, Mercury

**Keyword Description**: 深色极简、数据驱动、专业可信赖、克制的科技感

### 3.2 Design Principles

- **Color tone**: Dark-first (zinc-950 base) + Emerald accent
- **Personality**: Professional, data-dense, terminal-inspired, trustworthy
- **Reference UI Library**: shadcn/ui + Radix UI
- **Typography**: Inter (UI text) + JetBrains Mono (data/metrics)
- **Layout**: Fintech 卡片式，信息层级分明
- **Data display**: Terminal 风格 mono font 表格、sparkline
- **Animation**: 克制 — 仅 hover transition 和微交互，无花哨动画
- **Accent strategy**: 单色 emerald；正收益 green、负收益 red

### 3.3 Color Palette

```
Background:     #09090b  (zinc-950)
Surface:        #18181b  (zinc-900)
Surface Raised: #27272a  (zinc-800)
Border:         #3f3f46  (zinc-700)
Text Primary:   #fafafa  (zinc-50)
Text Secondary: #a1a1aa  (zinc-400)
Text Muted:     #71717a  (zinc-500)
Accent:         #10b981  (emerald-500)
Accent Hover:   #34d399  (emerald-400)
Accent Muted:   #065f46  (emerald-900)
Positive:       #22c55e  (green-500)
Negative:       #ef4444  (red-500)
Warning:        #f59e0b  (amber-500)
```
