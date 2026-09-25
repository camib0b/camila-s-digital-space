CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INTEGER PRIMARY KEY,
  ticker TEXT NOT NULL,
  trade_date TEXT NOT NULL,
  price REAL NOT NULL,
  quantity REAL NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL', 'FEE')),
  total_amount REAL NOT NULL
);
DELETE FROM transactions;

INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (43, 'VOO', '2026-01-13', 639.73, 0.070264, 'BUY', 44.94998872);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (44, 'VOO', '2026-02-17', 625.62, 0.008727, 'BUY', 5.45978574);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (45, 'NET', '2026-03-06', 194.24, 0.169891, 'BUY', 32.99962784);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (1, 'VOO', '2026-03-12', 617.26, 0.072903, 'BUY', 45.00000078);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (46, 'NET', '2026-03-12', 212.17, 0.073102, 'BUY', 15.510051339999999);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (47, 'NET', '2026-04-01', 207.07, 0.025064, 'BUY', 5.1900024799999995);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (2, 'VOO', '2026-04-06', 605.7, 0.165098, 'BUY', 99.9998586);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (3, 'VOO', '2026-04-10', 624.32, 0.088096, 'BUY', 54.99999872);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (4, 'ILF', '2026-04-10', 37.8, 0.290227, 'BUY', 10.9705806);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (5, 'ILF', '2026-04-13', 37.62, 1.329151, 'BUY', 50.00266162);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (6, 'ILF', '2026-04-13', 38.08, 0.889408, 'BUY', 33.86865664);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (7, 'VOO', '2026-04-20', 651.37, 0.3, 'SELL', 195.411);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (8, 'NET', '2026-04-20', 201.41, 0.05536, 'BUY', 11.1500576);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (9, 'NET', '2026-04-22', 207.59, 0.167924, 'BUY', 34.85933716);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (10, 'TSLA', '2026-04-22', 388.99, 0.077124, 'BUY', 30.00035676);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (11, 'ILF', '2026-05-05', 36.46, 0.960009, 'BUY', 35.00192814);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (13, 'NET', '2026-05-05', 242.84, 0.12354, 'BUY', 30.0004536);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (14, 'TSLA', '2026-05-05', 391.42, 0.081856, 'BUY', 32.04007552);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (12, 'ILF', '2026-05-06', 36.76, 0.647222, 'BUY', 23.79188072);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (15, 'ASML', '2026-06-05', 1664.37, 0.021029, 'BUY', 35.00003673);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (16, 'BND', '2026-06-05', 72.89, 0.754582, 'BUY', 55.00149398);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (17, 'SOXX', '2026-06-05', 558.21, 0.049623, 'BUY', 27.700054830000003);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (18, 'SOXX', '2026-06-05', 554.5, 0.036068, 'BUY', 19.999706000000003);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (19, 'SHOP', '2026-06-05', 109.42, 0.365571, 'BUY', 40.00077882);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (20, 'NET', '2026-06-05', 251.72, 0.054387, 'BUY', 13.69029564);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (21, 'ASML', '2026-06-09', 1806.7, 0.009409, 'BUY', 16.9992103);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (22, 'NET', '2026-06-09', 239.63, 0.070944, 'SELL', 17.00031072);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (23, 'VOO', '2026-06-15', 695.22, 0.100688, 'BUY', 70.00019136);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (24, 'TSLA', '2026-06-15', 411.4, 0.048614, 'BUY', 20.0006996);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (25, 'ASML', '2026-06-15', 1908.95, 0.011404, 'BUY', 21.7696658);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (26, 'VOO', '2026-07-06', 688.15, 0.000494, 'BUY', 0.3399461);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (27, 'VOO', '2026-09-09', 701.46, 0.121177, 'BUY', 85.00081842000002);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (28, 'BND', '2026-09-09', 71.75, 0.696884, 'BUY', 50.001427);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (29, 'SHOP', '2026-09-09', 128.94, 0.232663, 'BUY', 29.99956722);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (30, 'TSLA', '2026-09-09', 368.19, 0.108641, 'BUY', 40.00052979);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (31, 'ILF', '2026-09-09', 36.31, 4.116017, 'SELL', 149.45257727);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (32, 'VXUS', '2026-09-09', 87.55, 1.450633, 'BUY', 127.00291915);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (33, 'VOO', '2026-09-09', 701.2, 0.121221, 'BUY', 85.0001652);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (34, 'BND', '2026-09-09', 71.75, 0.491164, 'BUY', 35.241017);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (35, 'ASML', '2026-09-25', 1745.11, 0.041842, 'SELL', 73.01889261999999);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (36, 'NET', '2026-09-25', 348.4, 0.057406, 'BUY', 20.0002504);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (37, 'VOO', '2026-09-25', 709.02, 0.042312, 'BUY', 30.00005424);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (38, 'ROBO', '2026-09-25', 80.73, 0.284645, 'BUY', 22.979390849999998);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (39, 'SOXX', '2026-09-25', 572.63, 0.085691, 'SELL', 49.06923733);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (40, 'ROBO', '2026-09-25', 80.9, 0.605439, 'BUY', 48.9800151);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (41, 'ROBO', '2026-09-25', 80.57, 0.434394, 'BUY', 34.99912458);
INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (42, 'TSLA', '2026-09-25', 370.97, 0.044101, 'BUY', 16.360147970000003);
