import { lazy, Suspense, useMemo, type ReactNode } from "react";
import { ToolUiFallback } from "@/components/ToolUiFallback";

type Locale = "en" | "es";

/**
 * Finance tool shells must not statically import the calculator registry.
 * The registry pulls every formula module (compound interest, loans, tax, portfolio…)
 * into the route chunk. Load it after the H1 so only the visited calculator parses.
 */
export function DeferredFinancialUi({ slug, locale }: { slug: string; locale: Locale }) {
  const Ui = useMemo(
    () =>
      lazy(async () => {
        const { FINANCIAL_UI, FINANCIAL_UI_ES } = await import("@/components/financial/registry");
        const render = (locale === "es" ? FINANCIAL_UI_ES : FINANCIAL_UI)[slug];
        return {
          default: function LoadedFinancialUi(): ReactNode {
            if (!render) {
              return (
                <p role="alert" className="text-muted-foreground">
                  {locale === "es" ? "Calculadora no disponible." : "Calculator not available."}
                </p>
              );
            }
            return <>{render()}</>;
          },
        };
      }),
    [slug, locale],
  );

  return (
    <Suspense fallback={<ToolUiFallback locale={locale} />}>
      <Ui />
    </Suspense>
  );
}
