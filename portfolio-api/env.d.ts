/** Secrets set via `wrangler secret put` (not in wrangler.jsonc). */
interface Env {
  FINNHUB_API_KEY: string;
  XAI_API_KEY?: string;
}
