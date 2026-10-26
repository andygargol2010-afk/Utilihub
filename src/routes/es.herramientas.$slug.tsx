import { createFileRoute, notFound } from "@tanstack/react-router";
import type { CatalogTool } from "@/lib/all-tools";
import { SpanishToolPage } from "./es.herramientas.$slug.page";

type ToolHead = {
  meta: Array<{ title?: string; name?: string; property?: string; content?: string }>;
  links?: Array<{ rel: string; href: string; hrefLang?: string }>;
  scripts?: Array<{ type: string; children: string }>;
};

export const Route = createFileRoute("/es/herramientas/$slug")({
  loader: async ({ params }) => {
    const { allToolBySlug } = await import("@/lib/all-tools");
    const tool = allToolBySlug(params.slug);
    if (!tool || tool.category === "finanzas") throw notFound();
    const { toolSeoOverride } = await import("@/lib/tool-seo-overrides");
    const override = toolSeoOverride(tool.slug);
    const { spanishCategoryName, spanishToolName } = await import("@/lib/i18n/es");
    const { hasToolShowcase } = await import("@/lib/showcase-slugs");
    const name = spanishToolName(tool);
    const categoryName = spanishCategoryName(tool.category);
    const seo = {
      metaTitleEs: override?.metaTitleEs,
      metaDescriptionEs: override?.metaDescriptionEs,
      faqEs: override?.faqEs ?? [],
    };
    const head = await buildSpanishToolHead(tool, name, categoryName, seo);
    return {
      tool,
      name,
      categoryName,
      showcase: hasToolShowcase(tool.slug),
      seo,
      head,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Herramienta no encontrada | UtiliHub" },
          { name: "robots", content: "noindex, nofollow" },
        ],
      };
    }
    return loaderData.head;
  },
  component: SpanishToolPage,
});

async function buildSpanishToolHead(
  tool: CatalogTool,
  name: string,
  category: string,
  seo: { metaTitleEs?: string; metaDescriptionEs?: string; faqEs: Array<{ q: string; a: string }> },
): Promise<ToolHead> {
  const { absoluteUrl, breadcrumbSchema, cleanDescription, faqSchema, ogImage, organizationSchema } = await import(
    "@/lib/seo",
  );
  const { englishToolPath } = await import("@/lib/route-slugs");
  const url = absoluteUrl(`/es/herramientas/${tool.slug}`);
  const title = seo.metaTitleEs ?? `${name} gratis online — ${category} | UtiliHub`;
  const description = cleanDescription(
    seo.metaDescriptionEs ??
      `${name}: herramienta gratuita de ${category.toLowerCase()}. Usala en el navegador, sin cuenta ni instalación. Resultados al instante en UtiliHub.`,
  );
  const englishUrl = absoluteUrl(englishToolPath(tool));
  const faqEs = seo.faqEs ?? [];
  const categoryPath = tool.category === "finanzas" ? "/es/finanzas" : `/es/categoria/${tool.category}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage() },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "es", href: url },
      { rel: "alternate", hrefLang: "en", href: englishUrl },
      { rel: "alternate", hrefLang: "x-default", href: englishUrl },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name,
              description,
              url,
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: organizationSchema(),
            },
            ...(faqEs.length ? [faqSchema(faqEs)] : []),
            breadcrumbSchema([
              { name: "Inicio", path: "/es" },
              { name: "Herramientas", path: "/es/herramientas" },
              { name: category, path: categoryPath },
              { name },
            ]),
          ],
        }),
      },
    ],
  };
}
