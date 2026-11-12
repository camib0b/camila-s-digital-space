import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
/**
 * Cloudflare Workers assets default `html_handling` is `auto-trailing-slash`:
 * - `dist/ava.html` is 200-served at `/ava`; `/ava/` 307s to `/ava`
 * - `dist/ava/index.html` is 200-served at `/ava/`; `/ava` 307s to `/ava/`
 *
 * Copy the SPA shell into `dist/<route>/index.html` so `/ava/` and `/concat/`
 * are folder indexes without changing global `html_handling`.
 */
const SPA_FOLDER_ROUTES = ["ava", "concat"] as const;

const ROUTE_BY_PAGE_FILE: Record<string, string> = {
  "Home.tsx": "/",
  "CV.tsx": "/cv",
  "Ava.tsx": "/ava",
  "Capital.tsx": "/capital",
  "Concat.tsx": "/concat",
  "NotFound.tsx": "*",
};

interface PreloadEntry {
  scripts: string[];
  styles: string[];
}

interface BundleChunk {
  type: "chunk";
  name: string;
  fileName: string;
  facadeModuleId: string | null;
  imports: readonly string[];
  viteMetadata?: { importedCss?: Set<string> };
}

const ROUTE_BY_CHUNK_NAME: Record<string, string> = {
  Home: "/",
  CV: "/cv",
  Ava: "/ava",
  Capital: "/capital",
  Concat: "/concat",
  NotFound: "*",
};

function isBundleChunk(item: { type: string }): item is BundleChunk {
  return item.type === "chunk";
}

const ROUTE_PRELOAD_RUNTIME = `(function(){
  var node=document.getElementById("route-entry-preloads");
  if(!node||!node.textContent)return;
  var routes=JSON.parse(node.textContent);
  var path=location.pathname.replace(/\\/+$/,"")||"/";
  var entry=routes[path]||routes["*"];
  if(!entry)return;
  var head=document.head;
  (entry.styles||[]).forEach(function(href){
    var link=document.createElement("link");
    link.rel="stylesheet";
    link.href=href;
    head.appendChild(link);
  });
  (entry.scripts||[]).forEach(function(href){
    var link=document.createElement("link");
    link.rel="modulepreload";
    link.href=href;
    link.setAttribute("fetchpriority","high");
    head.appendChild(link);
  });
})();`;

function routePreloadEntries(
  bundle: Record<string, { type: string }>,
  entryFileName: string,
): Record<string, PreloadEntry> {
  const entries: Record<string, PreloadEntry> = {};

  for (const item of Object.values(bundle)) {
    if (!isBundleChunk(item)) {
      continue;
    }
    const pageFile = item.facadeModuleId?.split("/").pop()?.split("?")[0] ?? "";
    const route = ROUTE_BY_PAGE_FILE[pageFile] ?? ROUTE_BY_CHUNK_NAME[item.name];
    if (!route) {
      continue;
    }

    const scripts: string[] = [];
    const styles: string[] = [];
    const seen = new Set<string>();

    const visit = (fileName: string) => {
      if (seen.has(fileName)) {
        return;
      }
      seen.add(fileName);
      const current = bundle[fileName];
      if (!current || !isBundleChunk(current)) {
        return;
      }
      if (current.fileName === entryFileName) {
        return;
      }
      scripts.push(`/${current.fileName}`);
      const importedCss = current.viteMetadata?.importedCss;
      if (importedCss) {
        for (const cssFile of importedCss) {
          const href = `/${cssFile}`;
          if (!styles.includes(href)) {
            styles.push(href);
          }
        }
      }
      for (const imported of current.imports) {
        visit(imported);
      }
    };

    visit(item.fileName);
    entries[route] = { scripts, styles };
  }

  return entries;
}

function injectRoutePreloads(html: string, bundle: Record<string, { type: string }>): string {
  const entryMatch = html.match(/src="(\/assets\/[^"]+\.js)"/);
  const entryFileName = entryMatch ? entryMatch[1].slice(1) : "";
  const payload = JSON.stringify(routePreloadEntries(bundle, entryFileName)).replace(/</g, "\\u003c");
  const injection =
    `<script type="application/json" id="route-entry-preloads">${payload}</script>` +
    `<script>${ROUTE_PRELOAD_RUNTIME}</script>`;
  const moduleScript = html.match(/<script type="module"[^>]*><\/script>/);
  if (moduleScript) {
    return html.replace(moduleScript[0], `${injection}${moduleScript[0]}`);
  }
  return html.replace("</head>", `${injection}</head>`);
}

function stripGoogleFontImport(source: string): string {
  return source.replace(/@import\s*(?:url\()?["']https:\/\/fonts\.googleapis\.com[^"']+["']\)?;?/g, "");
}

function copySpaShellToFolderRoutes(): Plugin {
  return {
    name: "copy-spa-shell-to-folder-routes",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === "asset" && item.fileName.endsWith(".css") && typeof item.source === "string") {
          item.source = stripGoogleFontImport(item.source);
        }
      }
      const shell = bundle["index.html"];
      if (!shell || shell.type !== "asset") {
        this.error("Expected index.html in the build bundle so folder routes can be copied.");
      }
      const html = typeof shell.source === "string" ? shell.source : new TextDecoder().decode(shell.source);
      const withPreloads = injectRoutePreloads(html, bundle);
      shell.source = withPreloads;
      for (const route of SPA_FOLDER_ROUTES) {
        this.emitFile({
          type: "asset",
          fileName: `${route}/index.html`,
          source: withPreloads,
        });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/ava": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), copySpaShellToFolderRoutes()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util", "@ffmpeg/core"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
