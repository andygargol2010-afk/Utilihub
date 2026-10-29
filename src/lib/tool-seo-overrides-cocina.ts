import type { ToolSeoOverride } from "./tool-seo-overrides";

/** SEO overrides for small cocina (cooking) formula tools. */
export const TOOL_SEO_OVERRIDES_COCINA: Record<string, ToolSeoOverride> = {
  "conversion-cucharadas-ml": {
    metaTitle: "Tablespoons to Milliliters Converter — tbsp to ml | UtiliHub",
    metaTitleEs: "Conversor de cucharadas a mililitros (cucharada a ml) | UtiliHub",
    metaDescription:
      "Convert tablespoons to milliliters instantly: 1 US tbsp = 14.79 ml, 1 metric tbsp = 15 ml, 1 AU tbsp = 20 ml. Free, in your browser.",
    metaDescriptionEs:
      "Convertí cucharadas a mililitros al instante: 1 cucharada de EE. UU. = 14,79 ml, métrica = 15 ml, australiana = 20 ml. Gratis, en el navegador.",
    about: [
      "Tablespoon size depends on the country: the US tablespoon is 14.7868 ml, the metric tablespoon used in many recipes is 15 ml, and the Australian tablespoon is 20 ml.",
      "This converter multiplies the number of tablespoons by the ml-per-tablespoon factor you enter, so you can match any recipe's convention.",
    ],
    aboutEs: [
      "El tamaño de la cucharada depende del país: la de EE. UU. es 14,7868 ml, la cucharada métrica de muchas recetas es 15 ml y la australiana es 20 ml.",
      "El conversor multiplica las cucharadas por el factor de ml por cucharada que ingresés, así podés seguir la convención de cualquier receta.",
    ],
    steps: [
      "Enter the number of tablespoons.",
      "Enter the ml-per-tablespoon factor (14.79 US, 15 metric, 20 AU).",
      "Read the result in milliliters.",
    ],
    stepsEs: [
      "Ingresá la cantidad de cucharadas.",
      "Ingresá el factor de ml por cucharada (14,79 EE. UU., 15 métrica, 20 AU).",
      "Leé el resultado en mililitros.",
    ],
    faq: [
      {
        q: "How many ml are in a tablespoon?",
        a: "1 US tablespoon = 14.79 ml, 1 metric tablespoon = 15 ml, 1 Australian tablespoon = 20 ml. Check which one your recipe uses.",
      },
      {
        q: "How many ml is a teaspoon?",
        a: "A US teaspoon is 4.93 ml (often rounded to 5 ml); 1 tablespoon equals 3 teaspoons.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántos ml tiene una cucharada?",
        a: "1 cucharada de EE. UU. = 14,79 ml, 1 cucharada métrica = 15 ml y 1 australiana = 20 ml. Verificá cuál usa tu receta.",
      },
      {
        q: "¿Cuántos ml tiene una cucharadita?",
        a: "La cucharadita de EE. UU. es 4,93 ml (suele redondearse a 5 ml); 1 cucharada equivale a 3 cucharaditas.",
      },
    ],
  },
  "calculadora-ratio-cafe": {
    metaTitle: "Coffee Ratio Calculator — Coffee to Water Ratio (1:15) | UtiliHub",
    metaTitleEs: "Calculadora de ratio de café — proporción café y agua (1:15) | UtiliHub",
    metaDescription:
      "Free coffee-to-water ratio calculator. Enter coffee grams and brew ratio (1:15, 1:16, 1:17) to get the water in grams for pour-over, French press, or drip. Runs in your browser.",
    metaDescriptionEs:
      "Calculadora de proporción café-agua gratis: ingresá los gramos de café y el ratio (1:15, 1:16, 1:17) y obtené los gramos de agua para V60, prensa francesa o filtrado. En el navegador, sin registro.",
    about: [
      "Brewing water = coffee grams × ratio. A 1:15 ratio with 20 g of coffee needs 300 g of water; a lighter 1:17 cup needs 340 g.",
      "Common ranges: 1:15 to 1:17 for pour-over, 1:12 to 1:15 for French press, 1:16 to 1:17 for drip machines.",
      "Weigh both coffee and water in grams (1 g of water ≈ 1 ml) so the ratio stays consistent on any scale.",
    ],
    aboutEs: [
      "Agua de preparación = gramos de café × ratio. Con 20 g de café y un ratio 1:15 necesitás 300 g de agua; con 1:17, 340 g.",
      "Rangos habituales: 1:15 a 1:17 en vertido (V60), 1:12 a 1:15 en prensa francesa y 1:16 a 1:17 en filtrado de goteo.",
      "Pesá café y agua en gramos (1 g de agua ≈ 1 ml) para que el ratio sea igual con cualquier balanza.",
    ],
    steps: [
      "Enter the coffee weight in grams.",
      "Enter the brew ratio (e.g. 15 for 1:15).",
      "Read the water needed in grams and start brewing.",
    ],
    stepsEs: [
      "Ingresá el peso del café en gramos.",
      "Ingresá el ratio de preparación (p. ej. 15 para 1:15).",
      "Leé los gramos de agua necesarios y prepará.",
    ],
    faq: [
      {
        q: "How do I calculate the coffee to water ratio?",
        a: "Water (g) = coffee (g) × ratio. Example: 18 g of coffee at 1:16 → 18 × 16 = 288 g of water.",
      },
      {
        q: "What is a good ratio for pour-over?",
        a: "1:15 to 1:17 is typical: 1:15 gives a stronger cup, 1:17 a lighter one.",
      },
      {
        q: "Is it free and private?",
        a: "Yes. The calculation runs in your browser with no signup and nothing is uploaded.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la proporción de café y agua?",
        a: "Agua (g) = café (g) × ratio. Ejemplo: 18 g de café con 1:16 → 18 × 16 = 288 g de agua.",
      },
      {
        q: "¿Qué ratio uso para café vertido?",
        a: "De 1:15 a 1:17 es lo habitual: 1:15 da una taza más intensa y 1:17 más suave.",
      },
      {
        q: "¿Es gratis y privado?",
        a: "Sí. El cálculo corre en tu navegador sin registro y no se sube nada.",
      },
    ],
  },
};
