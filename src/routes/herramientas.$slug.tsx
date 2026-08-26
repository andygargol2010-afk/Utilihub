import { useEffect } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TOOL_UI } from "@/components/tools/registry";
import { GENERAL_TOOL_UI } from "@/components/general/registry";
import { ToolCard } from "@/components/ToolCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { ALL_CATEGORIES, allToolBySlug, allToolsByCategory } from "@/lib/all-tools";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, toolKeywords, webApplicationSchema } from "@/lib/seo";

export const Route = createFileRoute("/herramientas/$slug")({
  loader: ({ params }) => { const tool = allToolBySlug(params.slug); if (!tool) throw notFound(); return { tool }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Herramienta no encontrada | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { tool } = loaderData; const category = ALL_CATEGORIES.find((item) => item.slug === tool.category);
    if (!category) return { meta: [{ title: tool.title }, { name: "description", content: cleanDescription(tool.description) }, { name: "robots", content: "noindex" }] };
    const description = cleanDescription(tool.description), url = absoluteUrl(`/herramientas/${tool.slug}`);
    return { meta: [{ title: tool.title }, { name: "description", content: description }, { name: "keywords", content: toolKeywords(tool).join(", ") }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: tool.title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:site_name", content: "UtiliHub" }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: tool.title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [webApplicationSchema(tool), ...(tool.faq?.length ? [faqSchema(tool.faq)] : []), breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Herramientas", path: "/herramientas" }, { name: category.name, path: `/categoria/${category.slug}` }, { name: tool.name }])] }) }] };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const { record } = useRecentTools();
  const category = ALL_CATEGORIES.find((item) => item.slug === tool.category);
  const related = allToolsByCategory(tool.category).filter((item) => item.slug !== tool.slug).slice(0, 8);
  const ui = TOOL_UI[tool.slug] ?? GENERAL_TOOL_UI[tool.slug];
  useEffect(() => { record(tool); }, [record, tool]);
  if (!category) return <p className="container-page py-10">Herramienta no disponible.</p>;

  return <div className="container-page py-10">
    <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Herramientas", to: "/herramientas" }, { label: category.name, to: "/categoria/$slug", params: { slug: category.slug } }, { label: tool.name }]} />
    <div className="mt-4 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold sm:text-4xl">{tool.name}</h1><p className="mt-3 max-w-2xl text-muted-foreground">{tool.summary}</p></div><FavoriteButton slug={tool.slug} name={tool.name} /></div>
    <section data-tool-surface aria-label={`Herramienta: ${tool.name}`} className="surface-card mt-8 p-5 sm:p-7">{ui ? ui() : <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-muted-foreground">Esta herramienta no está disponible en este momento.</div>}<ShareAndExportActions title={tool.name} /></section>
    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><div className="space-y-10"><section><h2 className="text-2xl font-semibold">Cómo funciona</h2>{tool.about.map((paragraph, index) => <p key={index} className="mt-3 leading-relaxed text-muted-foreground">{paragraph}</p>)}</section><section><h2 className="text-2xl font-semibold">Cómo usar {tool.name.toLowerCase()}</h2><ol className="mt-4 space-y-3">{tool.steps.map((step, index) => <li key={index} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{index + 1}</span><span className="text-muted-foreground">{step}</span></li>)}</ol></section>{tool.faq?.length ? <section><h2 className="text-2xl font-semibold">Preguntas frecuentes</h2><dl className="mt-4 divide-y divide-border">{tool.faq.map((faq) => <div key={faq.q} className="py-4"><dt className="font-medium">{faq.q}</dt><dd className="mt-1 text-muted-foreground">{faq.a}</dd></div>)}</dl></section> : null}</div><aside className="space-y-4"><h2 className="text-lg font-semibold">Herramientas relacionadas</h2>{related.map((item) => <ToolCard key={item.slug} tool={item} />)}<a href={`/categoria/${category.slug}`} className="inline-block text-sm font-medium text-primary hover:underline">Ver toda la categoría {category.name} →</a></aside></div>
  </div>;
}
