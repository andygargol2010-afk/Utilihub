import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { DeferredToolSeo } from "@/components/DeferredToolSeo";
import type { CatalogTool } from "@/lib/all-tools";
import { englishToolPath } from "@/lib/route-slugs";
import {
  absoluteUrl,
  breadcrumbSchema,
  cleanDescription,
  faqSchema,
  ogImage,
  organizationSchema,
} from "@/lib/seo";
import { spanishCategoryName, spanishToolName } from "@/lib/i18n/es";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { DeferredShowcaseHero } from "@/components/DeferredShowcaseHero";
import { hasToolShowcase } from "@/lib/showcase-slugs";

export const Route = createFileRoute("/es/herramientas/$slug")({
  loader: async ({ params }) => {
    // Catalog stays off the route shell chunk so hydration does not parse it.
    const { allToolBySlug } = await import("@/lib/all-tools");
    const tool = allToolBySlug(params.slug);
    if (!tool || tool.category === "finanzas") throw notFound();
    const { toolSeoOverride } = await import("@/lib/tool-seo-overrides");
    const override = toolSeoOverride(tool.slug);
    return {
      tool,
      seo: {
        metaTitleEs: override?.metaTitleEs,
        metaDescriptionEs: override?.metaDescriptionEs,
        faqEs: override?.faqEs ?? [],
      },
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
    const { tool, seo } = loaderData;
    const override = seo;
    const url = absoluteUrl(`/es/herramientas/${tool.slug}`);
    const name = spanishToolName(tool);
    const category = spanishCategoryName(tool.category);
    const title =
      override?.metaTitleEs ?? `${name} gratis online — ${category} | UtiliHub`;
    const description = cleanDescription(
      override?.metaDescriptionEs ??
        `${name}: herramienta gratuita de ${category.toLowerCase()}. Usala en el navegador, sin cuenta ni instalación. Resultados al instante en UtiliHub.`,
    );
    const englishUrl = absoluteUrl(englishToolPath(tool));
    const faqEs = override?.faqEs ?? [];
    const categoryPath =
      tool.category === "finanzas" ? "/es/finanzas" : `/es/categoria/${tool.category}`;
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
                { name: name },
              ]),
            ],
          }),
        },
      ],
    };
  },
  component: SpanishToolPage,
});

function SpanishToolPage() {
  const { tool } = Route.useLoaderData() as { tool: CatalogTool };
  const { addRecent } = useRecentTools();
  const categorySlug = tool.category;
  const showcase = hasToolShowcase(tool.slug);
  const name = spanishToolName(tool);
  useEffect(() => {
    addRecent(tool.slug);
  }, [addRecent, tool.slug]);
  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs
        locale="es"
        items={[
          { label: "Inicio", to: "/es" },
          { label: "Herramientas", to: "/es/herramientas" },
          {
            label: spanishCategoryName(categorySlug),
            to: categorySlug === "finanzas" ? "/es/finanzas" : "/es/categoria/$slug",
            params: categorySlug === "finanzas" ? undefined : { slug: categorySlug },
          },
          { label: name },
        ]}
      />
      {showcase ? (
        <DeferredShowcaseHero name={name} slug={tool.slug} locale="es" />
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {`Herramienta de ${spanishCategoryName(tool.category).toLowerCase()}.`}
            </p>
          </div>
          <FavoriteButton slug={tool.slug} name={name} locale="es" />
        </div>
      )}
      <section
        data-tool-surface
        aria-label={`Herramienta: ${name}`}
        className={`surface-card mt-4 p-4 sm:p-6 ${
          showcase ? "-mt-1 border-0 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5" : ""
        }`}
      >
        <DeferredToolUi slug={tool.slug} locale="es" />
        <div className="mt-4">
          <ShareAndExportActions title={name} locale="es" />
        </div>
      </section>
      <AdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="es" />
      <DeferredToolSeo tool={tool} locale="es" />
    </div>
  );
}
