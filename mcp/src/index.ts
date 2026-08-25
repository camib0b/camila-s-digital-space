import { OAuthProvider } from "@cloudflare/workers-oauth-provider";
import { createMcpHandler } from "agents/mcp/server";
import { authHandler } from "./auth-handler";
import { createServer } from "./mcp-server";
import { MCP_URL } from "./site-content";

const mcpHandler = createMcpHandler(createServer, {
  route: "/mcp",
  allowedHostnames: ["mcp.camilaescudero.cl", "localhost", "127.0.0.1"],
});

const apiHandler = {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return mcpHandler(request, env, ctx);
  },
};

export default new OAuthProvider({
  apiRoute: "/mcp",
  apiHandler,
  defaultHandler: authHandler,
  authorizeEndpoint: "/authorize",
  tokenEndpoint: "/oauth/token",
  clientRegistrationEndpoint: "/oauth/register",
  clientIdMetadataDocumentEnabled: true,
  scopesSupported: ["mcp:read"],
  resourceMetadata: {
    resource: MCP_URL,
    authorization_servers: ["https://mcp.camilaescudero.cl"],
    scopes_supported: ["mcp:read"],
    resource_name: "camilaescudero MCP",
  },
});
