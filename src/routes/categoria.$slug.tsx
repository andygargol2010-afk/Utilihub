import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { ALL_CATEGORIES, allCategoryBySlug, allToolsByCategory } from "@/lib/all-tools";
import { LEGACY_CATEGORY_REDIRECTS } from "@/lib/category-catalog";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage } from "@/lib/seo";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => { const canonical = LEGACY_CATEGORY_REDIRECTS[params.slug]; if (canonical && canonical !== params.slug) throw redirect({ to: "/categoria/$slug", params: { slug: canonical }, statusCode: 301 }); const category = allCategoryBySlug(params.slug); if (!category) throw notFound(); return { category, tools: allToolsByCategory(category.slug) }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Categoría no encontrada | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { category } = loaderData; const description = cleanDescription(category.description); const url = absoluteUrl(`/categoria/${category.slug}`);
    return { meta: [{ title: category.title }, { name: "description", content: description }, { name: "robots", content: "index, follow, max-image-preview:large" }, { property: "og:title", content: category.title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:site_name", content: "UtiliHub" }, { property: "og:image", content: ogImage() }, { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: category.title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() }], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: category.name, description, url, isPartOf: { "@type": "WebSite", name: "UtiliHub", url: absoluteUrl("/") } }, breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Herramientas", path: "/herramientas" }, { name: category.name }])] }) }] };
  },
  component: CategoryPage,
});

function CategoryPage() { const { category, tools } = Route.useLoaderData(); return <div className="container-page py-6 sm:py-8"><Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Herramientas", to: "/herramientas" }, { label: category.name }]} /><div className="mt-4 flex items-end justify-between gap-3"><div><h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1><p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{category.intro}</p></div><span className="shrink-0 text-xs font-semibold text-muted-foreground">{tools.length} herramientas</span></div><div className="mt-5 divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">{tools.map(t => <ToolCard key={t.slug} tool={t} />)}</div></div>; }
