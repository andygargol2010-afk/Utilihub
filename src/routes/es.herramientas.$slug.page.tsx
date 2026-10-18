import { useEffect } from "react";
import { DeferredBreadcrumbs } from "@/components/DeferredBreadcrumbs";
import { DeferredToolUi } from "@/components/DeferredToolUi";
import { DeferredRelatedTools } from "@/components/DeferredRelatedTools";
import { DeferredFavoriteButton } from "@/components/DeferredFavoriteButton";
import { DeferredShareAndExport } from "@/components/DeferredShareAndExport";
import { DeferredToolSeo } from "@/components/DeferredToolSeo";
import { DeferredKitReturnRibbon } from "@/components/kits/DeferredKitReturnRibbon";
import type { CatalogTool } from "@/lib/all-tools";
import { DeferredAdsterraBanner } from "@/components/DeferredAdsterraBanner";
import { DeferredShowcaseHero } from "@/components/DeferredShowcaseHero";
import { Route } from "./es.herramientas.$slug";

export function SpanishToolPage() {
  const { tool, name, categoryName, showcase } = Route.useLoaderData() as {
    tool: CatalogTool;
    name: string;
    categoryName: string;
    showcase: boolean;
  };
  const categorySlug = tool.category;
  useEffect(() => {
    void import("@/lib/analytics").then((mod) => {
      mod.trackEvent("tool_open", { slug: tool.slug, locale: "es" });
    });
    void import("@/hooks/use-recent-tools").then((mod) => {
      mod.recordRecentTool(tool.slug);
    });
  }, [tool.slug]);
  return (
    <div className="container-page py-6 sm:py-8">
      <DeferredBreadcrumbs
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
          <DeferredFavoriteButton slug={tool.slug} name={name} locale="es" />
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
      <DeferredAdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="es" />
      <DeferredToolSeo tool={tool} locale="es" />
    </div>
  );
}
