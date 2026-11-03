interface LicenseKvNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  LICENSES: LicenseKvNamespace;
  GAME_METADATA_LICENSE_LIMIT: RateLimitBinding;
  GAME_METADATA_GLOBAL_LIMIT: RateLimitBinding;
  LICENSE_SIGNING_SECRET?: string;
  ADMIN_SECRET?: string;
  XAI_API_KEY?: string;
  XAI_CHAT_MODEL?: string;
  /** Full chat-completions URL. Empty sends names calls direct to xAI. Image calls require this. */
  AI_GATEWAY_BASE_URL?: string;
  AI_GATEWAY_TOKEN?: string;
}
