import type { CatalogTool } from "@/lib/all-tools";
import { financeSeo } from "@/lib/finance-seo-content";
import { spanishToolName } from "@/lib/i18n/es";

export function FinanceSeoContent({
  tool,
  locale,
}: {
  tool: CatalogTool;
  locale: "en" | "es";
}) {
  const seo = financeSeo(tool.slug);
  const es = locale === "es";
  const name = es ? spanishToolName({ slug: tool.slug, name: tool.name }) : tool.name;

  const aboutParas = es
    ? seo?.aboutEs ?? [
        tool.description ||
          "Esta herramienta realiza un cálculo matemático a partir de los valores que introduces y funciona directamente en el navegador.",
      ]
    : seo?.about ?? [
        `${tool.description} This tool runs in the browser and provides a mathematical estimate from the values you enter.`,
      ];

  const steps = es
    ? seo?.stepsEs ?? [
        "Introduce los valores del escenario que quieres analizar.",
        "Ejecuta el cálculo y revisa los resultados.",
        "Compara escenarios y comprueba las condiciones reales antes de tomar decisiones.",
      ]
    : seo?.steps ?? [
        "Enter the values for the scenario you want to analyze.",
        "Run the calculation and review each result.",
        "Compare scenarios and verify real conditions before deciding.",
      ];

  const faq = es
    ? seo?.faqEs?.length
      ? seo.faqEs
      : [
          {
            q: "¿Estos resultados son asesoramiento financiero?",
            a: "No. Son cálculos matemáticos orientativos y no reemplazan el criterio de un profesional.",
          },
          {
            q: "¿Se guardan mis datos?",
            a: "El cálculo se hace en tu navegador. No necesitás crear una cuenta para usar la herramienta.",
          },
        ]
    : seo?.faq ?? [];

  return (
    <>
      <section className="mt-10 grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-2" aria-labelledby={es ? undefined : "financial-guide"}>
        <div>
          <h2 id={es ? undefined : "financial-guide"} className="text-xl font-black">
            {es ? "Sobre esta calculadora" : "About this calculator"}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            {aboutParas.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-black">{es ? "Cómo usarla" : "How to use it"}</h2>
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
        <section className="mt-10 border-t border-border/70 pt-8" aria-labelledby={es ? "financial-faq-es" : "financial-faq"}>
          <h2 id={es ? "financial-faq-es" : "financial-faq"} className="text-xl font-black">
            {es ? "Preguntas frecuentes" : "Frequently asked questions"}
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
        {es
          ? "Los resultados son estimaciones matemáticas; verificá las condiciones reales de cualquier producto financiero antes de decidir."
          : "Results are mathematical estimates. Verify the real conditions of any financial product before making decisions."}
      </p>
    </>
  );
}
