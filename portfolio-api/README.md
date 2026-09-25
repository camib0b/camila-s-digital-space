# portfolio-api

Cloudflare Worker that serves this site’s private data (investment portfolio and GitHub contributions). The frontend calls it from the browser; secrets stay on the Worker.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/portfolio` | Live holdings + Finnhub quotes |
| `GET` | `/api/portfolio/history` | Historical portfolio value |
| `GET` | `/api/analytics` | Time-weighted return, VOO counterfactual, risk contribution, Sharpe, and look-through exposure. Reads stored prices; it does not fetch vendors. |
| `POST` | `/api/portfolio/ai-insight` | On-demand AI insight |
| `GET` | `/api/github/contributions` | Last ~365 days of GitHub contributions (GraphQL). Cached ~6 hours. |

## Secrets

Set production secrets from this directory (they are not in `wrangler.jsonc`):

```bash
npx wrangler secret put FINNHUB_API_KEY
npx wrangler secret put XAI_API_KEY
npx wrangler secret put GITHUB_TOKEN
```

`GITHUB_TOKEN` is required for `/api/github/contributions`. Use a fine-grained PAT with user profile read access, or a classic PAT with `read:user`. Never send this token to the client.

`/api/analytics` does not add a new secret. Live quotes still use `FINNHUB_API_KEY`. The weekday cron at 22:30 UTC (after the US cash close) stores daily closes in D1. It tries Finnhub candles first and uses the Yahoo Finance chart API when that history does not cover the window. The 3-month T-bill yield is the public FRED `DGS3MO` series. Fund holdings are committed JSON snapshots from issuer N-PORT filings (`data/holdings/`), refreshed with `node scripts/refresh-fund-holdings.mjs`, not scraped on the request path.

Apply the market-data migration before the first sync:

```bash
npx wrangler d1 migrations apply portfolio-holdings --remote
```

Local analytics also needs the ledger. `data/ledger-seed.sql` matches the production `transactions` table at the time it was exported:

```bash
npx wrangler d1 execute portfolio-holdings --local --file=data/ledger-seed.sql
npx wrangler d1 migrations apply portfolio-holdings --local
```

`GITHUB_USERNAME` is a plaintext Worker var in [`wrangler.jsonc`](wrangler.jsonc) (`vars.GITHUB_USERNAME`), defaulting to `camib0b`. Override it there, in the dashboard, or locally in `.dev.vars` if you need a different login. It is not a secret.

For local development, copy [`.dev.vars.example`](.dev.vars.example) to `.dev.vars` and fill in values. Do not commit `.dev.vars`.

## Development

```bash
npm install
npx wrangler dev
```
