import { createFileRoute } from "@tanstack/react-router";
import { ALL_CATEGORIES, ALL_TOOLS, toolHref } from "@/lib/all-tools";
import { EDUCATION_SUBJECTS } from "@/lib/general/education";
import { GAMES } from "@/lib/games/catalog";
import { englishCategoryPath } from "@/lib/route-slugs";
import { SITE_URL } from "@/lib/seo";
import { SIMULATORS } from "@/lib/simulators/catalog";
import { WORK_KITS } from "@/lib/work-kits";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const englishPaths = [
          { path: "/", priority: "1.0" },
          { path: "/tools", priority: "0.9" },
          { path: "/finance", priority: "0.9" },
          { path: "/kits", priority: "0.9" },
          { path: "/hubs/documents-and-files", priority: "0.9" },
          { path: "/games", priority: "0.9" },
          { path: "/simulators", priority: "0.9" },
          { path: "/legal", priority: "0.3" },
          { path: "/privacy", priority: "0.3" },
          { path: "/contact", priority: "0.3" },
          ...WORK_KITS.map((kit) => ({ path: `/kits/${kit.slug}`, priority: "0.8" })),
          ...GAMES.map((game) => ({ path: `/games/${game.slug}`, priority: "0.8" })),
          ...SIMULATORS.map((sim) => ({ path: `/simulators/${sim.slug}`, priority: "0.8" })),
          ...ALL_CATEGORIES.map((category) => ({
            path: englishCategoryPath(category.slug),
            priority: category.slug === "educacion" ? "0.9" : "0.8",
          })),
          ...EDUCATION_SUBJECTS.map(([slug]) => ({ path: `/education/${slug}`, priority: "0.8" })),
          ...ALL_TOOLS.map((tool) => ({ path: toolHref(tool), priority: "0.7" })),
        ];

        // Full Spanish surface so Google can discover ES tools/categories/kits
        // with correct /es/... paths (never legacy /herramientas without /es).
        const spanishPaths = [
          { path: "/es", priority: "1.0" },
          { path: "/es/herramientas", priority: "0.9" },
          { path: "/es/finanzas", priority: "0.9" },
          { path: "/es/kits", priority: "0.9" },
          { path: "/es/hubs/documentos-y-archivos", priority: "0.8" },
          { path: "/es/juegos", priority: "0.9" },
          { path: "/es/simuladores", priority: "0.9" },
          { path: "/es/aviso-legal", priority: "0.3" },
          { path: "/es/privacidad", priority: "0.3" },
          { path: "/es/contacto", priority: "0.3" },
          ...WORK_KITS.map((kit) => ({ path: `/es/kits/${kit.slug}`, priority: "0.8" })),
          ...GAMES.map((game) => ({ path: `/es/juegos/${game.slugEs}`, priority: "0.8" })),
          ...SIMULATORS.map((sim) => ({ path: `/es/simuladores/${sim.slugEs}`, priority: "0.8" })),
          ...ALL_CATEGORIES.map((category) => ({
            path: `/es/categoria/${category.slug}`,
            priority: "0.8",
          })),
          ...ALL_TOOLS.map((tool) => ({
            path: tool.category === "finanzas" ? `/es/finanzas/${tool.slug}` : `/es/herramientas/${tool.slug}`,
            priority: "0.7",
          })),
        ];

        const paths = [...englishPaths, ...spanishPaths];
        const today = new Date().toISOString().slice(0, 10);
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
          .map(
            ({ path, priority }) =>
              `<url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`,
          )
          .join("")}</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
