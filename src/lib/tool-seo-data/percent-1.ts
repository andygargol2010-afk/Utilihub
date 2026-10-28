// TOOL_SEO_OVERRIDES_PERCENT part 1 — split out of ../tool-seo-overrides-percent.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverridePercent } from "../tool-seo-overrides-percent";

export const TOOL_SEO_OVERRIDES_PERCENT_1: Record<string, ToolSeoOverridePercent> = {
  "porcentaje-aumento": {
    metaTitle: "Percentage Increase Calculator — From Old to New Value | UtiliHub",
    metaTitleEs: "Calculadora de aumento porcentual — de valor inicial a final | UtiliHub",
    metaDescription:
      "Calculate percentage increase between two numbers: ((new − old) ÷ old) × 100. Free, instant, no signup.",
    metaDescriptionEs:
      "Calculá el aumento porcentual entre dos números: ((nuevo − inicial) ÷ inicial) × 100. Gratis, al instante, sin registro.",
    about: [
      "Percentage increase measures relative growth from a baseline. From 80 to 100 is +25%, not +20 points on a 100 scale.",
      "Marketers, analysts, and students use it for KPIs, prices, and scores whenever the starting value is the reference.",
      "The tool also shows absolute change and the growth multiplier so you can cross-check the percent.",
    ],
    aboutEs: [
      "El aumento porcentual mide el crecimiento relativo respecto a un punto de partida. De 80 a 100 es +25%, no +20 puntos.",
      "Sirve para KPIs, precios y notas cuando el valor inicial es la referencia.",
      "También muestra el cambio absoluto y el factor de crecimiento para contrastar el porcentaje.",
    ],
    steps: [
      "Enter the initial value and the new value.",
      "Calculate to get the percentage increase.",
      "Use the absolute change card if you also need the raw difference.",
    ],
    stepsEs: [
      "Ingresá el valor inicial y el valor nuevo.",
      "Calculá para obtener el aumento porcentual.",
      "Usá la tarjeta de diferencia absoluta si también necesitás el cambio en unidades.",
    ],
    faq: [
      { q: "Percentage increase vs percentage points?", a: "Points are the arithmetic gap between two percents. Increase is relative to the starting amount." },
      { q: "Why is zero baseline invalid?", a: "Dividing by zero is undefined. Report an absolute change instead." },
    ],
    faqEs: [
      { q: "¿Aumento porcentual o puntos porcentuales?", a: "Los puntos son la resta entre dos porcentajes. El aumento es relativo al valor inicial." },
      { q: "¿Por qué no sirve un inicial en cero?", a: "Dividir por cero no está definido. Informá el cambio absoluto." },
    ],
  },
  "porcentaje-disminucion": {
    metaTitle: "Percentage Decrease Calculator — Relative Drop From Baseline | UtiliHub",
    metaTitleEs: "Calculadora de disminución porcentual — caída relativa | UtiliHub",
    metaDescription:
      "Find percentage decrease from an original value to a lower one. Free online relative-drop calculator.",
    metaDescriptionEs:
      "Obtené la disminución porcentual desde un valor original a uno menor. Calculadora online gratis.",
    about: [
      "Percentage decrease answers how large a cut is relative to where you started — standard for discounts and losses.",
      "A fall from 200 to 150 is a 25% decrease. The absolute loss is 50 units.",
      "If the second value is higher, the signed result turns negative; switch framing to percentage increase.",
    ],
    aboutEs: [
      "La disminución porcentual indica qué tan grande fue el recorte respecto al punto de partida.",
      "Bajar de 200 a 150 es una caída del 25%. La pérdida absoluta es 50 unidades.",
      "Si el segundo valor es mayor, el signo se invierte: conviene usar la calculadora de aumento.",
    ],
    steps: [
      "Enter the original value and the value after the drop.",
      "Calculate the percentage decrease.",
      "Check units lost for the absolute interpretation.",
    ],
    stepsEs: [
      "Ingresá el valor original y el valor después de la baja.",
      "Calculá la disminución porcentual.",
      "Revisá las unidades perdidas para la lectura absoluta.",
    ],
    faq: [
      { q: "Same as sale discount tools?", a: "Discount tools often apply a known % to a price. Here you recover the % from two observed amounts." },
      { q: "Weight-loss example?", a: "Yes — use starting weight and current weight as the two inputs." },
    ],
    faqEs: [
      { q: "¿Es igual a una calculadora de descuento?", a: "Las de descuento suelen aplicar un % conocido al precio. Aquí recuperás el % a partir de dos montos." },
      { q: "¿Sirve para pérdida de peso?", a: "Sí: peso inicial y peso actual como entradas." },
    ],
  },
  "diferencia-porcentual": {
    metaTitle: "Percentage Difference Calculator — Symmetric Comparison | UtiliHub",
    metaTitleEs: "Calculadora de diferencia porcentual — comparación simétrica | UtiliHub",
    metaDescription:
      "Symmetric percentage difference of two values versus their average. Free peer-comparison tool.",
    metaDescriptionEs:
      "Diferencia porcentual simétrica entre dos valores respecto a su promedio. Herramienta gratis.",
    about: [
      "Percentage difference treats both numbers as peers by dividing the gap by their midpoint.",
      "Swapping A and B does not change the result — unlike percentage change, which needs a baseline.",
      "Use it for lab replicates, competing quotes, or any pair without a clear “before” value.",
    ],
    aboutEs: [
      "La diferencia porcentual trata ambos números como pares al dividir la brecha por el punto medio.",
      "Intercambiar A y B no cambia el resultado, a diferencia del cambio porcentual.",
      "Útil en réplicas de laboratorio, cotizaciones rivales o pares sin un “antes” claro.",
    ],
    steps: [
      "Enter value A and value B.",
      "Calculate to get the percentage difference.",
      "Prefer percentage change if one value is the official baseline.",
    ],
    stepsEs: [
      "Ingresá el valor A y el valor B.",
      "Calculá la diferencia porcentual.",
      "Preferí el cambio porcentual si uno de los valores es la base oficial.",
    ],
    faq: [
      { q: "Why the average in the denominator?", a: "The midpoint keeps the measure symmetric for unordered pairs." },
      { q: "Both zero?", a: "Undefined — there is no scale to compare." },
    ],
    faqEs: [
      { q: "¿Por qué el promedio en el denominador?", a: "El punto medio mantiene la medida simétrica para pares sin orden." },
      { q: "¿Ambos en cero?", a: "Indefinido: no hay escala para comparar." },
    ],
  },
  "porcentaje-de-porcentaje": {
    metaTitle: "Percent of a Percent Calculator — Multiply Two Rates | UtiliHub",
    metaTitleEs: "Calculadora porcentaje de un porcentaje — producto de tasas | UtiliHub",
    metaDescription:
      "What is 30% of 40%? Multiply percentage rates correctly (result: 12%). Free stacked-percent tool.",
    metaDescriptionEs:
      "¿Cuánto es 30% de 40%? Multiplicá tasas porcentuales bien (resultado: 12%). Herramienta gratis.",
    about: [
      "Stacked percentages multiply as decimals: 30% of 40% is 0.12 of the whole, written 12%.",
      "People often add rates by mistake (30+40=70). This calculator prevents that error.",
      "An example card scales the combined rate onto a base of 1000 for intuition.",
    ],
    aboutEs: [
      "Los porcentajes encadenados se multiplican en decimal: 30% de 40% es 0,12 del total (12%).",
      "Es habitual sumar por error (30+40=70). Esta calculadora evita ese fallo.",
      "Una tarjeta de ejemplo aplica la tasa combinada sobre una base de 1000.",
    ],
    steps: [
      "Enter the first percent and the second percent.",
      "Calculate the combined percent of the whole.",
      "Use the example-on-1000 card to sanity-check magnitude.",
    ],
    stepsEs: [
      "Ingresá el primer y el segundo porcentaje.",
      "Calculá el porcentaje combinado del total.",
      "Usá el ejemplo sobre 1000 para validar la magnitud.",
    ],
    faq: [
      { q: "Compound interest?", a: "No — this multiplies two static rates, not growth over periods." },
      { q: "Does order matter?", a: "No for the product of two rates." },
    ],
    faqEs: [
      { q: "¿Es interés compuesto?", a: "No: multiplica dos tasas fijas, no un crecimiento por periodos." },
      { q: "¿Importa el orden?", a: "No para el producto de dos tasas." },
    ],
  },
};
