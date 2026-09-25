-- Daily closes, FX, Treasury yields, and splits for /api/analytics.
-- Prices are written by the scheduled sync, not by request handlers.

CREATE TABLE IF NOT EXISTS daily_closes (
  ticker TEXT NOT NULL,
  price_date TEXT NOT NULL,
  raw_close REAL,
  adjusted_close REAL,
  currency TEXT NOT NULL,
  source TEXT NOT NULL,
  PRIMARY KEY (ticker, price_date)
);

CREATE TABLE IF NOT EXISTS fx_rates (
  currency TEXT NOT NULL,
  rate_date TEXT NOT NULL,
  usd_per_unit REAL NOT NULL,
  source TEXT NOT NULL,
  PRIMARY KEY (currency, rate_date)
);

CREATE TABLE IF NOT EXISTS risk_free_rates (
  rate_date TEXT NOT NULL PRIMARY KEY,
  annual_yield REAL NOT NULL,
  series_id TEXT NOT NULL,
  source TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS share_splits (
  ticker TEXT NOT NULL,
  ex_date TEXT NOT NULL,
  share_multiplier REAL NOT NULL,
  source TEXT NOT NULL,
  PRIMARY KEY (ticker, ex_date)
);

CREATE TABLE IF NOT EXISTS market_data_sync (
  dataset TEXT PRIMARY KEY,
  synced_at TEXT NOT NULL,
  detail TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_daily_closes_date ON daily_closes(price_date);
