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
    // KitReturnRibbon is idle-imported on tool shells; work-kits pulls all-tools.
    // FinanceJourney is the deferred related-calculator block; discovery pulls all-tools.
    // Tool index search is idle-prefetched; ToolSearch pulls all-tools (~catalog).
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
            !dep.includes("HomeFeatured") &&
            !dep.includes("KitReturnRibbon") &&
            !dep.includes("work-kits") &&
            !dep.includes("FinanceJourney") &&
            !dep.includes("discovery") &&
            !dep.includes("ToolSearch"),
        );
      },
    },
    rollupOptions: {
      output: {
        // Only split three and xlsx. Do not name-chunk pdfjs/pdf-lib or jspdf/html2canvas:
        // those vendor chunks also absorbed Vite's preload helper, so the home entry
        // statically imported ~1.6 MB (vendor-pdf + vendor-export) before LCP.
        // Document/media tools and ShareAndExportActions already dynamic-import them.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/three/") || id.endsWith("/three")) return "vendor-three";
          if (id.includes("/xlsx") || id.includes("node_modules/xlsx")) return "vendor-xlsx";
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
});
