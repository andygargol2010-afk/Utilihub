import { Link, useLocation } from "@tanstack/react-router";
import { ALL_TOOLS } from "@/lib/all-tools";
import { englishToolPath, toolByEnglishSlug, englishCategorySlug, internalCategorySlugFromEnglish } from "@/lib/route-slugs";
import { spanishToolPath } from "@/lib/i18n/es";

function equivalentPath(pathname: string, targetLocale: "en" | "es") {
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
      const publicSlug = pathname.slice("/category/".length);
      const internal = internalCategorySlugFromEnglish(publicSlug);
      return `/es/categoria/${internal}`;
    }
    if (pathname.startsWith("/tools/")) {
      const tool = toolByEnglishSlug(ALL_TOOLS, pathname.slice("/tools/".length));
      return tool ? spanishToolPath(tool) : "/es/herramientas";
    }
    if (pathname.startsWith("/finance/")) {
      const tool = toolByEnglishSlug(ALL_TOOLS, pathname.slice("/finance/".length));
      return tool ? spanishToolPath(tool) : "/es/finanzas";
    }
    if (pathname === "/legal" || pathname === "/aviso-legal") return "/es/aviso-legal";
    if (pathname === "/privacy" || pathname === "/privacidad") return "/es/privacidad";
    if (pathname === "/contact" || pathname === "/contacto") return "/es/contacto";
    return "/es";
  }

  if (pathname === "/es") return "/";
  if (pathname === "/es/herramientas") return "/tools";
  if (pathname === "/es/finanzas") return "/finance";
  if (pathname === "/es/kits") return "/kits";
  if (pathname.startsWith("/es/kits/")) return `/kits/${pathname.slice("/es/kits/".length)}`;
  if (pathname === "/es/hubs/documentos-y-archivos") return "/hubs/documents-and-files";
  if (pathname.startsWith("/es/categoria/")) {
    const internal = pathname.slice("/es/categoria/".length);
    return `/category/${englishCategorySlug(internal)}`;
  }
  if (pathname.startsWith("/es/herramientas/")) {
    const tool = ALL_TOOLS.find((item) => item.slug === pathname.slice("/es/herramientas/".length));
    return tool ? englishToolPath(tool) : "/tools";
  }
  if (pathname.startsWith("/es/finanzas/")) {
    const tool = ALL_TOOLS.find((item) => item.slug === pathname.slice("/es/finanzas/".length));
    return tool ? englishToolPath(tool) : "/finance";
  }
  if (pathname === "/es/aviso-legal" || pathname === "/aviso-legal") return "/legal";
  if (pathname === "/es/privacidad" || pathname === "/privacidad") return "/privacy";
  if (pathname === "/es/contacto" || pathname === "/contacto") return "/contact";
  return "/";
}

export function LanguageSwitcher({ locale, onClick }: { locale: "en" | "es"; onClick?: () => void }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const target = equivalentPath(pathname, locale === "en" ? "es" : "en");
  return (
    <Link
      to={target as never}
      onClick={onClick}
      aria-label={locale === "en" ? "Ver UtiliHub en español" : "View UtiliHub in English"}
      className="ml-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/15"
    >
      {locale === "en" ? "Español" : "English"}
    </Link>
  );
}
