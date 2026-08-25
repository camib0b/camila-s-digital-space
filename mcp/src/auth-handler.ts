import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { escapeHtml, htmlResponse, renderPage } from "./html";
import { MCP_URL, SITE_URL } from "./site-content";

export interface AuthHandlerEnv {
  OAUTH_KV: KVNamespace;
  OAUTH_PROVIDER: OAuthHelpers;
}

const VISITOR_PROFILE = {
  userId: "visitor",
  username: "Visitor",
};

function encodeAuthRequest(oauthRequest: AuthRequest): string {
  return btoa(encodeURIComponent(JSON.stringify(oauthRequest)));
}

function decodeAuthRequest(state: string): AuthRequest {
  return JSON.parse(decodeURIComponent(atob(state))) as AuthRequest;
}

function accessDeniedRedirect(oauthRequest: AuthRequest): Response {
  const redirect = new URL(oauthRequest.redirectUri);
  redirect.searchParams.set("error", "access_denied");
  if (oauthRequest.state) {
    redirect.searchParams.set("state", oauthRequest.state);
  }
  return Response.redirect(redirect.toString(), 302);
}

function authorizationErrorResponse(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Authorization request was invalid.";
  return htmlResponse(
    renderPage(
      "Authorization error",
      `<h1>Authorization error</h1><p>${escapeHtml(message)}</p>`,
    ),
    400,
  );
}

function landingPage(): Response {
  return htmlResponse(
    renderPage(
      "camilaescudero MCP",
      `
      <h1>camilaescudero MCP</h1>
      <p>
        Remote Model Context Protocol server for
        <a href="${escapeHtml(SITE_URL)}">camilaescudero.cl</a>.
        Tools return public profile, experience, projects, reading list, and contact details.
      </p>
      <p>Connect an MCP client to:</p>
      <code class="endpoint">${escapeHtml(MCP_URL)}</code>
      <p>Cursor example:</p>
      <code class="endpoint">{ "mcpServers": { "camilaescudero": { "url": "${escapeHtml(MCP_URL)}" } } }</code>
      <p>
        Clients complete OAuth 2.1 (consent at <code>/authorize</code>) before calling tools.
        This is protocol auth for MCP clients, not identity login.
      </p>
      `,
    ),
  );
}

async function renderConsentPage(env: AuthHandlerEnv, request: Request): Promise<Response> {
  let oauthRequest: AuthRequest;
  try {
    oauthRequest = await env.OAUTH_PROVIDER.parseAuthRequest(request);
  } catch (error) {
    return authorizationErrorResponse(error);
  }

  const clientInfo = await env.OAUTH_PROVIDER.lookupClient(oauthRequest.clientId);
  if (!clientInfo) {
    return htmlResponse(
      renderPage("Invalid client", "<h1>Invalid client</h1><p>Unknown OAuth client.</p>"),
      400,
    );
  }

  const clientName = clientInfo.clientName || "MCP Client";
  const encodedState = encodeAuthRequest(oauthRequest);
  const requestedScopes =
    oauthRequest.scope.length > 0 ? oauthRequest.scope.join(", ") : "mcp:read";

  return htmlResponse(
    renderPage(
      `Authorize ${clientName}`,
      `
      <div class="card">
        <h1>Authorization request</h1>
        <p>
          <strong>${escapeHtml(clientName)}</strong> wants to use the
          camilaescudero MCP server.
        </p>
        <p>Client ID: <code>${escapeHtml(clientInfo.clientId)}</code></p>
        ${
          clientInfo.clientUri
            ? `<p>Website: <a href="${escapeHtml(clientInfo.clientUri)}">${escapeHtml(clientInfo.clientUri)}</a></p>`
            : ""
        }
        <p>Requested scopes: <code>${escapeHtml(requestedScopes)}</code></p>
        <p>If you approve, the client can call public-site MCP tools.</p>
        <form method="post" action="/authorize">
          <input type="hidden" name="state" value="${escapeHtml(encodedState)}" />
          <div class="actions">
            <button type="submit" name="decision" value="deny">Cancel</button>
            <button type="submit" name="decision" value="approve">Approve</button>
          </div>
        </form>
      </div>
      `,
    ),
  );
}

async function completeConsent(env: AuthHandlerEnv, request: Request): Promise<Response> {
  const formData = await request.formData();
  const encodedState = formData.get("state");
  const decision = formData.get("decision");

  if (typeof encodedState !== "string" || encodedState.length === 0) {
    return htmlResponse(
      renderPage("Missing state", "<h1>Missing state</h1><p>The authorization form was incomplete.</p>"),
      400,
    );
  }

  let oauthRequest: AuthRequest;
  try {
    oauthRequest = decodeAuthRequest(encodedState);
  } catch {
    return htmlResponse(
      renderPage("Invalid state", "<h1>Invalid state</h1><p>The authorization form could not be read.</p>"),
      400,
    );
  }

  if (decision !== "approve") {
    return accessDeniedRedirect(oauthRequest);
  }

  const clientInfo = await env.OAUTH_PROVIDER.lookupClient(oauthRequest.clientId);
  const grantedScopes =
    oauthRequest.scope.length > 0 ? oauthRequest.scope : ["mcp:read"];

  const { redirectTo } = await env.OAUTH_PROVIDER.completeAuthorization({
    request: oauthRequest,
    userId: VISITOR_PROFILE.userId,
    metadata: {
      label: "MCP server access",
      clientName: clientInfo?.clientName || "Unknown client",
    },
    scope: grantedScopes,
    props: VISITOR_PROFILE,
  });

  return Response.redirect(redirectTo, 302);
}

export const authHandler = {
  async fetch(request: Request, env: AuthHandlerEnv, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return landingPage();
    }

    if (url.pathname === "/authorize" && request.method === "GET") {
      return renderConsentPage(env, request);
    }

    if (url.pathname === "/authorize" && request.method === "POST") {
      return completeConsent(env, request);
    }

    return htmlResponse(
      renderPage("Not found", "<h1>Not found</h1><p>This path is not part of the MCP OAuth server.</p>"),
      404,
    );
  },
};
