# AGENTS.md

## Cursor Cloud specific instructions

This repository is the personal website for camilaescudero.cl. It contains four
independently-installed Node/npm projects, each with its own `package.json` and
lockfile:

| Project | Path | What it is | Standard commands |
| --- | --- | --- | --- |
| Frontend | repo root | Vite + React + TS + shadcn-ui site (the main product) | `npm run dev` (port 8080), `npm run lint`, `npm run build` — see `package.json` |
| `portfolio-api` | `portfolio-api/` | Cloudflare Worker (D1 + Workers AI + Finnhub/xAI/GitHub) | `npx wrangler dev`, `npx wrangler deploy` — see `portfolio-api/README.md` |
| `ava-checkout` | `ava-checkout/` | Cloudflare Worker (MercadoPago checkout + license email) | `npx wrangler dev`, `npx wrangler deploy` — see `ava-checkout/README.md` |
| `mcp` | `mcp/` | Cloudflare Worker MCP server with OAuth | `npm run dev`, `npx wrangler deploy` — see `mcp/README.md` |

The startup update script runs `npm ci` in all four directories, so dependencies
are already installed when an agent starts.

### Frontend (main product)

- `npm run dev` serves on `http://localhost:8080/` (host/port fixed in `vite.config.ts`). Routes: `/`, `/cv`, `/ava`, `/capital` (investment dashboard), `/tomorrow`.
- The frontend reads its API base from `VITE_PORTFOLIO_API_URL` (see `.env.example`). When unset it falls back to the deployed production Worker `https://portfolio-api.camilaescuderob.workers.dev/api/portfolio` (see `src/lib/portfolioApi.ts`), so the site — including the live-data `/capital` page — works standalone without running the local Worker, as long as egress is allowed.
- AVA checkout (`/ava`) posts to `VITE_AVA_CHECKOUT_URL` or `/api/ava` (see `src/lib/avaCheckoutApi.ts`). Payment, license-admin, and mail secrets live only in `ava-checkout`. The trial `.dmg` URL is public `VITE_AVA_DMG_URL`.
- Lint reports only warnings (0 errors); it also lints the workers' generated `worker-configuration.d.ts`, which is expected.

### Cloudflare Workers (`portfolio-api`, `ava-checkout`, and `mcp`)

- All three bundle/typecheck without credentials via `npx wrangler deploy --dry-run` (good for CI-style verification).
- Running `npx wrangler dev` locally requires a real Cloudflare account. `portfolio-api` has a remote `AI` binding and `mcp` has a remote `OAUTH_KV` binding; with no credentials, `wrangler dev` launches an interactive OAuth browser flow at startup and then fails (`A request to the Cloudflare API (/memberships) failed`). Set `CLOUDFLARE_API_TOKEN` (Worker/D1/KV/AI scopes) to run them locally.
- `ava-checkout` local setup: copy `ava-checkout/.dev.vars.example` to `ava-checkout/.dev.vars`. Create the `PAYMENTS` KV namespace and set `AVA_PRICE_CLP` before taking real payments. Email Sending must be enabled for `camilaescudero.cl` (`npx wrangler email sending enable camilaescudero.cl`).
- `portfolio-api` local setup: copy `portfolio-api/.dev.vars.example` to `portfolio-api/.dev.vars`, then seed the local D1 DB from the repo-root schema: `cd portfolio-api && npx wrangler d1 execute portfolio-holdings --local --file=../schema.sql`. `GET /api/portfolio` then works even without a Finnhub key (quote prices fall back to `0`, see `src/quotes.ts`); the `/api/portfolio/ai-insight` endpoint additionally needs the `AI`/`XAI_API_KEY` path.
- `.dev.vars` is git-ignored; never commit real secret values.
