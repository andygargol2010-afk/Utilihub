import { createFileRoute, notFound } from "@tanstack/react-router";
import { DeferredBreadcrumbs } from "@/components/DeferredBreadcrumbs";
import { DeferredFinancialUi } from "@/components/DeferredFinancialUi";
import { DeferredFavoriteButton } from "@/components/DeferredFavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredFinanceSeo } from "@/components/DeferredFinanceSeo";
import { financialToolBySlug } from "@/lib/financial-tools";
import { englishToolPath } from "@/lib/route-slugs";
import { absoluteUrl, cleanDescription, ogImage } from "@/lib/seo";
import { spanishToolName } from "@/lib/i18n/es";
import { DeferredAdsterraBanner } from "@/components/DeferredAdsterraBanner";

type FinanceSeoLiteEs = {
  metaTitleEs?: string;
  metaDescriptionEs?: string;
  introEs?: string;
  faqEs: Array<{ q: string; a: string }>;
};

export const Route = createFileRoute("/es/finanzas/$slug")({
  loader: async ({ params }) => {
    const tool = financialToolBySlug(params.slug);
    if (!tool) throw notFound();
    // Keep the SEO barrel off the route shell chunk.
    const { financeSeo } = await import("@/lib/finance-seo-content");
    const seo = financeSeo(tool.slug);
    return {
      tool,
      seo: {
        metaTitleEs: seo?.metaTitleEs,
        metaDescriptionEs: seo?.metaDescriptionEs,
        introEs: seo?.introEs,
        faqEs: seo?.faqEs ?? [],
      } satisfies FinanceSeoLiteEs,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Calculadora financiera no encontrada | UtiliHub" },
          { name: "robots", content: "noindex, nofollow" },
        ],
      };
    }
    const { tool, seo } = loaderData;
    const name = spanishToolName({ slug: tool.slug, name: tool.name });
    const url = absoluteUrl(`/es/finanzas/${tool.slug}`);
    const englishUrl = absoluteUrl(englishToolPath({ ...tool, category: "finanzas" }));
    const title = seo.metaTitleEs ?? `${name} gratis online | UtiliHub`;
    const description = cleanDescription(
      seo.metaDescriptionEs ??
        (tool.description?.trim()
          ? tool.description
          : `Calculadora financiera gratuita: ${name}. Analizá escenarios en el navegador, sin registro.`),
    );
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
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: englishUrl },
        { rel: "alternate", hrefLang: "x-default", href: englishUrl },
      ],
      scripts:
        seo.faqEs.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: seo.faqEs.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: { "@type": "Answer", text: item.a },
                  })),
                }),
              },
            ]
          : undefined,
    };
  },
  component: SpanishFinancialToolPage,
});

function SpanishFinancialToolPage() {
  const { tool, seo } = Route.useLoaderData();
  const name = spanishToolName({ slug: tool.slug, name: tool.name });

  const intro =
    seo.introEs ??
    tool.description ??
    "Calcula y analiza este escenario financiero directamente en tu navegador.";

  return (
    <main className="container-page py-10 sm:py-14">
      <DeferredBreadcrumbs
        locale="es"
        back={{ label: "Finanzas", to: "/es/finanzas" }}
        items={[
          { label: "Inicio", to: "/es" },
          { label: "Finanzas", to: "/es/finanzas" },
          { label: name },
        ]}
      />
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Calculadora financiera</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{name}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{intro}</p>
        </div>
        <DeferredFavoriteButton slug={tool.slug} name={name} locale="es" />
      </div>
      <section data-tool-surface className="surface-card mt-8 p-5 sm:p-7" aria-label={name}>
        <DeferredFinancialUi slug={tool.slug} locale="es" />
        <DeferredShareAndExport title={name} locale="es" />
      </section>
      <DeferredAdsterraBanner />
      <DeferredFinanceSeo tool={tool} locale="es" />
    </main>
  );
}
