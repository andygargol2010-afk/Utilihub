import { createFileRoute } from "@tanstack/react-router";
import { ALL_CATEGORIES, ALL_TOOLS, toolHref } from "@/lib/all-tools";
import { isRedirectedToolSlug } from "@/lib/canonical-tool-redirects";
import { EDUCATION_SUBJECTS } from "@/lib/general/education";
import { GAMES } from "@/lib/games/catalog";
import { englishCategoryPath, spanishToolPath } from "@/lib/route-slugs";
import { SITE_URL } from "@/lib/seo";
import { SIMULATORS } from "@/lib/simulators/catalog";
import { WORK_KITS } from "@/lib/work-kits";

/** Escape XML special chars without embedding &entity; literals that get mangled by some editors. */
const escapeXml = (value: string) => {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === "&") out += "&" + "amp;";
    else if (c === "<") out += "&" + "lt;";
    else if (c === ">") out += "&" + "gt;";
    else if (c === '"') out += "&" + "quot;";
    else if (c === "'") out += "&" + "apos;";
    else out += c;
  }
  return out;
};

type SitemapEntry = {
  path: string;
  priority: string;
  /** ISO date (YYYY-MM-DD). Only set when known real; never invent per-tool dates. */
  lastmod?: string;
  alternates?: Array<{ lang: string; path: string }>;
};

/** Build/deploy day for hub lastmod only (not individual tools). */
const BUILD_DAY = new Date().toISOString().slice(0, 10);

const pair = (
  enPath: string,
  esPath: string,
  priority: string,
  opts?: { lastmod?: string },
): SitemapEntry[] => {
  const alternates = [
    { lang: "en", path: enPath },
    { lang: "es", path: esPath },
    { lang: "x-default", path: enPath },
  ];
  return [
    { path: enPath, priority, lastmod: opts?.lastmod, alternates },
    { path: esPath, priority, lastmod: opts?.lastmod, alternates },
  ];
};

const hreflangXml = (entry: SitemapEntry) => {
  if (!entry.alternates?.length) return "";
  return entry.alternates
    .map(
      (alt) =>
        `<xhtml:link rel="alternate" hreflang="${escapeXml(alt.lang)}" href="${escapeXml(`${SITE_URL}${alt.path}`)}"/>`,
    )
    .join("");
};

/** Higher priority for advanced tools and flagship 3D studios. */
function toolPriority(tool: (typeof ALL_TOOLS)[number]): string {
  if (tool.category === "herramientas-avanzadas") return "0.85";
  if (tool.slug === "modelador-casas-3d" || tool.slug === "modelador-3d") return "0.85";
  return "0.7";
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const hubPairs: SitemapEntry[] = [
          ...pair("/", "/es", "1.0", { lastmod: BUILD_DAY }),
          ...pair("/tools", "/es/herramientas", "0.9", { lastmod: BUILD_DAY }),
          ...pair("/finance", "/es/finanzas", "0.9", { lastmod: BUILD_DAY }),
          ...pair("/kits", "/es/kits", "0.9", { lastmod: BUILD_DAY }),
          ...pair("/hubs/documents-and-files", "/es/hubs/documentos-y-archivos", "0.9", {
            lastmod: BUILD_DAY,
          }),
          ...pair("/games", "/es/juegos", "0.95", { lastmod: BUILD_DAY }),
          ...pair("/simulators", "/es/simuladores", "0.9", { lastmod: BUILD_DAY }),
          ...pair("/experiences", "/es/experiences", "0.92", { lastmod: BUILD_DAY }),
          ...pair("/legal", "/es/aviso-legal", "0.3", { lastmod: BUILD_DAY }),
          ...pair("/privacy", "/es/privacidad", "0.3", { lastmod: BUILD_DAY }),
          ...pair("/terms", "/es/terminos", "0.3", { lastmod: BUILD_DAY }),
          ...pair("/contact", "/es/contacto", "0.3", { lastmod: BUILD_DAY }),
        ];

        // Canonical ES paths under /es/guias/… (not /es/guides/…)
        const guidePairs: SitemapEntry[] = [
          ...pair("/guides/compound-interest", "/es/guias/interes-compuesto", "0.75", {
            lastmod: BUILD_DAY,
          }),
          ...pair("/guides/particle-physics", "/es/guias/fisica-particulas", "0.75", {
            lastmod: BUILD_DAY,
          }),
          ...pair(
            "/guides/canvas-webgl-performance",
            "/es/guias/rendimiento-canvas-webgl",
            "0.75",
            { lastmod: BUILD_DAY },
          ),
          ...pair("/guides/n-body-gravity", "/es/guias/n-body-gravity", "0.75", {
            lastmod: BUILD_DAY,
          }),
        ];

        // Finance hubs already listed above — skip slug "finanzas" to avoid duplicate loc.
        const categoryPairs: SitemapEntry[] = ALL_CATEGORIES.filter(
          (category) => category.slug !== "finanzas",
        ).flatMap((category) => {
          const enPath = englishCategoryPath(category.slug);
          const esPath = `/es/categoria/${category.slug}`;
          let priority = "0.8";
          if (category.slug === "herramientas-avanzadas") priority = "0.95";
          else if (category.slug === "educacion") priority = "0.9";
          return pair(enPath, esPath, priority);
        });

        const educationPairs: SitemapEntry[] = EDUCATION_SUBJECTS.flatMap(([slug]) =>
          pair(`/education/${slug}`, `/es/educacion/${slug}`, "0.8"),
        );

        const kitPairs: SitemapEntry[] = WORK_KITS.flatMap((kit) =>
          pair(`/kits/${kit.englishSlug}`, `/es/kits/${kit.slug}`, "0.8"),
        );

        const gamePairs: SitemapEntry[] = GAMES.flatMap((game) =>
          pair(`/games/${game.slug}`, `/es/juegos/${game.slugEs}`, "0.85"),
        );

        const simPairs: SitemapEntry[] = SIMULATORS.flatMap((sim) =>
          pair(`/simulators/${sim.slug}`, `/es/simuladores/${sim.slugEs}`, "0.8"),
        );

        // No lastmod on tools unless we have a real content-updated timestamp (we don't).
        // Consolidated duplicates 301 to their canonical tool; list only the canonical URL.
        const toolEntries: SitemapEntry[] = ALL_TOOLS.flatMap((tool) => {
          if (isRedirectedToolSlug(tool.slug)) return [];
          const enPath = toolHref(tool);
          const esPath = spanishToolPath(tool);
          return pair(enPath, esPath, toolPriority(tool));
        });

        const seoLocaleEntries: SitemapEntry[] = [
          {
            path: "/pt",
            priority: "0.9",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt" },
              { lang: "es", path: "/es" },
              { lang: "en", path: "/" },
              { lang: "x-default", path: "/" },
            ],
          },
          {
            path: "/pt/pulse-catch",
            priority: "0.8",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/pulse-catch" },
              { lang: "es", path: "/es/pulse-catch" },
              { lang: "en", path: "/pulse-catch" },
              { lang: "x-default", path: "/pulse-catch" },
            ],
          },
        ];

        const pathsRaw = [
          ...hubPairs,
          ...guidePairs,
          ...categoryPairs,
          ...educationPairs,
          ...kitPairs,
          ...gamePairs,
          ...simPairs,
          ...toolEntries,
          ...seoLocaleEntries,
        ];

        // Keep first occurrence of each path (canonical-only list).
        const seen = new Set<string>();
        const paths: SitemapEntry[] = [];
        for (const entry of pathsRaw) {
          if (seen.has(entry.path)) continue;
          seen.add(entry.path);
          paths.push(entry);
        }

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
          paths
            .map((entry) => {
              const lastmod =
                entry.lastmod != null
                  ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>`
                  : "";
              return (
                `<url><loc>${escapeXml(`${SITE_URL}${entry.path}`)}</loc>` +
                lastmod +
                `<changefreq>weekly</changefreq><priority>${entry.priority}</priority>` +
                `${hreflangXml(entry)}</url>`
              );
            })
            .join("") +
          `</urlset>`;

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
