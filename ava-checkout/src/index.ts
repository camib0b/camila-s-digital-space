import {
  LICENSE_CURRENCY,
  LICENSE_DAYS,
  normalizeAvaApiPath,
  parsePriceClp,
} from "./config";
import { corsHeadersForRequest, corsPreflightResponse, jsonResponse } from "./cors";
import { handleCheckout } from "./checkout";
import { handleWebhook } from "./webhook";

function withBrowserCors(request: Request, env: Env, response: Response): Response {
  const headers = new Headers(response.headers);
  const corsHeaders = corsHeadersForRequest(request, env);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = normalizeAvaApiPath(url.pathname);
    const isBrowserApi = path === "/checkout" || path === "/config";

    if (request.method === "OPTIONS") {
      if (isBrowserApi) {
        return corsPreflightResponse(request, env);
      }
      return new Response(null, { status: 204 });
    }

    try {
      if (request.method === "GET" && path === "/health") {
        return jsonResponse({ ok: true }, 200);
      }

      if (request.method === "GET" && path === "/config") {
        return withBrowserCors(
          request,
          env,
          jsonResponse(
            {
              priceClp: parsePriceClp(env),
              currency: LICENSE_CURRENCY,
              licenseDays: LICENSE_DAYS,
            },
            200,
          ),
        );
      }

      if (request.method === "POST" && path === "/checkout") {
        return withBrowserCors(request, env, await handleCheckout(request, env));
      }

      if ((request.method === "POST" || request.method === "GET") && path === "/webhook") {
        return handleWebhook(request, env);
      }

      const notFound = jsonResponse({ ok: false, error: "not_found" }, 404);
      return isBrowserApi ? withBrowserCors(request, env, notFound) : notFound;
    } catch (error) {
      console.error(JSON.stringify({ event: "ava.checkout.unhandled", error: String(error) }));
      const failed = jsonResponse({ ok: false, error: "server_error" }, 500);
      return isBrowserApi ? withBrowserCors(request, env, failed) : failed;
    }
  },
} satisfies ExportedHandler<Env>;
