# camilaescudero MCP

Cloudflare Worker that exposes a remote [Model Context Protocol](https://modelcontextprotocol.io/) server for [camilaescudero.cl](https://camilaescudero.cl).

MCP endpoint: `https://mcp.camilaescudero.cl/mcp`

Tools return **public** site content (profile, experience, projects, reading list, contact). They do not expose portfolio holdings, Finnhub quotes, or other private API data.

Clients complete OAuth 2.1 before calling tools. Consent is a public visitor grant (`userId: visitor`), not GitHub/Google login. Anyone who approves can use the public tools.

## Connect

Cursor / Claude-compatible config:

```json
{
  "mcpServers": {
    "camilaescudero": {
      "url": "https://mcp.camilaescudero.cl/mcp"
    }
  }
}
```

You can also use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) against that URL. The Inspector handles the OAuth consent page.

## Tools

| Tool | Returns |
| --- | --- |
| `hello` | Greeting |
| `whoami` | OAuth client / visitor props (never the access token) |
| `get_profile` | Name, location, tagline, site URL, socials |
| `get_experience` | Public roles from the website |
| `get_projects` | AVA, clip library, capital, Raycast |
| `get_reading_list` | Book titles, authors, categories |
| `get_contact` | Public email and social links |

## Local development

```bash
cd mcp
npm install
npx wrangler kv namespace create OAUTH_KV
npx wrangler kv namespace create OAUTH_KV --preview
```

Put the returned ids in `wrangler.jsonc` (`kv_namespaces[0].id` and `preview_id`), then:

```bash
npx wrangler types
npm run dev
```

Open `http://localhost:8787/` for the landing page. Unauthenticated `POST /mcp` should return `401` with a `WWW-Authenticate` challenge.

## Deploy

Requires Wrangler access to the Cloudflare account that owns `camilaescudero.cl`.

```bash
cd mcp
npx wrangler deploy
```

That command deploys the Worker and attaches the Custom Domain `mcp.camilaescudero.cl` (DNS + certificate). If deploy fails because the hostname already has a DNS record, remove the conflicting record and deploy again.

No Worker secrets are required. OAuth state lives in the `OAUTH_KV` namespace.

## Endpoints

| Path | Role |
| --- | --- |
| `GET /` | Human landing page |
| `/mcp` | Streamable HTTP MCP (Bearer token) |
| `/authorize` | OAuth consent |
| `/oauth/token` | Token endpoint |
| `/oauth/register` | Dynamic client registration (compatibility) |
| `/.well-known/oauth-protected-resource/mcp` | Protected resource metadata |
| `/.well-known/oauth-authorization-server` | Authorization server metadata |
