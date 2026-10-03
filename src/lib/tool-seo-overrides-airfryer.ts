import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_AIRFRYER: Record<string, ToolSeoOverride> = {
  "conversor-freidora-aire": {
    metaTitle: "Air fryer conversion calculator | UtiliHub",
    metaTitleEs: "Conversor horno a freidora de aire | UtiliHub",
    metaDescription:
      "Convert oven temperature and time to an air fryer setting, or reverse it. Presets for fries, chicken, veg, and baking. °C or °F. Free in the browser.",
    metaDescriptionEs:
      "Convertí temperatura y tiempo de horno a freidora de aire, o al revés. Presets para papas, pollo, verduras y horneados. °C o °F. Gratis en el navegador.",
    about: [
      "This converter turns a conventional oven temperature and cook time into a starting air fryer setting, and can reverse the same rule. It is the chart people look up when a recipe only lists the oven.",
      "The default rule follows the common appliance guidance: drop about 20°C (25°F) and start checking around 20% earlier. Presets change that pair. Fries and fish shorten more; a chicken piece drops less temperature so the center still cooks. Reheating uses a larger time cut because leftovers are already cooked.",
      "The check-at time is 80% of the suggested air fryer time. Air fryers run hotter at the surface and depend on basket load, wattage, and whether food is stacked. Use the result as a start, then finish by color and, for poultry, by internal temperature.",
      "Nothing is uploaded. The tool does not replace a food-safety thermometer or the manual for a specific model. Most basket fryers top out near 200°C; the result flags settings outside a typical 80–200°C window.",
    ],
    aboutEs: [
      "Este conversor pasa una temperatura y un tiempo de horno convencional a un punto de partida para freidora de aire, y puede invertir la misma regla. Sirve cuando la receta solo indica el horno.",
      "La regla por defecto sigue la guía habitual de los fabricantes: bajar unos 20°C (25°F) y empezar a revisar cerca de un 20% antes. Los presets cambian ese par. Papas y pescado acortan más; un trozo de pollo baja menos la temperatura para que el centro se cocine. Recalentar recorta más el tiempo porque la comida ya está hecha.",
      "El aviso de revisión es el 80% del tiempo sugerido en la freidora. La superficie se dora antes y el resultado depende de la carga de la cubeta, los watts y si la comida está apilada. Usalo como arranque y terminá por color y, en aves, por temperatura interna.",
      "No se sube nada. No reemplaza un termómetro de cocina ni el manual del modelo. La mayoría de las cubetas llegan cerca de 200°C; el resultado marca ajustes fuera de una ventana típica de 80–200°C.",
    ],
    steps: [
      "Choose oven to air fryer, or the reverse, and °C or °F.",
      "Pick a food preset or set your own temperature drop and time cut.",
      "Enter the recipe temperature and time in minutes.",
      "Read the suggested setting, the check-early minute, and the food note.",
      "Copy the result or reset to the general 20°C / 20% rule.",
    ],
    stepsEs: [
      "Elegí horno a freidora, o el sentido inverso, y °C o °F.",
      "Elegí un preset de comida o cargá tu propia baja de temperatura y recorte de tiempo.",
      "Ingresá la temperatura de la receta y el tiempo en minutos.",
      "Leé el ajuste sugerido, el minuto para revisar y la nota del alimento.",
      "Copiá el resultado o reiniciá a la regla general de 20°C / 20%.",
    ],
    faq: [
      {
        q: "How is the air fryer time calculated?",
        a: "Suggested time is recipe time multiplied by the preset factor (0.80 for the general rule, 20% shorter). The check-at minute is 80% of that suggested time. Reverse mode divides air fryer time by the same factor.",
      },
      {
        q: "Why lower the temperature and the time?",
        a: "A basket fryer circulates heat closer to the food than a large oven. Many manuals say to reduce about 20°C or 25°F and to start checking earlier. Doing only one of the two is also common; the custom fields let you zero out either adjustment.",
      },
      {
        q: "Is poultry safe at the suggested setting?",
        a: "No setting here guarantees doneness. Chicken should reach 74°C (165°F) in the thickest part. The chicken preset only shortens time by 20% and drops 15°C so the center has a better chance to cook.",
      },
      {
        q: "Does it work offline and keep my recipe private?",
        a: "Yes. Temperature, time, and presets are calculated in the browser. Nothing is sent to a server.",
      },
      {
        q: "What if my air fryer maxes out below the result?",
        a: "If the suggested temperature is above 200°C, use the machine maximum and add a few minutes, checking early. Crowding the basket also needs extra time.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el tiempo de la freidora?",
        a: "El tiempo sugerido es el de la receta por el factor del preset (0,80 en la regla general, un 20% menos). El minuto de revisión es el 80% de ese tiempo. En sentido inverso se divide el tiempo de freidora por el mismo factor.",
      },
      {
        q: "¿Por qué bajar temperatura y tiempo?",
        a: "La cubeta mueve el calor más cerca de la comida que un horno grande. Muchos manuales piden bajar unos 20°C o 25°F y revisar antes. También es habitual hacer solo uno de los dos ajustes; los campos custom permiten anular cualquiera.",
      },
      {
        q: "¿El pollo queda seguro con el ajuste sugerido?",
        a: "Ningún valor de acá garantiza el punto. El pollo debería llegar a 74°C (165°F) en la parte más gruesa. El preset solo acorta un 20% y baja 15°C para darle más chance al centro.",
      },
      {
        q: "¿Funciona sin conexión y guarda la receta?",
        a: "Sí. Temperatura, tiempo y presets se calculan en el navegador. No se envía nada a un servidor.",
      },
      {
        q: "¿Qué hago si la freidora no llega a esa temperatura?",
        a: "Si el resultado pasa de 200°C, usá el máximo del equipo y sumá unos minutos, revisando antes. Llenar la cubeta también pide más tiempo.",
      },
    ],
  },
};
