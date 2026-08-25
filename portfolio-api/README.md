# portfolio-api

Cloudflare Worker that serves this site’s private data (investment portfolio and GitHub contributions). The frontend calls it from the browser; secrets stay on the Worker.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/portfolio` | Live holdings + Finnhub quotes |
| `GET` | `/api/portfolio/history` | Historical portfolio value |
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

`GITHUB_USERNAME` is a plaintext Worker var in [`wrangler.jsonc`](wrangler.jsonc) (`vars.GITHUB_USERNAME`), defaulting to `camib0b`. Override it there, in the dashboard, or locally in `.dev.vars` if you need a different login. It is not a secret.

For local development, copy [`.dev.vars.example`](.dev.vars.example) to `.dev.vars` and fill in values. Do not commit `.dev.vars`.

## Development

```bash
npm install
npx wrangler dev
```
