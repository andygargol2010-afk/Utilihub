import { FINANCE_SEO_BLOCK4 } from "./finance-seo-block4";
import { FINANCE_SEO_TOP_REST_A } from "./finance-seo-top-rest-a";
import { FINANCE_SEO_ROI } from "./finance-seo-roi";
import { FINANCE_SEO_SAVINGS_INFLATION } from "./finance-seo-savings-inflation";

/** Unique on-page SEO copy for high-priority finance tools. */

export type FinanceSeoBlock = {
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

export const FINANCE_SEO: Record<string, FinanceSeoBlock> = {
  ...(FINANCE_SEO_TOP_REST_A as Record<string, FinanceSeoBlock>),
  ...(FINANCE_SEO_ROI as Record<string, FinanceSeoBlock>),
  ...(FINANCE_SEO_SAVINGS_INFLATION as Record<string, FinanceSeoBlock>),
  "interes-compuesto": {
    metaTitle: "Compound Interest Calculator — Free Online | UtiliHub",
    metaTitleEs: "Calculadora de interés compuesto gratis | UtiliHub",
    metaDescription:
      "Free compound interest calculator. Project future value with regular contributions, annual rate, and compounding frequency. No signup.",
    metaDescriptionEs:
      "Calculadora de interés compuesto gratis. Proyectá el valor futuro con aportes, tasa anual y capitalización. Sin registro.",
    intro:
      "Estimate how savings or investments grow when interest is added to the balance and then earns interest itself. Adjust principal, rate, time, and optional contributions.",
    introEs:
      "Estimá cómo crecen el ahorro o la inversión cuando el interés se suma al capital y vuelve a generar interés. Ajustá capital, tasa, tiempo y aportes opcionales.",
    about: [
      "Compound interest is the process of earning returns on both the original principal and on interest already credited. Over long periods, small differences in rate or contribution frequency can change the final balance substantially.",
      "This calculator projects a future value from the starting amount, an annual percentage rate, the number of years, how often interest is applied, and optional recurring deposits. All math runs in your browser; nothing is stored on a server.",
      "Use it to compare save monthly vs yearly, to see the impact of a higher rate, or to stress-test a goal before you commit to a product. Results are mathematical estimates—not advice and not a guarantee of any bank or fund return.",
    ],
    aboutEs: [
      "El interés compuesto consiste en ganar rendimiento sobre el capital inicial y también sobre los intereses ya capitalizados. A largo plazo, pequeñas diferencias de tasa o de frecuencia de aportes cambian mucho el saldo final.",
      "Esta calculadora proyecta un valor futuro a partir del monto inicial, la tasa anual, los años, la frecuencia de capitalización y depósitos periódicos opcionales. El cálculo corre en tu navegador; no se guarda nada en un servidor.",
      "Sirve para comparar ahorrar cada mes vs una vez al año, ver el efecto de una tasa más alta o probar una meta antes de elegir un producto. Los resultados son estimaciones matemáticas, no asesoramiento ni garantía de rendimiento.",
    ],
    steps: [
      "Enter the starting principal (what you invest or save today).",
      "Set the annual interest rate and how many years you will leave the money invested.",
      "Choose compounding frequency and, if you want, a regular contribution amount.",
      "Review the projected balance and compare with a second scenario if needed.",
    ],
    stepsEs: [
      "Ingresá el capital inicial (lo que invertís o ahorrás hoy).",
      "Definí la tasa anual de interés y cuántos años dejarás el dinero invertido.",
      "Elegí la frecuencia de capitalización y, si querés, un aporte periódico.",
      "Revisá el saldo proyectado y compará con otro escenario si hace falta.",
    ],
    faq: [
      {
        q: "What is the compound interest formula?",
        a: "A common form is A = P(1 + r/n)^(n·t), where P is principal, r the annual rate as a decimal, n the number of compounding periods per year, and t the time in years. Contributions are added on top of that base model.",
      },
      {
        q: "Does monthly compounding grow faster than annual?",
        a: "Yes, all else equal: interest is credited more often, so later periods earn on a larger balance. The difference is modest at low rates and short horizons, and larger over decades.",
      },
      {
        q: "Are these results guaranteed returns?",
        a: "No. Markets, fees, taxes, and product terms change real outcomes. Treat the number as a planning estimate only.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuál es la fórmula del interés compuesto?",
        a: "Una forma habitual es A = P(1 + r/n)^(n·t), donde P es el capital, r la tasa anual en decimal, n las capitalizaciones por año y t el tiempo en años. Los aportes se suman sobre ese modelo base.",
      },
      {
        q: "¿Capitalizar cada mes rinde más que una vez al año?",
        a: "Sí, si todo lo demás es igual: el interés se acredita más seguido y los períodos siguientes trabajan sobre un saldo mayor. La diferencia es chica a tasas bajas y plazos cortos, y más grande a lo largo de décadas.",
      },
      {
        q: "¿Estos resultados son un rendimiento garantizado?",
        a: "No. Mercados, comisiones, impuestos y condiciones del producto cambian el resultado real. Usá el número solo como estimación para planificar.",
      },
    ],
  },
};

export function financeSeo(slug: string): FinanceSeoBlock | undefined {
  return (
    FINANCE_SEO[slug] ??
    (FINANCE_SEO_BLOCK4[slug] as FinanceSeoBlock | undefined)
  );
}
