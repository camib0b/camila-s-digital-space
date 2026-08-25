type OAuthHelpers = import("@cloudflare/workers-oauth-provider").OAuthHelpers;

declare namespace Cloudflare {
  interface Env {
    OAUTH_PROVIDER: OAuthHelpers;
  }
}

interface Env {
  OAUTH_PROVIDER: OAuthHelpers;
}
