import { createFileRoute } from "@tanstack/react-router";
import type { ALL_TOOLS } from "@/lib/all-tools";
import { isRedirectedToolSlug } from "@/lib/canonical-tool-redirects";
import { EDUCATION_SUBJECTS } from "@/lib/general/education";
import { GAMES } from "@/lib/games/catalog";
import { englishCategoryPath, spanishToolPath } from "@/lib/route-slugs";
import { SITE_URL } from "@/lib/seo";
import { SIMULATORS } from "@/lib/simulators/catalog";
import { WORK_KITS } from "@/lib/work-kits";
import { escapeXml } from "./-sitemap[.]xml.part1";
import { type SitemapEntry, pair, BUILD_DAY, toolPriority, hreflangXml } from "./-sitemap[.]xml.part2";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Dynamic: keeps the catalog and SEO barrel out of the client entry chunk.
        const { ALL_CATEGORIES, ALL_TOOLS, toolHref } = await import("@/lib/all-tools");
        const { toolSeoOverride } = await import("@/lib/tool-seo-overrides");
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
          if (category.slug === "herramientas-avancadas") priority = "0.95";
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
          return pair(enPath, esPath, toolPriority(tool, toolSeoOverride));
        });

        // SEO locales: PT product-parity pages (not yet marked active until full bar).
        const seoLocaleEntries: SitemapEntry[] = [
          {
            path: "/pt",
            priority: "1.0",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt" },
              { lang: "en", path: "/" },
              { lang: "es", path: "/es" },
              { lang: "x-default", path: "/" },
            ],
          },
          {
            path: "/pt/ferramentas",
            priority: "0.9",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/ferramentas" },
              { lang: "en", path: "/tools" },
              { lang: "es", path: "/es/herramientas" },
              { lang: "x-default", path: "/tools" },
            ],
          },
          {
            path: "/pt/jogos",
            priority: "0.95",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/jogos" },
              { lang: "en", path: "/games" },
              { lang: "es", path: "/es/juegos" },
              { lang: "x-default", path: "/games" },
            ],
          },
          {
            path: "/pt/simuladores",
            priority: "0.9",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/simuladores" },
              { lang: "en", path: "/simulators" },
              { lang: "es", path: "/es/simuladores" },
              { lang: "x-default", path: "/simulators" },
            ],
          },
          {
            path: "/pt/privacidade",
            priority: "0.3",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/privacidade" },
              { lang: "en", path: "/privacy" },
              { lang: "es", path: "/es/privacidad" },
              { lang: "x-default", path: "/privacy" },
            ],
          },
          {
            path: "/pt/cookies",
            priority: "0.3",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/cookies" },
              { lang: "en", path: "/cookies" },
              { lang: "es", path: "/es/cookies" },
              { lang: "x-default", path: "/cookies" },
            ],
          },
          {
            path: "/pt/contato",
            priority: "0.3",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/contato" },
              { lang: "en", path: "/contact" },
              { lang: "es", path: "/es/contato" },
              { lang: "x-default", path: "/contact" },
            ],
          },
          {
            path: "/pt/sobre",
            priority: "0.3",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/sobre" },
              { lang: "en", path: "/about" },
              { lang: "es", path: "/es/sobre" },
              { lang: "x-default", path: "/about" },
            ],
          },
          {
            path: "/pt/playgrounds",
            priority: "0.9",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/playgrounds" },
              { lang: "en", path: "/playgrounds" },
              { lang: "es", path: "/es/playgrounds" },
              { lang: "x-default", path: "/playgrounds" },
            ],
          },
          {
            path: "/pt/kits",
            priority: "0.9",
            lastmod: BUILD_DAY,
            alternates: [
              { lang: "pt", path: "/pt/kits" },
              { lang: "en", path: "/kits" },
              { lang: "es", path: "/es/kits" },
              { lang: "x-default", path: "/kits" },
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
