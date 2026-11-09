import { Suspense } from "react";
import type { CatalogTool } from "@/lib/all-tools";
import { LazyBoundary, retryableLazy } from "@/components/LazyBoundary";

const FinanceSeoContent = retryableLazy(() =>
  import("./FinanceSeoContent").then((m) => ({ default: m.FinanceSeoContent })),
);

/**
 * Finance about / steps / FAQ pull the SEO content barrel.
 * Keep that off the finance route shell so the calculator paints with less JS.
 */
export function DeferredFinanceSeo({
  tool,
  locale,
}: {
  tool: CatalogTool;
  locale: "en" | "es";
}) {
  return (
    <LazyBoundary locale={locale} onRetry={FinanceSeoContent.retry} className="mt-10">
      <Suspense
        fallback={
          <div className="mt-10 space-y-6" aria-hidden>
            <div className="h-40 rounded-xl border border-border/60 bg-card/40" />
            <div className="h-48 rounded-xl border border-border/60 bg-card/30" />
          </div>
        }
      >
        <FinanceSeoContent tool={tool} locale={locale} />
      </Suspense>
    </LazyBoundary>
  );
}
