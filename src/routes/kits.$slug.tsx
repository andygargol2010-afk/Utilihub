import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { kitBySlug, kitTools } from "@/lib/work-kits";
import { toolHref } from "@/lib/all-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/kits/$slug")({
  loader: ({ params }) => { const kit = kitBySlug(params.slug); if (!kit) throw notFound(); return { kit, tools: kitTools(kit) }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Kit no encontrado | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { kit } = loaderData; const title = `${kit.name} | UtiliHub`; const description = cleanDescription(kit.description); const url = absoluteUrl(`/kits/${kit.slug}`);
    return { meta: [{ title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() }], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: title, description, url, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") }, breadcrumb: breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Kits de trabajo", path: "/kits" }, { name: kit.name }]) }) }] };
  },
  component: KitPage,
});

function KitPage() {
  const { kit, tools } = Route.useLoaderData();
  return <main className="container-page py-6 sm:py-8">
    <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Kits de trabajo", to: "/kits" }, { label: kit.name }]} />
    <header className="mt-5 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{kit.eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{kit.name}</h1><p className="mt-4 text-base leading-7 text-muted-foreground">{kit.description}</p><p className="mt-3 inline-flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="size-4 text-primary" /> {kit.outcome}</p></header>
    <section className="mt-8" aria-labelledby="kit-steps"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Recorrido recomendado</p><h2 id="kit-steps" className="mt-1 text-2xl font-black">Sigue estos pasos</h2></div><Link to="/herramientas" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">Ver todo el catálogo <ArrowRight className="size-4" /></Link></div><div className="mt-5 space-y-3">{tools.map((tool, index) => <div key={tool.slug} className="surface-card flex gap-4 p-4 sm:p-5"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">{index + 1}</span><div className="min-w-0 flex-1"><ToolCard tool={tool} /><Link to={toolHref(tool) as "/herramientas/$slug"} params={{ slug: tool.slug }} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">Abrir herramienta <ArrowRight className="size-4" /></Link></div></div>)}</div></section>
  </main>;
}
