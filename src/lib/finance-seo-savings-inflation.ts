/** Finance SEO: savings goal + inflation. */
import type { FinanceSeoBlockRest } from "./finance-seo-top-rest-a";

export const FINANCE_SEO_SAVINGS_INFLATION: Record<string, FinanceSeoBlockRest> = {
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
