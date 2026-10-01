import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_TILE: Record<string, ToolSeoOverride> = {
  "calculadora-baldosas": {
    metaTitle: "Tile calculator — tiles and boxes needed | UtiliHub",
    metaTitleEs: "Calculadora de baldosas — piezas y cajas | UtiliHub",
    metaDescription:
      "Estimate floor or wall tiles from room size, tile dimensions, grout, openings, and waste. Free, runs in your browser.",
    metaDescriptionEs:
      "Calculá baldosas de piso o pared según el ambiente, el tamaño de la pieza, la junta, los huecos y el desperdicio. Gratis en el navegador.",
    about: [
      "Enter the room length and width, the tile size in centimeters, and an optional grout joint. Openings such as doors or windows can be subtracted from the area.",
      "Waste is applied before rounding up. Boxes are based on how many tiles come in a pack, so you can order whole cartons.",
    ],
    aboutEs: [
      "Ingresá el largo y el ancho del ambiente, el tamaño de la baldosa en centímetros y la junta si la hay. Podés restar huecos como puertas o ventanas.",
      "El desperdicio se aplica antes de redondear hacia arriba. Las cajas salen de cuántas piezas trae el paquete, para comprar cajas enteras.",
    ],
    steps: [
      "Measure the room in meters and the tile in centimeters.",
      "Set grout, waste (10% is a common floor allowance), and any openings to skip.",
      "Read the tile count and the number of boxes to buy.",
    ],
    stepsEs: [
      "Medí el ambiente en metros y la baldosa en centímetros.",
      "Indicá la junta, el desperdicio (10% es habitual en pisos) y los huecos a omitir.",
      "Revisá la cantidad de baldosas y de cajas a comprar.",
    ],
    faq: [
      {
        q: "Does grout change the tile count?",
        a: "Yes. The joint is added to each side so the coverage per tile is a little larger than the ceramic alone.",
      },
      {
        q: "How much waste should I use?",
        a: "About 10% for a straight layout. Diagonal layouts or many cuts often need 15%.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. The estimate is calculated locally in the browser.",
      },
    ],
    faqEs: [
      {
        q: "¿La junta cambia la cantidad?",
        a: "Sí. Se suma a cada lado, así que cada pieza cubre un poco más que la cerámica sola.",
      },
      {
        q: "¿Cuánto desperdicio conviene poner?",
        a: "Cerca del 10% en un tendido recto. En diagonal o con muchos cortes, 15% suele alcanzar.",
      },
      {
        q: "¿Se envían las medidas?",
        a: "No. El cálculo se hace en el navegador.",
      },
    ],
  },
};
