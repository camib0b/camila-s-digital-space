export type QuotaResult = "ok" | "license" | "global" | "unconfigured";

/** Per-license limiter, then the global limiter. Both are Workers Rate Limiting bindings. */
export async function consumeGameMetadataQuota(env: Env, licenseKeyId: string): Promise<QuotaResult> {
  const licenseLimiter = env.GAME_METADATA_LICENSE_LIMIT;
  const globalLimiter = env.GAME_METADATA_GLOBAL_LIMIT;
  if (!licenseLimiter || !globalLimiter) return "unconfigured";
  const licenseResult = await licenseLimiter.limit({ key: licenseKeyId });
  if (!licenseResult.success) return "license";
  const globalResult = await globalLimiter.limit({ key: "game-metadata" });
  if (!globalResult.success) return "global";
  return "ok";
}
