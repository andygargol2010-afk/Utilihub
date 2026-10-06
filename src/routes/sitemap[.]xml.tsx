import { createFileRoute } from "@tanstack/react-router";
import { ALL_CATEGORIES, ALL_TOOLS, toolHref } from "@/lib/all-tools";
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
  alternates?: Array<{ lang: string; path: string }>;
};

const pair = (enPath: string, esPath: string, priority: string): SitemapEntry[] => {
  const alternates = [
    { lang: "en", path: enPath },
    { lang: "es", path: esPath },
    { lang: "x-default", path: enPath },
  ];
  return [
    { path: enPath, priority, alternates },
    { path: esPath, priority, alternates },
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
          ...pair("/", "/es", "1.0"),
          ...pair("/tools", "/es/herramientas", "0.9"),
          ...pair("/finance", "/es/finanzas", "0.9"),
          ...pair("/kits", "/es/kits", "0.9"),
          ...pair("/hubs/documents-and-files", "/es/hubs/documentos-y-archivos", "0.9"),
          // Featured hubs: games + advanced sit at the top of discovery
          ...pair("/games", "/es/juegos", "0.95"),
          ...pair("/simulators", "/es/simuladores", "0.9"),
          ...pair("/legal", "/es/aviso-legal", "0.3"),
          ...pair("/privacy", "/es/privacidad", "0.3"),
          ...pair("/contact", "/es/contacto", "0.3"),
        ];

        const categoryPairs: SitemapEntry[] = ALL_CATEGORIES.flatMap((category) => {
          const enPath =
            category.slug === "finanzas" ? "/finance" : englishCategoryPath(category.slug);
          const esPath =
            category.slug === "finanzas" ? "/es/finanzas" : `/es/categoria/${category.slug}`;
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

        const toolEntries: SitemapEntry[] = ALL_TOOLS.flatMap((tool) => {
          const enPath = toolHref(tool);
          const esPath = spanishToolPath(tool);
          return pair(enPath, esPath, toolPriority(tool));
        });

        const paths = [
          ...hubPairs,
          ...categoryPairs,
          ...educationPairs,
          ...kitPairs,
          ...gamePairs,
          ...simPairs,
          ...toolEntries,
        ];

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
          paths
            .map(
              (entry) =>
                `<url><loc>${escapeXml(`${SITE_URL}${entry.path}`)}</loc>` +
                `<changefreq>weekly</changefreq><priority>${entry.priority}</priority>` +
                `${hreflangXml(entry)}</url>`,
            )
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
