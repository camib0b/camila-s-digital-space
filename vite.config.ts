import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Cloudflare Workers assets default `html_handling` is `auto-trailing-slash`:
 * - `dist/ava.html` is 200-served at `/ava`; `/ava/` 307s to `/ava`
 * - `dist/ava/index.html` is 200-served at `/ava/`; `/ava` 307s to `/ava/`
 *
 * Copy the SPA shell into `dist/ava/index.html` so `/ava/` is a folder index
 * (same pattern as `/tomorrow/`) without changing global `html_handling`.
 */
function copySpaShellToAvaFolder(): Plugin {
  return {
    name: "copy-spa-shell-to-ava-folder",
    apply: "build",
    closeBundle() {
      const distDirectory = path.resolve(__dirname, "dist");
      const spaShellPath = path.join(distDirectory, "index.html");
      const avaFolderPath = path.join(distDirectory, "ava");
      const avaIndexPath = path.join(avaFolderPath, "index.html");

      if (!fs.existsSync(spaShellPath)) {
        this.error(
          `Expected ${spaShellPath} after the Vite build so it can be copied to ${avaIndexPath}.`,
        );
      }

      fs.mkdirSync(avaFolderPath, { recursive: true });
      fs.copyFileSync(spaShellPath, avaIndexPath);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    copySpaShellToAvaFolder(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
