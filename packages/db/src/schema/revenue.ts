import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { purchases } from "./purchases.js";

export const revenueLedger = sqliteTable("revenue_ledger", {
  id: text("id").primaryKey(),
  purchaseId: text("purchase_id")
    .notNull()
    .references(() => purchases.id),
  recipientType: text("recipient_type").notNull(),
  recipientId: text("recipient_id").notNull(),
  chainId: text("chain_id").notNull().default("196"),
  paymentToken: text("payment_token").notNull(),
  amountRaw: text("amount_raw").notNull(),
  amountUsd: real("amount_usd").notNull(),
  shareBps: real("share_bps").notNull(),
  createdAt: text("created_at").notNull(),
});
