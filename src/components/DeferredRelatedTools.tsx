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
    <Suspense
      fallback={
        <div className="mt-5 h-28 rounded-2xl border border-border/50 bg-card/30" aria-hidden />
      }
    >
      <RelatedToolPath tool={tool} locale={locale} />
    </Suspense>
  );
}
