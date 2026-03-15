import { Hono } from "hono";
import { type BacktestConfig, type BacktestOutput, type StrategyRules, runBacktest } from "./lib/backtest-engine.js";

interface Env {
  AI: Ai;
  ENVIRONMENT: string;
}

interface AiTextResponse {
  response?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) => {
  return c.json({
    data: {
      status: "operational",
      service: "backtest",
      timestamp: new Date().toISOString(),
    },
    display: {
      markdown: "**Backtest Worker** — Operational",
    },
  });
});

app.post("/run", async (c) => {
  const body = await c.req.json<{
    strategy: StrategyRules;
    config: BacktestConfig;
    title: string;
  }>();

  if (!body.strategy || !body.config) {
    return c.json({ error: "VALIDATION_ERROR", message: "strategy and config are required" }, 400);
  }

  const result = runBacktest(body.config, body.strategy);
  const analysis = await generateAnalysis(c.env.AI, result, body.title, body.strategy.family);

  const m = result.metrics;
  const markdown = [
    `**Backtest Results — ${body.title}**`,
    `Period: ${body.config.period} · Initial: $${body.config.initialCapital.toLocaleString()}`,
    "",
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Total Return | ${m.totalReturn}% |`,
    `| Max Drawdown | ${m.maxDrawdown}% |`,
    `| Sharpe Ratio | ${m.sharpeRatio} |`,
    `| Win Rate | ${m.winRate}% |`,
    `| Total Trades | ${m.totalTrades} |`,
    `| Profit Factor | ${m.profitFactor} |`,
    `| Avg Hold | ${m.averageHoldingPeriod} |`,
    "",
    `**AI Analysis:** ${analysis}`,
  ].join("\n");

  return c.json({
    data: { ...result, analysis },
    display: { markdown },
  });
});

async function generateAnalysis(
  ai: Ai,
  result: BacktestOutput,
  title: string,
  family: string,
): Promise<string> {
  const m = result.metrics;
  const prompt = `Analyze these backtest results for the "${title}" ${family} trading strategy in 2-3 sentences:
Total Return: ${m.totalReturn}%, Max Drawdown: ${m.maxDrawdown}%, Sharpe: ${m.sharpeRatio}, Win Rate: ${m.winRate}%, Trades: ${m.totalTrades}, Profit Factor: ${m.profitFactor}.
Focus on risk-adjusted performance and suitability. Be concise and objective.`;

  try {
    const response = (await ai.run("@cf/meta/llama-3.1-8b-instruct" as keyof AiModels, {
      messages: [
        { role: "system", content: "You are a quantitative trading analyst. Provide brief, objective analysis." },
        { role: "user", content: prompt },
      ],
    })) as AiTextResponse;
    return response.response?.trim() ?? "Analysis unavailable.";
  } catch {
    return "AI analysis unavailable.";
  }
}

export default app;
