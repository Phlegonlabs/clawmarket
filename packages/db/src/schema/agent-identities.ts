import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const agentIdentities = sqliteTable("agent_identities", {
  id: text("id").primaryKey(),
  name: text("name"),
  walletAddress: text("wallet_address"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
