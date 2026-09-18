import type { CatalogTool } from "@/lib/all-tools";
import { resolvedToolSeo, toolSeoOverride } from "@/lib/tool-seo-overrides";

export function ToolSeoContent({ tool, locale = "en" }: { tool: CatalogTool; locale?: "en" | "es" }) {
  const override = toolSeoOverride(tool.slug);
  const resolved = resolvedToolSeo(tool);

  const about =
    locale === "es" && override?.aboutEs?.length ? override.aboutEs : resolved.about;
  const steps =
    locale === "es" && override?.stepsEs?.length ? override.stepsEs : resolved.steps;
  const faq =
    locale === "es" && override?.faqEs?.length ? override.faqEs : resolved.faq;

  const hasDetails = about.length > 0 || steps.length > 0 || faq.length > 0;
  if (!hasDetails) return null;

  const guideLabel = locale === "es" ? "Guía de la herramienta" : "Tool guide";
  const howTitle =
    locale === "es" ? `${tool.name}: cómo funciona` : `${tool.name}: how it works`;
  const howLead =
    locale === "es"
      ? "Información práctica para entender el resultado y usar bien esta herramienta."
      : "Practical information to understand the result and use this tool correctly.";
  const aboutTitle = locale === "es" ? `Sobre ${tool.name}` : `About ${tool.name}`;
  const stepsTitle = locale === "es" ? "Cómo usarla" : "How to use it";
  const faqTitle = locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions";

  return (
    <article className="mt-10 border-t border-border/70 pt-8" aria-labelledby="tool-guide-title">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{guideLabel}</p>
        <h2 id="tool-guide-title" className="mt-1 text-2xl font-black">
          {howTitle}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{howLead}</p>
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_.9fr]">
        {about.length > 0 && (
          <section aria-labelledby="tool-about-title">
            <h3 id="tool-about-title" className="text-base font-bold">
              {aboutTitle}
            </h3>
            <div className="mt-3 space-y-3">
              {about.map((paragraph, index) => (
                <p key={index} className="text-sm leading-6 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}
        {steps.length > 0 && (
          <section aria-labelledby="tool-steps-title">
            <h3 id="tool-steps-title" className="text-base font-bold">
              {stepsTitle}
            </h3>
            <ol className="mt-3 space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
      {faq.length > 0 ? (
        <section className="mt-8 max-w-3xl" aria-labelledby="tool-faq-title">
          <h3 id="tool-faq-title" className="text-base font-bold">
            {faqTitle}
          </h3>
          <dl className="mt-3 divide-y divide-border rounded-xl border border-border/70 bg-card px-4">
            {faq.map((item) => (
              <div key={item.q} className="py-4">
                <dt className="font-semibold">{item.q}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </article>
  );
}
