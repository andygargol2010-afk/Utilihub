// Part 1 of 3 — split from LanguageSwitcher.tsx on 2026-11-04. Edit here; LanguageSwitcher.tsx re-exports.
import { englishCategorySlug, internalCategorySlugFromEnglish } from "@/lib/route-slugs";

/** Tools that own a persistent WebGL context. Soft SPA locale switches can race
 *  with Three.js dispose/re-init and hit the error boundary even though a hard
 *  reload of the same URL works. Force a full navigation for these paths. */
export const HARD_NAV_PATH_PREFIXES = [
  "/tools/3d-house-modeler",
  "/es/herramientas/modelador-casas-3d",
  "/tools/3d-modeler",
  "/es/herramientas/modelador-3d",
];

export function needsHardNav(pathname: string) {
  return HARD_NAV_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export type Locale = "en" | "es";

/** Prefix rules that do not need the tool, game, or simulator catalogs. */
export function staticEquivalent(pathname: string, targetLocale: Locale): string | null {
  if (targetLocale === "es") {
    if (pathname === "/") return "/es";
    if (pathname === "/tools" || pathname === "/herramientas") return "/es/herramientas";
    if (pathname === "/finance" || pathname === "/finanzas") return "/es/finanzas";
    if (pathname === "/kits") return "/es/kits";
    if (pathname.startsWith("/kits/")) return `/es/kits/${pathname.slice("/kits/".length)}`;
    if (pathname === "/hubs/documents-and-files" || pathname === "/hubs/documentos-y-archivos") {
      return "/es/hubs/documentos-y-archivos";
    }
    if (pathname.startsWith("/category/")) {
      return `/es/categoria/${internalCategorySlugFromEnglish(pathname.slice("/category/".length))}`;
    }
    if (pathname.startsWith("/education/")) return `/es/educacion/${pathname.slice("/education/".length)}`;
    if (pathname.startsWith("/educacion/")) return `/es/educacion/${pathname.slice("/educacion/".length)}`;
    if (pathname.startsWith("/tools/") || pathname.startsWith("/finance/")) return null;
    if (pathname === "/legal" || pathname === "/aviso-legal") return "/es/aviso-legal";
    if (pathname === "/privacy" || pathname === "/privacidad") return "/es/privacidad";
    if (pathname === "/contact" || pathname === "/contacto") return "/es/contacto";
    if (pathname === "/games") return "/es/juegos";
    if (pathname.startsWith("/games/")) return null;
    if (pathname === "/simulators") return "/es/simuladores";
    if (pathname.startsWith("/simulators/")) return null;
    return "/es";
  }

  if (pathname === "/es") return "/";
  if (pathname === "/es/herramientas") return "/tools";
  if (pathname === "/es/finanzas") return "/finance";
  if (pathname === "/es/kits") return "/kits";
  if (pathname.startsWith("/es/kits/")) return `/kits/${pathname.slice("/es/kits/".length)}`;
  if (pathname === "/es/hubs/documentos-y-archivos") return "/hubs/documents-and-files";
  if (pathname.startsWith("/es/categoria/")) {
    return `/category/${englishCategorySlug(pathname.slice("/es/categoria/".length))}`;
  }
  if (pathname.startsWith("/es/educacion/")) return `/education/${pathname.slice("/es/educacion/".length)}`;
  if (pathname.startsWith("/es/herramientas/") || pathname.startsWith("/es/finanzas/")) return null;
  if (pathname === "/es/aviso-legal" || pathname === "/aviso-legal") return "/legal";
  if (pathname === "/es/privacidad" || pathname === "/privacidad") return "/privacy";
  if (pathname === "/es/contacto" || pathname === "/contacto") return "/contact";
  if (pathname === "/es/juegos") return "/games";
  if (pathname.startsWith("/es/juegos/")) return null;
  if (pathname === "/es/simuladores") return "/simulators";
  if (pathname.startsWith("/es/simuladores/")) return null;
  return "/";
}
