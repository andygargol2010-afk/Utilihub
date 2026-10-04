import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GRASS_SEED: Record<string, ToolSeoOverride> = {
  "calculadora-semilla-cesped": {
    metaTitle: "Grass Seed Calculator — Bags and Rate | UtiliHub",
    metaTitleEs: "Calculadora de semilla de césped | UtiliHub",
    metaDescription:
      "Estimate grass seed pounds or kilograms and bags for a new lawn, overseed, or patch. Rates, waste, and bag size. Free, in the browser.",
    metaDescriptionEs:
      "Calculá kilos o libras y sacos de semilla para césped nuevo, resiembra o un parche. Dosis, desperdicio y tamaño de saco. Gratis, en el navegador.",
    about: [
      "Enter a rectangle or a known area, subtract hardscape if you measured it, then pick a job: new lawn, overseed, or patch. Order weight is net area times the planning rate times one plus waste. Bags are that weight divided by the bag you buy, rounded up.",
      "Default rates are planning figures, not a soil test: tall fescue 8 lb per 1,000 sq ft new, perennial rye 6, Kentucky bluegrass 3, and seeded bermuda 1.5. Overseed uses half of that rate; a bare patch uses 1.25 times the new-lawn rate. Switch to a custom rate when the bag label disagrees.",
      "One pound per 1,000 square feet is about 4.88 grams per square meter. Metric results show kilograms and grams per square meter; foot results show pounds and pounds per 1,000 square feet. Leftover is purchased weight minus the order weight.",
      "Nothing is uploaded. Zero, negative, and oversized areas are rejected. This is a seed list, not a sod-roll count or a bulk mulch order — those live in the sod and gravel calculators.",
    ],
    aboutEs: [
      "Ingresá un rectángulo o un área conocida, restá el solado si lo mediste y elegí el trabajo: césped nuevo, resiembra o parche. El peso a pedir es el área neta por la dosis de planificación por uno más el desperdicio. Los sacos son ese peso dividido por el saco que comprás, redondeado hacia arriba.",
      "Las dosis por defecto son de planificación, no un análisis de suelo: festuca alta 8 lb por 1.000 ft² en siembra nueva, raigrás perenne 6, Kentucky bluegrass 3 y bermuda de semilla 1,5. La resiembra usa la mitad; un parche pelado usa 1,25 veces la dosis de césped nuevo. Pasá a dosis propia si la etiqueta del saco dice otra cosa.",
      "Una libra por 1.000 pies cuadrados son unos 4,88 gramos por metro cuadrado. En metros el resultado va en kilos y gramos por metro cuadrado; en pies, en libras y libras por 1.000 ft². El sobrante es el peso comprado menos el peso a pedir.",
      "No se sube nada. Se rechazan áreas nulas, negativas o enormes. Es una lista de semilla, no un conteo de rollos de césped ni un pedido de mantillo a granel: eso está en las calculadoras de césped en rollo y de grava.",
    ],
    steps: [
      "Choose meters or feet, then a rectangle or a known area.",
      "Subtract patios or paths, and pick new lawn, overseed, or patch.",
      "Use a species preset or enter the bag rate, bag weight, and waste.",
      "Review seed weight, bags, leftover, and optional cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un rectángulo o un área conocida.",
      "Restá patios o caminos, y elegí césped nuevo, resiembra o parche.",
      "Usá un preset de especie o cargá la dosis, el peso del saco y el desperdicio.",
      "Revisá peso, sacos, sobrante y el precio opcional, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the grass seed amount calculated?",
        a: "Net area is the rectangle or known area minus hardscape. Order weight is net area times the job rate times (1 + waste). Bags are that weight divided by one bag, rounded up. Leftover is bags times bag weight minus the order weight.",
      },
      {
        q: "Does this replace the sod calculator?",
        a: "No. Sod counts rolls from piece size and area. This tool only estimates seed mass and bags. Mulch and topsoil volume stay in the gravel calculator.",
      },
      {
        q: "What rate should I use?",
        a: "Start with the species preset, then match the bag label. Overseeding is usually about half a new-lawn rate. Bare patches need a heavier rate because the seed is not filling an existing stand.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Areas, rates, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de semilla?",
        a: "El área neta es el rectángulo o el área conocida menos el solado. El peso a pedir es el área neta por la dosis del trabajo por (1 + desperdicio). Los sacos son ese peso dividido por un saco, redondeado hacia arriba. El sobrante es sacos × peso del saco menos el peso a pedir.",
      },
      {
        q: "¿Reemplaza a la calculadora de césped en rollo?",
        a: "No. El césped en rollo cuenta piezas según el tamaño del rollo y el área. Esta tool solo estima masa y sacos de semilla. El volumen de mantillo y tierra vegetal sigue en la calculadora de grava.",
      },
      {
        q: "¿Qué dosis conviene usar?",
        a: "Arrancá con el preset de especie y después igualala a la etiqueta del saco. La resiembra suele ser cerca de la mitad de una siembra nueva. Un parche pelado pide más dosis porque no hay césped que completar.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las áreas, las dosis, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
