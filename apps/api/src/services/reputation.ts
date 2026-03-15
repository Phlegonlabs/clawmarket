import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import {
  publishers,
  purchases,
  strategyBadges,
  strategyPackages,
} from "@clawmarket/db";
import { eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";

interface ReputationScore {
  publisherId: string;
  publisherName: string;
  overallScore: number;
  breakdown: {
    salesScore: number;
    badgeScore: number;
    strategyQuality: number;
  };
  totalSales: number;
  totalBadges: number;
  strategyCount: number;
}

export async function getPublisherReputation(
  db: Database,
  publisherId: string,
): Promise<Result<AgentResponse<ReputationScore>, "NOT_FOUND">> {
  const pub = await db
    .select()
    .from(publishers)
    .where(eq(publishers.id, publisherId))
    .limit(1);
  if (!pub[0]) return err("NOT_FOUND", `Publisher '${publisherId}' not found`);

  const strategies = await db
    .select()
    .from(strategyPackages)
    .where(eq(strategyPackages.publisherId, publisherId))
    .all();

  let totalSales = 0;
  let totalBadges = 0;

  for (const s of strategies) {
    const sales = await db.select().from(purchases).where(eq(purchases.strategyId, s.id)).all();
    const badges = await db.select().from(strategyBadges).where(eq(strategyBadges.strategyId, s.id)).all();
    totalSales += sales.length;
    totalBadges += badges.length;
  }

  const salesScore = Math.min(totalSales * 5, 100);
  const badgeScore = Math.min(totalBadges * 15, 100);
  const strategyQuality = strategies.length > 0 ? Math.min(strategies.length * 20, 100) : 0;
  const overallScore = Math.round(0.4 * salesScore + 0.35 * badgeScore + 0.25 * strategyQuality);

  const result: ReputationScore = {
    publisherId,
    publisherName: pub[0].name,
    overallScore,
    breakdown: { salesScore, badgeScore, strategyQuality },
    totalSales,
    totalBadges,
    strategyCount: strategies.length,
  };

  return ok({
    data: result,
    display: {
      markdown: `**${pub[0].name}** — Reputation Score: ${overallScore}/100\nSales: ${totalSales} · Badges: ${totalBadges} · Strategies: ${strategies.length}`,
    },
  });
}
