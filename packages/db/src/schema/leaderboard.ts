import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const leaderboardSnapshots = sqliteTable("leaderboard_snapshots", {
  id: text("id").primaryKey(),
  strategyId: text("strategy_id").notNull(),
  rank: integer("rank").notNull(),
  score: real("score").notNull(),
  category: text("category").notNull(), // overall, by_family, trending
  purchaseCount: integer("purchase_count").notNull().default(0),
  badgeCount: integer("badge_count").notNull().default(0),
  sharpeRatio: real("sharpe_ratio"),
  winRate: real("win_rate"),
  snapshotDate: text("snapshot_date").notNull(),
  createdAt: text("created_at").notNull(),
});
