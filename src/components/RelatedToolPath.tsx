import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import type { CatalogTool } from "@/lib/all-tools";
import { englishToolSlug } from "@/lib/route-slugs";
import { spanishToolName } from "@/lib/i18n/es";
import { journeyLabel, journeyTools } from "@/lib/discovery";

function NextStepLink({ tool, locale }: { tool: CatalogTool; locale: "en" | "es" }) {
  const className =
    "inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90";
  if (locale === "es") {
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
  const slug = englishToolSlug(tool);
  if (tool.category === "finanzas") {
    return (
      <Link to="/finance/$slug" params={{ slug }} className={className}>
        Open next <ArrowRight className="size-4" />
      </Link>
    );
  }
  return (
    <Link to="/tools/$slug" params={{ slug }} className={className}>
      Open next <ArrowRight className="size-4" />
    </Link>
  );
}

export function RelatedToolPath({ tool, locale }: { tool: CatalogTool; locale: "en" | "es" }) {
  const related = journeyTools(tool);
  const nextStep = related[0];
  const es = locale === "es";
  const name = es ? spanishToolName(tool) : tool.name;

  if (!nextStep && related.length === 0) return null;

  return (
    <>
      {nextStep && (
        <section
          className="mt-5 rounded-2xl border border-primary/20 bg-accent/50 p-4 sm:p-5"
          aria-labelledby={es ? "next-step-es" : "next-step"}
        >
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">
            {es ? "Siguiente paso recomendado" : "Recommended next step"}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id={es ? "next-step-es" : "next-step"} className="text-base font-black">
                {journeyLabel(tool, locale)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {es
                  ? `Después de usar ${name}, continúa con ${spanishToolName(nextStep)}.`
                  : `After using ${tool.name}, continue with ${nextStep.name}.`}
              </p>
            </div>
            <NextStepLink tool={nextStep} locale={locale} />
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="mt-8" aria-labelledby={es ? "related-es" : "related"}>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 id={es ? "related-es" : "related"} className="text-base font-bold">
                {es ? "Herramientas relacionadas" : "Continue this path"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {es
                  ? "Mismo tipo de tarea, para seguir en el sitio."
                  : "Tools selected to complete the same task."}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {es ? related.length : `${related.length} steps`}
            </span>
          </div>
          <div className="divide-y divide-border/70 rounded-xl border border-border/70 bg-card px-3">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} locale={es ? "es" : undefined} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
