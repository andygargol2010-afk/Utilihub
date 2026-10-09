import { lazy, Suspense } from "react";
import type { CatalogTool } from "@/lib/all-tools";

const FinanceJourney = lazy(() =>
  import("./FinanceJourney").then((m) => ({ default: m.FinanceJourney })),
);

/**
 * Finance shells must not statically import discovery: it pulls all-tools.
 * The calculator and ad slot paint first; the journey chunk loads with this boundary.
 */
export function DeferredFinanceJourney({ tool }: { tool: CatalogTool }) {
  return (
    <Suspense
      fallback={
        <div className="mt-6 h-28 rounded-2xl border border-border/50 bg-card/30" aria-hidden />
      }
    >
      <FinanceJourney tool={tool} />
    </Suspense>
  );
}
