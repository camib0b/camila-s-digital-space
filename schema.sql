-- schema.sql
DROP TABLE IF EXISTS purchases;

CREATE TABLE purchases (
  purchase_id  INTEGER PRIMARY KEY,
  ticker       TEXT NOT NULL,
  shares       REAL NOT NULL,
  buy_price    REAL NOT NULL,
  buy_date     TEXT NOT NULL,   -- formato YYYY-MM-DD
  total_cost   REAL NOT NULL
);

-- === TUS 17 COMPRAS (ya limpiadas y estandarizadas) ===
INSERT INTO purchases (purchase_id, ticker, shares, buy_price, buy_date, total_cost) VALUES
(1, 'VOO', 0.070264017, 639.73, '2026-01-13', 44.95),
(2, 'VOO', 0.008727342, 625.62, '2026-02-17', 5.46),
(3, 'TSM', 0.083314818, 360.08, '2026-02-17', 30.00),
(4, 'MELI', 0.012655728, 1975.39, '2026-02-17', 25.00),
(5, 'AAPL', 0.077507363, 258.04, '2026-02-17', 20.00),
(6, 'NET', 0.169891166, 194.24, '2026-03-06', 33.00),
(7, 'COIN', 0.105592135, 197.74, '2026-03-06', 20.88),
(8, 'AAPL', 0.058045042, 258.42, '2026-03-12', 15.00),
(9, 'NET', 0.073101758, 212.17, '2026-03-12', 15.51),
(10, 'VOO', 0.072902828, 617.26, '2026-03-12', 45.00),
(11, 'QQQ', 0.149285915, 602.87, '2026-03-12', 90.00),
(12, 'COKE', 0.099954021, 200.09, '2026-04-01', 20.00),
(13, 'SNDK', 0.018341449, 695.69, '2026-04-01', 12.76),
(14, 'OCC', 2.464294517, 8.93, '2026-04-01', 22.01),
(15, 'NET', 0.025063745, 207.07, '2026-04-01', 5.19),
(16, 'VOO', 0.165097688, 605.70, '2026-04-06', 100.00),
(17, 'AAPL', 0.118126538, 260.82, '2026-04-06', 30.81);
