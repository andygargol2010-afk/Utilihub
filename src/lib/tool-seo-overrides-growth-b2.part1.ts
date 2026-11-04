// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_B2, split from tool-seo-overrides-growth-b2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_B2_PART1: Record<string, ToolSeoOverrideGrowth> = {  "pago-tarjeta-credito": {
    metaTitle: "Credit Card Payoff Calculator — Months & Interest | UtiliHub",
    metaTitleEs: "Calculadora de pago de tarjeta de crédito | UtiliHub",
    metaDescription:
      "Estimate how many months and how much interest you pay to clear a revolving balance at a fixed monthly payment and APR.",
    metaDescriptionEs:
      "Estimá en cuántos meses y con cuánto interés cancelás un saldo rotativo con pago mensual fijo y tasa anual.",
    about: [
      "Credit cards charge interest on revolving balances. A fixed payment must exceed the monthly interest or the balance never falls.",
      "We simulate month-by-month interest accrual and payments until the balance is cleared (or a safety month cap is hit).",
      "Fees, promotional rates, and minimum-payment rules differ by issuer—treat the output as a planning model.",
    ],
    aboutEs: [
      "Las tarjetas cobran interés sobre el saldo rotativo. El pago fijo debe superar el interés mensual o el saldo no baja.",
      "Simulamos mes a mes el interés y los pagos hasta liquidar el saldo (o alcanzar un tope de seguridad de meses).",
      "Comisiones, tasas promocionales y mínimos varían por emisor: tomá el resultado como modelo de planificación.",
    ],
    steps: [
      "Enter current balance, annual rate %, and monthly payment.",
      "Calculate months to payoff and total interest.",
      "Try a higher payment to see interest saved.",
    ],
    stepsEs: [
      "Ingresá saldo, tasa anual % y pago mensual.",
      "Calculá meses hasta cancelar e interés total.",
      "Probá un pago mayor para ver el interés ahorrado.",
    ],
    faq: [
      {
        q: "Payment too low error?",
        a: "If the payment is less than or equal to the first month’s interest, the balance grows. Raise the payment.",
      },
      {
        q: "Daily vs monthly compounding?",
        a: "This model uses a simple monthly rate (APR/12). Card statements may use daily balances; results can differ slightly.",
      },
    ],
    faqEs: [
      {
        q: "¿Error de pago demasiado bajo?",
        a: "Si el pago es menor o igual al interés del primer mes, el saldo crece. Subí el pago.",
      },
      {
        q: "¿Interés diario o mensual?",
        a: "El modelo usa tasa mensual simple (TEA/12). Los resúmenes pueden usar saldo diario; puede haber pequeñas diferencias.",
      },
    ],
  },
};
