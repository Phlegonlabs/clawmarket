import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const creditBalances = sqliteTable("credit_balances", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  balance: real("balance").notNull().default(0),
  chainId: text("chain_id").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const creditTransactions = sqliteTable("credit_transactions", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  type: text("type").notNull(), // topup, purchase, refund
  amount: real("amount").notNull(),
  reference: text("reference"), // intentId, txHash, etc.
  chainId: text("chain_id").notNull(),
  createdAt: text("created_at").notNull(),
});
