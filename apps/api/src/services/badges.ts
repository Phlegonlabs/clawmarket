import {
  type AgentResponse,
  ok,
  type Result,
} from "@clawmarket/contracts";
import { strategyBadges, strategyPackages } from "@clawmarket/db";
import { eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { generateId } from "../lib/id.js";
import type { Env } from "../types/bindings.js";

interface BadgeThreshold {
  badge: string;
  metric: string;
  check: (value: number) => boolean;
  threshold: number;
}

const BADGE_RULES: BadgeThreshold[] = [
  { badge: "verified-sharpe", metric: "sharpeRatio", check: (v) => v >= 1.0, threshold: 1.0 },
  { badge: "low-drawdown", metric: "maxDrawdown", check: (v) => v <= 15, threshold: 15 },
  { badge: "high-win-rate", metric: "winRate", check: (v) => v >= 60, threshold: 60 },
];

interface BacktestMetrics {
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
}

export async function evaluateAndGrantBadges(
  db: Database,
  env: Env,
  strategyId: string,
  metrics: BacktestMetrics,
  period: string,
): Promise<Result<AgentResponse<typeof strategyBadges.$inferSelect[]>, never>> {
  const now = new Date().toISOString();
  const granted: typeof strategyBadges.$inferSelect[] = [];

  for (const rule of BADGE_RULES) {
    const value = metrics[rule.metric as keyof BacktestMetrics] as number;
    if (rule.check(value)) {
      // Check if badge already exists for this strategy+badge combo
      const existing = await db
        .select()
        .from(strategyBadges)
        .where(eq(strategyBadges.strategyId, strategyId))
        .all();
      const alreadyHas = existing.find((b) => b.badge === rule.badge);
      if (!alreadyHas) {
        const badge = {
          id: generateId("badge"),
          strategyId,
          badge: rule.badge,
          metricName: rule.metric,
          metricValue: value,
          threshold: rule.threshold,
          backtestPeriod: period,
          grantedAt: now,
        };
        await db.insert(strategyBadges).values(badge);
        granted.push(badge);
      }
    }
  }

  return ok({
    data: granted,
    display: {
      markdown: granted.length
        ? `Badges granted: ${granted.map((b) => b.badge).join(", ")}`
        : "No new badges earned.",
    },
  });
}

export async function getStrategyBadges(
  db: Database,
  strategyId: string,
): Promise<typeof strategyBadges.$inferSelect[]> {
  return db
    .select()
    .from(strategyBadges)
    .where(eq(strategyBadges.strategyId, strategyId))
    .all();
}
