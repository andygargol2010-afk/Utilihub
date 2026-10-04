import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_BASEBOARD: Record<string, ToolSeoOverride> = {
  "calculadora-zocalos": {
    metaTitle: "Baseboard Calculator — Sticks and Waste | UtiliHub",
    metaTitleEs: "Calculadora de zócalos y rodapié | UtiliHub",
    metaDescription:
      "Estimate baseboard and shoe-molding sticks from room perimeter, door openings, and waste. Stick length, leftover, and optional price. Free, in the browser.",
    metaDescriptionEs:
      "Calculá varillas de zócalo y de cuarto de rondana según el perímetro, las puertas y el desperdicio. Largo de pieza, sobrante y precio opcional. Gratis, en el navegador.",
    about: [
      "Enter a rectangular room or a known perimeter, then subtract door openings and add closet returns or islands. Order length is that net run times 1 plus the waste percent. Sticks are the order length divided by the piece you buy, rounded up.",
      "Presets cover a metric 4 m × 3 m room on 2.4 m sticks, a US 12 ft × 10 ft bedroom on 8 ft sticks, a 12 ft stick run, and an open plan with 12% waste. Door width defaults to 0.80 m or 2.5 ft; change it for a 32 in or 36 in slab.",
      "Shoe molding and quarter round follow the same order length, not the raw perimeter, so waste is included once. Inside and outside corner counts are what you measured: the tool does not invent returns. Leftover is purchased length minus the order length.",
      "Nothing is uploaded. Zero, negative, and oversized runs are rejected. This is a material list, not a cope schedule or a paint estimate — those live in the paint and wallpaper calculators.",
    ],
    aboutEs: [
      "Ingresá una habitación rectangular o un perímetro conocido, restá las puertas y sumá retornos de placard o islas. El largo a pedir es ese recorrido neto por 1 más el desperdicio. Las varillas son ese largo dividido por la pieza que comprás, redondeado hacia arriba.",
      "Los presets cubren una habitación métrica de 4 m × 3 m con varillas de 2,4 m, un dormitorio de EE. UU. de 12 ft × 10 ft con piezas de 8 ft, un pedido en varillas de 12 ft y un espacio abierto con 12% de desperdicio. El ancho de puerta arranca en 0,80 m o 2,5 ft; cambialo para una hoja de 32 o 36 in.",
      "El cuarto de rondana y el zócalo fino usan el mismo largo a pedir, no el perímetro crudo, así el desperdicio entra una sola vez. Las esquinas interiores y exteriores son las que mediste: la tool no inventa retornos. El sobrante es el largo comprado menos el largo a pedir.",
      "No se sube nada. Se rechazan recorridos nulos, negativos o enormes. Es una lista de material, no un despiece de ingletes ni un presupuesto de pintura: eso está en las calculadoras de pintura y de papel pintado.",
    ],
    steps: [
      "Choose meters or feet, then a rectangle or a known perimeter.",
      "Subtract door openings and add closet or island runs.",
      "Pick a stick preset or enter piece length, waste, and optional shoe molding.",
      "Review sticks, leftover, and corners, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un rectángulo o un perímetro conocido.",
      "Restá las puertas y sumá recorridos de placard o isla.",
      "Usá un preset de varilla o cargá el largo, el desperdicio y el cuarto de rondana si hace falta.",
      "Revisá varillas, sobrante y esquinas, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the baseboard count calculated?",
        a: "Net length is the perimeter minus door widths plus extra runs. Order length is net × (1 + waste). Sticks are that length divided by one piece, rounded up. Leftover is sticks × piece length minus the order length.",
      },
      {
        q: "Does this replace the paint or wallpaper calculator?",
        a: "No. Paint estimates wall area and cans. Wallpaper counts rolls. This tool only counts linear trim: baseboard, shoe molding, and the corners you enter.",
      },
      {
        q: "How much waste should I use?",
        a: "About 8–10% for a simple rectangle with few miters, and 12–15% when pieces are short, walls are out of square, or you are coping inside corners.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Dimensions, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de zócalo?",
        a: "El largo neto es el perímetro menos el ancho de las puertas más los recorridos extra. El largo a pedir es neto × (1 + desperdicio). Las varillas son ese largo dividido por una pieza, redondeado hacia arriba. El sobrante es varillas × largo de pieza menos el largo a pedir.",
      },
      {
        q: "¿Reemplaza a la calculadora de pintura o de papel pintado?",
        a: "No. La pintura estima superficie de pared y latas. El papel pintado cuenta rollos. Esta tool solo cuenta moldura lineal: zócalo, cuarto de rondana y las esquinas que cargues.",
      },
      {
        q: "¿Qué desperdicio conviene usar?",
        a: "Unos 8–10% en un rectángulo simple con pocos ingletes, y 12–15% si las piezas son cortas, las paredes están fuera de escuadra o vas a copiar esquinas interiores.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
