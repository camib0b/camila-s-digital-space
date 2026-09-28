export const LICENSE_DAYS = 365;
export const LICENSE_CURRENCY = "CLP";

const LOCAL_DEV_ORIGINS = ["http://localhost:8080", "http://127.0.0.1:8080"];

export function parsePriceClp(env: Env): number {
  const parsed = Number.parseInt(String(env.AVA_PRICE_CLP ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return parsed;
}

export function publicSiteUrl(env: Env): string {
  const configured = (env.PUBLIC_SITE_URL || "https://camilaescudero.cl").trim();
  return configured.replace(/\/+$/, "");
}

export function allowedCheckoutOrigins(env: Env): string[] {
  const site = publicSiteUrl(env);
  const origins = new Set<string>([site, ...LOCAL_DEV_ORIGINS]);
  if (site === "https://camilaescudero.cl") {
    origins.add("https://www.camilaescudero.cl");
  }
  return [...origins];
}

export function checkoutReturnOrigin(request: Request, env: Env): string {
  const originHeader = (request.headers.get("Origin") || "").replace(/\/+$/, "");
  if (originHeader && allowedCheckoutOrigins(env).includes(originHeader)) {
    return originHeader;
  }
  return publicSiteUrl(env);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function checkoutLanguage(value: unknown): "es" | "en" {
  return value === "en" ? "en" : "es";
}

export function licenseApiOrigin(env: Env): string {
  return env.AVA_LICENSE_API_URL.replace(/\/+$/, "");
}

export function stripTrailingSlash(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.replace(/\/+$/, "") || "/";
  }
  return path || "/";
}

/** `/api/ava/checkout` and `/checkout` both become `/checkout`. */
export function normalizeAvaApiPath(pathname: string): string {
  const trimmed = stripTrailingSlash(pathname);
  if (trimmed === "/api/ava") {
    return "/";
  }
  if (trimmed.startsWith("/api/ava/")) {
    return `/${trimmed.slice("/api/ava/".length)}`;
  }
  return trimmed;
}
