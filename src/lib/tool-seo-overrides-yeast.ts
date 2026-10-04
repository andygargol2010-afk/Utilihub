import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_YEAST: Record<string, ToolSeoOverride> = {
  "conversor-levadura": {
    metaTitle: "Yeast Conversion Calculator | UtiliHub",
    metaTitleEs: "Conversor de levadura de pan | UtiliHub",
    metaDescription:
      "Convert instant, active dry, fresh, and osmotolerant yeast by grams, teaspoons, or packets. Baking ratios stay in the browser.",
    metaDescriptionEs:
      "Convertí levadura instantánea, seca activa, fresca y osmotolerante en gramos, cucharaditas o sobres. Las equivalencias quedan en el navegador.",
    about: [
      "Swap the yeast you have for the yeast a recipe calls for. Enter a weight, an approximate teaspoon, or a standard 7 g packet, pick the source type, and the tool returns instant, active dry, fresh, and osmotolerant amounts.",
      "Weights use the common baking ratio instant : active dry : fresh = 1 : 1.25 : 3. One gram of instant matches 1.25 g of active dry and 3 g of fresh compressed yeast. Osmotolerant instant is treated as equal to regular instant by weight; it is the type meant for doughs above about 10% sugar, not a stronger yeast.",
      "Teaspoons are volume estimates, not a scale: about 3.1 g per teaspoon of instant or osmotolerant yeast and 2.8 g per teaspoon of active dry. Fresh yeast is not converted from teaspoons. A packet is 7 g, close to a US 1/4 oz envelope. Brands vary, so weigh when the recipe is sensitive.",
      "This does not replace the baker's percentage calculator, which builds a full formula, or the air fryer converter, which maps oven time and temperature. Nothing is uploaded. Zero, negative, and amounts above 2 kg of instant-equivalent yeast are rejected.",
    ],
    aboutEs: [
      "Cambiá la levadura que tenés por la que pide la receta. Cargá un peso, una cucharadita aproximada o un sobre de 7 g, elegí el tipo de origen y la tool devuelve instantánea, seca activa, fresca y osmotolerante.",
      "Los pesos usan la equivalencia habitual instantánea : seca activa : fresca = 1 : 1,25 : 3. Un gramo de instantánea equivale a 1,25 g de seca activa y a 3 g de levadura fresca prensada. La instantánea osmotolerante se toma igual a la instantánea común en peso; es la variante para masas con más de un 10% de azúcar, no una levadura más fuerte.",
      "Las cucharaditas son estimaciones de volumen, no una balanza: unos 3,1 g por cucharadita de instantánea u osmotolerante y 2,8 g de seca activa. La fresca no se convierte desde cucharaditas. Un sobre son 7 g, cerca del sobre estadounidense de 1/4 oz. Las marcas varían: pesá si la receta es sensible.",
      "No reemplaza la calculadora de porcentaje panadero, que arma la fórmula completa, ni el conversor de freidora de aire, que traduce tiempo y temperatura de horno. No se sube nada. Se rechazan cantidades nulas, negativas o de más de 2 kg equivalentes de instantánea.",
    ],
    steps: [
      "Choose grams, teaspoons, or a 7 g packet, then the yeast you have.",
      "Enter the amount, or use a packet, teaspoon, or fresh-cube preset.",
      "Read the equivalent weight for instant, active dry, fresh, and osmotolerant yeast.",
      "Copy the swap note and weigh the type you will actually use.",
    ],
    stepsEs: [
      "Elegí gramos, cucharaditas o un sobre de 7 g, y la levadura que tenés.",
      "Cargá la cantidad, o usá un preset de sobre, cucharadita o cubo fresco.",
      "Leé el peso equivalente de instantánea, seca activa, fresca y osmotolerante.",
      "Copiá la nota de cambio y pesá el tipo que vas a usar.",
    ],
    faq: [
      {
        q: "How do you convert fresh yeast to instant?",
        a: "Divide the fresh weight by 3. The tool uses instant : fresh = 1 : 3, so 25 g fresh is about 8.3 g instant and 10.4 g active dry.",
      },
      {
        q: "Is active dry the same as instant yeast?",
        a: "No. Active dry needs about 25% more weight than instant and is often dissolved first. Instant (also called bread-machine or rapid-rise in many packets) can be mixed into the flour.",
      },
      {
        q: "What is a yeast packet in grams?",
        a: "This tool treats one packet as 7 g, the usual US 1/4 oz envelope. A European cube is often 25 g or 42 g of fresh yeast; use the gram unit for those.",
      },
      {
        q: "Does the conversion leave the browser?",
        a: "No. The amount, unit, and yeast type stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se pasa levadura fresca a instantánea?",
        a: "Dividí el peso fresco por 3. La tool usa instantánea : fresca = 1 : 3, así que 25 g de fresca son unos 8,3 g de instantánea y 10,4 g de seca activa.",
      },
      {
        q: "¿La levadura seca activa es igual a la instantánea?",
        a: "No. La seca activa pide cerca de un 25% más de peso que la instantánea y suele disolverse antes. La instantánea (en muchos sobres, de panificadora o de acción rápida) se puede mezclar con la harina.",
      },
      {
        q: "¿Cuántos gramos tiene un sobre de levadura?",
        a: "Esta tool toma un sobre como 7 g, el sobre habitual de 1/4 oz en EE. UU. Un cubo europeo suele ser 25 g o 42 g de levadura fresca; para eso usá gramos.",
      },
      {
        q: "¿La conversión sale del navegador?",
        a: "No. La cantidad, la unidad y el tipo de levadura quedan en tu dispositivo.",
      },
    ],
  },
};
