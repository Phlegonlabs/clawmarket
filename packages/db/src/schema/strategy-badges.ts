import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const strategyBadges = sqliteTable("strategy_badges", {
  id: text("id").primaryKey(),
  strategyId: text("strategy_id").notNull(),
  badge: text("badge").notNull(), // verified-sharpe, low-drawdown, high-win-rate
  metricName: text("metric_name").notNull(),
  metricValue: real("metric_value").notNull(),
  threshold: real("threshold").notNull(),
  backtestPeriod: text("backtest_period").notNull(),
  grantedAt: text("granted_at").notNull(),
});
