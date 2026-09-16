import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FINANCIAL_UI_ES } from "@/components/financial/registry";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShareAndExportActions } from "@/components/ShareAndExportActions";
import { financialToolBySlug } from "@/lib/financial-tools";
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
    const name = spanishToolName({ slug: tool.slug, name: tool.name });
    const url = absoluteUrl(`/es/finanzas/${tool.slug}`);
    const englishUrl = absoluteUrl(englishToolPath({ ...tool, category: "finanzas" }));
    const description = cleanDescription(
      tool.description?.trim()
        ? tool.description
        : `Calculadora financiera gratuita: ${name}. Analizá escenarios en el navegador, sin registro.`,
    );
    return {
      meta: [
        { title: `${name} gratis online | UtiliHub` },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:title", content: `${name} | UtiliHub` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "es_ES" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage() },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${name} | UtiliHub` },
        { name: "twitter:description", content: description },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "es", href: url },
        { rel: "alternate", hrefLang: "en", href: englishUrl },
        { rel: "alternate", hrefLang: "x-default", href: englishUrl },
      ],
    };
  },
  component: SpanishFinanceTool,
});

function SpanishFinanceTool() {
  const { tool } = Route.useLoaderData();
  const ui = FINANCIAL_UI_ES[tool.slug];
  const name = spanishToolName({ slug: tool.slug, name: tool.name });
  if (!ui) throw new Error(`Missing financial UI for catalog tool: ${tool.slug}`);
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
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {tool.description || "Calcula y analiza este escenario financiero directamente en tu navegador."}
          </p>
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
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {tool.description ||
              "Esta herramienta realiza un cálculo matemático a partir de los valores que introduces y funciona directamente en el navegador."}{" "}
            Los resultados son estimaciones matemáticas; verificá las condiciones reales de cualquier producto financiero antes de decidir.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-black">Cómo usarla</h2>
          <ol className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">1</span>
              <span>Introduce los valores del escenario que quieres analizar.</span>
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">2</span>
              <span>Ejecuta el cálculo y revisa los resultados.</span>
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">3</span>
              <span>Compara escenarios y comprueba las condiciones reales antes de tomar decisiones.</span>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
