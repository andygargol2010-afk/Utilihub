import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolSearch } from "@/components/ToolSearch";
import { ALL_TOOLS } from "@/lib/all-tools";
import { absoluteUrl, ogImage } from "@/lib/seo";

export const Route = createFileRoute("/herramientas/")({
  head: () => ({
    meta: [
      { title: "Todas las herramientas online gratis | UtiliHub" },
      { name: "description", content: "Explora todas las herramientas gratuitas de UtiliHub: matemáticas, finanzas, conversores, texto, fechas, desarrollo, ciencia, educación y más." },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: "Todas las herramientas online gratis | UtiliHub" },
      { property: "og:description", content: "Explora calculadoras, conversores y utilidades gratuitas que funcionan directamente en el navegador." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/herramientas") },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/herramientas") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Todas las herramientas online gratis", url: absoluteUrl("/herramientas"), numberOfItems: ALL_TOOLS.length, isPartOf: { "@type": "WebSite", name: "UtiliHub", url: absoluteUrl("/") } }) }],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  const count = ALL_TOOLS.length;
  return <div className="container-page py-10"><Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Herramientas" }]} /><h1 className="mt-4 text-3xl font-bold sm:text-4xl">Todas las herramientas</h1><p className="mt-3 max-w-2xl text-muted-foreground">{count} utilidades gratuitas que funcionan en el navegador, sin registro ni instalación.</p><div className="mt-8"><ToolSearch /></div></div>;
}
