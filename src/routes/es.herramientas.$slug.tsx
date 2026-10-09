import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { FavoriteButton } from "@/components/FavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredToolSeo } from "@/components/DeferredToolSeo";
import { ToolUiFallback } from "@/components/ToolUiFallback";
import { DeferredKitReturnRibbon } from "@/components/kits/DeferredKitReturnRibbon";
import type { CatalogTool } from "@/lib/all-tools";
import { recordRecentTool } from "@/hooks/use-recent-tools";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { DeferredShowcaseHero } from "@/components/DeferredShowcaseHero";

type ToolHead = {
  meta: Array<{ title?: string; name?: string; property?: string; content?: string }>;
  links?: Array<{ rel: string; href: string; hrefLang?: string }>;
  scripts?: Array<{ type: string; children: string }>;
};

export const Route = createFileRoute("/es/herramientas/$slug")({
  loader: async ({ params }) => {
    // Name dictionary, SEO helpers, and the showcase set stay off the route shell chunk.
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
  pendingComponent: SpanishToolRoutePending,
  pendingMs: 100,
  pendingMinMs: 0,
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

function SpanishToolRoutePending() {
  return (
    <div className="container-page py-6 sm:py-8" aria-busy="true">
      <div className="h-5 w-56 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-muted" />
      <p className="mt-1 h-5 w-48 max-w-full animate-pulse rounded bg-muted" />
      <section className="surface-card mt-4 min-h-72 p-4 sm:p-6" aria-label="Cargando herramienta">
        <ToolUiFallback locale="es" />
      </section>
    </div>
  );
}

function SpanishToolPage() {
  const { tool, name, categoryName, showcase } = Route.useLoaderData() as {
    tool: CatalogTool;
    name: string;
    categoryName: string;
    showcase: boolean;
  };
  const categorySlug = tool.category;
  useEffect(() => {
    recordRecentTool(tool.slug);
  }, [tool.slug]);
  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs
        locale="es"
        back={{
          label: categoryName,
          to: categorySlug === "finanzas" ? "/es/finanzas" : "/es/categoria/$slug",
          params: categorySlug === "finanzas" ? undefined : { slug: categorySlug },
        }}
        items={[
          { label: "Inicio", to: "/es" },
          { label: "Herramientas", to: "/es/herramientas" },
          {
            label: categoryName,
            to: categorySlug === "finanzas" ? "/es/finanzas" : "/es/categoria/$slug",
            params: categorySlug === "finanzas" ? undefined : { slug: categorySlug },
          },
          { label: name },
        ]}
      />
      <DeferredKitReturnRibbon toolSlug={tool.slug} locale="es" />
      {showcase ? (
        <DeferredShowcaseHero name={name} slug={tool.slug} locale="es" />
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {`Herramienta de ${categoryName.toLowerCase()}.`}
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
          <DeferredShareAndExport title={name} locale="es" />
        </div>
      </section>
      <AdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="es" />
      <DeferredToolSeo tool={tool} locale="es" />
    </div>
  );
}
