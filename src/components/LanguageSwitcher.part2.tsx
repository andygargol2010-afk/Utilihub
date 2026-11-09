// Part 2 of 3 — split from LanguageSwitcher.tsx on 2026-11-04. Edit here; LanguageSwitcher.tsx re-exports.
import { type Locale } from "./LanguageSwitcher.part1";

export function lookupFallback(pathname: string, targetLocale: Locale) {
  if (pathname.startsWith("/tools/") || pathname.startsWith("/es/herramientas/")) {
    return targetLocale === "es" ? "/es/herramientas" : "/tools";
  }
  if (pathname.startsWith("/finance/") || pathname.startsWith("/es/finanzas/")) {
    return targetLocale === "es" ? "/es/finanzas" : "/finance";
  }
  if (pathname.startsWith("/games/") || pathname.startsWith("/es/juegos/")) {
    return targetLocale === "es" ? "/es/juegos" : "/games";
  }
  if (pathname.startsWith("/simulators/") || pathname.startsWith("/es/simuladores/")) {
    return targetLocale === "es" ? "/es/simuladores" : "/simulators";
  }
  return targetLocale === "es" ? "/es" : "/";
}

export async function resolveCatalogPath(pathname: string, targetLocale: Locale): Promise<string> {
  if (
    pathname.startsWith("/tools/") ||
    pathname.startsWith("/finance/") ||
    pathname.startsWith("/es/herramientas/") ||
    pathname.startsWith("/es/finanzas/")
  ) {
    const { ALL_TOOLS } = await import("@/lib/all-tools");
    const { toolByEnglishSlug, englishToolPath, spanishToolPath } = await import("@/lib/route-slugs");
    if (targetLocale === "es") {
      const slug = pathname.startsWith("/tools/")
        ? pathname.slice("/tools/".length)
        : pathname.slice("/finance/".length);
      const tool = toolByEnglishSlug(ALL_TOOLS, slug);
      return tool ? spanishToolPath(tool) : lookupFallback(pathname, targetLocale);
    }
    const slug = pathname.startsWith("/es/herramientas/")
      ? pathname.slice("/es/herramientas/".length)
      : pathname.slice("/es/finanzas/".length);
    const tool = ALL_TOOLS.find((item) => item.slug === slug);
    return tool ? englishToolPath(tool) : lookupFallback(pathname, targetLocale);
  }
  if (pathname.startsWith("/games/") || pathname.startsWith("/es/juegos/")) {
    const { gameBySlug } = await import("@/lib/games/catalog");
    if (targetLocale === "es") {
      const game = gameBySlug(pathname.slice("/games/".length), "en");
      return game ? `/es/juegos/${game.slugEs}` : "/es/juegos";
    }
    const game = gameBySlug(pathname.slice("/es/juegos/".length), "es");
    return game ? `/games/${game.slug}` : "/games";
  }
  if (pathname.startsWith("/simulators/") || pathname.startsWith("/es/simuladores/")) {
    const { simBySlug } = await import("@/lib/simulators/catalog");
    if (targetLocale === "es") {
      const sim = simBySlug(pathname.slice("/simulators/".length), "en");
      return sim ? `/es/simuladores/${sim.slugEs}` : "/es/simuladores";
    }
    const sim = simBySlug(pathname.slice("/es/simuladores/".length), "es");
    return sim ? `/simulators/${sim.slug}` : "/simulators";
  }
  return lookupFallback(pathname, targetLocale);
}
