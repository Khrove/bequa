import react from "@vitejs/plugin-react";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import { dirname } from "path";

export default defineConfig({
  plugins: [react()],
  envPrefix: "AIRPLANE_",
  resolve: {
    // This replaces __airplane_root with the absolute path to the root.
    // This vite.config is placed in /airplane/src and the root is /airplane.
    alias: [{ find: "__airplane_root", replacement: dirname(__dirname) }],
  },
  base: "",
  build: {
    assetsDir: "",
    sourcemap: true,
  },
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        // If base is non-empty, Vite attempts to serve files from a subpath of the actual workspace root (i.e.
        // {workspace}/{base}. We do not want that, and are simply using base to proxy Studio requests to the vite
        // server, and so we allow the original workspace root (equivalent to the Airplane project root).
        String.raw`/Users/joshuajohnson/bequa`,
      ],
    },
  },
});
