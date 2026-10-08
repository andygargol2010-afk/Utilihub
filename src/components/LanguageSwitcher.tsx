import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { englishCategorySlug, internalCategorySlugFromEnglish } from "@/lib/route-slugs";

/** Tools that own a persistent WebGL context. Soft SPA locale switches can race
 *  with Three.js dispose/re-init and hit the error boundary even though a hard
 *  reload of the same URL works. Force a full navigation for these paths. */
const HARD_NAV_PATH_PREFIXES = [
  "/tools/3d-house-modeler",
  "/es/herramientas/modelador-casas-3d",
  "/tools/3d-modeler",
  "/es/herramientas/modelador-3d",
];

function needsHardNav(pathname: string) {
  return HARD_NAV_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

type Locale = "en" | "es";

/** Prefix rules that do not need the tool, game, or simulator catalogs. */
function staticEquivalent(pathname: string, targetLocale: Locale): string | null {
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

function lookupFallback(pathname: string, targetLocale: Locale) {
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

async function resolveCatalogPath(pathname: string, targetLocale: Locale): Promise<string> {
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

export function LanguageSwitcher({ locale, onClick }: { locale: "en" | "es"; onClick?: () => void }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const targetLocale: Locale = locale === "en" ? "es" : "en";
  const staticTarget = staticEquivalent(pathname, targetLocale);
  const [target, setTarget] = useState(staticTarget ?? lookupFallback(pathname, targetLocale));

  useEffect(() => {
    if (staticTarget) {
      setTarget(staticTarget);
      return;
    }
    let cancelled = false;
    setTarget(lookupFallback(pathname, targetLocale));
    void resolveCatalogPath(pathname, targetLocale).then((href) => {
      if (!cancelled) setTarget(href);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, staticTarget, targetLocale]);

  const hard = needsHardNav(pathname);
  const label = locale === "en" ? "Español" : "English";
  const aria = locale === "en" ? "Ver UtiliHub en español" : "View UtiliHub in English";
  const className =
    "ml-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/15";

  if (hard || staticTarget == null) {
    return (
      <a
        href={target}
        onClick={(event) => {
          onClick?.();
          if (staticTarget) return;
          if (target !== lookupFallback(pathname, targetLocale)) return;
          event.preventDefault();
          void resolveCatalogPath(pathname, targetLocale).then((href) => {
            window.location.assign(href);
          });
        }}
        aria-label={aria}
        className={className}
      >
        {label}
      </a>
    );
  }

  return (
    <Link to={target as never} onClick={onClick} aria-label={aria} className={className}>
      {label}
    </Link>
  );
}
