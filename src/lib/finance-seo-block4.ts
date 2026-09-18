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
  cagr: {
    metaTitle: "CAGR Calculator — Compound Annual Growth Rate | UtiliHub",
    metaTitleEs: "Calculadora de CAGR gratis | UtiliHub",
    metaDescription:
      "Free CAGR calculator. Measure compound annual growth rate from start value, end value, and years. No signup.",
    metaDescriptionEs:
      "Calculadora de CAGR gratis. Medí la tasa de crecimiento anual compuesto con valor inicial, final y años. Sin registro.",
    intro:
      "CAGR compresses multi-year growth into a single annual rate as if returns compounded smoothly each year.",
    introEs:
      "El CAGR resume el crecimiento de varios años en una sola tasa anual, como si el rendimiento se capitalizara de forma uniforme.",
    about: [
      "Compound annual growth rate (CAGR) answers: if an investment grew from a start value to an end value over N years, what constant annual rate would produce the same result?",
      "The usual formula is (end / start)^(1/N) − 1. It ignores path volatility—useful for comparing funds or projects over different horizons.",
      "CAGR is not a forecast. Past growth need not repeat, and fees or deposits change real results.",
    ],
    aboutEs: [
      "La tasa de crecimiento anual compuesto (CAGR) responde: si una inversión pasó de un valor inicial a uno final en N años, ¿qué tasa anual constante daría el mismo resultado?",
      "La fórmula habitual es (final / inicial)^(1/N) − 1. Ignora la volatilidad del camino: sirve para comparar fondos o proyectos en horizontes distintos.",
      "El CAGR no es un pronóstico. El pasado no se repite solo, y comisiones o aportes cambian el resultado real.",
    ],
    steps: [
      "Enter the starting value.",
      "Enter the ending value.",
      "Enter the number of years.",
      "Read the CAGR as a percentage.",
    ],
    stepsEs: [
      "Ingresá el valor inicial.",
      "Ingresá el valor final.",
      "Ingresá la cantidad de años.",
      "Leé el CAGR en porcentaje.",
    ],
    faq: [
      {
        q: "CAGR vs average annual return?",
        a: "A simple average of yearly returns can differ from CAGR when returns vary. CAGR is the geometric path that links start to end in N years.",
      },
      {
        q: "Can CAGR be negative?",
        a: "Yes, if the end value is lower than the start value over the period.",
      },
    ],
    faqEs: [
      {
        q: "¿CAGR o promedio de retornos anuales?",
        a: "El promedio simple de retornos anuales puede diferir del CAGR cuando los años varían. El CAGR es la vía geométrica que une inicio y fin en N años.",
      },
      {
        q: "¿Puede ser negativo?",
        a: "Sí, si el valor final es menor que el inicial en el período.",
      },
    ],
  },

  "pago-anticipado-de-prestamo": {
    metaTitle: "Early Loan Repayment Calculator | UtiliHub",
    metaTitleEs: "Calculadora de pago anticipado de préstamo | UtiliHub",
    metaDescription:
      "Estimate interest and time saved when you make extra loan payments. Free early repayment calculator.",
    metaDescriptionEs:
      "Estimá el interés y el tiempo que ahorrás con pagos extra de un préstamo. Calculadora de pago anticipado gratis.",
    intro:
      "See how extra payments shorten a loan and reduce total interest compared with the original schedule.",
    introEs:
      "Mirá cómo los pagos extra acortan el préstamo y bajan el interés total frente al plan original.",
    about: [
      "Extra principal payments reduce the balance faster so later interest accrues on a smaller amount. The benefit depends on rate, remaining term, and how large the extras are.",
      "This calculator compares a baseline amortizing schedule with a scenario that includes additional payments.",
      "Confirm with your lender whether prepayment penalties apply and whether extras go to principal by default.",
    ],
    aboutEs: [
      "Los pagos extra de capital bajan el saldo más rápido y el interés futuro se aplica sobre menos deuda. El beneficio depende de la tasa, el plazo restante y el tamaño de los extras.",
      "Esta calculadora compara un plan amortizable base con un escenario con pagos adicionales.",
      "Confirmá con el prestamista si hay penalidad por prepago y si los extras van a capital por defecto.",
    ],
    steps: [
      "Enter the loan balance, rate, and remaining term.",
      "Add the extra payment amount and frequency.",
      "Compare months saved and interest saved.",
    ],
    stepsEs: [
      "Ingresá saldo, tasa y plazo restante.",
      "Sumá el monto y la frecuencia del pago extra.",
      "Compará meses e interés ahorrados.",
    ],
    faq: [
      {
        q: "Is it better to invest than prepay?",
        a: "It depends on after-tax investment return versus the loan rate, risk tolerance, and liquidity needs. The calculator only shows the loan-side math.",
      },
      {
        q: "Monthly vs lump-sum extra?",
        a: "Regular extras and one-time principal payments both help; the tool lets you model the pattern you plan to use.",
      },
    ],
    faqEs: [
      {
        q: "¿Conviene más invertir que prepagar?",
        a: "Depende del retorno después de impuestos vs la tasa del préstamo, el riesgo y la liquidez. La calculadora solo muestra la matemática del préstamo.",
      },
      {
        q: "¿Extra mensual o pago único?",
        a: "Ambos ayudan; modelá el patrón que planeás usar.",
      },
    ],
  },

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
