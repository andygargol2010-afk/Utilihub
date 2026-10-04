import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_DOUGH_WATER: Record<string, ToolSeoOverride> = {
  "temperatura-agua-masa": {
    metaTitle: "Dough Water Temperature Calculator | UtiliHub",
    metaTitleEs: "Temperatura del agua para masa | UtiliHub",
    metaDescription:
      "Find the water temperature for a target dough temperature from flour, room, preferment, and mixer friction. Celsius or Fahrenheit, in the browser.",
    metaDescriptionEs:
      "Calculá la temperatura del agua para la masa objetivo con harina, ambiente, prefermento y fricción de la amasadora. Celsius o Fahrenheit, en el navegador.",
    about: [
      "Bread dough finishes near the temperature you plan for, not the temperature of the tap. This calculator solves the mix water temperature from a desired dough temperature (DDT), the flour temperature, the room temperature, an optional preferment, and the friction the mixer adds.",
      "The bakery formula is water = (DDT × number of factors) − (flour + room + preferment + friction). A straight dough uses three factors: flour, room, and friction. A dough with a levain or poolish uses four, because the preferment is a fourth measured temperature. All inputs must be in the same unit. Switching to Fahrenheit converts the current values.",
      "Friction is an estimate, not a sensor reading. Hand mixing is often near zero. A home stand mixer is commonly about 4–8°C (8–15°F). A spiral mixer can add 8–14°C (15–25°F). After a real mix, friction ≈ (final dough temperature × factors) − (water + flour + room + preferment). Use that measured factor next time.",
      "This does not build a baker's formula or convert yeast types. Water below about 4°C / 39°F usually means ice water or a chilled preferment. Water above about 40°C / 105°F can stress commercial yeast. Nothing is uploaded. Empty, non-numeric, and out-of-range temperatures are rejected.",
    ],
    aboutEs: [
      "La masa termina cerca de la temperatura que planificás, no de la del grifo. Esta calculadora resuelve la temperatura del agua de amasado a partir de la temperatura deseada de la masa (DDT), la de la harina, la del ambiente, un prefermento opcional y la fricción que suma la amasadora.",
      "La fórmula de panadería es agua = (DDT × cantidad de factores) − (harina + ambiente + prefermento + fricción). Una masa directa usa tres factores: harina, ambiente y fricción. Con levain o poolish son cuatro, porque el prefermento es una cuarta temperatura medida. Todas las entradas van en la misma unidad. Al pasar a Fahrenheit se convierten los valores actuales.",
      "La fricción es una estimación, no una lectura de sensor. El amasado a mano suele estar cerca de cero. Una amasadora doméstica aporta unos 4–8°C (8–15°F). Una espiral puede sumar 8–14°C (15–25°F). Después de un amasado real, fricción ≈ (temperatura final × factores) − (agua + harina + ambiente + prefermento). Usá ese factor medido la próxima vez.",
      "No arma una fórmula panadera ni convierte tipos de levadura. Agua por debajo de unos 4°C / 39°F suele pedir agua con hielo o un prefermento frío. Por encima de unos 40°C / 105°F puede estresar la levadura comercial. No se sube nada. Se rechazan temperaturas vacías, no numéricas o fuera de rango.",
    ],
    steps: [
      "Pick Celsius or Fahrenheit and a hand, stand-mixer, or spiral preset if it matches your mix.",
      "Enter the desired dough temperature, flour temperature, and room temperature.",
      "Add a preferment temperature only if the levain or poolish goes into the mix.",
      "Read the water temperature, the ice-water or warm-water note, and copy the mix note.",
    ],
    stepsEs: [
      "Elegí Celsius o Fahrenheit y un preset de mano, amasadora o espiral si coincide con tu amasado.",
      "Cargá la temperatura deseada de la masa, la de la harina y la del ambiente.",
      "Sumá la temperatura del prefermento solo si el levain o el poolish entra en la mezcla.",
      "Leé la temperatura del agua, la nota de hielo o de agua tibia, y copiá la nota de amasado.",
    ],
    faq: [
      {
        q: "How is dough water temperature calculated?",
        a: "Multiply the desired dough temperature by 3 for a straight dough, or by 4 if you include a preferment. Subtract flour temperature, room temperature, preferment temperature, and the friction factor. The remainder is the water temperature.",
      },
      {
        q: "What friction factor should I use?",
        a: "Start with 0°C for hand mixing, about 6°C (11°F) for a home stand mixer, and about 10°C (18°F) for a spiral. Measure it from a finished dough and replace the preset.",
      },
      {
        q: "What if the water temperature is below freezing?",
        a: "The formula is telling you the other ingredients are already warm. Chill the flour or preferment, or replace part of the water with ice. This tool does not calculate an ice weight.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Temperatures, unit, and friction stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la temperatura del agua para la masa?",
        a: "Multiplicá la temperatura deseada por 3 en una masa directa, o por 4 si incluís prefermento. Restá la temperatura de la harina, la del ambiente, la del prefermento y el factor de fricción. El resto es la temperatura del agua.",
      },
      {
        q: "¿Qué factor de fricción uso?",
        a: "Empezá con 0°C para amasado a mano, unos 6°C (11°F) en amasadora doméstica y unos 10°C (18°F) en espiral. Medilo en una masa terminada y reemplazá el preset.",
      },
      {
        q: "¿Qué hago si el agua da bajo cero?",
        a: "La fórmula indica que el resto ya está caliente. Enfriá la harina o el prefermento, o reemplazá parte del agua por hielo. Esta tool no calcula el peso del hielo.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las temperaturas, la unidad y la fricción quedan en tu dispositivo.",
      },
    ],
  },
};
