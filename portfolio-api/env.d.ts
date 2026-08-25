/** Secrets set via `wrangler secret put` (not in wrangler.jsonc). */
interface Env {
  FINNHUB_API_KEY: string;
  XAI_API_KEY?: string;
  /** Fine-grained PAT (user profile read) or classic PAT with `read:user`. */
  GITHUB_TOKEN?: string;
  /** Plaintext Worker var from wrangler.jsonc; defaults to camib0b. */
  GITHUB_USERNAME?: string;
}
