/** Finance SEO: ROI. */
import type { FinanceSeoBlockRest } from "./finance-seo-top-rest-a";

export const FINANCE_SEO_ROI: Record<string, FinanceSeoBlockRest> = {
  roi: {
    metaTitle: "ROI Calculator — Return on Investment Online | UtiliHub",
    metaTitleEs: "Calculadora de ROI gratis | UtiliHub",
    metaDescription:
      "Free ROI calculator. Measure percentage return and net profit from cost and gain. Simple return on investment, no signup.",
    metaDescriptionEs:
      "Calculadora de ROI gratis. Medí el retorno porcentual y la ganancia neta a partir del costo y el beneficio. Sin registro.",
    intro:
      "Measure return on investment as a percentage and as net profit. Enter what you spent and what you got back (or the gain) to see ROI instantly.",
    introEs:
      "Medí el retorno de la inversión en porcentaje y como ganancia neta. Ingresá lo que gastaste y lo que obtuviste para ver el ROI al instante.",
    about: [
      "ROI (return on investment) answers a simple question: relative to what I put in, how much did I get back? The basic formula is (gain − cost) / cost, often shown as a percentage.",
      "It is widely used for campaigns, side projects, equipment purchases, and quick investment comparisons. It does not by itself adjust for time—two investments with the same ROI over 1 year vs 10 years are not equivalent.",
      "For multi-year or cash-flow-heavy projects, pair ROI with CAGR, NPV, or payback. This page focuses on a clear, single-period ROI you can recompute in the browser in seconds.",
    ],
    aboutEs: [
      "El ROI (retorno sobre la inversión) responde una pregunta simple: respecto de lo que puse, ¿cuánto recuperé? La fórmula básica es (ganancia − costo) / costo, suele expresarse en porcentaje.",
      "Se usa en campañas, proyectos, compras de equipos y comparaciones rápidas. Por sí solo no ajusta por el tiempo: el mismo ROI en 1 año o en 10 no es equivalente.",
      "En proyectos de varios años o con muchos flujos, combiná ROI con CAGR, VAN o payback. Esta página se centra en un ROI claro de un período, recalculable en el navegador en segundos.",
    ],
    steps: [
      "Enter the total cost or amount invested.",
      "Enter the final value, revenue, or gain from the investment.",
      "Read the ROI percentage and net profit.",
      "Compare with another scenario (different cost or exit value).",
    ],
    stepsEs: [
      "Ingresá el costo total o el monto invertido.",
      "Ingresá el valor final, el ingreso o la ganancia de la inversión.",
      "Leé el ROI en porcentaje y la ganancia neta.",
      "Compará con otro escenario (otro costo u otro valor de salida).",
    ],
    faq: [
      {
        q: "What is a good ROI?",
        a: "It depends on risk, time, and alternatives. A short marketing test might accept a modest ROI; a risky startup bet usually needs a much higher expected return. Always compare against your next-best use of the money.",
      },
      {
        q: "ROI vs profit?",
        a: "Profit is an absolute amount (money gained). ROI scales that gain by the capital used, so you can compare projects of different sizes.",
      },
      {
        q: "Does this include taxes and fees?",
        a: "Only if you bake them into the cost and gain figures you enter. The calculator does not apply a tax model automatically.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué es un ROI bueno?",
        a: "Depende del riesgo, del tiempo y de las alternativas. Un test de marketing corto puede aceptar un ROI modesto; una apuesta riesgosa suele exigir un retorno esperado mucho mayor. Compará siempre con el mejor uso alternativo del dinero.",
      },
      {
        q: "¿ROI o ganancia?",
        a: "La ganancia es un monto absoluto. El ROI relaciona esa ganancia con el capital usado, para comparar proyectos de distinto tamaño.",
      },
      {
        q: "¿Incluye impuestos y comisiones?",
        a: "Solo si los incorporás en el costo y en la ganancia que cargás. La calculadora no aplica un modelo impositivo automático.",
      },
    ],
  },
};
