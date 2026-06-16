-- Compatibility layer: exposes net holdings for the legacy purchases query shape.
-- Source of truth remains the transactions table.

DROP TABLE IF EXISTS purchases;

CREATE TABLE purchases (
  purchase_id  INTEGER PRIMARY KEY,
  ticker       TEXT NOT NULL,
  shares       REAL NOT NULL,
  buy_price    REAL NOT NULL,
  buy_date     TEXT NOT NULL,
  total_cost   REAL NOT NULL
);

INSERT INTO purchases (purchase_id, ticker, shares, buy_price, buy_date, total_cost) VALUES
(1, 'VOO',  0.126785, 678.36, '2026-06-15', 86.01),
(2, 'ILF',  4.116017, 37.33,  '2026-06-06', 153.64),
(3, 'NET',  0.330267, 223.57, '2026-06-09', 73.84),
(4, 'TSLA', 0.207594, 395.20, '2026-06-15', 82.04),
(5, 'ASML', 0.041842, 1752.98,'2026-06-15', 73.35),
(6, 'BND',  0.754582, 72.89,  '2026-06-05', 55.00),
(7, 'SOXX', 0.085691, 547.53, '2026-06-05', 46.92),
(8, 'SHOP', 0.365571, 109.42, '2026-06-05', 40.00);
