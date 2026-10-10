import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { KitCarryBoard } from "@/components/kits/KitCarryBoard";
import { MarketStallBoard } from "@/components/kits/MarketStallBoard";
import { ToolCard } from "@/components/ToolCard";
import { spanishToolName } from "@/lib/i18n/es";
import { kitBySlug, kitTools, kitEnglishPath } from "@/lib/work-kits";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage } from "@/lib/seo";

const KIT_ES: Record<string, { name: string; eyebrow: string; description: string; outcome: string }> = {
  freelancers: {
    name: "Kit para freelancers",
    eyebrow: "Trabaj\u00e1 y entreg\u00e1 mejor",
    description: "Prepar\u00e1 una entrega profesional: revis\u00e1 texto, organiz\u00e1 archivos, ajust\u00e1 im\u00e1genes y calcul\u00e1 montos.",
    outcome: "De una idea a una entrega clara lista para compartir.",
  },
  "seo-y-contenido": {
    name: "SEO y contenido",
    eyebrow: "Investig\u00e1 y public\u00e1",
    description: "Limpi\u00e1 y prepar\u00e1 contenido para una p\u00e1gina: extensi\u00f3n, URL, expresiones y markup m\u00e1s liviano.",
    outcome: "Contenido m\u00e1s claro, consistente y f\u00e1cil de publicar.",
  },
  "preparar-documentos": {
    name: "Preparar documentos",
    eyebrow: "Antes de enviar",
    description: "Valid\u00e1 datos, convert\u00ed formatos y organiz\u00e1 PDFs e im\u00e1genes directamente en el navegador.",
    outcome: "Documentos m\u00e1s limpios y compatibles, listos para entregar.",
  },
  "archivos-y-formatos": {
    name: "Archivos y formatos",
    eyebrow: "Convert\u00ed sin subir archivos",
    description: "Resolv\u00e9 las conversiones m\u00e1s comunes entre im\u00e1genes, PDF, datos y unidades de almacenamiento.",
    outcome: "El formato correcto para cada destino, con procesamiento local.",
  },
  "desarrollo-web": {
    name: "Desarrollo web",
    eyebrow: "Depur\u00e1 y transform\u00e1 datos",
    description: "Formate\u00e1, valid\u00e1, codific\u00e1 y transform\u00e1 datos y snippets web sin salir del navegador.",
    outcome: "Datos legibles y formatos listos para integrar.",
  },
  estudiantes: {
    name: "Kit para estudiantes",
    eyebrow: "Estudi\u00e1 con foco",
    description: "Resolv\u00e9 c\u00e1lculos, organiz\u00e1 fechas y prepar\u00e1 materiales de estudio con utilidades r\u00e1pidas.",
    outcome: "M\u00e1s tiempo para entender y menos en tareas repetitivas.",
  },
  "puesto-de-feria": {
    name: "Puesto de feria",
    eyebrow: "D\u00eda de feria",
    description: "Organiz\u00e1 un d\u00eda de puesto: cartel de precios, cambio inicial, foto del puesto, enlace o QR y cierre de caja. Un tablero fijo, no un listado de herramientas.",
    outcome: "Puesto listo desde la apertura hasta el cierre de caja, en este navegador.",
  },
};

export const Route = createFileRoute("/es/kits/$slug")({
  loader: ({ params }) => {
    const kit = kitBySlug(params.slug);
    if (!kit) throw notFound();
    return { kit, tools: kitTools(kit) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Kit no encontrado | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { kit } = loaderData;
    const es = KIT_ES[kit.slug] ?? kit;
    const title = `${es.name} | UtiliHub`;
    const description = cleanDescription(es.description);
    const url = absoluteUrl(`/es/kits/${kit.slug}`);
    const enUrl = absoluteUrl(kitEnglishPath(kit));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage() },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: enUrl },
        { rel: "alternate", hrefLang: "x-default", href: enUrl },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url, breadcrumb: breadcrumbSchema([{ name: "Inicio", path: "/es" }, { name: "Kits", path: "/es/kits" }, { name: es.name }]) }) }],
    };
  },
  component: SpanishKitPage,
});

function SpanishKitPage() {
  const { kit, tools } = Route.useLoaderData();
  const esMeta = KIT_ES[kit.slug] ?? { name: kit.name, eyebrow: kit.eyebrow, description: kit.description, outcome: kit.outcome };
  const isMarketStall = kit.slug === "puesto-de-feria";
  return (
    <main className="container-page py-6 sm:py-8">
      <Breadcrumbs locale="es" items={[{ label: "Inicio", to: "/es" }, { label: "Kits", to: "/es/kits" }, { label: esMeta.name }]} />
      <header className="mt-5 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{esMeta.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{esMeta.name}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{esMeta.description}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 className="size-4 text-primary" /> {esMeta.outcome}
        </p>
      </header>
      {isMarketStall ? (
        <MarketStallBoard locale="es" />
      ) : (
        <>
          <KitCarryBoard
            locale="es"
            kitSlug={kit.slug}
            steps={tools.map((tool) => ({ slug: tool.slug, label: spanishToolName(tool) }))}
          />
          <section className="mt-8" aria-labelledby="kit-steps">
            <h2 id="kit-steps" className="text-base font-bold">Pasos del kit</h2>
            <div className="mt-3 divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} locale="es" />
              ))}
            </div>
            <Link to="/es/kits" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
              Ver todos los kits <ArrowRight className="size-4" />
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
