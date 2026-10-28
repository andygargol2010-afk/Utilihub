/**
 * Duplicate tools consolidated into one canonical URL (301s live in vercel.json).
 * The old tool stays in the catalog so ALL_TOOLS is unchanged, but internal links
 * and the sitemap point at the canonical tool instead.
 */
export const CANONICAL_TOOL_REDIRECTS: Record<string, { en: string; es: string; enSlug: string; esSlug: string }> = {
  imc: {
    en: "/tools/bmi-calculator",
    es: "/es/herramientas/calculadora-imc",
    enSlug: "bmi-calculator",
    esSlug: "calculadora-imc",
  },
  "tiempo-lectura": {
    en: "/tools/reading-time-calculator",
    es: "/es/herramientas/calculadora-tiempo-lectura",
    enSlug: "reading-time-calculator",
    esSlug: "calculadora-tiempo-lectura",
  },
};

export const isRedirectedToolSlug = (slug: string) => Object.hasOwn(CANONICAL_TOOL_REDIRECTS, slug);
