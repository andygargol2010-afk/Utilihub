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
  build: {
    target: "es2022",
    cssCodeSplit: true,
    // Avoid modulepreload polyfill overhead on modern browsers.
    // Drop heavy on-demand chunks from the automatic modulepreload list so
    // home EN/ES do not fetch pdf.js / jspdf / xlsx / three.js before LCP.
    // Those modules stay dynamic-imported; the browser loads them on use.
    // home-catalog is idle-prefetched after first paint (index / es.index).
    // Do not also modulepreload it — or the featured block it pulls — ahead of CSS and the hero font.
    modulePreload: {
      polyfill: false,
      resolveDependencies(_filename, deps) {
        return deps.filter(
          (dep) =>
            !dep.includes("vendor-pdf") &&
            !dep.includes("vendor-export") &&
            !dep.includes("vendor-xlsx") &&
            !dep.includes("vendor-three") &&
            !dep.includes("home-catalog") &&
            !dep.includes("HomeFeatured"),
        );
      },
    },
    rollupOptions: {
      output: {
        // Only split heavy optional libs. Never chunk @tanstack/* — breaks Nitro SSR.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/three/") || id.endsWith("/three")) return "vendor-three";
          if (id.includes("pdfjs-dist") || id.includes("pdf-lib")) return "vendor-pdf";
          if (id.includes("/xlsx") || id.includes("node_modules/xlsx")) return "vendor-xlsx";
          if (id.includes("jspdf") || id.includes("html2canvas")) return "vendor-export";
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
});
