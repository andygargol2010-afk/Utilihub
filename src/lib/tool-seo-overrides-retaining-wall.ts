import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RETAINING_WALL: Record<string, ToolSeoOverride> = {
  "calculadora-muro-contencion": {
    metaTitle: "Retaining Wall Block Calculator | UtiliHub",
    metaTitleEs: "Calculadora de muro de contención | UtiliHub",
    metaDescription:
      "Estimate retaining-wall blocks, cap units, courses, and base gravel from length, exposed height, and block size. Free, in the browser.",
    metaDescriptionEs:
      "Calculá bloques, tapas, hiladas y grava de base para un muro de contención según largo, altura vista y tamaño de bloque. Gratis, en el navegador.",
    about: [
      "Order volume is wall length divided by the block face length, rounded up per course, times exposed courses plus buried courses, then times a small waste allowance. Exposed courses are the exposed height divided by the block height, rounded up. Cap units use the cap length the same way, without the course stack.",
      "A typical garden wall buries the first course so the face starts below grade. Set buried courses to 0 only if the manufacturer allows a wall that sits fully on the prepared base. Base gravel is length × trench width × trench depth, with the same waste factor, reported in cubic meters or yards.",
      "Presets cover a 6 m garden wall with 40×20 cm blocks, a low seat wall, a 20 ft run of 12×4 in landscape blocks, and a taller 1 m face. Switching meters and feet converts length, height, block size, cap length, and the trench.",
      "Nothing is uploaded. This is a material list, not a structural design. Walls over about 1 m (3–4 ft), slopes, surcharge, or poor soil need an engineer and the block maker’s limits. Brick counts a mortared wall; concrete sizes a pour; fence counts posts.",
    ],
    aboutEs: [
      "El pedido es el largo del muro dividido por la cara del bloque, redondeado hacia arriba en cada hilada, por las hiladas vistas más las enterradas, y luego por un desperdicio chico. Las hiladas vistas son la altura vista dividida por la altura del bloque, redondeada hacia arriba. Las tapas usan el largo de la tapa del mismo modo, sin apilar hiladas.",
      "Un muro de jardín suele enterrar la primera hilada para que la cara arranque bajo el nivel del suelo. Dejá las hiladas enterradas en 0 solo si el fabricante admite un muro apoyado por completo en la base. La grava de base es largo × ancho de zanja × profundidad de zanja, con el mismo desperdicio, en metros o yardas cúbicas.",
      "Los presets cubren un muro de jardín de 6 m con bloques de 40×20 cm, un muro bajo de asiento, un tramo de 20 ft con bloques de 12×4 in y una cara más alta de 1 m. Cambiar metros y pies convierte largo, altura, tamaño de bloque, tapa y zanja.",
      "No se sube nada. Es una lista de materiales, no un cálculo estructural. Muros de más de 1 m (3–4 ft), pendientes, sobrecarga o suelo malo necesitan un ingeniero y los límites del fabricante. El ladrillo cuenta un muro con mortero; el hormigón, un vaciado; la valla, postes.",
    ],
    steps: [
      "Choose meters or feet and a preset, or enter wall length and exposed height.",
      "Set block face length and height, cap length, and how many courses are buried.",
      "Add a waste allowance and the gravel trench width and depth.",
      "Review courses, blocks, caps, base gravel, and optional cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies y un preset, o cargá el largo del muro y la altura vista.",
      "Indicá la cara y la altura del bloque, el largo de la tapa y cuántas hiladas van enterradas.",
      "Sumá un desperdicio y el ancho y la profundidad de la zanja de grava.",
      "Revisá hiladas, bloques, tapas, grava de base y el precio opcional, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How are retaining wall blocks calculated?",
        a: "Blocks per course are wall length divided by block face length, rounded up. Total blocks are that count times exposed courses plus buried courses, times (1 + waste), rounded up. Exposed courses are exposed height divided by block height, rounded up.",
      },
      {
        q: "Should I bury a course?",
        a: "Most landscape-block guides bury at least the first course. The default is one buried course. Use the manufacturer sheet if the block is a pinned or lip system with a different embedment.",
      },
      {
        q: "Does this design the wall?",
        a: "No. It only counts blocks, caps, and base gravel. It does not size geogrid, drainage pipe, or footing concrete, and it is not a substitute for an engineer on tall or loaded walls.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Lengths, block sizes, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calculan los bloques del muro?",
        a: "Los bloques por hilada son el largo del muro dividido por la cara del bloque, redondeado hacia arriba. El total es esa cantidad por las hiladas vistas más las enterradas, por (1 + desperdicio), redondeado hacia arriba. Las hiladas vistas son la altura vista dividida por la altura del bloque, redondeada hacia arriba.",
      },
      {
        q: "¿Hay que enterrar una hilada?",
        a: "La mayoría de las guías de bloques de jardín entierran al menos la primera hilada. El valor por defecto es una hilada enterrada. Usá la ficha del fabricante si el bloque es de pasador o de labio y pide otro empotramiento.",
      },
      {
        q: "¿Esto diseña el muro?",
        a: "No. Solo cuenta bloques, tapas y grava de base. No dimensiona geomalla, tubo de drenaje ni hormigón de cimiento, y no reemplaza a un ingeniero en muros altos o con carga.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, los tamaños de bloque, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
