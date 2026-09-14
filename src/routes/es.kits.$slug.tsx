import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { kitBySlug, kitTools } from "@/lib/work-kits";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

const KIT_ES: Record<string, { name: string; eyebrow: string; description: string; outcome: string }> = {
  freelancers: {
    name: "Kit para freelancers",
    eyebrow: "Trabajá y entregá mejor",
    description: "Prepará una entrega profesional: revisá texto, organizá archivos, ajustá imágenes y calculá montos.",
    outcome: "De una idea a una entrega clara lista para compartir.",
  },
  "seo-y-contenido": {
    name: "SEO y contenido",
    eyebrow: "Investigá y publicá",
    description: "Limpiá y prepará contenido para una página: extensión, URL, expresiones y markup más liviano.",
    outcome: "Contenido más claro, consistente y fácil de publicar.",
  },
  "preparar-documentos": {
    name: "Preparar documentos",
    eyebrow: "Antes de enviar",
    description: "Validá datos, convertí formatos y organizá PDFs e imágenes directamente en el navegador.",
    outcome: "Documentos más limpios y compatibles, listos para entregar.",
  },
  "archivos-y-formatos": {
    name: "Archivos y formatos",
    eyebrow: "Convertí sin subir archivos",
    description: "Resolvé las conversiones más comunes entre imágenes, PDF, datos y unidades de almacenamiento.",
    outcome: "El formato correcto para cada destino, con procesamiento local.",
  },
  "desarrollo-web": {
    name: "Desarrollo web",
    eyebrow: "Depurá y transformá datos",
    description: "Formateá, validá, codificá y transformá datos y snippets web sin salir del navegador.",
    outcome: "Datos legibles y formatos listos para integrar.",
  },
  estudiantes: {
    name: "Kit para estudiantes",
    eyebrow: "Estudiá con foco",
    description: "Resolvé cálculos, organizá fechas y prepará materiales de estudio con utilidades rápidas.",
    outcome: "Más tiempo para entender y menos en tareas repetitivas.",
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
        { rel: "alternate", hrefLang: "en", href: absoluteUrl(`/kits/${kit.slug}`) },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url, breadcrumb: breadcrumbSchema([{ name: "Inicio", path: "/es" }, { name: "Kits", path: "/es/kits" }, { name: es.name }]) }) }],
    };
  },
  component: SpanishKitPage,
});

function SpanishKitPage() {
  const { kit, tools } = Route.useLoaderData();
  const es = KIT_ES[kit.slug] ?? { name: kit.name, eyebrow: kit.eyebrow, description: kit.description, outcome: kit.outcome };
  return (
    <main className="container-page py-6 sm:py-8">
      <Breadcrumbs locale="es" items={[{ label: "Inicio", to: "/es" }, { label: "Kits", to: "/es/kits" }, { label: es.name }]} />
      <header className="mt-5 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{es.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{es.name}</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{es.description}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 className="size-4 text-primary" /> {es.outcome}
        </p>
      </header>
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
    </main>
  );
}
