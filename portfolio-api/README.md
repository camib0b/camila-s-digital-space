# portfolio-api

Cloudflare Worker that serves this site’s private data (investment portfolio and GitHub contributions). The frontend calls it from the browser; secrets stay on the Worker.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/portfolio` | Live holdings + Finnhub quotes |
| `GET` | `/api/portfolio/history` | Historical portfolio value |
| `GET` | `/api/analytics` | Time-weighted return, VOO counterfactual, risk contribution, Sharpe, and look-through exposure. Reads stored prices; it does not fetch vendors. |
| `POST` | `/api/portfolio/ai-insight` | On-demand AI insight |
| `GET` | `/api/github/contributions` | Up to three years of GitHub contributions (multiple yearly GraphQL ranges stitched). Cached ~6 hours. |

## Secrets

Set production secrets from this directory (they are not in `wrangler.jsonc`):

```bash
npx wrangler secret put FINNHUB_API_KEY
npx wrangler secret put XAI_API_KEY
npx wrangler secret put GITHUB_TOKEN
```

`GITHUB_TOKEN` is required for `/api/github/contributions`. Use a fine-grained PAT with user profile read access, or a classic PAT with `read:user`. Never send this token to the client.

`/api/analytics` does not add a new secret. Live quotes still use `FINNHUB_API_KEY`. The weekday cron at 22:30 UTC (after the US cash close) stores daily closes in D1. It tries Finnhub candles first and uses the Yahoo Finance chart API when that history does not cover the window. The 3-month T-bill yield is the public FRED `DGS3MO` series. Fund holdings are committed JSON snapshots from issuer N-PORT filings (`data/holdings/`), refreshed with `node scripts/refresh-fund-holdings.mjs`, not scraped on the request path.

Apply the market-data migration before the first sync. On a database that already has `transactions.total_amount`, deploy this worker before `migrations apply` so 0002 does not land under the old worker:

```bash
npx wrangler d1 migrations apply portfolio-holdings --remote
```

Local analytics also needs the ledger. `data/ledger-seed.sql` creates `transactions.gross_notional`. Apply the market-data migration by file. Do not run `migrations/0002_gross_notional.sql` on that fresh database: 0002 is only for a database that still has `total_amount`.

```bash
npx wrangler d1 execute portfolio-holdings --local --file=data/ledger-seed.sql
npx wrangler d1 execute portfolio-holdings --local --file=migrations/0001_market_data.sql
```

On the remote database, deploy this worker before applying 0002. The worker reads `gross_notional` and falls back to `total_amount`. `npx wrangler d1 migrations apply portfolio-holdings --remote` applies 0002 once 0001 is already recorded.

`GITHUB_USERNAME` is a plaintext Worker var in [`wrangler.jsonc`](wrangler.jsonc) (`vars.GITHUB_USERNAME`), defaulting to `camib0b`. Override it there, in the dashboard, or locally in `.dev.vars` if you need a different login. It is not a secret.

For local development, copy [`.dev.vars.example`](.dev.vars.example) to `.dev.vars` and fill in values. Do not commit `.dev.vars`.

## Development

```bash
npm install
npx wrangler dev
```

## Deploy

After changing Worker code (including GitHub contributions), deploy from this directory:

```bash
npm run deploy
```

That runs `wrangler deploy` for the `portfolio-api` Worker. GitHub Actions in this repo do not auto-deploy the Worker; merge the PR and run deploy (or your usual release process) so `/api/github/contributions` picks up API changes.
