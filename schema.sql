-- Synced from portfolio-api/data/camila-stock-portfolio.csv (single source of truth)

DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
  transaction_id   INTEGER PRIMARY KEY,
  ticker           TEXT NOT NULL,
  trade_date       TEXT NOT NULL,
  price            REAL NOT NULL,
  quantity         REAL NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
  total_amount     REAL NOT NULL
);

INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES
(1,  'VOO',  '2026-03-12', 617.26,  0.072903,  'BUY',  45.00000078),
(2,  'VOO',  '2026-04-06', 605.70,  0.165098,  'BUY',  99.9998586),
(3,  'VOO',  '2026-04-10', 624.32,  0.088096,  'BUY',  54.99999872),
(4,  'ILF',  '2026-04-10', 37.80,   4.116016,  'BUY',  155.5854048),
(5,  'ILF',  '2026-04-13', 37.62,   1.329151,  'BUY',  50.00266162),
(6,  'ILF',  '2026-04-13', 38.08,   0.889408,  'BUY',  33.86865664),
(7,  'VOO',  '2026-04-20', 651.37,  0.300000,  'SELL', 195.411),
(8,  'NET',  '2026-04-20', 201.41,  0.055360,  'BUY',  11.1500576),
(9,  'NET',  '2026-04-22', 207.59,  0.167924,  'BUY',  34.85933716),
(10, 'TSLA', '2026-04-22', 388.99,  0.077124,  'BUY',  30.00035676),
(11, 'ILF',  '2026-05-05', 36.46,   0.960009,  'BUY',  35.00192814),
(12, 'ILF',  '2026-05-06', 36.76,   0.647222,  'BUY',  23.79188072),
(13, 'NET',  '2026-05-05', 242.84,  0.123540,  'BUY',  30.0004536),
(14, 'TSLA', '2026-05-05', 391.42,  0.081856,  'BUY',  32.04007552),
(15, 'ASML', '2026-06-05', 1644.37, 0.021029,  'BUY',  34.57999673),
(16, 'BND',  '2026-06-05', 72.89,   0.754582,  'BUY',  55.00149398),
(17, 'SOXX', '2026-06-05', 539.77,  0.049623,  'BUY',  26.78500671),
(18, 'SOXX', '2026-06-05', 558.21,  0.036068,  'BUY',  20.13353028),
(19, 'SHOP', '2026-06-05', 109.42,  0.365571,  'BUY',  40.00077882),
(20, 'NET',  '2026-06-05', 251.72,  0.054387,  'BUY',  13.69029564),
(21, 'ASML', '2026-06-09', 1806.70, 0.009409,  'BUY',  16.9992103),
(22, 'NET',  '2026-06-09', 239.63,  0.070944,  'SELL', 17.00031072),
(23, 'VOO',  '2026-06-15', 695.22,  0.100688,  'BUY',  70.00019136),
(24, 'TSLA', '2026-06-15', 411.40,  0.048614,  'BUY',  20.0006996),
(25, 'ASML', '2026-06-15', 1908.95, 0.011404,  'BUY',  21.7696658);

CREATE TABLE IF NOT EXISTS ai_usage (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp           TEXT DEFAULT CURRENT_TIMESTAMP,
  provider            TEXT NOT NULL,
  model               TEXT NOT NULL,
  prompt_tokens       INTEGER NOT NULL,
  completion_tokens   INTEGER NOT NULL,
  total_tokens        INTEGER NOT NULL,
  estimated_cost_usd  REAL
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_trade_date ON transactions(trade_date);
