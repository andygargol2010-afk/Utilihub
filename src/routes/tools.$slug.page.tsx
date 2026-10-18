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
import { Route } from "./tools.$slug";

export function ToolPage() {
  const { tool, category, categoryPublicSlug, showcase } = Route.useLoaderData() as {
    tool: CatalogTool;
    category: { slug: string; name: string } | null;
    categoryPublicSlug: string | null;
    showcase: boolean;
  };

  useEffect(() => {
    void import("@/lib/analytics").then((mod) => {
      mod.trackEvent("tool_open", { slug: tool.slug, locale: "en" });
    });
    void import("@/hooks/use-recent-tools").then((mod) => {
      mod.recordRecentTool(tool.slug);
    });
  }, [tool.slug]);

  if (!category || !categoryPublicSlug) return <p className="container-page py-10">Tool not available.</p>;

  return (
    <div className="container-page py-6 sm:py-8">
      <DeferredBreadcrumbs
        back={{
          label: category.name,
          to: "/category/$slug",
          params: { slug: categoryPublicSlug },
        }}
        items={[
          { label: "Home", to: "/" },
          { label: "Tools", to: "/tools" },
          { label: category.name, to: "/category/$slug", params: { slug: categoryPublicSlug } },
          { label: tool.name },
        ]}
      />
      <DeferredKitReturnRibbon toolSlug={tool.slug} locale="en" />
      {showcase ? (
        <DeferredShowcaseHero name={tool.name} slug={tool.slug} locale="en" />
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold sm:text-3xl">{tool.name}</h1>
            <p className="mt-1 max-w-2xl truncate text-sm text-muted-foreground">{tool.summary}</p>
          </div>
          <DeferredFavoriteButton slug={tool.slug} name={tool.name} />
        </div>
      )}
      <section
        data-tool-surface
        aria-label={`Tool: ${tool.name}`}
        className={`surface-card mt-4 p-4 sm:p-6 ${
          showcase ? "-mt-1 border-0 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5" : ""
        }`}
      >
        <DeferredToolUi slug={tool.slug} locale="en" />
        <div className="mt-4">
          <DeferredShareAndExport title={tool.name} />
        </div>
      </section>
      <DeferredAdsterraBanner />
      <DeferredRelatedTools tool={tool} locale="en" />
      <DeferredToolSeo tool={tool} locale="en" />
    </div>
  );
}
