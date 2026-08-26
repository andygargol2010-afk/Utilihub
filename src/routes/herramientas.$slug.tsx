import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TOOL_UI } from "@/components/tools/registry";
import { GENERAL_TOOL_UI } from "@/components/general/registry";
import { ToolCard } from "@/components/ToolCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { ToolResultGuide } from "@/components/ToolResultGuide";
import { ALL_CATEGORIES, allToolBySlug, allToolsByCategory } from "@/lib/all-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, toolKeywords, webApplicationSchema } from "@/lib/seo";
import { useRecentTools } from "@/hooks/use-recent-tools";

export const Route = createFileRoute("/herramientas/$slug")({
  loader: ({ params }) => { const tool = allToolBySlug(params.slug); if (!tool) throw notFound(); return { tool }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Herramienta no encontrada | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { tool } = loaderData; const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
    if (!category) return { meta: [{ title: tool.title }, { name: "description", content: cleanDescription(tool.description) }, { name: "robots", content: "noindex" }] };
    const description = cleanDescription(tool.description); const url = absoluteUrl(`/herramientas/${tool.slug}`);
    return { meta: [{ title: tool.title }, { name: "description", content: description }, { name: "keywords", content: toolKeywords(tool).join(", ") }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: tool.title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:site_name", content: "UtiliHub" }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: tool.title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [webApplicationSchema(tool), ...(tool.faq?.length ? [faqSchema(tool.faq)] : []), breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Herramientas", path: "/herramientas" }, { name: category.name, path: `/categoria/${category.slug}` }, { name: tool.name }])] }) }] };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const { addRecent } = useRecentTools();
  const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
  const related = allToolsByCategory(tool.category).filter((t) => t.slug !== tool.slug).slice(0, 8);
  const ui = TOOL_UI[tool.slug] ?? GENERAL_TOOL_UI[tool.slug];
  useEffect(() => { addRecent(tool.slug); }, [addRecent, tool.slug]);
  if (!category) return <p className="container-page py-10">Herramienta no disponible.</p>;
  return <div className="container-page py-10"><Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Herramientas", to: "/herramientas" }, { label: category.name, to: "/categoria/$slug", params: { slug: category.slug } }, { label: tool.name }]} />
    <div className="mt-4 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold sm:text-4xl">{tool.name}</h1><p className="mt-3 max-w-2xl text-muted-foreground">{tool.summary}</p></div><FavoriteButton slug={tool.slug} name={tool.name} /></div>
    <section data-tool-surface aria-label={`Herramienta: ${tool.name}`} className="surface-card mt-8 p-5 sm:p-7">{ui ? ui() : <p role="alert" className="text-muted-foreground">Herramienta no disponible.</p>}<div className="mt-5"><ToolResultGuide tool={tool} /></div><div className="mt-5"><ShareAndExportActions title={tool.name} /></div></section>
    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"><div className="space-y-10"><section><h2 className="text-2xl font-semibold">Cómo funciona</h2>{tool.about.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-muted-foreground">{p}</p>)}</section><section><h2 className="text-2xl font-semibold">Cómo usar {tool.name.toLowerCase()}</h2><ol className="mt-4 space-y-3">{tool.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{i + 1}</span><span className="text-muted-foreground">{s}</span></li>)}</ol></section>{tool.faq?.length ? <section><h2 className="text-2xl font-semibold">Preguntas frecuentes</h2><dl className="mt-4 divide-y divide-border">{tool.faq.map((f) => <div key={f.q} className="py-4"><dt className="font-medium">{f.q}</dt><dd className="mt-1 text-muted-foreground">{f.a}</dd></div>)}</dl></section> : null}</div><aside className="space-y-4"><h2 className="text-lg font-semibold">Herramientas relacionadas</h2>{related.map((t) => <ToolCard key={t.slug} tool={t} />)}<a href={`/categoria/${category.slug}`} className="inline-block text-sm font-medium text-primary hover:underline">Ver toda la categoría {category.name} →</a></aside></div>
  </div>;
}