import BetterSqlite3 from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@clawmarket/db";
import type { Database } from "../../lib/db.js";

const CREATE_TABLES_SQL = `
CREATE TABLE publishers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE agent_identities (
  id TEXT PRIMARY KEY,
  name TEXT,
  wallet_address TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE strategy_packages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  family TEXT NOT NULL,
  execution_mode TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  price_usd REAL NOT NULL,
  publisher_id TEXT NOT NULL REFERENCES publishers(id),
  supported_chain_ids TEXT NOT NULL DEFAULT '["196"]',
  natural_language_spec TEXT NOT NULL,
  rule_spec TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE purchase_intents (
  id TEXT PRIMARY KEY,
  strategy_id TEXT NOT NULL REFERENCES strategy_packages(id),
  agent_id TEXT NOT NULL REFERENCES agent_identities(id),
  chain_id TEXT NOT NULL DEFAULT '196',
  payment_token TEXT NOT NULL,
  token_address TEXT NOT NULL,
  amount_raw TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE purchases (
  id TEXT PRIMARY KEY,
  intent_id TEXT NOT NULL REFERENCES purchase_intents(id),
  strategy_id TEXT NOT NULL REFERENCES strategy_packages(id),
  agent_id TEXT NOT NULL REFERENCES agent_identities(id),
  publisher_id TEXT NOT NULL,
  chain_id TEXT NOT NULL DEFAULT '196',
  payment_token TEXT NOT NULL,
  token_address TEXT NOT NULL,
  amount_raw TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  tx_hash TEXT,
  completed_at TEXT NOT NULL
);

CREATE TABLE entitlements (
  id TEXT PRIMARY KEY,
  strategy_id TEXT NOT NULL REFERENCES strategy_packages(id),
  agent_id TEXT NOT NULL REFERENCES agent_identities(id),
  purchase_id TEXT NOT NULL REFERENCES purchases(id),
  granted_at TEXT NOT NULL
);

CREATE TABLE revenue_ledger (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES purchases(id),
  recipient_type TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  chain_id TEXT NOT NULL DEFAULT '196',
  payment_token TEXT NOT NULL,
  amount_raw TEXT NOT NULL,
  amount_usd REAL NOT NULL,
  share_bps REAL NOT NULL,
  created_at TEXT NOT NULL
);
`;

export function createTestDb(): Database {
  const sqlite = new BetterSqlite3(":memory:");
  sqlite.exec(CREATE_TABLES_SQL);
  return drizzle(sqlite, { schema }) as unknown as Database;
}
