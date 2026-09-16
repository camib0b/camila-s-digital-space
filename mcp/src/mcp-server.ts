import { McpServer } from "@modelcontextprotocol/server";
import { getMcpAuthContext } from "agents/mcp/server";
import { z } from "zod";
import { contact, experience, profile, projects, readingList } from "./site-content";

function textResult(text: string) {
  return {
    content: [{ type: "text" as const, text }],
  };
}

function jsonTextResult(value: unknown) {
  return textResult(JSON.stringify(value, null, 2));
}

export function createSiteMcpServer() {
  const server = new McpServer({
    name: "camilaescudero-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "hello",
    {
      description: "Returns a greeting",
      inputSchema: { name: z.string().optional() },
    },
    async ({ name }) => {
      const auth = getMcpAuthContext();
      const username = typeof auth?.props?.username === "string" ? auth.props.username : undefined;
      return textResult(`Hello, ${name ?? username ?? "World"}!`);
    },
  );

  server.registerTool(
    "whoami",
    {
      description: "Returns information about the authenticated MCP client and visitor props",
    },
    async (context) => {
      const auth = getMcpAuthContext();

      if (!auth) {
        return textResult("No authentication context available");
      }

      return jsonTextResult({
        userId: auth.props?.userId,
        username: auth.props?.username,
        clientId: context.http?.authInfo?.clientId,
        scopes: context.http?.authInfo?.scopes,
      });
    },
  );

  server.registerTool(
    "get_profile",
    {
      description: "Returns Camila Escudero's public profile from camilaescudero.cl",
    },
    async () => jsonTextResult(profile),
  );

  server.registerTool(
    "get_experience",
    {
      description: "Returns public work experience and internships from the website",
    },
    async () => jsonTextResult(experience),
  );

  server.registerTool(
    "get_projects",
    {
      description: "Returns public personal projects from the website",
    },
    async () => jsonTextResult(projects),
  );

  server.registerTool(
    "get_reading_list",
    {
      description: "Returns the public reading list from the website",
    },
    async () => jsonTextResult(readingList),
  );

  server.registerTool(
    "get_contact",
    {
      description: "Returns public contact email and social links",
    },
    async () => jsonTextResult(contact),
  );

  return server;
}
