# Project info

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Cloudflare Workers (static assets + `/api` routes)
- Fintoc Payment Links + Checkout Sessions for Chilean payments (CLP)

## Fintoc payments

### Payment Link button (primary UI)

The React `/pay` page and Contact “Make a payment” link use a Fintoc Payment Link:

- URL: `VITE_FINTOC_PAYMENT_LINK_URL` (default `https://pay.fintoc.com/plink_kMV9D8xTvqJDb1L7`)
- Public key: `VITE_FINTOC_PUBLIC_KEY` (safe in the browser; used for future Widget integrations)

`PayButton` opens that payment link. The amount is configured in the Fintoc Dashboard for the link itself.

### Checkout Session API + webhooks (Worker)

The site Worker (`worker/index.ts`) also exposes:

- `POST /api/checkout` — creates a dynamic Fintoc Checkout Session and returns `redirect_url`
- `POST /api/webhooks/fintoc` — verifies `Fintoc-Signature` and records payment events

For Payment Links, listen for `payment_intent.succeeded`. `/payment/success` and `/payment/cancel` are return URLs only when using Checkout Sessions. **Do not treat the success page as paid** — webhooks are the source of truth.

### Local development

1. Copy `.env.example` values into a local `.env` if you need to override the payment link or public key.
2. Copy `.dev.vars.example` to `.dev.vars` and paste Fintoc **test** secrets for the Worker.
3. Apply the payments schema (once):

```bash
npm run db:payments:local
```

4. Run the UI and Worker together:

```bash
npm run dev
npm run dev:worker
```

Vite proxies `/api` to `wrangler dev` on port `8787`.

### Production setup (Fintoc Dashboard)

1. Create a Fintoc account and copy the **test** secret key (`sk_test_...`).
2. Store secrets on the `camilaescudero` Worker (never `VITE_*` for secrets):

```bash
npx wrangler secret put FINTOC_SECRET_KEY
npx wrangler secret put FINTOC_WEBHOOK_SECRET
```

3. Apply the D1 schema:

```bash
npm run db:payments:remote
```

4. After deploy, register `https://<your-domain>/api/webhooks/fintoc` in the Fintoc Dashboard for at least:

- `payment_intent.succeeded`
- `payment_intent.failed`
- `checkout_session.finished` (if you also use Checkout Sessions)

Fintoc shows the webhook signing secret **once** when the endpoint is created. Put that value in `FINTOC_WEBHOOK_SECRET`.

5. Optional: `npx wrangler secret put SITE_URL` (or a Wrangler `vars.SITE_URL`) if Checkout Session success/cancel URLs should not use the request origin.

6. Test with Fintoc’s Chile test bank login: RUT `41614850-3`, password `jonsnow`, account `422159212`.
