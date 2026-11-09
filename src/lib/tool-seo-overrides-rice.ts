import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RICE: Record<string, ToolSeoOverride> = {
  "calculadora-arroz": {
    metaTitle: "Rice Water Ratio Calculator — White, Basmati, Brown | UtiliHub",
    metaTitleEs: "Calculadora de agua para arroz — blanco, basmati y integral | UtiliHub",
    metaDescription:
      "Estimate absorption-method water and cooked weight for white, basmati, jasmine, sushi, brown, and parboiled rice. Zero grams does not invent a pot. Runs locally.",
    metaDescriptionEs:
      "Estimá el agua del método de absorción y el peso cocido para arroz blanco, basmati, jazmín, sushi, integral y parboil. Cero gramos no inventa una olla. Corre en el navegador.",
    about: [
      "This is an absorption-method planner, not a boiling-in-excess timer. Each variety uses a fixed water-to-dry-rice ratio.",
      "White long-grain uses 1.5 ml per gram. Basmati uses 1.25, jasmine 1.2, sushi 1.1, brown 2, and parboiled 1.75.",
      "Cooked weight is a kitchen estimate after absorption. It does not add salt, oil, or evaporation from an open pot.",
    ],
    aboutEs: [
      "Es un plan del método de absorción, no un temporizador de hervido con exceso de agua. Cada variedad usa una relación fija de agua por gramo seco.",
      "El blanco de grano largo usa 1,5 ml por gramo. El basmati usa 1,25, el jazmín 1,2, el de sushi 1,1, el integral 2 y el parboil 1,75.",
      "El peso cocido es una estimación de cocina tras absorber. No suma sal, aceite ni evaporación de una olla destapada.",
    ],
    steps: [
      "Pick white rice and enter 200 g, or use the basmati example.",
      "Read water in milliliters and the estimated cooked weight.",
      "Copy the result. Zero, negative, or more than 5000 g does not produce a pot.",
    ],
    stepsEs: [
      "Elegí arroz blanco e ingresá 200 g, o usá el ejemplo de basmati.",
      "Leé el agua en mililitros y el peso cocido estimado.",
      "Copiá el resultado. Cero, negativo o más de 5000 g no produce una olla.",
    ],
    faq: [
      { q: "How much water is 200 g of white rice?", a: "300 ml, at 1.5 ml per gram. Estimated cooked weight is 600 g." },
      { q: "What about 150 g of basmati?", a: "187.5 ml of water, at 1.25 ml per gram. Estimated cooked weight is 420 g." },
      { q: "Is the rice uploaded?", a: "No. The ratio is calculated in the browser. Nothing is sent." },
    ],
    faqEs: [
      { q: "¿Cuánta agua son 200 g de arroz blanco?", a: "300 ml, a 1,5 ml por gramo. El peso cocido estimado es 600 g." },
      { q: "¿Y 150 g de basmati?", a: "187,5 ml de agua, a 1,25 ml por gramo. El peso cocido estimado es 420 g." },
      { q: "¿Se sube el arroz?", a: "No. La relación se calcula en el navegador. No se envía nada." },
    ],
  },
};
