import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    nitro({
      preset: process.env.VERCEL ? "vercel" : undefined,
    }),
  ],
  // Note: aggressive rollup manualChunks (esp. for @tanstack/*) breaks
  // Nitro/TanStack Start SSR (createRequestHandler becomes undefined).
  // Heavy libs are still code-split via React.lazy in tool registries.
});
