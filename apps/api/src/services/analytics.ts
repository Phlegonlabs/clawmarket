import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import {
  publishers,
  purchases,
  revenueLedger,
  strategyPackages,
} from "@clawmarket/db";
import { eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";

interface StrategyAnalytics {
  strategyId: string;
  slug: string;
  title: string;
  totalSales: number;
  totalRevenue: number;
}

interface PublisherAnalyticsResult {
  publisherId: string;
  publisherName: string;
  totalRevenue: number;
  totalSales: number;
  strategyCount: number;
  strategies: StrategyAnalytics[];
}

export async function getPublisherAnalytics(
  db: Database,
  publisherId: string,
): Promise<Result<AgentResponse<PublisherAnalyticsResult>, "NOT_FOUND">> {
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

  const revenueRows = await db
    .select()
    .from(revenueLedger)
    .where(eq(revenueLedger.recipientId, publisherId))
    .all();

  const purchaseRows = await db
    .select()
    .from(purchases)
    .where(eq(purchases.publisherId, publisherId))
    .all();

  const strategyAnalytics: StrategyAnalytics[] = strategies.map((s) => {
    const sales = purchaseRows.filter((p) => p.strategyId === s.id);
    const revenue = revenueRows
      .filter((r) => r.purchaseId && sales.some((sale) => sale.id === r.purchaseId))
      .reduce((sum, r) => sum + (r.amountUsd ?? 0), 0);

    return {
      strategyId: s.id,
      slug: s.slug,
      title: s.title,
      totalSales: sales.length,
      totalRevenue: Math.round(revenue * 100) / 100,
    };
  });

  const totalRevenue = revenueRows.reduce((sum, r) => sum + (r.amountUsd ?? 0), 0);
  const totalSales = purchaseRows.length;

  const result: PublisherAnalyticsResult = {
    publisherId,
    publisherName: pub[0].name,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalSales,
    strategyCount: strategies.length,
    strategies: strategyAnalytics,
  };

  const md = [
    `**Publisher Analytics — ${pub[0].name}**`,
    `Total Revenue: $${result.totalRevenue} · Sales: ${result.totalSales} · Strategies: ${result.strategyCount}`,
    "",
    ...strategyAnalytics.map(
      (s) => `- **${s.title}**: ${s.totalSales} sales, $${s.totalRevenue} revenue`,
    ),
  ].join("\n");

  return ok({ data: result, display: { markdown: md } });
}
