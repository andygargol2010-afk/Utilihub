import { lazy, Suspense } from "react";
import type { CatalogTool } from "@/lib/all-tools";

const RelatedToolPath = lazy(() =>
  import("./RelatedToolPath").then((m) => ({ default: m.RelatedToolPath })),
);

/**
 * Related-path matching pulls discovery.ts and ToolCard. Keep that off the
 * tool-route shell so the calculator can paint before the below-fold links.
 */
export function DeferredRelatedTools({
  tool,
  locale,
}: {
  tool: CatalogTool;
  locale: "en" | "es";
}) {
  return (
    <Suspense fallback={<RelatedToolsSlot />}>
      <RelatedToolPath tool={tool} locale={locale} />
    </Suspense>
  );
}

/** Next-step card plus four compact rows. Same floor as RelatedToolPath so the ad/SEO below do not jump when the chunk arrives. */
function RelatedToolsSlot() {
  return (
    <div aria-hidden>
      <div className="mt-5 min-h-[8.75rem] rounded-2xl border border-border/50 bg-card/30" />
      <div className="mt-8 min-h-[22rem] rounded-xl border border-border/50 bg-card/20" />
    </div>
  );
}
