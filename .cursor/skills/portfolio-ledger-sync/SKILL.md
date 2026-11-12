---
name: portfolio-ledger-sync
description: >-
  Keeps portfolio trade history aligned across portfolio-transactions.csv,
  ledger.json, ledger-seed.sql, schema.sql, and remote D1. Use when editing
  portfolio trades, fixing /capital holdings, syncing transactions, or seeding
  portfolio-holdings locally or in production.
---

# Portfolio ledger sync (camilaescudero.cl)

## Source of truth at runtime

- **Live `/capital` and `/api/analytics`** read **`transactions` in remote D1** (`portfolio-holdings`), not the CSV or `ledger.json`.
- **Authoring source of truth for trades:** `portfolio-api/data/portfolio-transactions.csv`. The price column header is `Price` for buys and sells. The notional column in D1 and the seed is `gross_notional` (`grossNotional` in `ledger.json`).

Committed mirrors (must stay aligned with the CSV):

| Artifact | Path |
| --- | --- |
| CSV | `portfolio-api/data/portfolio-transactions.csv` |
| JSON ledger | `portfolio-api/data/ledger.json` |
| D1 seed SQL | `portfolio-api/data/ledger-seed.sql` |
| Local full schema | `schema.sql` (repo root; used by `AGENTS.md` local D1 seed) |

## After you change the CSV

Refresh `ledger.json` and `ledger-seed.sql` after you change `portfolio-transactions.csv`, then either run `ledger-seed.sql` with `--remote` again or regenerate `schema.sql` the same way so local seeds and production stay aligned. The remote seed inserts `gross_notional`. Apply migration `0002_gross_notional.sql` before that seed if production still has `total_amount`. Deploy the worker first: it reads either column. Do not use the seed as the rename.

1. **Regenerate JSON + SQL from the CSV** (from repo root):

   ```bash
   node portfolio-api/scripts/sync-ledger-from-csv.mjs
   ```

2. **Push trades to production D1** (requires Cloudflare auth):

   ```bash
   cd portfolio-api
   npx wrangler d1 execute portfolio-holdings --remote --file=data/ledger-seed.sql
   ```

3. **Refresh repo-root `schema.sql`** (for local `wrangler d1 execute ... --local --file=../schema.sql`):

   ```bash
   node portfolio-api/scripts/regenerate-schema-sql.mjs
   ```

4. **Verify**

   ```bash
   npx wrangler d1 execute portfolio-holdings --remote --command "SELECT COUNT(*) AS n, MAX(trade_date) AS last_date FROM transactions;"
   curl -sS "https://portfolio-api.camilaescuderob.workers.dev/api/portfolio" | jq '[.holdings[].ticker] | sort'
   ```

   Open positions should match `computeHoldings` on `ledger.json` (seven tickers as of the last sync: BND, NET, ROBO, SHOP, TSLA, VOO, VXUS).

## Local D1 only

```bash
cd portfolio-api
npx wrangler d1 execute portfolio-holdings --local --file=data/ledger-seed.sql
# or from repo root schema (drops/recreates transactions + ai_usage tables):
npx wrangler d1 execute portfolio-holdings --local --file=../schema.sql
```

## Do not

- Assume `schema.sql` and remote D1 stay in sync without running the commands above.
- Edit only `ledger.json` or only remote D1; the CSV and all mirrors drift.
