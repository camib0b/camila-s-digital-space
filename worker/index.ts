import { handleCreateCheckoutSession } from "./checkout";
import { jsonResponse } from "./json";
import { handleFintocWebhook } from "./webhooks";

const CHECKOUT_PATH = "/api/checkout";
const WEBHOOK_PATH = "/api/webhooks/fintoc";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === CHECKOUT_PATH && request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          Allow: "POST, OPTIONS",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === CHECKOUT_PATH && request.method === "POST") {
      return handleCreateCheckoutSession(request, env);
    }

    if (url.pathname === WEBHOOK_PATH && request.method === "POST") {
      return handleFintocWebhook(request, env);
    }

    if (url.pathname === CHECKOUT_PATH || url.pathname === WEBHOOK_PATH) {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
