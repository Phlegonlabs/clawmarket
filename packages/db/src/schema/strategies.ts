import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { publishers } from "./publishers.js";

export const strategyPackages = sqliteTable("strategy_packages", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  family: text("family").notNull(),
  executionMode: text("execution_mode").notNull(),
  tags: text("tags").notNull().default("[]"),
  priceUsd: real("price_usd").notNull(),
  publisherId: text("publisher_id")
    .notNull()
    .references(() => publishers.id),
  supportedChainIds: text("supported_chain_ids").notNull().default('["196"]'),
  naturalLanguageSpec: text("natural_language_spec").notNull(),
  ruleSpec: text("rule_spec").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
