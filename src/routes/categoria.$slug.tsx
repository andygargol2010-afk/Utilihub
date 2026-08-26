import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { ALL_CATEGORIES, allCategoryBySlug, allToolsByCategory } from "@/lib/all-tools";
import { LEGACY_CATEGORY_REDIRECTS } from "@/lib/category-catalog";
import { absoluteUrl, breadcrumbSchema, cleanDescription, ogImage, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => { const canonical = LEGACY_CATEGORY_REDIRECTS[params.slug]; if (canonical && canonical !== params.slug) throw redirect({ to: "/categoria/$slug", params: { slug: canonical }, statusCode: 301 }); const category = allCategoryBySlug(params.slug); if (!category) throw notFound(); return { category, tools: allToolsByCategory(category.slug) }; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Categoría no encontrada | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { category } = loaderData; const description = cleanDescription(category.description); const url = absoluteUrl(`/categoria/${category.slug}`);
    return { meta: [
      { title: category.title }, { name: "description", content: description }, { name: "keywords", content: `${category.name}, herramientas de ${category.name.toLowerCase()}, utilidades online, ${SITE_NAME}` }, { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: category.title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { property: "og:url", content: url }, { property: "og:site_name", content: SITE_NAME }, { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" }, { name: "twitter:title", content: category.title }, { name: "twitter:description", content: description }, { name: "twitter:image", content: ogImage() },
    ], links: [{ rel: "canonical", href: url }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@graph": [
      { "@type": "CollectionPage", name: category.name, description, url, isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") } },
      breadcrumbSchema([{ name: "Inicio", path: "/" }, { name: "Herramientas", path: "/herramientas" }, { name: category.name }]),
    ] }) } ] };
  },
  component: CategoryPage,
});

function CategoryPage() { const { category, tools } = Route.useLoaderData(); return <div className="container-page py-10"><Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Herramientas", to: "/herramientas" }, { label: category.name }]} /><h1 className="mt-4 text-3xl font-bold sm:text-4xl">{category.name}</h1><p className="mt-3 max-w-2xl text-muted-foreground">{category.intro}</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map(t => <ToolCard key={t.slug} tool={t} />)}</div></div>; }
