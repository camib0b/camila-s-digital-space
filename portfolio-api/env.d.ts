/** Secrets set via `wrangler secret put` (not in wrangler.jsonc). */
interface Env {
  FINNHUB_API_KEY: string;
  XAI_API_KEY?: string;
  /** Fine-grained PAT (user profile read) or classic PAT with `read:user`. */
  GITHUB_TOKEN?: string;
  /** Defaults to camib0b when unset. */
  GITHUB_USERNAME?: string;
}
