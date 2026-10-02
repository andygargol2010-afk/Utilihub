import { createFileRoute } from "@tanstack/react-router";
import { ALL_CATEGORIES, ALL_TOOLS, toolHref } from "@/lib/all-tools";
import { EDUCATION_SUBJECTS } from "@/lib/general/education";
import { GAMES } from "@/lib/games/catalog";
import { englishCategoryPath, englishToolPath, spanishToolPath } from "@/lib/route-slugs";
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

type SitemapEntry = {
  path: string;
  priority: string;
  alternates?: Array<{ lang: string; path: string }>;
};

const hreflangLinks = (entry: SitemapEntry) => {
  if (!entry.alternates?.length) return "";
  return entry.alternates
    .map(
      (alt) =>
        `<xhtml:link rel="alternate" hreflang="${escapeXml(alt.lang)}" href="${escapeXml(`${SITE_URL}${alt.path}`)}"/>`,
    )
    .join("");
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const hubPairs: SitemapEntry[] = [
          {
            path: "/",
            priority: "1.0",
            alternates: [
              { lang: "en", path: "/" },
              { lang: "es", path: "/es" },
              { lang: "x-default", path: "/" },
            ],
          },
          {
            path: "/es",
            priority: "1.0",
            alternates: [
              { lang: "en", path: "/" },
              { lang: "es", path: "/es" },
              { lang: "x-default", path: "/" },
            ],
          },
          {
            path: "/tools",
            priority: "0.9",
            alternates: [
              { lang: "en", path: "/tools" },
              { lang: "es", path: "/es/herramientas" },
              { lang: "x-default", path: "/tools" },
            ],
          },
          {
            path: "/es/herramientas",
            priority: "0.9",
            alternates: [
              { lang: "en", path: "/tools" },
              { lang: "es", path: "/es/herramientas" },
              { lang: "x-default", path: "/tools" },
            ],
          },
          {
            path: "/finance",
            priority: "0.9",
            alternates: [
              { lang: "en", path: "/finance" },
              { lang: "es", path: "/es/finanzas" },
              { lang: "x-default", path: "/finance" },
            ],
          },
          {
            path: "/es/finanzas",
            priority: "0.9",
            alternates: [
              { lang: "en", path: "/finance" },
              { lang: "es", path: "/es/finanzas" },
              { lang: "x-default", path: "/finance" },
            ],
          },
        ];

        const englishStatic: SitemapEntry[] = [
          { path: "/kits", priority: "0.9" },
          { path: "/hubs/documents-and-files", priority: "0.9" },
          { path: "/games", priority: "0.9" },
          { path: "/simulators", priority: "0.9" },
          { path: "/legal", priority: "0.3" },
          { path: "/privacy", priority: "0.3" },
          { path: "/contact", priority: "0.3" },
          ...WORK_KITS.map((kit) => {
            const enPath = `/kits/${kit.englishSlug}`;
            const esPath = `/es/kits/${kit.slug}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return { path: enPath, priority: "0.8", alternates };
          }),
          ...GAMES.map((game) => {
            const enPath = `/games/${game.slug}`;
            const esPath = `/es/juegos/${game.slugEs}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return { path: enPath, priority: "0.8", alternates };
          }),
          ...SIMULATORS.map((sim) => {
            const enPath = `/simulators/${sim.slug}`;
            const esPath = `/es/simuladores/${sim.slugEs}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return { path: enPath, priority: "0.8", alternates };
          }),
          ...ALL_CATEGORIES.map((category) => {
            const enPath = englishCategoryPath(category.slug);
            const esPath = `/es/categoria/${category.slug}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return {
              path: enPath,
              priority: category.slug === "educacion" ? "0.9" : "0.8",
              alternates,
            };
          }),
          ...EDUCATION_SUBJECTS.map(([slug]) => ({ path: `/education/${slug}`, priority: "0.8" })),
        ];

        const spanishStatic: SitemapEntry[] = [
          { path: "/es/kits", priority: "0.8" },
          { path: "/es/hubs/documentos-y-archivos", priority: "0.8" },
          { path: "/es/juegos", priority: "0.9" },
          { path: "/es/simuladores", priority: "0.9" },
          { path: "/es/aviso-legal", priority: "0.3" },
          { path: "/es/privacidad", priority: "0.3" },
          { path: "/es/contacto", priority: "0.3" },
          ...WORK_KITS.map((kit) => {
            const enPath = `/kits/${kit.englishSlug}`;
            const esPath = `/es/kits/${kit.slug}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return { path: esPath, priority: "0.8", alternates };
          }),
          ...GAMES.map((game) => {
            const enPath = `/games/${game.slug}`;
            const esPath = `/es/juegos/${game.slugEs}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return { path: esPath, priority: "0.8", alternates };
          }),
          ...SIMULATORS.map((sim) => {
            const enPath = `/simulators/${sim.slug}`;
            const esPath = `/es/simuladores/${sim.slugEs}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return { path: esPath, priority: "0.8", alternates };
          }),
          ...ALL_CATEGORIES.map((category) => {
            const enPath = englishCategoryPath(category.slug);
            const esPath = `/es/categoria/${category.slug}`;
            const alternates = [
              { lang: "en", path: enPath },
              { lang: "es", path: esPath },
              { lang: "x-default", path: enPath },
            ];
            return {
              path: esPath,
              priority: category.slug === "educacion" ? "0.9" : "0.8",
              alternates,
            };
          }),
        ];

        const toolEntries: SitemapEntry[] = ALL_TOOLS.flatMap((tool) => {
          const enPath = toolHref(tool);
          const esPath = spanishToolPath(tool);
          const alternates = [
            { lang: "en", path: enPath },
            { lang: "es", path: esPath },
            { lang: "x-default", path: enPath },
          ];
          return [
            { path: enPath, priority: "0.7", alternates },
            { path: esPath, priority: "0.7", alternates },
          ];
        });

        const paths = [...hubPairs, ...englishStatic, ...spanishStatic, ...toolEntries];
        const today = new Date().toISOString().slice(0, 10);
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${paths
          .map(
            (entry) =>
              `<url><loc>${escapeXml(`${SITE_URL}${entry.path}`)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${entry.priority}</priority>${hreflangLinks(entry)}</url>`,
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
