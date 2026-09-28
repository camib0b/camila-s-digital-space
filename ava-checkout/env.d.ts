/** Secrets set via `wrangler secret put` (not in wrangler.jsonc). */
interface Env {
  MP_ACCESS_TOKEN: string;
  MP_WEBHOOK_SECRET: string;
  AVA_LICENSE_API_URL: string;
  AVA_LICENSE_ADMIN_SECRET: string;
  MAIL_FROM: string;
}
