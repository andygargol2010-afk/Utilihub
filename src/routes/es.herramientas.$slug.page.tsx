import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { DeferredFavoriteButton } from "@/components/DeferredFavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredKitReturnRibbon } from "@/components/kits/DeferredKitReturnRibbon";
import type { CatalogTool } from "@/lib/all-tools";
import { DeferredAdsterraBanner } from "@/components/DeferredAdsterraBanner";
import { DeferredShowcaseHero } from "@/components/DeferredShowcaseHero";
import { spanishToolSummary } from "@/lib/i18n/es-summaries";
import { Route } from "./es.herramientas.$slug";

export function SpanishToolPage() {
  const { tool, name, categoryName, showcase } = Route.useLoaderData() as {
    tool: CatalogTool;
    name: string;
    categoryName: string;
    showcase: boolean;
  };
  const categorySlug = tool.category;
  const summaryEs = spanishToolSummary(tool);

  useEffect(() => {
    void import("@/lib/analytics").then((mod) => {
      mod.trackEvent("tool_open", { slug: tool.slug, locale: "es" });
    });
    void import("@/hooks/use-recent-tools").then((mod) => {
      mod.recordRecentTool(tool.slug);
    });
  }, [tool.slug]);

  const about = Array.isArray(tool.about) ? tool.about.filter(Boolean) : [];
  const steps = Array.isArray(tool.steps) ? tool.steps.filter(Boolean) : [];
  const faq = Array.isArray(tool.faq) ? tool.faq : [];

  const categoryTo =
    categorySlug === "finanzas" ? ("/es/finanzas" as const) : ("/es/categoria/$slug" as const);
  const categoryParams = categorySlug === "finanzas" ? undefined : { slug: categorySlug };

  return (
    <div className="container-page py-6 sm:py-8">
      <nav aria-label="Miga de pan" className="flex min-h-9 flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/es" className="hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/es/herramientas" className="hover:text-foreground">
          Herramientas
        </Link>
        <span aria-hidden="true">/</span>
        {categoryParams ? (
          <Link to={categoryTo} params={categoryParams} className="hover:text-foreground">
            {categoryName}
          </Link>
        ) : (
          <Link to={categoryTo} className="hover:text-foreground">
            {categoryName}
          </Link>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <DeferredKitReturnRibbon toolSlug={tool.slug} locale="es" />

      {showcase ? <DeferredShowcaseHero name={name} slug={tool.slug} locale="es" /> : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{summaryEs}</p>
        </div>
        <DeferredFavoriteButton slug={tool.slug} name={name} locale="es" />
      </div>

      <section
        data-tool-surface
        aria-label={`Herramienta: ${name}`}
        className={`surface-card mt-4 p-4 sm:p-6 ${
          showcase ? "border-0 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5" : ""
        }`}
      >
        <DeferredToolUi slug={tool.slug} locale="es" />
        <div className="mt-4">
          <DeferredShareAndExport title={name} locale="es" />
        </div>
      </section>

      <DeferredAdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="es" />

      {(about.length > 0 || steps.length > 0 || faq.length > 0) && (
        <section className="mt-10 space-y-8" aria-labelledby="tool-guide-title">
          <h2 id="tool-guide-title" className="text-2xl font-black">
            {name}: cómo funciona
          </h2>
          {about.length > 0 && (
            <div>
              <h3 className="text-base font-bold">Sobre {name}</h3>
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                {about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
          {steps.length > 0 && (
            <div>
              <h3 className="text-base font-bold">Cómo usarla</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          )}
          {faq.length > 0 && (
            <div>
              <h3 className="text-base font-bold">Preguntas frecuentes</h3>
              <dl className="mt-2 space-y-3 text-sm">
                {faq.map((item, i) => (
                  <div key={i}>
                    <dt className="font-semibold">{item.q}</dt>
                    <dd className="mt-1 text-muted-foreground">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
