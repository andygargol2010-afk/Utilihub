import { lazy, Suspense, useMemo, type ComponentType, type ReactNode } from "react";
import { ToolUiFallback } from "@/components/ToolUiFallback";

type Locale = "en" | "es";
type FinanceUi = ComponentType<{ locale?: Locale }>;

/**
 * Flagship calculators are their own modules. The advanced registry pulls every
 * formula definition (tax, portfolio, loans, retirement…). Do not import that
 * barrel — or the other four flagship components — unless this page needs them.
 */
const CORE_FINANCE: Record<string, () => Promise<{ default: FinanceUi }>> = {
  "interes-compuesto": () => import("@/components/financial/CompoundInterest"),
  "cuota-de-prestamo": () => import("@/components/financial/LoanPayment"),
  "rentabilidad-de-inversion": () => import("@/components/financial/InvestmentReturn"),
  "objetivo-de-ahorro": () => import("@/components/financial/SavingsGoal"),
  "inflacion-y-poder-adquisitivo": () => import("@/components/financial/Inflation"),
};

async function loadRenderer(slug: string, locale: Locale): Promise<() => ReactNode> {
  const core = CORE_FINANCE[slug];
  if (core) {
    const { default: Comp } = await core();
    return () => <Comp locale={locale} />;
  }

  const { ADVANCED_FINANCIAL_UI, ADVANCED_FINANCIAL_UI_ES } = await import(
    "@/components/financial/advanced-registry"
  );
  const render = (locale === "es" ? ADVANCED_FINANCIAL_UI_ES : ADVANCED_FINANCIAL_UI)[slug];
  if (!render) {
    const missing = locale === "es" ? "Calculadora no disponible." : "Calculator not available.";
    return () => (
      <p role="alert" className="text-muted-foreground">
        {missing}
      </p>
    );
  }
  return render;
}

/**
 * Finance tool shells must not statically import the calculator registry.
 * Each flagship route loads only its component. Advanced routes load the
 * formula barrel without the five flagship modules.
 */
export function DeferredFinancialUi({ slug, locale }: { slug: string; locale: Locale }) {
  const Ui = useMemo(
    () =>
      lazy(async () => {
        const render = await loadRenderer(slug, locale);
        return {
          default: function LoadedFinancialUi() {
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
