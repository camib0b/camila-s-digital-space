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

function copySpaShellToFolderRoutes(): Plugin {
  return {
    name: "copy-spa-shell-to-folder-routes",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const shell = bundle["index.html"];
      if (!shell || shell.type !== "asset") {
        this.error("Expected index.html in the build bundle so folder routes can be copied.");
      }
      for (const route of SPA_FOLDER_ROUTES) {
        this.emitFile({
          type: "asset",
          fileName: `${route}/index.html`,
          source: shell.source,
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
