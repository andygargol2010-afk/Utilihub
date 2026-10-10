import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { DeferredBreadcrumbs } from "@/components/DeferredBreadcrumbs";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { DeferredFavoriteButton } from "@/components/DeferredFavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredToolSeo } from "@/components/DeferredToolSeo";
import { ToolUiFallback } from "@/components/ToolUiFallback";
import { DeferredKitReturnRibbon } from "@/components/kits/DeferredKitReturnRibbon";
import type { CatalogTool } from "@/lib/all-tools";
import { recordRecentTool } from "@/hooks/use-recent-tools";
import { DeferredAdsterraBanner } from "@/components/DeferredAdsterraBanner";
import { DeferredShowcaseHero } from "@/components/DeferredShowcaseHero";

type ToolHead = {
  meta: Array<{ title?: string; name?: string; property?: string; content?: string }>;
  links?: Array<{ rel: string; href: string; hrefLang?: string }>;
  scripts?: Array<{ type: string; children: string }>;
};

export const Route = createFileRoute("/tools/$slug")({
  loader: async ({ params }) => {
    // Catalog, slug helpers, SEO, and the showcase set stay off the route shell chunk.
    const { ALL_TOOLS, ALL_CATEGORIES } = await import("@/lib/all-tools");
    const { toolByEnglishSlug, englishToolPath, englishCategorySlug, englishCategoryPath } = await import(
      "@/lib/route-slugs",
    );
    const tool = toolByEnglishSlug(ALL_TOOLS, params.slug);
    if (!tool) throw notFound();
    const category = ALL_CATEGORIES.find((c) => c.slug === tool.category) ?? null;
    const { resolvedToolSeo } = await import("@/lib/tool-seo-overrides");
    const seo = resolvedToolSeo(tool);
    const { hasToolShowcase } = await import("@/lib/showcase-slugs");
    const categoryView = category ? { slug: category.slug, name: category.name } : null;
    const head = await buildEnglishToolHead(tool, categoryView, seo, englishToolPath, englishCategoryPath);
    return {
      tool,
      category: categoryView,
      categoryPublicSlug: category ? englishCategorySlug(category.slug) : null,
      showcase: hasToolShowcase(tool.slug),
      seo: { title: seo.title, description: seo.description, faq: seo.faq },
      head,
    };
  },
  // Catalog import blocks the real page. Paint a reserved shell instead of a blank route.
  pendingComponent: ToolRoutePending,
  pendingMs: 100,
  pendingMinMs: 0,
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tool not found | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    return loaderData.head;
  },
  component: ToolPage,
});

async function buildEnglishToolHead(
  tool: CatalogTool,
  category: { slug: string; name: string } | null,
  seo: { title?: string; description?: string; faq: Array<{ q: string; a: string }> },
  englishToolPath: (tool: Pick<CatalogTool, "name" | "category">) => string,
  englishCategoryPath: (internalCategorySlug: string) => string,
): Promise<ToolHead> {
  const { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, toolKeywords, webApplicationSchema } =
    await import("@/lib/seo");
  if (!category) {
    return {
      meta: [
        { title: tool.title },
        { name: "description", content: cleanDescription(tool.description) },
        { name: "robots", content: "noindex" },
      ],
    };
  }
  const title = seo.title ?? tool.title;
  const description = cleanDescription(seo.description ?? tool.description);
  const url = absoluteUrl(englishToolPath(tool));
  const esUrl = absoluteUrl(
    tool.category === "finanzas" ? `/es/finanzas/${tool.slug}` : `/es/herramientas/${tool.slug}`,
  );
  const categoryPath = englishCategoryPath(category.slug);
  const faq = seo.faq;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: toolKeywords(tool).join(", ") },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "UtiliHub" },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "en", href: url },
      { rel: "alternate", hrefLang: "es", href: esUrl },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            webApplicationSchema({ ...tool, description, title }),
            ...(faq.length ? [faqSchema(faq)] : []),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools" },
              { name: category.name, path: categoryPath },
              { name: tool.name },
            ]),
          ],
        }),
      },
    ],
  };
}

function ToolRoutePending() {
  return (
    <div className="container-page py-6 sm:py-8" aria-busy="true">
      <div className="h-5 w-56 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-muted" />
      <p className="mt-1 h-5 w-48 max-w-full animate-pulse rounded bg-muted" />
      <section className="surface-card mt-4 min-h-72 p-4 sm:p-6" aria-label="Loading tool">
        <ToolUiFallback locale="en" />
      </section>
    </div>
  );
}

function ToolPage() {
  const { tool, category, categoryPublicSlug, showcase } = Route.useLoaderData() as {
    tool: CatalogTool;
    category: { slug: string; name: string } | null;
    categoryPublicSlug: string | null;
    showcase: boolean;
  };

  useEffect(() => {
    recordRecentTool(tool.slug);
  }, [tool.slug]);

  if (!category || !categoryPublicSlug) return <p className="container-page py-10">Tool not available.</p>;

  return (
    <div className="container-page py-6 sm:py-8">
      <DeferredBreadcrumbs
        back={{
          label: category.name,
          to: "/category/$slug",
          params: { slug: categoryPublicSlug },
        }}
        items={[
          { label: "Home", to: "/" },
          { label: "Tools", to: "/tools" },
          { label: category.name, to: "/category/$slug", params: { slug: categoryPublicSlug } },
          { label: tool.name },
        ]}
      />
      <DeferredKitReturnRibbon toolSlug={tool.slug} locale="en" />
      {showcase ? (
        <DeferredShowcaseHero name={tool.name} slug={tool.slug} locale="en" />
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 max-w-2xl truncate text-sm text-muted-foreground">{tool.summary}</p>
          </div>
          <DeferredFavoriteButton slug={tool.slug} name={tool.name} />
        </div>
      )}
      <section
        data-tool-surface
        aria-label={`Tool: ${tool.name}`}
        className={`surface-card mt-4 p-4 sm:p-6 ${
          showcase ? "-mt-1 border-0 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5" : ""
        }`}
      >
        <DeferredToolUi slug={tool.slug} locale="en" />
        <div className="mt-4">
          <DeferredShareAndExport title={tool.name} />
        </div>
      </section>
      <DeferredAdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="en" />
      <DeferredToolSeo tool={tool} locale="en" />
    </div>
  );
}
