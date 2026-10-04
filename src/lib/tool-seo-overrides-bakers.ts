import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_BAKERS: Record<string, ToolSeoOverride> = {
  "calculadora-porcentaje-panadero": {
    metaTitle: "Baker's percentage calculator | UtiliHub",
    metaTitleEs: "Calculadora de porcentaje panadero | UtiliHub",
    metaDescription:
      "Convert baker's percentages into dough grams. Hydration, salt, yeast, fat, and a 50–150% starter. Scale from flour or target dough weight.",
    metaDescriptionEs:
      "Pasá el porcentaje panadero a gramos de masa. Hidratación, sal, levadura, grasa y masa madre. Escalado desde harina o peso final.",
    about: [
      "Baker's percentage expresses every ingredient as a share of total flour, which is always 100%. This calculator turns those percentages into grams and can reverse the formula when you know the dough weight you want, not the flour.",
      "Total dough is flour plus water, salt, yeast, fat, and extras. Water grams are flour times hydration. A preferment is not extra mass: its flour and water are subtracted from what you add, using the starter hydration you set (100% means equal flour and water in the starter).",
      "Presets are starting points, not recipes. Sandwich loaf sits near 62% hydration with a little fat. Baguette and pizza stay lean. Ciabatta and focaccia run wetter. Sourdough uses a 20% starter at 100% hydration and no commercial yeast.",
      "The single-field hydration, salt, and yeast tools only report one percentage. This one builds the whole formula. It does not model fermentation time, flour protein, or oven spring. Nothing is uploaded. Zero, negative, and oversized batches are rejected.",
    ],
    aboutEs: [
      "El porcentaje panadero expresa cada ingrediente respecto de la harina total, que siempre es 100%. Esta calculadora pasa esos porcentajes a gramos y puede invertir la fórmula si conocés el peso de masa, no la harina.",
      "La masa total es harina más agua, sal, levadura, grasa y extras. El agua es la harina por la hidratación. La masa madre no suma masa extra: su harina y su agua se restan de lo que agregás, con la hidratación del fermento que indiques (100% es mitad harina y mitad agua).",
      "Los presets son puntos de partida, no recetas. El pan de molde queda cerca del 62% con un poco de grasa. Baguette y pizza van magras. Ciabatta y focaccia son más húmedas. La masa madre usa 20% de fermento al 100% y sin levadura comercial.",
      "Las herramientas sueltas de hidratación, sal y levadura solo muestran un porcentaje. Esta arma la fórmula completa. No modela el tiempo de fermentación, la proteína de la harina ni el salto en el horno. No se sube nada. Se rechazan lotes nulos, negativos o enormes.",
    ],
    steps: [
      "Choose flour weight or a target dough weight.",
      "Pick a loaf, baguette, pizza, ciabatta, focaccia, or sourdough preset, or type your percentages.",
      "If you use a preferment, set its baker's percentage and hydration.",
      "Review grams to weigh, including flour and water already in the starter, then copy the formula.",
    ],
    stepsEs: [
      "Elegí peso de harina o peso de masa objetivo.",
      "Usá un preset de molde, baguette, pizza, ciabatta, focaccia o masa madre, o cargá tus porcentajes.",
      "Si usás prefermento, definí su porcentaje panadero y su hidratación.",
      "Revisá los gramos a pesar, incluida la harina y el agua que ya trae el fermento, y copiá la fórmula.",
    ],
    faq: [
      {
        q: "How is baker's percentage calculated?",
        a: "Flour is 100%. Water grams equal flour times hydration divided by 100. Salt, yeast, fat, and extras use the same rule. Total dough is the sum. If you enter a target dough weight, flour is that weight times 100 divided by the sum of all percentages.",
      },
      {
        q: "How is the sourdough starter counted?",
        a: "Starter percentage is starter weight divided by total flour. At 100% starter hydration, half of that weight is flour and half is water, both already included in the total flour and the dough water. The tool shows what is left to add.",
      },
      {
        q: "Is this the same as the bread hydration tool?",
        a: "No. The hydration tool only divides water by flour. This calculator builds the full formula, scales to a dough weight, and splits a preferment so you do not weigh the same flour twice.",
      },
      {
        q: "Are instant and fresh yeast the same percentage?",
        a: "No. Presets use instant yeast. Fresh yeast is roughly three times the instant amount by weight. Switch the yeast type and the gram result is multiplied; the baker's percentage shown stays the instant reference unless you edit it.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. Weights are calculated in the browser. The result is a kitchen formula, not a food-safety or bakery-production guarantee.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el porcentaje panadero?",
        a: "La harina es 100%. El agua es la harina por la hidratación dividida por 100. Sal, levadura, grasa y extras usan la misma regla. La masa es la suma. Si cargás un peso objetivo, la harina es ese peso por 100 dividido por la suma de todos los porcentajes.",
      },
      {
        q: "¿Cómo se cuenta la masa madre?",
        a: "El porcentaje de fermento es su peso dividido por la harina total. Al 100% de hidratación, la mitad de ese peso es harina y la mitad agua, ya incluidas en la harina total y en el agua de la masa. La herramienta muestra lo que falta agregar.",
      },
      {
        q: "¿Es lo mismo que la herramienta de hidratación del pan?",
        a: "No. Esa solo divide agua por harina. Esta arma la fórmula completa, escala a un peso de masa y separa el prefermento para no pesar dos veces la misma harina.",
      },
      {
        q: "¿La levadura fresca usa el mismo porcentaje?",
        a: "No. Los presets usan levadura instantánea. La fresca pesa unas tres veces más. Si cambiás el tipo, los gramos se multiplican; el porcentaje mostrado sigue siendo la referencia instantánea salvo que lo edites.",
      },
      {
        q: "¿Se sube algo?",
        a: "No. Los pesos se calculan en el navegador. El resultado es una fórmula de cocina, no una garantía de inocuidad ni de producción.",
      },
    ],
  },
};
