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
      "Use it to compare “save monthly vs yearly”, to see the impact of a higher rate, or to stress-test a goal before you commit to a product. Results are mathematical estimates—not advice and not a guarantee of any bank or fund return.",
    ],
    aboutEs: [
      "El interés compuesto consiste en ganar rendimiento sobre el capital inicial y también sobre los intereses ya capitalizados. A largo plazo, pequeñas diferencias de tasa o de frecuencia de aportes cambian mucho el saldo final.",
      "Esta calculadora proyecta un valor futuro a partir del monto inicial, la tasa anual, los años, la frecuencia de capitalización y depósitos periódicos opcionales. El cálculo corre en tu navegador; no se guarda nada en un servidor.",
      "Sirve para comparar “ahorrar cada mes vs una vez al año”, ver el efecto de una tasa más alta o probar una meta antes de elegir un producto. Los resultados son estimaciones matemáticas, no asesoramiento ni garantía de rendimiento.",
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
      "This tool uses the classic fixed-payment formula based on the loan amount, nominal annual rate, and number of periods. It helps you compare “shorter term / higher payment” vs “longer term / lower payment” before you sign.",
      "Banks may add fees, insurance, or different day-count conventions. Always confirm the APR and schedule on the real offer; this page is a transparent math check, not a lender quote.",
    ],
    aboutEs: [
      "En un préstamo amortizable clásico, cada cuota se parte en interés y capital. Al principio pesa más el interés; después se reduce el capital más rápido. La cuota se elige para que el saldo llegue a cero al final del plazo.",
      "Esta herramienta usa la fórmula de cuota fija según monto, tasa nominal anual y cantidad de períodos. Sirve para comparar “plazo corto / cuota alta” vs “plazo largo / cuota baja” antes de firmar.",
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
        q: "What is a “good” ROI?",
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
        q: "¿Qué es un ROI “bueno”?",
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

  "objetivo-de-ahorro": {
    metaTitle: "Savings Goal Calculator — Monthly Contribution | UtiliHub",
    metaTitleEs: "Calculadora de meta de ahorro gratis | UtiliHub",
    metaDescription:
      "Free savings goal calculator. Find how much to save per month to reach a target amount on time. No signup required.",
    metaDescriptionEs:
      "Calculadora de meta de ahorro gratis. Averiguá cuánto ahorrar por mes para llegar a un monto a tiempo. Sin registro.",
    intro:
      "Work backwards from a savings target: given the goal amount, the deadline, and any starting balance or return, estimate the monthly contribution you need.",
    introEs:
      "Partí de una meta de ahorro: con el monto objetivo, el plazo y un saldo inicial o rendimiento opcional, estimá el aporte mensual que necesitás.",
    about: [
      "A savings goal is easier to hit when you turn it into a concrete monthly number. This calculator solves for the contribution required to reach a target balance within a time frame.",
      "You can include a starting amount already saved and, when relevant, an assumed annual return so invested savings are not treated as zero-yield cash.",
      "Real life adds inflation, irregular income, and rate changes. Re-run the numbers when your income or deadline changes; use the result as a budget line, not a rigid promise.",
    ],
    aboutEs: [
      "Una meta de ahorro se vuelve alcanzable cuando la convertís en un número mensual concreto. Esta calculadora obtiene el aporte necesario para llegar a un saldo objetivo en un plazo.",
      "Podés incluir un monto ya ahorrado y, si aplica, un rendimiento anual estimado para no tratar el ahorro invertido como efectivo a tasa cero.",
      "En la vida real hay inflación, ingresos irregulares y cambios de tasa. Recalculá cuando cambie tu ingreso o el plazo; usá el resultado como línea de presupuesto, no como promesa rígida.",
    ],
    steps: [
      "Enter the target amount you want to reach.",
      "Set how many months or years you have until the deadline.",
      "Add any amount already saved and an optional expected return.",
      "Read the required monthly contribution and adjust the goal or timeline if needed.",
    ],
    stepsEs: [
      "Ingresá el monto objetivo al que querés llegar.",
      "Definí cuántos meses o años tenés hasta la fecha límite.",
      "Sumá lo ya ahorrado y un rendimiento esperado opcional.",
      "Leé el aporte mensual requerido y ajustá la meta o el plazo si hace falta.",
    ],
    faq: [
      {
        q: "Should I include investment returns?",
        a: "If the money will sit in a low-yield account, use 0% or a conservative rate. If it will be invested, a modest expected return reduces the required monthly deposit—but returns are not guaranteed.",
      },
      {
        q: "What if I cannot afford the monthly amount?",
        a: "Extend the deadline, lower the target, or raise income/cut other costs. The calculator shows the trade-off clearly so you can pick a plan you can sustain.",
      },
      {
        q: "Is this the same as an emergency fund calculator?",
        a: "Related. An emergency fund is a specific goal (often 3–6 months of expenses). You can use this tool for that goal or for any other target (trip, down payment, buffer).",
      },
    ],
    faqEs: [
      {
        q: "¿Debo incluir rendimiento de la inversión?",
        a: "Si el dinero estará en una cuenta de bajo rendimiento, usá 0% o una tasa conservadora. Si estará invertido, un retorno esperado modesto baja el depósito mensual requerido—pero el rendimiento no está garantizado.",
      },
      {
        q: "¿Y si no llego al aporte mensual?",
        a: "Alargá el plazo, bajá la meta o aumentá ingresos/recortá otros gastos. La calculadora muestra el trade-off para elegir un plan sostenible.",
      },
      {
        q: "¿Es lo mismo que un fondo de emergencia?",
        a: "Está relacionado. Un fondo de emergencia es una meta concreta (suele ser 3–6 meses de gastos). Podés usar esta herramienta para eso o para cualquier otro objetivo (viaje, seña, colchón).",
      },
    ],
  },

  "inflacion-y-poder-adquisitivo": {
    metaTitle: "Inflation Calculator — Purchasing Power Online | UtiliHub",
    metaTitleEs: "Calculadora de inflación y poder adquisitivo | UtiliHub",
    metaDescription:
      "Free inflation and purchasing power calculator. See how prices and real value change over time at a given inflation rate. No signup.",
    metaDescriptionEs:
      "Calculadora de inflación y poder adquisitivo gratis. Mirá cómo cambian precios y valor real en el tiempo con una tasa de inflación. Sin registro.",
    intro:
      "See how inflation erodes purchasing power: estimate future prices or the real value of a sum of money after several years at a given inflation rate.",
    introEs:
      "Mirá cómo la inflación erosiona el poder adquisitivo: estimá precios futuros o el valor real de una suma después de varios años a una tasa dada.",
    about: [
      "Inflation means the same basket of goods tends to cost more over time. A nominal balance that does not grow can buy less in the future; wages and returns need to be compared in real terms.",
      "This calculator applies a constant annual inflation rate to project either a future nominal amount or the loss of purchasing power of money held today. It is a teaching and planning tool, not a forecast of official CPI.",
      "For investing, compare nominal returns with inflation to estimate real return. For salaries, check whether raises keep up with the rate you assume here.",
    ],
    aboutEs: [
      "La inflación implica que la misma canasta de bienes suele costar más con el tiempo. Un saldo nominal que no crece puede comprar menos en el futuro; salarios y rendimientos conviene mirarlos en términos reales.",
      "Esta calculadora aplica una tasa anual constante para proyectar un monto nominal futuro o la pérdida de poder adquisitivo del dinero de hoy. Es una herramienta de planificación y aprendizaje, no un pronóstico del IPC oficial.",
      "En inversiones, compará el retorno nominal con la inflación para estimar el retorno real. En salarios, revisá si los aumentos acompañan la tasa que asumís acá.",
    ],
    steps: [
      "Enter today’s amount (price, salary, or cash balance).",
      "Set an annual inflation rate and the number of years.",
      "Calculate to see the projected future nominal value or real purchasing power.",
      "Try a higher/lower rate to see sensitivity.",
    ],
    stepsEs: [
      "Ingresá el monto de hoy (precio, salario o saldo).",
      "Definí una tasa anual de inflación y la cantidad de años.",
      "Calculá para ver el valor nominal futuro o el poder adquisitivo real.",
      "Probá una tasa más alta o más baja para ver la sensibilidad.",
    ],
    faq: [
      {
        q: "Is the inflation rate the same as CPI?",
        a: "CPI is one official measure. You can enter any rate you want to model—historical average, a stressed scenario, or a personal estimate for your city or category of spending.",
      },
      {
        q: "What is purchasing power?",
        a: "It is what a unit of money can buy. If inflation is 5% and your cash earns 0%, after one year that cash typically buys about 5% less of the same basket.",
      },
      {
        q: "How does this relate to real return?",
        a: "Roughly, real return ≈ nominal return − inflation (more precise formulas exist). If your investment returns 8% and inflation is 3%, real growth is near 5% before taxes and fees.",
      },
    ],
    faqEs: [
      {
        q: "¿La tasa de inflación es lo mismo que el IPC?",
        a: "El IPC es una medida oficial. Acá podés cargar la tasa que quieras modelar: un promedio histórico, un escenario de estrés o una estimación personal de tu ciudad o tipo de gasto.",
      },
      {
        q: "¿Qué es el poder adquisitivo?",
        a: "Es lo que puede comprar una unidad de dinero. Si la inflación es 5% y tu efectivo rinde 0%, al cabo de un año ese efectivo suele comprar cerca de un 5% menos de la misma canasta.",
      },
      {
        q: "¿Cómo se relaciona con el retorno real?",
        a: "En forma aproximada, retorno real ≈ retorno nominal − inflación (hay fórmulas más precisas). Si invertís al 8% e inflación es 3%, el crecimiento real ronda el 5% antes de impuestos y comisiones.",
      },
    ],
  },
};

export function financeSeo(slug: string): FinanceSeoBlock | undefined {
  return FINANCE_SEO[slug];
}
