import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FINANCIAL_UI_ES } from "@/components/financial/registry";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { financialToolBySlug } from "@/lib/financial-tools";
import { financeSeo } from "@/lib/finance-seo-content";
import { englishToolPath } from "@/lib/route-slugs";
import { absoluteUrl, cleanDescription, ogImage } from "@/lib/seo";
import { spanishToolName } from "@/lib/i18n/es";
import { AdsterraBanner } from "@/components/AdsterraBanner";

export const Route = createFileRoute("/es/finanzas/$slug")({
  loader: ({ params }) => {
    const tool = financialToolBySlug(params.slug);
    if (!tool) throw notFound();
    return { tool };
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
    const { tool } = loaderData;
    const seo = financeSeo(tool.slug);
    const name = spanishToolName({ slug: tool.slug, name: tool.name });
    const url = absoluteUrl(`/es/finanzas/${tool.slug}`);
    const englishUrl = absoluteUrl(englishToolPath({ ...tool, category: "finanzas" }));
    const title = seo?.metaTitleEs ?? `${name} gratis online | UtiliHub`;
    const description = cleanDescription(
      seo?.metaDescriptionEs ??
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
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: englishUrl },
        { rel: "alternate", hrefLang: "x-default", href: englishUrl },
      ],
      scripts:
        seo?.faqEs && seo.faqEs.length > 0
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
  component: SpanishFinanceTool,
});

function SpanishFinanceTool() {
  const { tool } = Route.useLoaderData();
  const ui = FINANCIAL_UI_ES[tool.slug];
  const seo = financeSeo(tool.slug);
  const name = spanishToolName({ slug: tool.slug, name: tool.name });
  if (!ui) throw new Error(`Missing financial UI for catalog tool: ${tool.slug}`);

  const intro =
    seo?.introEs ??
    tool.description ??
    "Calcula y analiza este escenario financiero directamente en tu navegador.";
  const aboutParas = seo?.aboutEs ?? [
    tool.description ||
      "Esta herramienta realiza un cálculo matemático a partir de los valores que introduces y funciona directamente en el navegador.",
  ];
  const steps = seo?.stepsEs ?? [
    "Introduce los valores del escenario que quieres analizar.",
    "Ejecuta el cálculo y revisa los resultados.",
    "Compara escenarios y comprueba las condiciones reales antes de tomar decisiones.",
  ];
  const faq = seo?.faqEs ?? [];

  return (
    <main className="container-page py-10 sm:py-14">
      <Breadcrumbs
        locale="es"
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
        <FavoriteButton slug={tool.slug} name={name} locale="es" />
      </div>
      <section data-tool-surface className="surface-card mt-8 p-5 sm:p-7" aria-label={name}>
        {ui()}
        <ShareAndExportActions title={name} locale="es" />
      </section>
      <AdsterraBanner />
      <section className="mt-8 grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-black">Sobre esta calculadora</h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            {aboutParas.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black">Cómo usarla</h2>
          <ol className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {faq.length > 0 && (
        <section className="mt-10 border-t border-border/70 pt-8" aria-labelledby="financial-faq-es">
          <h2 id="financial-faq-es" className="text-xl font-black">
            Preguntas frecuentes
          </h2>
          <dl className="mt-4 space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-xl border border-border/70 bg-card p-4">
                <dt className="text-sm font-bold">{item.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <p className="mt-8 max-w-3xl text-xs leading-5 text-muted-foreground">
        Los resultados son estimaciones matemáticas; verificá las condiciones reales de cualquier producto financiero
        antes de decidir.
      </p>
    </main>
  );
}
