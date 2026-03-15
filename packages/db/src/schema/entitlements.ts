import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { agentIdentities } from "./agent-identities.js";
import { purchases } from "./purchases.js";
import { strategyPackages } from "./strategies.js";

/** Entitlements are chain-agnostic — no chain_id column (ADR-007) */
export const entitlements = sqliteTable("entitlements", {
  id: text("id").primaryKey(),
  strategyId: text("strategy_id")
    .notNull()
    .references(() => strategyPackages.id),
  agentId: text("agent_id")
    .notNull()
    .references(() => agentIdentities.id),
  purchaseId: text("purchase_id")
    .notNull()
    .references(() => purchases.id),
  grantedAt: text("granted_at").notNull(),
});
