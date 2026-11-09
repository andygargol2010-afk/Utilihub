// Part 2 of 3 — split from sitemap[.]xml.tsx on 2026-11-04. Edit here; sitemap[.]xml.tsx re-exports.
import type { ALL_TOOLS } from "@/lib/all-tools";
import { SITE_URL } from "@/lib/seo";
import { escapeXml } from "./-sitemap[.]xml.part1";

export type SitemapEntry = {
  path: string;
  priority: string;
  /** ISO date (YYYY-MM-DD). Only set when known real; never invent per-tool dates. */
  lastmod?: string;
  alternates?: Array<{ lang: string; path: string }>;
};

/** Build/deploy day for hub lastmod only (not individual tools). */
export const BUILD_DAY = new Date().toISOString().slice(0, 10);

export const pair = (
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

export const hreflangXml = (entry: SitemapEntry) => {
  if (!entry.alternates?.length) return "";
  return entry.alternates
    .map(
      (alt) =>
        `<xhtml:link rel="alternate" hreflang="${escapeXml(alt.lang)}" href="${escapeXml(`${SITE_URL}${alt.path}`)}"/>`,
    )
    .join("");
};

/** Higher priority for advanced tools, flagship 3D studios and tools with their own written content. */
export function toolPriority(
  tool: (typeof ALL_TOOLS)[number],
  toolSeoOverride: (slug: string) => unknown,
): string {
  if (tool.category === "herramientas-avanzadas") return "0.85";
  if (tool.slug === "modelador-casas-3d" || tool.slug === "modelador-3d") return "0.85";
  // Own about/steps/FAQ copy (tool-seo-overrides): prioritise over generic catalog pages.
  if (toolSeoOverride(tool.slug)) return "0.8";
  return "0.6";
}
