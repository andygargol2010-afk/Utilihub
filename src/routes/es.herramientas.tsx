import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SpanishToolSearch } from "@/components/SpanishToolSearch";
import { ALL_TOOLS } from "@/lib/all-tools";
import { absoluteUrl, ogImage } from "@/lib/seo";

export const Route = createFileRoute("/es/herramientas")({
  head: () => ({
    meta: [
      { title: "Todas las herramientas online | UtiliHub" },
      { name: "description", content: "Explora todas las herramientas gratuitas de UtiliHub: matemáticas, finanzas, conversores, texto, fechas, desarrollo, ciencia y más." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Todas las herramientas online | UtiliHub" },
      { property: "og:description", content: "Calculadoras, conversores y utilidades gratuitas en español." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: absoluteUrl("/es/herramientas") },
      { property: "og:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/es/herramientas") },
      { rel: "alternate", hrefLang: "es", href: absoluteUrl("/es/herramientas") },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl("/tools") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/tools") },
    ],
  }),
  component: SpanishToolsIndex,
});

function SpanishToolsIndex() {
  const pathname = useLocation({ select: (location) => location.pathname });
  if (pathname !== "/es/herramientas") return <Outlet />;
  return <div className="container-page py-10"><Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Herramientas" }]} /><h1 className="mt-4 text-3xl font-bold sm:text-4xl">Todas las herramientas</h1><p className="mt-3 max-w-2xl text-muted-foreground">{ALL_TOOLS.length} herramientas gratuitas que funcionan directamente en el navegador, sin registro ni instalación.</p><div className="mt-8"><SpanishToolSearch /></div></div>;
}
