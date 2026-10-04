import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SOD: Record<string, ToolSeoOverride> = {
  "calculadora-cesped": {
    metaTitle: "Sod Calculator — Rolls and Pallets | UtiliHub",
    metaTitleEs: "Calculadora de césped en rollo | UtiliHub",
    metaDescription:
      "Estimate sod rolls and pallets from lawn area, roll size, and waste. Subtract beds and paths, add starter bags, and copy the order. Free, in the browser.",
    metaDescriptionEs:
      "Calculá rollos y pallets de césped según el área, la medida del rollo y el desperdicio. Restá canteros, sumá abono de arranque y copiá el pedido. Gratis, en el navegador.",
    about: [
      "Enter the lawn as a rectangle or a known area, then subtract beds, paths, and patios. The order area is that net surface times 1 plus the waste percent. Rolls are the order area divided by the face of one roll, rounded up.",
      "Presets cover a common 2 ft × 5 ft US roll (10 sq ft), a 0.40 m × 2.50 m metric roll (1 m²), and a half-size metric roll. Irregular edges and slopes waste more than a clean rectangle; the slope preset uses 15% instead of 8%.",
      "Pallets use the rolls-per-pallet figure you set (a typical US pallet is about 450–500 sq ft, often 45–50 rolls of 10 sq ft). Starter-fertilizer bags cover the net area, not the waste allowance, using the bag coverage you enter. Neither line is a soil test or an install spec.",
      "Nothing is uploaded. Zero, negative, and oversized dimensions are rejected so a typo does not look like a real delivery.",
    ],
    aboutEs: [
      "Ingresá el césped como rectángulo o como área conocida, y restá canteros, senderos y patios. El área a pedir es esa superficie neta por 1 más el desperdicio. Los rollos son esa área dividida por la cara de un rollo, redondeada hacia arriba.",
      "Los presets cubren un rollo habitual de EE. UU. de 2 ft × 5 ft (10 sq ft), un rollo métrico de 0,40 m × 2,50 m (1 m²) y un rollo métrico a la mitad. Bordes irregulares y pendientes desperdician más que un rectángulo limpio; el preset de pendiente usa 15% en lugar de 8%.",
      "Los pallets usan los rollos por pallet que indiques (un pallet típico de EE. UU. ronda 450–500 sq ft, a menudo 45–50 rollos de 10 sq ft). Los sacos de abono de arranque cubren el área neta, no el desperdicio, con la cobertura del saco que cargues. Ninguna línea reemplaza un análisis de suelo ni una especificación de instalación.",
      "No se sube nada. Se rechazan medidas nulas, negativas o enormes para que un error de tipeo no parezca un pedido real.",
    ],
    steps: [
      "Choose meters or feet, then a rectangle or a known area.",
      "Subtract beds and paths, and pick a roll preset or enter roll size.",
      "Set waste, rolls per pallet, optional starter-bag coverage, and price.",
      "Review rolls, pallets, and bags, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un rectángulo o un área conocida.",
      "Restá canteros y senderos, y usá un preset de rollo o cargá la medida.",
      "Definí desperdicio, rollos por pallet, cobertura del abono y precio si querés.",
      "Revisá rollos, pallets y sacos, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the sod count calculated?",
        a: "Net area is the lawn minus beds and paths. Order area is net × (1 + waste). Rolls are that order area divided by one roll’s face, rounded up. Pallets are rolls divided by rolls per pallet, also rounded up.",
      },
      {
        q: "Does this replace the gravel or flooring calculator?",
        a: "No. Gravel is loose bulk for paths and beds. Flooring counts indoor packs and underlay. This tool counts sod rolls for a lawn only.",
      },
      {
        q: "How much waste should I use?",
        a: "About 5–8% for a simple rectangle, 10% with curves, and 15% on slopes or odd shapes. Cut rolls cannot always be reused across the yard.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Dimensions, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de césped?",
        a: "El área neta es el césped menos canteros y senderos. El área a pedir es neta × (1 + desperdicio). Los rollos son esa área dividida por la cara de un rollo, redondeada hacia arriba. Los pallets son los rollos divididos por rollos por pallet, también hacia arriba.",
      },
      {
        q: "¿Reemplaza a la calculadora de grava o de suelo?",
        a: "No. La grava es material suelto para senderos y canteros. El suelo laminado cuenta cajas de interior y base. Esta tool solo cuenta rollos de césped.",
      },
      {
        q: "¿Qué desperdicio conviene usar?",
        a: "Unos 5–8% en un rectángulo simple, 10% con curvas y 15% en pendientes o formas raras. Los recortes no siempre se reutilizan en otro sector.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
