/** SEO-growth overrides part b3. */
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_B3: Record<string, ToolSeoOverrideGrowth> = {
  "mpg-a-litros": {
    metaTitle: "MPG to L/100km Converter — Fuel Economy | UtiliHub",
    metaTitleEs: "Conversor MPG ↔ L/100 km — consumo de combustible | UtiliHub",
    metaDescription:
      "Convert US miles per gallon to liters per 100 kilometers and the reverse for vehicle fuel economy labels.",
    metaDescriptionEs:
      "Convertí millas por galón (EE.UU.) a litros cada 100 km y al revés, para etiquetas de consumo de vehículos.",
    about: [
      "US fuel economy is often stated in MPG; many other regions use L/100 km. The values are inverse-related, not a linear scale.",
      "We use the standard factor ≈ 235.215 to convert between US MPG and L/100 km.",
      "Imperial (UK) gallons differ from US gallons—this tool uses the US definition common on many online specs.",
    ],
    aboutEs: [
      "En EE.UU. el consumo suele ir en MPG; en otras regiones en L/100 km. Son magnitudes inversas, no una escala lineal.",
      "Usamos el factor estándar ≈ 235,215 entre MPG (EE.UU.) y L/100 km.",
      "El galón imperial (UK) no es el de EE.UU.: esta tool usa la definición estadounidense.",
    ],
    steps: [
      "Enter the fuel-economy value.",
      "Choose direction: MPG→L/100 or L/100→MPG.",
      "Read the converted figure for comparison shopping.",
    ],
    stepsEs: [
      "Ingresá el valor de consumo.",
      "Elegí dirección: MPG→L/100 o L/100→MPG.",
      "Leé la cifra convertida para comparar vehículos.",
    ],
    faq: [
      {
        q: "Higher MPG or lower L/100?",
        a: "Both mean better efficiency. 30 MPG is more efficient than 20 MPG; 6 L/100 is more efficient than 9 L/100.",
      },
      {
        q: "City vs highway?",
        a: "Labels often split cycles. Convert each rating separately.",
      },
    ],
    faqEs: [
      {
        q: "¿Más MPG o menos L/100?",
        a: "Ambos indican mejor eficiencia. 30 MPG es mejor que 20; 6 L/100 es mejor que 9.",
      },
      {
        q: "¿Ciudad o ruta?",
        a: "Las etiquetas suelen separar ciclos. Convertí cada valor por separado.",
      },
    ],
  },

  "ppi-pantalla": {
    metaTitle: "PPI Calculator — Pixels Per Inch from Diagonal | UtiliHub",
    metaTitleEs: "Calculadora de PPI de pantalla | UtiliHub",
    metaDescription:
      "Compute screen pixel density (PPI) from resolution width, height, and diagonal size in inches.",
    metaDescriptionEs:
      "Calculá la densidad de píxeles (PPI) a partir de la resolución y la diagonal en pulgadas.",
    about: [
      "Pixels per inch measures how densely pixels are packed on a diagonal-specified panel. Higher PPI generally looks sharper at the same viewing distance.",
      "PPI = √(width² + height²) / diagonal_inches using the resolution’s pixel counts.",
      "Marketing “Retina” claims depend on viewing distance; use PPI as a neutral comparison between monitors and phones.",
    ],
    aboutEs: [
      "Los píxeles por pulgada miden qué tan juntos están los píxeles en un panel definido por su diagonal. Más PPI suele verse más nítido a igual distancia.",
      "PPI = √(ancho² + alto²) / diagonal_en_pulgadas usando la resolución en píxeles.",
      "Las promesas tipo “Retina” dependen de la distancia de visionado; usá el PPI como comparación neutral entre monitores y celulares.",
    ],
    steps: [
      "Enter width px, height px, and diagonal inches.",
      "Calculate PPI.",
      "Compare panels before buying or designing UI assets.",
    ],
    stepsEs: [
      "Ingresá ancho px, alto px y diagonal en pulgadas.",
      "Calculá el PPI.",
      "Compará paneles antes de comprar o diseñar assets de UI.",
    ],
    faq: [
      {
        q: "Logical vs physical pixels?",
        a: "Use the panel’s native resolution, not CSS CSS-px after scaling, for hardware PPI.",
      },
      {
        q: "Ultrawide screens?",
        a: "The same formula applies; extreme aspect ratios still use the pixel diagonal over the stated inch size.",
      },
    ],
    faqEs: [
      {
        q: "¿Píxeles lógicos o físicos?",
        a: "Usá la resolución nativa del panel, no los CSS-px tras el escalado, para el PPI de hardware.",
      },
      {
        q: "¿Pantallas ultrawide?",
        a: "Vale la misma fórmula; ratios extremos siguen usando la diagonal en píxeles sobre las pulgadas indicadas.",
      },
    ],
  },

  "crecimiento-periodico": {
    metaTitle: "Periodic Savings Calculator — Daily or Weekly Adds | UtiliHub",
    metaTitleEs: "Calculadora de ahorro periódico (diario o semanal) | UtiliHub",
    metaDescription:
      "Project a simple total if you add a fixed amount every day or every week for a number of years, plus a starting balance.",
    metaDescriptionEs:
      "Proyectá un total simple si sumás un monto fijo cada día o cada semana durante varios años, más un saldo inicial.",
    about: [
      "This model is linear contribution math: start + contribution × number of periods. It does not apply compound interest (use the compound-interest tool for that).",
      "Daily mode uses 365 periods per year; weekly mode uses 52. Leap days and exact calendar weeks are ignored for simplicity.",
      "Good for “what if I put aside $X a day” planning before you layer returns or inflation.",
    ],
    aboutEs: [
      "El modelo es lineal: inicio + aporte × cantidad de períodos. No aplica interés compuesto (para eso está la tool de interés compuesto).",
      "El modo diario usa 365 períodos por año; el semanal, 52. Se ignoran años bisiestos y semanas exactas por simplicidad.",
      "Sirve para planear “¿y si aparto $X al día?” antes de sumar rendimientos o inflación.",
    ],
    steps: [
      "Enter contribution, frequency, years, and optional starting balance.",
      "Project the total contributions and end balance.",
      "Compare with compound-interest tools if you earn a return.",
    ],
    stepsEs: [
      "Ingresá aporte, frecuencia, años y saldo inicial opcional.",
      "Proyectá aportes totales y saldo final.",
      "Compará con herramientas de interés compuesto si hay rendimiento.",
    ],
    faq: [
      {
        q: "Why not compound here?",
        a: "Keeping contributions separate from returns avoids mixing two questions. Stack tools when you need both.",
      },
      {
        q: "Monthly contributions?",
        a: "Approximate with weekly or scale the daily amount; a dedicated monthly compound tool covers rate-based growth.",
      },
    ],
    faqEs: [
      {
        q: "¿Por qué sin interés compuesto?",
        a: "Separar aportes de rendimientos evita mezclar dos preguntas. Combiná tools cuando necesites ambas.",
      },
      {
        q: "¿Aportes mensuales?",
        a: "Aproximá con semanal o escalá el monto diario; una tool de compuesto mensual cubre el crecimiento con tasa.",
      },
    ],
  },
};
