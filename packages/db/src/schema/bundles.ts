import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const bundles = sqliteTable("bundles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  strategyIds: text("strategy_ids").notNull(), // JSON array of strategy IDs
  priceUsd: real("price_usd").notNull(),
  publisherId: text("publisher_id").notNull(),
  tags: text("tags").notNull().default("[]"), // JSON array
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
