import { createFileRoute } from "@tanstack/react-router";
import { ALL_CATEGORIES, ALL_TOOLS } from "@/lib/all-tools";
import { EDUCATION_SUBJECTS } from "@/lib/general/education";
import { FINANCIAL_TOOLS } from "@/lib/financial-tools";
import { SITE_URL } from "@/lib/seo";

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");

export const Route = createFileRoute("/sitemap.xml")({
  server: { handlers: { GET: () => {
    const paths = [
      { path: "/", priority: "1.0" },
      { path: "/herramientas", priority: "0.9" },
      { path: "/finanzas", priority: "0.9" },
      ...ALL_CATEGORIES.map((category) => ({ path: `/categoria/${category.slug}`, priority: category.slug === "educacion" ? "0.9" : "0.8" })),
      ...EDUCATION_SUBJECTS.map(([slug]) => ({ path: `/educacion/${slug}`, priority: "0.8" })),
      ...ALL_TOOLS.map((tool) => ({ path: `/herramientas/${tool.slug}`, priority: "0.7" })),
      ...FINANCIAL_TOOLS.map((tool) => ({ path: `/finanzas/${tool.slug}`, priority: "0.7" })),
    ];
    const uniquePaths = Array.from(new Map(paths.map((entry) => [entry.path, entry])).values());
    const today = new Date().toISOString().slice(0, 10);
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${uniquePaths.map(({ path, priority }) => `<url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`).join("")}</urlset>`;
    return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
  } } },
});
