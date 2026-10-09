import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { ToolListBrowser } from "@/components/ToolListBrowser";
import { spanishCategoryName } from "@/lib/i18n/es";
import { englishCategoryPath } from "@/lib/route-slugs";
import { absoluteUrl, breadcrumbSchema, cleanDescription, hreflangLinks, ogImage } from "@/lib/seo";
import type { CatalogTool } from "@/lib/all-tools";

type CategoryPayload = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
};

type Neighbor = { slug: string };

export const Route = createFileRoute("/es/categoria/$slug")({
  loader: async ({ params }) => {
    const { ALL_CATEGORIES, allCategoryBySlug, allToolsByCategory } = await import("@/lib/all-tools");
    const category = allCategoryBySlug(params.slug);
    if (!category) throw notFound();
    const neighboring = ALL_CATEGORIES.filter((item) => item.slug !== category.slug)
      .slice(0, 4)
      .map((item) => ({ slug: item.slug }));
    return { category, tools: allToolsByCategory(category.slug), neighboring };
  },
  pendingComponent: SpanishCategoryRoutePending,
  pendingMs: 100,
  pendingMinMs: 0,
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Categoría no encontrada | UtiliHub" }, { name: "robots", content: "noindex" }] };
    const { category, tools } = loaderData;
    const name = spanishCategoryName(category.slug);
    const description = cleanDescription(
      `Herramientas gratuitas de ${name.toLowerCase()} para usar en el navegador. ${tools.length} utilidades sin registro.`,
    );
    const esPath = `/es/categoria/${category.slug}`;
    const enPath =
      category.slug === "finanzas" ? "/finance" : englishCategoryPath(category.slug);
    const url = absoluteUrl(esPath);
    return {
      meta: [
        { title: `${name} | UtiliHub` },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: name },
        { property: "og:description", content: description },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage() },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }, ...hreflangLinks(enPath, esPath)],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "CollectionPage", name, description, url },
              breadcrumbSchema([
                { name: "Inicio", path: "/es" },
                { name: "Herramientas", path: "/es/herramientas" },
                { name },
              ]),
            ],
          }),
        },
      ],
    };
  },
  component: SpanishCategoryPage,
});

function SpanishCategoryRoutePending() {
  return (
    <div className="container-page py-6 sm:py-8" aria-busy="true">
      <div className="h-5 w-40 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-56 max-w-full animate-pulse rounded bg-muted" />
      <p className="mt-2 h-5 w-72 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-5 min-h-72 rounded-xl border border-border/70 bg-card" />
    </div>
  );
}

function SpanishCategoryPage() {
  const { category, tools, neighboring } = Route.useLoaderData() as {
    category: CategoryPayload;
    tools: CatalogTool[];
    neighboring: Neighbor[];
  };
  const name = spanishCategoryName(category.slug);
  const browseItems = tools.map((t) => ({
    ...t,
    id: t.slug,
    searchText: `${t.summary} ${t.description ?? ""} ${(t.keywords ?? []).join(" ")}`,
  }));

  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs
        locale="es"
        items={[
          { label: "Inicio", to: "/es" },
          { label: "Herramientas", to: "/es/herramientas" },
          { label: name },
        ]}
      />
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Herramientas de {name.toLowerCase()} para usar directamente en el navegador.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
          {tools.length} herramientas
        </span>
      </div>

      <div className="mt-5">
        <ToolListBrowser
          tools={browseItems}
          locale="es"
          categorySlug={category.slug}
          searchPlaceholder={`Buscar en ${name}…`}
          renderItem={(tool) => <ToolCard tool={tool} locale="es" />}
        />
      </div>

      <section className="mt-8 border-t border-border/70 pt-6" aria-labelledby="other-categories">
        <h2 id="other-categories" className="text-base font-bold">
          También podés explorar
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {neighboring.map((item) => (
            <Link
              key={item.slug}
              to={item.slug === "finanzas" ? "/es/finanzas" : "/es/categoria/$slug"}
              params={item.slug === "finanzas" ? undefined : { slug: item.slug }}
              className="rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary/40 hover:bg-accent"
            >
              {spanishCategoryName(item.slug)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
