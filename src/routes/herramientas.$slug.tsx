import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TOOL_UI } from "@/components/tools/registry";
import { GENERAL_TOOL_UI } from "@/components/general/registry";
import { ToolCard } from "@/components/ToolCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import { ALL_CATEGORIES, allToolBySlug, toolHref } from "@/lib/all-tools";
import { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, toolKeywords, toolPath, webApplicationSchema } from "@/lib/seo";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { journeyLabel, journeyTools } from "@/lib/discovery";
import { AdsterraBanner } from "@/components/AdsterraBanner";

export const Route = createFileRoute("/herramientas/$slug")({
  loader: ({ params }) => { const tool = allToolBySlug(params.slug); if (!tool) throw notFound(); return { tool }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tool not found | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { tool } = loaderData; const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
    if (!category) return { meta: [{ title: tool.title }, { name: "description", content: cleanDescription(tool.description) }, { name: "robots", content: "noindex" }] };
    const description = cleanDescription(tool.description); const url = absoluteUrl(toolPath(tool));
    return { meta: [{ title: tool.title }, { name: "description", content: description }, { name: "keywords", content: toolKeywords(tool).join(", ") }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: tool.title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:site_name", content: "UtiliHub" }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: tool.title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [webApplicationSchema(tool), ...(tool.faq?.length ? [faqSchema(tool.faq)] : []), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Tools", path: "/herramientas" }, { name: category.name, path: `/categoria/${category.slug}` }, { name: tool.name }])] }) }] };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const { addRecent } = useRecentTools();
  const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
  const related = journeyTools(tool);
  const nextStep = related[0];
  const ui = TOOL_UI[tool.slug] ?? GENERAL_TOOL_UI[tool.slug];
  useEffect(() => { addRecent(tool.slug); }, [addRecent, tool.slug]);
  if (!category) return <p className="container-page py-10">Tool not available.</p>;
  return <main className="container-page py-6 sm:py-8">
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Tools", to: "/herramientas" }, { label: category.name, to: "/categoria/$slug", params: { slug: category.slug } }, { label: tool.name }]} />
    <div className="mt-3 flex items-center justify-between gap-3"><div className="min-w-0"><h1 className="truncate text-2xl font-bold sm:text-3xl">{tool.name}</h1><p className="mt-1 max-w-2xl truncate text-sm text-muted-foreground">{tool.summary}</p></div><FavoriteButton slug={tool.slug} name={tool.name} /></div>
    <section data-tool-surface aria-label={`Tool: ${tool.name}`} className="surface-card mt-5 p-4 sm:p-5">{ui ? ui() : <p role="alert" className="text-muted-foreground">Tool not available.</p>}<div className="mt-4"><ShareAndExportActions title={tool.name} /></div></section>
    <AdsterraBanner />
    {nextStep && <section className="mt-5 rounded-2xl border border-primary/20 bg-accent/50 p-4 sm:p-5" aria-labelledby="next-step"><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Recommended next step</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><div><h2 id="next-step" className="text-base font-black">{journeyLabel(tool)}</h2><p className="mt-1 text-sm text-muted-foreground">After using {tool.name}, continue with {nextStep.name}.</p></div><Link to={toolHref(nextStep) as "/herramientas/$slug"} params={{ slug: nextStep.slug }} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90">Open next <ArrowRight className="size-4" /></Link></div></section>}
    {related.length > 0 && <section className="mt-8" aria-labelledby="related"><div className="mb-2 flex items-center justify-between"><div><h2 id="related" className="text-base font-bold">Continue this path</h2><p className="mt-1 text-xs text-muted-foreground">Tools selected to complete the same task.</p></div><span className="text-xs text-muted-foreground">{related.length} steps</span></div><div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">{related.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></section>}
    <ToolSeoContent tool={tool} />
  </main>;
}