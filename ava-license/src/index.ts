import { emptyCorsResponse, jsonResponse, readJsonObject } from "./http.ts";
import { handleGameMetadata } from "./gameMetadata.ts";
import {
  handleActivate,
  handleAdminIntrospect,
  handleAdminIssue,
  handleAdminRevoke,
  handleCheck,
  handleLicenseVerify,
  handleTrialStart,
} from "./licenseRoutes.ts";

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.replace(/\/+$/, "") || "/";
  return pathname || "/";
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return emptyCorsResponse();
    const url = new URL(request.url);
    const path = normalizePath(url.pathname);

    try {
      if (request.method === "GET" && path === "/health") {
        return jsonResponse({ ok: true });
      }

      if (request.method === "POST" && path === "/v1/license/verify") {
        return handleLicenseVerify(request, env);
      }

      if (request.method === "POST" && path === "/v1/ai/game-metadata") {
        return handleGameMetadata(request, env, globalThis.fetch);
      }

      if (request.method === "POST" && path === "/v1/trial/start") {
        const body = await readJsonObject(request);
        if (!body) return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
        return handleTrialStart(env, body);
      }

      if (request.method === "POST" && path === "/v1/license/activate") {
        const body = await readJsonObject(request);
        if (!body) return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
        return handleActivate(env, body);
      }

      if (request.method === "POST" && path === "/v1/license/check") {
        const body = await readJsonObject(request);
        if (!body) return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
        return handleCheck(env, body);
      }

      if (request.method === "POST" && path === "/v1/admin/issue") {
        const body = await readJsonObject(request);
        if (!body) return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
        return handleAdminIssue(request, env, body);
      }

      if (request.method === "POST" && path === "/v1/admin/revoke") {
        const body = await readJsonObject(request);
        if (!body) return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
        return handleAdminRevoke(request, env, body);
      }

      if (request.method === "GET" && path === "/v1/admin/introspect") {
        return handleAdminIntrospect(request, env, url);
      }

      return jsonResponse({ ok: false, reason: "not_found" }, 404);
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "ava.license.unhandled",
          errorName: error instanceof Error ? error.name : "unknown",
        }),
      );
      return jsonResponse({ ok: false, reason: "server_error" }, 500);
    }
  },
};
