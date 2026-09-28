import { allowedCheckoutOrigins } from "./config";

const ALLOWED_HEADERS = "Content-Type";
const ALLOWED_METHODS = "GET, POST, OPTIONS";

export function corsHeadersForRequest(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get("Origin") || "";
  const allowOrigin = allowedCheckoutOrigins(env).includes(origin) ? origin : allowedCheckoutOrigins(env)[0] || "";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    Vary: "Origin",
  };
}

export function corsPreflightResponse(request: Request, env: Env): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeadersForRequest(request, env),
  });
}

export function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders?: HeadersInit,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}
