import { lazy, Suspense } from "react";
import type { CatalogTool } from "@/lib/all-tools";

const ToolSeoContent = lazy(() =>
  import("./ToolSeoContent").then((m) => ({ default: m.ToolSeoContent })),
);

/**
 * SEO guides pull the full override barrel (~500KB source). Keep that chunk
 * off the tool-route graph so the calculator shell can parse without it.
 */
export function DeferredToolSeo({ tool, locale }: { tool: CatalogTool; locale: "en" | "es" }) {
  return (
    <Suspense
      fallback={
        <div className="mt-10 h-32 rounded-xl border border-border/60 bg-card/40" aria-hidden />
      }
    >
      <ToolSeoContent tool={tool} locale={locale} />
    </Suspense>
  );
}
