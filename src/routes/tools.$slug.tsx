import { createFileRoute, notFound } from "@tanstack/react-router";
import type { CatalogTool } from "@/lib/all-tools";
import { ToolPage } from "./tools.$slug.page";

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
