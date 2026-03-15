import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { agentIdentities } from "./agent-identities.js";
import { strategyPackages } from "./strategies.js";

export const purchaseIntents = sqliteTable("purchase_intents", {
  id: text("id").primaryKey(),
  strategyId: text("strategy_id")
    .notNull()
    .references(() => strategyPackages.id),
  agentId: text("agent_id")
    .notNull()
    .references(() => agentIdentities.id),
  chainId: text("chain_id").notNull().default("196"),
  paymentToken: text("payment_token").notNull(),
  tokenAddress: text("token_address").notNull(),
  amountRaw: text("amount_raw").notNull(),
  amountUsd: real("amount_usd").notNull(),
  status: text("status").notNull().default("pending"),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const purchases = sqliteTable("purchases", {
  id: text("id").primaryKey(),
  intentId: text("intent_id")
    .notNull()
    .references(() => purchaseIntents.id),
  strategyId: text("strategy_id")
    .notNull()
    .references(() => strategyPackages.id),
  agentId: text("agent_id")
    .notNull()
    .references(() => agentIdentities.id),
  publisherId: text("publisher_id").notNull(),
  chainId: text("chain_id").notNull().default("196"),
  paymentToken: text("payment_token").notNull(),
  tokenAddress: text("token_address").notNull(),
  amountRaw: text("amount_raw").notNull(),
  amountUsd: real("amount_usd").notNull(),
  txHash: text("tx_hash"),
  completedAt: text("completed_at").notNull(),
});
