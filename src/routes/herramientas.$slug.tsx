import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TOOL_UI } from "@/components/tools/registry";
import { GENERAL_TOOL_UI } from "@/components/general/registry";
import { ToolCard } from "@/components/ToolCard";
import { ALL_CATEGORIES, allToolBySlug, allToolsByCategory } from "@/lib/all-tools";
import { FavoriteButton } from "@/components/FavoriteButton";

export const Route = createFileRoute("/herramientas/$slug")({
  loader: ({ params }) => {
    const tool = allToolBySlug(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Herramienta no encontrada | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { tool } = loaderData;
    const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
    if (!category) return { meta: [{ title: tool.title }, { name: "description", content: tool.description }] };
    return {
      meta: [
        { title: tool.title },
        { name: "description", content: tool.description },
        { name: "keywords", content: tool.keywords.join(", ") },
        { property: "og:title", content: tool.title },
        { property: "og:description", content: tool.description },
      ],
      links: [{ rel: "canonical", href: `/herramientas/${tool.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebApplication", name: tool.name, description: tool.description, applicationCategory: "UtilityApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
            { "@type": "FAQPage", mainEntity: tool.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
            { "@type": "BreadcrumbList", itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
              { "@type": "ListItem", position: 2, name: "Herramientas", item: "/herramientas" },
              { "@type": "ListItem", position: 3, name: category.name, item: `/categoria/${category.slug}` },
              { "@type": "ListItem", position: 4, name: tool.name },
            ] },
          ],
        }),
      }],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
  const related = allToolsByCategory(tool.category).filter((t) => t.slug !== tool.slug);
  const ui = TOOL_UI[tool.slug] ?? GENERAL_TOOL_UI[tool.slug];

  if (!category) return <p className="container-page py-10">Herramienta no disponible.</p>;

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[
        { label: "Inicio", to: "/" },
        { label: "Herramientas", to: "/herramientas" },
        { label: category.name, to: "/categoria/$slug", params: { slug: category.slug } },
        { label: tool.name },
      ]} />
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-3xl font-bold sm:text-4xl">{tool.name}</h1><p className="mt-3 max-w-2xl text-muted-foreground">{tool.summary}</p></div>
        <FavoriteButton slug={tool.slug} name={tool.name} />
      </div>
      <section aria-label={`Herramienta: ${tool.name}`} className="surface-card mt-8 p-5 sm:p-7">
        {ui ? ui() : <p className="text-muted-foreground">Herramienta no disponible.</p>}
      </section>
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-10">
          <section><h2 className="text-2xl font-semibold">Cómo funciona</h2>{tool.about.map((p, i) => <p key={i} className="mt-3 leading-relaxed text-muted-foreground">{p}</p>)}</section>
          <section><h2 className="text-2xl font-semibold">Cómo usar {tool.name.toLowerCase()}</h2><ol className="mt-4 space-y-3">{tool.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{i + 1}</span><span className="text-muted-foreground">{s}</span></li>)}</ol></section>
          <section><h2 className="text-2xl font-semibold">Preguntas frecuentes</h2><dl className="mt-4 divide-y divide-border">{tool.faq.map((f) => <div key={f.q} className="py-4"><dt className="font-medium">{f.q}</dt><dd className="mt-1 text-muted-foreground">{f.a}</dd></div>)}</dl></section>
        </div>
        <aside className="space-y-4"><h2 className="text-lg font-semibold">Herramientas relacionadas</h2>{related.slice(0, 8).map((t) => <ToolCard key={t.slug} tool={t} />)}<a href={`/categoria/${category.slug}`} className="inline-block text-sm font-medium text-primary hover:underline">Ver toda la categoría {category.name} →</a></aside>
      </div>
    </div>
  );
}
