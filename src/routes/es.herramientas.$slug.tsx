import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { ToolSeoContent } from "@/components/ToolSeoContent";
import { ToolCard } from "@/components/ToolCard";
import { allToolBySlug, ALL_CATEGORIES, type CatalogTool } from "@/lib/all-tools";
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
import { toolSeoOverride } from "@/lib/tool-seo-overrides";
import { journeyLabel, journeyTools } from "@/lib/discovery";
import { useRecentTools } from "@/hooks/use-recent-tools";
import { AdsterraBanner } from "@/components/AdsterraBanner";
import { ToolShowcaseHero } from "@/components/ToolShowcaseHero";
import { getToolShowcase } from "@/lib/tool-showcase";

export const Route = createFileRoute("/es/herramientas/$slug")({
  loader: ({ params }) => {
    const tool = allToolBySlug(params.slug);
    if (!tool || tool.category === "finanzas") throw notFound();
    return { tool };
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
    const { tool } = loaderData;
    const override = toolSeoOverride(tool.slug);
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

function NextStepLinkEs({ tool }: { tool: CatalogTool }) {
  const className =
    "inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90";
  if (tool.category === "finanzas") {
    return (
      <Link to="/es/finanzas/$slug" params={{ slug: tool.slug }} className={className}>
        Abrir siguiente <ArrowRight className="size-4" />
      </Link>
    );
  }
  return (
    <Link to="/es/herramientas/$slug" params={{ slug: tool.slug }} className={className}>
      Abrir siguiente <ArrowRight className="size-4" />
    </Link>
  );
}

function SpanishToolPage() {
  const { tool } = Route.useLoaderData();
  const { addRecent } = useRecentTools();
  const category = ALL_CATEGORIES.find((item) => item.slug === tool.category);
  const showcase = getToolShowcase(tool.slug);
  const name = spanishToolName(tool);
  const related = journeyTools(tool);
  const nextStep = related[0];
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
            label: category ? spanishCategoryName(category.slug) : "Categoría",
            to: category
              ? category.slug === "finanzas"
                ? "/es/finanzas"
                : "/es/categoria/$slug"
              : undefined,
            params:
              category && category.slug !== "finanzas" ? { slug: category.slug } : undefined,
          },
          { label: name },
        ]}
      />
      {showcase ? (
        <ToolShowcaseHero name={name} slug={tool.slug} showcase={showcase} locale="es" />
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
      {nextStep && (
        <section className="mt-5 rounded-2xl border border-primary/20 bg-accent/50 p-4 sm:p-5" aria-labelledby="next-step-es">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Siguiente paso recomendado</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="next-step-es" className="text-base font-black">
                {journeyLabel(tool, "es")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Después de usar {name}, continúa con {spanishToolName(nextStep)}.
              </p>
            </div>
            <NextStepLinkEs tool={nextStep} />
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="mt-8" aria-labelledby="related-es">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 id="related-es" className="text-base font-bold">
                Herramientas relacionadas
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">Mismo tipo de tarea, para seguir en el sitio.</p>
            </div>
            <span className="text-xs text-muted-foreground">{related.length}</span>
          </div>
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} locale="es" />
            ))}
          </div>
        </section>
      )}
      <ToolSeoContent tool={tool} locale="es" />
    </div>
  );
}
