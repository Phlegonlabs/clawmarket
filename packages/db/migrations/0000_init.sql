-- ClawMarket D1 Schema Migration
-- Generated from Drizzle ORM schema definitions

CREATE TABLE IF NOT EXISTS publishers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_identities (
  id TEXT PRIMARY KEY,
  name TEXT,
  wallet_address TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS strategy_packages (
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

CREATE TABLE IF NOT EXISTS purchase_intents (
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

CREATE TABLE IF NOT EXISTS purchases (
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

CREATE TABLE IF NOT EXISTS entitlements (
  id TEXT PRIMARY KEY,
  strategy_id TEXT NOT NULL REFERENCES strategy_packages(id),
  agent_id TEXT NOT NULL REFERENCES agent_identities(id),
  purchase_id TEXT NOT NULL REFERENCES purchases(id),
  granted_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS revenue_ledger (
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

CREATE TABLE IF NOT EXISTS strategy_badges (
  id TEXT PRIMARY KEY,
  strategy_id TEXT NOT NULL,
  badge TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  threshold REAL NOT NULL,
  backtest_period TEXT NOT NULL,
  granted_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id TEXT PRIMARY KEY,
  strategy_id TEXT NOT NULL,
  rank INTEGER NOT NULL,
  score REAL NOT NULL,
  category TEXT NOT NULL,
  purchase_count INTEGER NOT NULL DEFAULT 0,
  badge_count INTEGER NOT NULL DEFAULT 0,
  sharpe_ratio REAL,
  win_rate REAL,
  snapshot_date TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS credit_balances (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  balance REAL NOT NULL DEFAULT 0,
  chain_id TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  reference TEXT,
  chain_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bundles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  strategy_ids TEXT NOT NULL,
  price_usd REAL NOT NULL,
  publisher_id TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
