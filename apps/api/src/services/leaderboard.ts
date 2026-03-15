import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import {
  leaderboardSnapshots,
  purchases,
  strategyBadges,
  strategyPackages,
} from "@clawmarket/db";
import { desc, eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { generateId } from "../lib/id.js";

interface LeaderboardEntry {
  rank: number;
  strategyId: string;
  slug: string;
  title: string;
  family: string;
  score: number;
  purchaseCount: number;
  badgeCount: number;
  sharpeRatio: number | null;
  winRate: number | null;
}

/**
 * Scoring formula:
 * 0.3 * sharpe + 0.25 * purchases + 0.2 * winRate + 0.15 * recency + 0.1 * badges
 */
function computeScore(
  sharpe: number,
  purchaseCount: number,
  winRate: number,
  daysSinceCreated: number,
  badgeCount: number,
): number {
  const sharpeNorm = Math.min(sharpe / 3, 1) * 100;
  const purchaseNorm = Math.min(purchaseCount / 20, 1) * 100;
  const winRateNorm = winRate;
  const recencyNorm = Math.max(0, 100 - daysSinceCreated);
  const badgeNorm = Math.min(badgeCount / 3, 1) * 100;

  return Math.round(
    0.3 * sharpeNorm +
    0.25 * purchaseNorm +
    0.2 * winRateNorm +
    0.15 * recencyNorm +
    0.1 * badgeNorm,
  );
}

export async function aggregateLeaderboard(db: Database): Promise<void> {
  const now = new Date();
  const snapshotDate = now.toISOString().split("T")[0];
  const strategies = await db.select().from(strategyPackages).all();

  const entries: Array<{ strategyId: string; score: number; purchaseCount: number; badgeCount: number; sharpe: number; winRate: number }> = [];

  for (const s of strategies) {
    const purchaseRows = await db.select().from(purchases).where(eq(purchases.strategyId, s.id)).all();
    const badges = await db.select().from(strategyBadges).where(eq(strategyBadges.strategyId, s.id)).all();

    const sharpeBadge = badges.find((b) => b.metricName === "sharpeRatio");
    const winRateBadge = badges.find((b) => b.metricName === "winRate");

    const sharpe = sharpeBadge?.metricValue ?? 0;
    const winRate = winRateBadge?.metricValue ?? 50;
    const daysSinceCreated = Math.floor((now.getTime() - new Date(s.createdAt).getTime()) / 86400000);

    const score = computeScore(sharpe, purchaseRows.length, winRate, daysSinceCreated, badges.length);
    entries.push({ strategyId: s.id, score, purchaseCount: purchaseRows.length, badgeCount: badges.length, sharpe, winRate });
  }

  entries.sort((a, b) => b.score - a.score);

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    await db.insert(leaderboardSnapshots).values({
      id: generateId("lb"),
      strategyId: e.strategyId,
      rank: i + 1,
      score: e.score,
      category: "overall",
      purchaseCount: e.purchaseCount,
      badgeCount: e.badgeCount,
      sharpeRatio: e.sharpe,
      winRate: e.winRate,
      snapshotDate,
      createdAt: now.toISOString(),
    });
  }
}

export async function getLeaderboard(
  db: Database,
  category = "overall",
  limit = 20,
  offset = 0,
): Promise<AgentResponse<LeaderboardEntry[]>> {
  const rows = await db
    .select()
    .from(leaderboardSnapshots)
    .where(eq(leaderboardSnapshots.category, category))
    .orderBy(desc(leaderboardSnapshots.score))
    .limit(limit)
    .offset(offset)
    .all();

  const strategies = await db.select().from(strategyPackages).all();
  const stratMap = new Map(strategies.map((s) => [s.id, s]));

  const entries: LeaderboardEntry[] = rows.map((r, i) => {
    const s = stratMap.get(r.strategyId);
    return {
      rank: offset + i + 1,
      strategyId: r.strategyId,
      slug: s?.slug ?? "",
      title: s?.title ?? "Unknown",
      family: s?.family ?? "",
      score: r.score,
      purchaseCount: r.purchaseCount,
      badgeCount: r.badgeCount,
      sharpeRatio: r.sharpeRatio,
      winRate: r.winRate,
    };
  });

  const table = entries
    .map((e) => `| ${e.rank} | ${e.title} | ${e.family} | ${e.score} | ${e.purchaseCount} |`)
    .join("\n");

  return {
    data: entries,
    display: {
      markdown: entries.length
        ? `**Leaderboard (${category})**\n\n| Rank | Strategy | Family | Score | Sales |\n|------|----------|--------|-------|-------|\n${table}`
        : "No leaderboard data available yet.",
    },
  };
}

export async function getStrategyRank(
  db: Database,
  slug: string,
): Promise<Result<AgentResponse<LeaderboardEntry>, "NOT_FOUND">> {
  const strategy = await db.select().from(strategyPackages).where(eq(strategyPackages.slug, slug)).limit(1);
  if (!strategy[0]) return err("NOT_FOUND", `Strategy '${slug}' not found`);

  const snapshot = await db
    .select()
    .from(leaderboardSnapshots)
    .where(eq(leaderboardSnapshots.strategyId, strategy[0].id))
    .orderBy(desc(leaderboardSnapshots.createdAt))
    .limit(1);

  if (!snapshot[0]) return err("NOT_FOUND", "No ranking data for this strategy");

  const entry: LeaderboardEntry = {
    rank: snapshot[0].rank,
    strategyId: strategy[0].id,
    slug: strategy[0].slug,
    title: strategy[0].title,
    family: strategy[0].family,
    score: snapshot[0].score,
    purchaseCount: snapshot[0].purchaseCount,
    badgeCount: snapshot[0].badgeCount,
    sharpeRatio: snapshot[0].sharpeRatio,
    winRate: snapshot[0].winRate,
  };

  return ok({
    data: entry,
    display: { markdown: `**${entry.title}** — Rank #${entry.rank} (score: ${entry.score})` },
  });
}
