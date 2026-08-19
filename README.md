# Project info

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Cloudflare Workers (static assets + `/api` routes)
- Fintoc Checkout Sessions for Chilean payments (CLP)

## Fintoc payments

The site Worker (`worker/index.ts`) exposes:

- `POST /api/checkout` — creates a Fintoc Checkout Session and returns `redirect_url`
- `POST /api/webhooks/fintoc` — verifies `Fintoc-Signature` and records payment events

The React `/pay` page collects email and a CLP amount, then redirects to hosted Fintoc Checkout. `/payment/success` and `/payment/cancel` are return URLs only. **Do not treat the success page as paid** — `payment_intent.succeeded` / `checkout_session.finished` webhooks are the source of truth.

### Local development

1. Copy `.dev.vars.example` to `.dev.vars` and paste Fintoc **test** secrets.
2. Apply the payments schema (once):

```bash
npm run db:payments:local
```

3. Run the UI and Worker together:

```bash
npm run dev
npm run dev:worker
```

Vite proxies `/api` to `wrangler dev` on port `8787`.

### Production setup (Fintoc Dashboard)

1. Create a Fintoc account and copy the **test** secret key (`sk_test_...`).
2. Store secrets on the `camilaescudero` Worker (never `VITE_*`):

```bash
npx wrangler secret put FINTOC_SECRET_KEY
npx wrangler secret put FINTOC_WEBHOOK_SECRET
```

3. Apply the D1 schema:

```bash
npm run db:payments:remote
```

4. After deploy, register `https://<your-domain>/api/webhooks/fintoc` in the Fintoc Dashboard for:

- `checkout_session.finished`
- `payment_intent.succeeded`
- `payment_intent.failed`

Fintoc shows the webhook signing secret **once** when the endpoint is created. Put that value in `FINTOC_WEBHOOK_SECRET`.

5. Optional: `npx wrangler secret put SITE_URL` (or a Wrangler `vars.SITE_URL`) if success/cancel URLs should not use the request origin.

6. Test with Fintoc’s Chile test bank login: RUT `41614850-3`, password `jonsnow`, account `422159212`.
