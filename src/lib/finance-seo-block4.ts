import { FINANCE_SEO_BLOCK4_PART1 } from "./finance-seo-block4.part1";
import { FINANCE_SEO_BLOCK4_PART2 } from "./finance-seo-block4.part2";
/** Finance SEO block 4 (CAGR, early repayment, emergency fund, FX, loan compare). */

export type FinanceSeoBlock4 = {
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

export const FINANCE_SEO_BLOCK4: Record<string, FinanceSeoBlock4> = {
  ...FINANCE_SEO_BLOCK4_PART1,
  ...FINANCE_SEO_BLOCK4_PART2,

  "fondo-de-emergencia": {
    metaTitle: "Emergency Fund Calculator — Free Online | UtiliHub",
    metaTitleEs: "Calculadora de fondo de emergencia gratis | UtiliHub",
    metaDescription:
      "Estimate how large an emergency fund you need from monthly expenses and months of coverage. Free, no signup.",
    metaDescriptionEs:
      "Estimá el tamaño de un fondo de emergencia según gastos mensuales y meses de cobertura. Gratis, sin registro.",
    intro:
      "Size a cash buffer from your essential monthly expenses and how many months of coverage you want.",
    introEs:
      "Dimensioná un colchón de efectivo a partir de tus gastos esenciales mensuales y los meses de cobertura que querés.",
    about: [
      "An emergency fund is money set aside for job loss, medical bills, or urgent repairs so you avoid high-interest debt.",
      "Common rules of thumb target 3–6 months of essential expenses; freelancers or single-income households often aim higher.",
      "This calculator multiplies monthly essentials by the months of coverage you choose—it does not invest the fund or model inflation.",
    ],
    aboutEs: [
      "Un fondo de emergencia es dinero apartado para pérdida de empleo, salud o reparaciones urgentes, para no caer en deuda cara.",
      "Una regla habitual apunta a 3–6 meses de gastos esenciales; freelancers o hogares de un ingreso suelen apuntar más alto.",
      "Esta calculadora multiplica los gastos mensuales esenciales por los meses de cobertura que elijas; no invierte el fondo ni modela inflación.",
    ],
    steps: [
      "Enter essential monthly expenses.",
      "Choose months of coverage (e.g. 3, 6, 12).",
      "Read the target fund size.",
    ],
    stepsEs: [
      "Ingresá los gastos esenciales mensuales.",
      "Elegí meses de cobertura (p. ej. 3, 6, 12).",
      "Leé el tamaño objetivo del fondo.",
    ],
    faq: [
      {
        q: "What counts as essential expenses?",
        a: "Housing, food, utilities, insurance, minimum debt payments, and transport—not discretionary spending you could pause.",
      },
      {
        q: "Where should I keep it?",
        a: "Typically a liquid, low-risk account you can access quickly. This tool only sizes the amount.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué cuenta como gasto esencial?",
        a: "Vivienda, comida, servicios, seguros, mínimos de deudas y transporte—no el gasto discrecional que podrías pausar.",
      },
      {
        q: "¿Dónde guardarlo?",
        a: "Suele ser una cuenta líquida y de bajo riesgo de acceso rápido. Esta herramienta solo dimensiona el monto.",
      },
    ],
  },

  "conversor-de-divisas": {
    metaTitle: "Currency Converter — Exchange Rate Calculator | UtiliHub",
    metaTitleEs: "Conversor de divisas gratis | UtiliHub",
    metaDescription:
      "Convert currencies with an exchange rate you enter. Free currency converter in the browser, no signup.",
    metaDescriptionEs:
      "Convertí divisas con el tipo de cambio que ingresás. Conversor gratis en el navegador, sin registro.",
    intro:
      "Convert an amount from one currency to another using an exchange rate you provide (from your bank or a market quote).",
    introEs:
      "Convertí un monto de una moneda a otra con el tipo de cambio que indiques (banco o cotización de mercado).",
    about: [
      "Currency conversion multiplies (or divides) an amount by an FX rate. Live mid-market rates differ from the rate your bank or card applies after spread and fees.",
      "This tool does not fetch live rates—you enter the rate so the math matches the quote you care about.",
      "For travel or invoices, double-check whether the rate is quoted as base/quote or the inverse.",
    ],
    aboutEs: [
      "La conversión de divisas multiplica (o divide) un monto por un tipo de cambio. La cotización mid-market difiere de la que aplica tu banco o tarjeta tras spread y comisiones.",
      "Esta herramienta no trae cotizaciones en vivo: cargás el tipo para que la cuenta coincida con la cotización que te importa.",
      "En viajes o facturas, confirmá si el tipo está cotizado como base/cotizada o al revés.",
    ],
    steps: [
      "Enter the amount to convert.",
      "Enter the exchange rate you want to use.",
      "Read the converted amount.",
    ],
    stepsEs: [
      "Ingresá el monto a convertir.",
      "Ingresá el tipo de cambio a usar.",
      "Leé el monto convertido.",
    ],
    faq: [
      {
        q: "Why not automatic live rates?",
        a: "Rates change continuously and differ by provider. Entering your rate keeps the result aligned with your bank or broker quote.",
      },
      {
        q: "Does it include fees?",
        a: "Only if you bake fees into the rate or adjust the amount yourself.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué no cotización automática?",
        a: "Las cotizaciones cambian todo el tiempo y varían por proveedor. Cargar tu tipo alinea el resultado con tu banco o broker.",
      },
      {
        q: "¿Incluye comisiones?",
        a: "Solo si las incorporás en el tipo o ajustás el monto vos.",
      },
    ],
  },

  "comparador-de-prestamos": {
    metaTitle: "Loan Comparison Calculator — Free Online | UtiliHub",
    metaTitleEs: "Comparador de préstamos gratis | UtiliHub",
    metaDescription:
      "Compare total cost of two loans by amount, rate, and term. Free loan comparison calculator.",
    metaDescriptionEs:
      "Compará el costo total de dos préstamos según monto, tasa y plazo. Comparador de préstamos gratis.",
    intro:
      "Put two loan offers side by side: payment and total interest for each so you can pick the cheaper structure.",
    introEs:
      "Poné dos ofertas de préstamo lado a lado: cuota e interés total de cada una para elegir la estructura más barata.",
    about: [
      "Loan comparison is not only about the lowest monthly payment—a longer term can mean much more interest paid overall.",
      "This calculator estimates payment and total cost for two scenarios from principal, rate, and term.",
      "Fees, insurance, and variable rates may not be fully captured; always read the lender disclosure.",
    ],
    aboutEs: [
      "Comparar préstamos no es solo mirar la cuota más baja: un plazo más largo puede significar mucho más interés total.",
      "Esta calculadora estima cuota y costo total de dos escenarios según capital, tasa y plazo.",
      "Comisiones, seguros y tasas variables pueden no quedar cubiertos del todo; leé siempre la información del prestamista.",
    ],
    steps: [
      "Enter amount, rate, and term for loan A.",
      "Enter the same fields for loan B.",
      "Compare monthly payment and total interest.",
    ],
    stepsEs: [
      "Ingresá monto, tasa y plazo del préstamo A.",
      "Ingresá los mismos campos del préstamo B.",
      "Compará cuota mensual e interés total.",
    ],
    faq: [
      {
        q: "Lower payment always better?",
        a: "Not if it comes from a much longer term that inflates total interest. Compare total cost too.",
      },
      {
        q: "Fixed vs variable rate?",
        a: "This tool uses the rates you enter as constant. Variable-rate risk is outside the simple comparison.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuota más baja siempre es mejor?",
        a: "No si viene de un plazo mucho más largo que infla el interés total. Compará también el costo global.",
      },
      {
        q: "¿Tasa fija o variable?",
        a: "La herramienta usa las tasas que cargás como constantes. El riesgo de tasa variable queda fuera de la comparación simple.",
      },
    ],
  },
};
