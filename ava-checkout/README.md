# ava-checkout

Cloudflare Worker that takes AVA payments on the website, issues a license via the existing AVA license API, and emails the key. MercadoPago and license secrets stay on this Worker; they are never imported by `src/pages/Ava.tsx`.

The Mac app is unchanged. Coaches pay on [camilaescudero.cl/ava](https://camilaescudero.cl/ava/), then paste the emailed token in AVA.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/ava/config` | Public `{ priceClp, currency, licenseDays }` |
| `POST` | `/api/ava/checkout` | Body `{ email, language }`. Creates a Checkout Pro preference and returns `{ initPoint }` |
| `POST` | `/api/ava/webhook` | MercadoPago notifications. Verifies HMAC, issues 365-day license, emails token |
| `GET` | `/health` | Liveness |

Production route: `camilaescudero.cl/api/ava/*` (see `wrangler.jsonc`). Local and `workers.dev` use the same `/api/ava/...` paths.

## Secrets

```bash
npx wrangler secret put MP_ACCESS_TOKEN
npx wrangler secret put MP_WEBHOOK_SECRET
npx wrangler secret put AVA_LICENSE_API_URL
npx wrangler secret put AVA_LICENSE_ADMIN_SECRET
npx wrangler secret put MAIL_FROM
```

`AVA_LICENSE_API_URL` is the origin of the sibling AVA license Worker (no trailing path), for example `https://ava-license.example.workers.dev`. This Worker calls `POST {url}/v1/admin/issue`.

`MAIL_FROM` must be an address on a domain onboarded for Cloudflare Email Sending:

```bash
npx wrangler email sending enable camilaescudero.cl
```

Do not use Email Routing for this: Routing can only deliver to verified destinations, not to arbitrary coaches.

Plaintext vars in `wrangler.jsonc`: `PUBLIC_SITE_URL`, `AVA_PRICE_CLP` (integer CLP, no decimals). Set `AVA_PRICE_CLP` to the real annual price before taking payments.

## KV

Webhook fulfillment is idempotent in `PAYMENTS`:

```bash
npx wrangler kv namespace create PAYMENTS
```

Paste the id into `wrangler.jsonc` `kv_namespaces`.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # fill secrets + AVA_PRICE_CLP
npx wrangler types
npx wrangler dev
```

Point the site at this Worker with `VITE_AVA_CHECKOUT_URL=http://127.0.0.1:8787/api/ava`, or use the Vite proxy (`/api/ava` → port 8787). MercadoPago cannot reach `localhost` webhooks; use a deployed Worker or a tunnel to test fulfillment.

Do not commit `.dev.vars`.
