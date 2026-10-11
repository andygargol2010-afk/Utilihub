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
};
