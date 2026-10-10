import { lazy, Suspense } from "react";
import { createFileRoute, notFound, redirect, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { LEGACY_CATEGORY_REDIRECTS } from "@/lib/category-catalog";
import { englishCategorySlug, englishToolSlug, internalCategorySlugFromEnglish } from "@/lib/route-slugs";
import { absoluteUrl, breadcrumbSchema, cleanDescription, hreflangLinks, ogImage } from "@/lib/seo";
import type { CatalogTool } from "@/lib/all-tools";

const ToolListBrowser = lazy(() =>
  import("@/components/ToolListBrowser").then((m) => ({ default: m.ToolListBrowser })),
);

type CategoryPayload = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
};

type Neighbor = { slug: string; name: string };

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const legacy = LEGACY_CATEGORY_REDIRECTS[params.slug];
    const internalSlug = internalCategorySlugFromEnglish(params.slug);
    const canonicalSlug = englishCategorySlug(legacy ?? internalSlug);
    if (params.slug !== canonicalSlug)
      throw redirect({ to: "/category/$slug", params: { slug: canonicalSlug }, statusCode: 301 });
    // Catalog stays off the listing route chunk so hydration does not parse it.
    const { ALL_CATEGORIES, allCategoryBySlug, allToolsByCategory } = await import("@/lib/all-tools");
    const category = allCategoryBySlug(internalSlug);
    if (!category) throw notFound();
    const neighboring = ALL_CATEGORIES.filter((item) => item.slug !== category.slug)
      .slice(0, 4)
      .map((item) => ({ slug: item.slug, name: item.name }));
    return { category, tools: allToolsByCategory(category.slug), neighboring };
  },
  pendingComponent: CategoryRoutePending,
  pendingMs: 100,
  pendingMinMs: 0,
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Category not found | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { category } = loaderData;
    const publicSlug = englishCategorySlug(category.slug);
    const description = cleanDescription(category.description);
    const enPath = `/category/${publicSlug}`;
    const esPath =
      category.slug === "finanzas" ? "/es/finanzas" : `/es/categoria/${category.slug}`;
    const url = absoluteUrl(enPath);
    const itemList = loaderData.tools.slice(0, 50).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: absoluteUrl(
        tool.category === "finanzas"
          ? `/finance/${englishToolSlug(tool)}`
          : `/tools/${englishToolSlug(tool)}`,
      ),
    }));
    return {
      meta: [
        { title: category.title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: category.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "UtiliHub" },
        { property: "og:image", content: ogImage() },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks(enPath, esPath)],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                name: category.name,
                description,
                url,
                isPartOf: { "@type": "WebSite", name: "UtiliHub", url: absoluteUrl("/") },
              },
              { "@type": "ItemList", name: `${category.name} on UtiliHub`, itemListElement: itemList },
              breadcrumbSchema([
                { name: "Home", path: "/" },
                { name: "Tools", path: "/tools" },
                { name: category.name },
              ]),
            ],
          }),
        },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryRoutePending() {
  return (
    <div className="container-page py-6 sm:py-8" aria-busy="true">
      <div className="h-5 w-40 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-56 max-w-full animate-pulse rounded bg-muted" />
      <p className="mt-2 h-5 w-72 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-5 min-h-72 rounded-xl border border-border/70 bg-card" />
    </div>
  );
}

function CategoryListingSlot() {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="h-12 rounded-xl border border-border/70 bg-card" />
      <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="flex min-h-14 items-center gap-3 px-1 py-2 sm:min-h-16" aria-hidden>
            <div className="size-9 shrink-0 rounded-lg bg-accent" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-4 w-2/5 max-w-xs rounded bg-muted" />
              <div className="h-3 w-3/5 max-w-md rounded bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryPage() {
  const { category, tools, neighboring } = Route.useLoaderData() as {
    category: CategoryPayload;
    tools: CatalogTool[];
    neighboring: Neighbor[];
  };
  const browseItems = tools.map((t) => ({
    ...t,
    id: t.slug,
    searchText: `${t.summary} ${t.description ?? ""} ${(t.keywords ?? []).join(" ")}`,
  }));

  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Tools", to: "/tools" }, { label: category.name }]}
      />
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{category.intro}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">{tools.length} tools</span>
      </div>

      <div className="mt-5">
        <Suspense fallback={<CategoryListingSlot />}>
          <ToolListBrowser
            tools={browseItems}
            locale="en"
            categorySlug={category.slug}
            searchPlaceholder={`Search in ${category.name}…`}
            renderItem={(tool) => <ToolCard tool={tool} />}
          />
        </Suspense>
      </div>

      <section className="mt-8 border-t border-border/70 pt-6" aria-labelledby="other-categories">
        <h2 id="other-categories" className="text-base font-bold">
          You can also explore
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {neighboring.map((item) => (
            <Link
              key={item.slug}
              to="/category/$slug"
              params={{ slug: englishCategorySlug(item.slug) }}
              className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary/40 hover:bg-accent"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
