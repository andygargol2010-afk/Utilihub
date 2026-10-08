import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { DeferredToolSeo } from "@/components/DeferredToolSeo";
import { ALL_CATEGORIES, ALL_TOOLS, type CatalogTool } from "@/lib/all-tools";
import {
  toolByEnglishSlug,
  englishToolPath,
  englishCategorySlug,
  englishCategoryPath,
} from "@/lib/route-slugs";
import { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, toolKeywords, webApplicationSchema } from "@/lib/seo";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { DeferredShowcaseHero } from "@/components/DeferredShowcaseHero";
import { hasToolShowcase } from "@/lib/showcase-slugs";

export const Route = createFileRoute("/tools/$slug")({
  loader: async ({ params }) => {
    const tool = toolByEnglishSlug(ALL_TOOLS, params.slug);
    if (!tool) throw notFound();
    const { resolvedToolSeo } = await import("@/lib/tool-seo-overrides");
    const seo = resolvedToolSeo(tool);
    return {
      tool,
      seo: { title: seo.title, description: seo.description, faq: seo.faq },
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tool not found | UtiliHub" }, { name: "robots", content: "noindex, nofollow" }] };
    const { tool, seo } = loaderData;
    const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);
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
  },
  component: ToolPage,
});

function ToolPage() {
  const { tool } = Route.useLoaderData() as { tool: CatalogTool };
  const { addRecent } = useRecentTools();
  const category = ALL_CATEGORIES.find((c) => c.slug === tool.category);

  useEffect(() => {
    addRecent(tool.slug);
  }, [addRecent, tool.slug]);

  if (!category) return <p className="container-page py-10">Tool not available.</p>;

  const categoryPublicSlug = englishCategorySlug(category.slug);
  const showcase = hasToolShowcase(tool.slug);

  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Tools", to: "/tools" },
          { label: category.name, to: "/category/$slug", params: { slug: categoryPublicSlug } },
          { label: tool.name },
        ]}
      />
      {showcase ? (
        <DeferredShowcaseHero name={tool.name} slug={tool.slug} locale="en" />
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 max-w-2xl truncate text-sm text-muted-foreground">{tool.summary}</p>
          </div>
          <FavoriteButton slug={tool.slug} name={tool.name} />
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
          <ShareAndExportActions title={tool.name} />
        </div>
      </section>
      <AdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="en" />
      <DeferredToolSeo tool={tool} locale="en" />
    </div>
  );
}
