import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import { strategyPackages } from "@clawmarket/db";
import { eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import type { Env } from "../types/bindings.js";

interface BacktestInput {
  period?: string;
  initialCapital?: number;
  tokenSymbol?: string;
  chainId?: number;
}

interface BacktestMetrics {
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  averageHoldingPeriod: string;
}

interface BacktestResult {
  metrics: BacktestMetrics;
  equity: Array<{ date: string; value: number }>;
  trades: Array<{ date: string; type: string; price: number; quantity: number; pnl: number | null }>;
  analysis: string;
}

export async function runStrategyBacktest(
  db: Database,
  env: Env,
  slug: string,
  input: BacktestInput,
): Promise<Result<AgentResponse<BacktestResult>, "NOT_FOUND" | "BACKTEST_ERROR">> {
  const rows = await db
    .select()
    .from(strategyPackages)
    .where(eq(strategyPackages.slug, slug))
    .limit(1);
  const row = rows[0];
  if (!row) return err("NOT_FOUND", `Strategy '${slug}' not found`);

  const ruleSpec = JSON.parse(row.ruleSpec) as {
    rules: Array<{ id: string; description: string; condition: string; action: string }>;
  };

  const requestBody = {
    strategy: {
      family: row.family,
      executionMode: row.executionMode,
      rules: ruleSpec.rules,
    },
    config: {
      period: input.period ?? "30d",
      initialCapital: input.initialCapital ?? 10000,
      tokenSymbol: input.tokenSymbol ?? "ETH",
    },
    title: row.title,
  };

  try {
    const response = await env.BACKTEST.fetch("https://backtest.internal/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return err("BACKTEST_ERROR", `Backtest worker returned ${response.status}`);
    }

    const result = (await response.json()) as { data: BacktestResult; display: { markdown: string } };
    return ok(result);
  } catch (e) {
    return err("BACKTEST_ERROR", `Backtest request failed: ${e instanceof Error ? e.message : String(e)}`);
  }
}
