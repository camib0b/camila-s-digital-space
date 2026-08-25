export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function htmlResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function renderPage(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        max-width: 40rem;
        margin: 3rem auto;
        padding: 0 1.25rem 3rem;
        line-height: 1.6;
      }
      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      code,
      .endpoint {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.9em;
      }
      .endpoint {
        display: block;
        background: color-mix(in srgb, CanvasText 8%, Canvas);
        padding: 0.65rem 0.8rem;
        border-radius: 0.4rem;
        margin: 0.75rem 0;
        overflow-wrap: anywhere;
      }
      .card {
        border: 1px solid color-mix(in srgb, CanvasText 16%, Canvas);
        border-radius: 0.6rem;
        padding: 1.25rem 1.4rem;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.25rem;
      }
      button {
        font: inherit;
        padding: 0.55rem 1rem;
        border-radius: 0.4rem;
        border: 1px solid color-mix(in srgb, CanvasText 16%, Canvas);
        background: Canvas;
        color: CanvasText;
        cursor: pointer;
      }
      button[value="approve"] {
        background: CanvasText;
        color: Canvas;
        border-color: transparent;
        flex: 1;
      }
      a {
        color: inherit;
      }
    </style>
  </head>
  <body>
    ${bodyHtml}
  </body>
</html>`;
}
