import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { DeferredFavoriteButton } from "@/components/DeferredFavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredKitReturnRibbon } from "@/components/kits/DeferredKitReturnRibbon";
import { ToolSeoContent } from "@/components/ToolSeoContent";
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

      {/* ES-only guide: overrides aboutEs/stepsEs/faqEs or spanishGuideFallback — never EN catalog copy */}
      <ToolSeoContent tool={tool} locale="es" />
    </div>
  );
}
