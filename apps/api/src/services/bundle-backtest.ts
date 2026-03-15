import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import { bundles, strategyPackages } from "@clawmarket/db";
import { eq, inArray } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import type { Env } from "../types/bindings.js";

interface PortfolioBacktestResult {
  portfolioReturn: number;
  portfolioDrawdown: number;
  diversificationRatio: number;
  strategyResults: Array<{
    slug: string;
    title: string;
    totalReturn: number;
    sharpeRatio: number;
  }>;
  analysis: string;
}

export async function runBundleBacktest(
  db: Database,
  env: Env,
  bundleSlug: string,
  period: string,
  initialCapital: number,
): Promise<Result<AgentResponse<PortfolioBacktestResult>, "NOT_FOUND" | "BACKTEST_ERROR">> {
  const bundleRows = await db.select().from(bundles).where(eq(bundles.slug, bundleSlug)).limit(1);
  if (!bundleRows[0]) return err("NOT_FOUND", "Bundle not found");

  const strategyIds = JSON.parse(bundleRows[0].strategyIds) as string[];
  const strategies = await db
    .select()
    .from(strategyPackages)
    .where(inArray(strategyPackages.id, strategyIds))
    .all();

  if (strategies.length === 0) return err("NOT_FOUND", "No strategies in bundle");

  const perStrategyCapital = initialCapital / strategies.length;
  const strategyResults: PortfolioBacktestResult["strategyResults"] = [];
  let totalWeightedReturn = 0;
  let maxDrawdown = 0;

  for (const s of strategies) {
    const ruleSpec = JSON.parse(s.ruleSpec) as {
      rules: Array<{ id: string; description: string; condition: string; action: string }>;
    };

    try {
      const response = await env.BACKTEST.fetch("https://backtest.internal/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy: { family: s.family, executionMode: s.executionMode, rules: ruleSpec.rules },
          config: { period, initialCapital: perStrategyCapital, tokenSymbol: "ETH" },
          title: s.title,
        }),
      });

      if (response.ok) {
        const result = (await response.json()) as {
          data: { metrics: { totalReturn: number; maxDrawdown: number; sharpeRatio: number } };
        };
        const m = result.data.metrics;
        strategyResults.push({ slug: s.slug, title: s.title, totalReturn: m.totalReturn, sharpeRatio: m.sharpeRatio });
        totalWeightedReturn += m.totalReturn / strategies.length;
        if (m.maxDrawdown > maxDrawdown) maxDrawdown = m.maxDrawdown;
      }
    } catch {
      strategyResults.push({ slug: s.slug, title: s.title, totalReturn: 0, sharpeRatio: 0 });
    }
  }

  const diversificationRatio = strategyResults.length > 1
    ? Math.round((1 - maxDrawdown / Math.max(1, Math.abs(totalWeightedReturn))) * 100) / 100
    : 1;

  const portfolioResult: PortfolioBacktestResult = {
    portfolioReturn: Math.round(totalWeightedReturn * 100) / 100,
    portfolioDrawdown: maxDrawdown,
    diversificationRatio,
    strategyResults,
    analysis: `Portfolio of ${strategies.length} strategies. Combined return: ${totalWeightedReturn.toFixed(2)}%, max drawdown: ${maxDrawdown}%.`,
  };

  const table = strategyResults
    .map((s) => `| ${s.title} | ${s.totalReturn}% | ${s.sharpeRatio} |`)
    .join("\n");

  return ok({
    data: portfolioResult,
    display: {
      markdown: `**Portfolio Backtest — ${bundleRows[0].name}**\n\nReturn: ${portfolioResult.portfolioReturn}% · Drawdown: ${portfolioResult.portfolioDrawdown}%\n\n| Strategy | Return | Sharpe |\n|----------|--------|--------|\n${table}`,
    },
  });
}
