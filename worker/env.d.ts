interface Env {
  FINTOC_SECRET_KEY: string;
  FINTOC_WEBHOOK_SECRET: string;
  SITE_URL?: string;
}

declare namespace Cloudflare {
  interface Env {
    FINTOC_SECRET_KEY: string;
    FINTOC_WEBHOOK_SECRET: string;
    SITE_URL?: string;
  }
}
