import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_PAVER: Record<string, ToolSeoOverride> = {
  "calculadora-adoquines": {
    metaTitle: "Patio Paver Calculator — Count and Base | UtiliHub",
    metaTitleEs: "Calculadora de adoquines — patio y base | UtiliHub",
    metaDescription:
      "Count patio pavers from area, paver size, and joint gap. Optional border course, polymeric sand bags, and crushed-stone base volume. Free, runs in the browser.",
    metaDescriptionEs:
      "Calculá adoquines de patio según área, medida y junta. Curso de borde, sacos de arena polimérica y volumen de base de piedra opcionales. Gratis, en el navegador.",
    about: [
      "Enter the patio as a rectangle or a known area, then the paver face size and the joint gap. Each paver is assumed to occupy (length + gap) × (width + gap). The count is that coverage divided into the field area, rounded up, then increased by the waste percent you set.",
      "A border course, when enabled, walks the perimeter with the long side of the paver and subtracts that strip from the field. For a known area you must enter the perimeter. Curves, circles, and diagonal herringbone waste more than a straight running bond; raise the waste preset if the pattern is not a simple grid.",
      "The crushed-stone line is area × base depth, with its own waste. It is a planning volume, not a compaction spec. Polymeric sand bags use a labeled coverage that shrinks as the joint gets wider (about 8 m² per 22.7 kg bag at a 3 mm joint). Follow the bag label.",
      "Nothing is uploaded. Zero, negative, and oversized dimensions are rejected so a typo does not look like a real order.",
    ],
    aboutEs: [
      "Ingresá el patio como rectángulo o como área conocida, y después la cara del adoquín y la junta. Cada pieza ocupa (largo + junta) × (ancho + junta). El conteo divide esa cobertura en el campo, redondea hacia arriba y suma el desperdicio que indiques.",
      "El curso de borde, si lo activás, recorre el perímetro con el lado largo del adoquín y resta esa franja al campo. Con área conocida tenés que cargar el perímetro. Curvas, círculos y espina de pescado desperdician más que una junta corrida; subí el desperdicio si el patrón no es una grilla simple.",
      "La línea de piedra partida es área × espesor de base, con su propio desperdicio. Es un volumen de planificación, no una especificación de compactación. Los sacos de arena polimérica usan una cobertura orientativa que baja si la junta es más ancha (unos 8 m² por saco de 22,7 kg con junta de 3 mm). Segí la etiqueta.",
      "No se sube nada. Se rechazan medidas nulas, negativas o enormes para que un error de tipeo no parezca un pedido real.",
    ],
    steps: [
      "Choose meters or feet, then a rectangle or a known area.",
      "Pick a paver preset or enter length, width, and joint gap.",
      "Set waste, and optionally a border course, base depth, and prices.",
      "Review field pavers, border pavers, sand bags, and base volume, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un rectángulo o un área conocida.",
      "Usá un preset de adoquín o ingresá largo, ancho y junta.",
      "Definí el desperdicio y, si querés, borde, espesor de base y precios.",
      "Revisá piezas de campo, borde, sacos de arena y volumen de base, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the paver count calculated?",
        a: "Coverage per paver is (length + gap) × (width + gap). Field pieces are the field area divided by that coverage, rounded up, then multiplied by 1 + waste. A border course is counted from the perimeter and is not double-counted in the field.",
      },
      {
        q: "Does this replace the gravel calculator?",
        a: "No. This tool counts pieces and a patio base under those pieces. The gravel calculator is for loose paths, driveways, and bulk mulch or topsoil without a paver module.",
      },
      {
        q: "How accurate is the polymeric sand estimate?",
        a: "It is a planning factor scaled from about 8 m² per 22.7 kg bag at a 3 mm joint. Wider joints need more bags. Always check the product coverage chart.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Dimensions, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de adoquines?",
        a: "La cobertura de cada pieza es (largo + junta) × (ancho + junta). Las piezas de campo son el área de campo dividida por esa cobertura, redondeada hacia arriba, y después multiplicada por 1 + desperdicio. El borde se cuenta con el perímetro y no se vuelve a contar en el campo.",
      },
      {
        q: "¿Reemplaza a la calculadora de grava?",
        a: "No. Esta cuenta piezas y la base debajo de esas piezas. La de grava es para senderos sueltos, entradas y mantillo o tierra a granel, sin módulo de adoquín.",
      },
      {
        q: "¿Qué tan precisa es la arena polimérica?",
        a: "Es un factor de planificación escalado desde unos 8 m² por saco de 22,7 kg con junta de 3 mm. Juntas más anchas piden más sacos. Contrastá con la tabla del producto.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
