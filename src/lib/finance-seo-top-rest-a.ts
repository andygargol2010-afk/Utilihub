/** Remaining top-5 finance SEO A (loan). */

export type FinanceSeoBlockRest = {
  metaTitle: string;
  metaTitleEs: string;
  metaDescription: string;
  metaDescriptionEs: string;
  intro: string;
  introEs: string;
  about: string[];
  aboutEs: string[];
  steps: string[];
  stepsEs: string[];
  faq: { q: string; a: string }[];
  faqEs: { q: string; a: string }[];
};

export const FINANCE_SEO_TOP_REST_A: Record<string, FinanceSeoBlockRest> = {
  "cuota-de-prestamo": {
    metaTitle: "Loan Payment Calculator — Monthly Payment & Interest | UtiliHub",
    metaTitleEs: "Calculadora de cuota de préstamo gratis | UtiliHub",
    metaDescription:
      "Free loan payment calculator. Estimate monthly payment, total interest, and overall cost from amount, rate, and term. No signup.",
    metaDescriptionEs:
      "Calculadora de cuota de préstamo gratis. Estimá la cuota mensual, el interés total y el costo global según monto, tasa y plazo. Sin registro.",
    intro:
      "Calculate a fixed monthly payment for a loan from the principal, annual interest rate, and term in months or years. See total interest and total amount paid.",
    introEs:
      "Calculá una cuota mensual fija a partir del capital, la tasa anual y el plazo. Mirá el interés total y el monto total a pagar.",
    about: [
      "A standard amortizing loan splits each payment into interest and principal. Early payments are interest-heavy; later payments reduce principal faster. The payment amount is chosen so the balance reaches zero at the end of the term.",
      "This tool uses the classic fixed-payment formula based on the loan amount, nominal annual rate, and number of periods. It helps you compare shorter term / higher payment vs longer term / lower payment before you sign.",
      "Banks may add fees, insurance, or different day-count conventions. Always confirm the APR and schedule on the real offer; this page is a transparent math check, not a lender quote.",
    ],
    aboutEs: [
      "En un préstamo amortizable clásico, cada cuota se parte en interés y capital. Al principio pesa más el interés; después se reduce el capital más rápido. La cuota se elige para que el saldo llegue a cero al final del plazo.",
      "Esta herramienta usa la fórmula de cuota fija según monto, tasa nominal anual y cantidad de períodos. Sirve para comparar plazo corto / cuota alta vs plazo largo / cuota baja antes de firmar.",
      "Los bancos pueden sumar comisiones, seguros u otras convenciones de días. Confirmá siempre la TEA/TNA y el cuadro de la oferta real; esta página es un control matemático transparente, no una cotización del prestamista.",
    ],
    steps: [
      "Enter the loan amount (principal).",
      "Set the annual interest rate and the term (months or years, as the form allows).",
      "Calculate to see the estimated monthly payment.",
      "Review total interest and total cost; try a shorter or longer term to compare.",
    ],
    stepsEs: [
      "Ingresá el monto del préstamo (capital).",
      "Definí la tasa anual y el plazo (meses o años, según el formulario).",
      "Calculá para ver la cuota mensual estimada.",
      "Revisá el interés total y el costo global; probá otro plazo para comparar.",
    ],
    faq: [
      {
        q: "How is the monthly payment calculated?",
        a: "For a fixed-rate amortizing loan, payment ≈ P · r(1+r)^n / ((1+r)^n − 1), where P is principal, r the rate per period, and n the number of periods.",
      },
      {
        q: "Why does total interest fall if I shorten the term?",
        a: "You repay principal faster, so interest accrues on a smaller average balance—even if each monthly payment is higher.",
      },
      {
        q: "Is this the same as the bank’s APR?",
        a: "Not always. APR can include fees and other costs. Use this calculator for the pure interest-and-principal schedule, then compare with the lender’s full disclosure.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cuota mensual?",
        a: "En un préstamo a tasa fija amortizable, la cuota ≈ P · r(1+r)^n / ((1+r)^n − 1), donde P es el capital, r la tasa por período y n la cantidad de períodos.",
      },
      {
        q: "¿Por qué baja el interés total si acorto el plazo?",
        a: "Devolvés el capital más rápido, así que el interés se aplica sobre un saldo promedio menor, aunque cada cuota mensual sea más alta.",
      },
      {
        q: "¿Es lo mismo que la TEA del banco?",
        a: "No siempre. La TEA puede incluir comisiones y otros costos. Usá esta calculadora para el esquema puro de interés y capital, y después compará con la información completa del prestamista.",
      },
    ],
  },
};
