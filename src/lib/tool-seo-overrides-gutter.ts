import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GUTTER: Record<string, ToolSeoOverride> = {
  "calculadora-canalones": {
    metaTitle: "Gutter Calculator — Sections and Downspouts | UtiliHub",
    metaTitleEs: "Calculadora de canalones y bajantes | UtiliHub",
    metaDescription:
      "Estimate gutter sections, hangers, downspouts, and elbows from eave length. Closed loop or open runs, with waste and optional price. Free, in the browser.",
    metaDescriptionEs:
      "Calculá tramos de canalón, soportes, bajantes y codos según el alero. Circuito cerrado o tramos abiertos, con desperdicio y precio opcional. Gratis, en el navegador.",
    about: [
      "Enter the house as a closed rectangle, front and back only, one fascia, or a known eave length. Order length is that run times 1 plus the waste percent. Sections are the order length divided by the stock length you buy (often 10 ft or 3 m), rounded up.",
      "A closed loop uses four outside corners and no end caps, because the gutter meets itself. Open runs use two end caps per run and no corners unless you add them. Downspouts are the eave length divided by your spacing (about 30 ft / 9–10 m in moderate rain), rounded up, with at least one.",
      "Hangers follow the spacing you set: about 24 in / 0.6 m on 5-inch K-style, closer in snow country. Elbows default to two per downspout for a typical offset. This is a material count, not a hydraulic sizing for 5-inch versus 6-inch gutter or a local code check.",
      "Nothing is uploaded. Zero, negative, and oversized lengths are rejected so a typo does not look like a real order.",
    ],
    aboutEs: [
      "Ingresá la casa como rectángulo cerrado, solo frente y fondo, un solo alero o un largo conocido. El largo a pedir es ese recorrido por 1 más el desperdicio. Los tramos son ese largo dividido por la pieza que comprás (a menudo 3 m o 10 ft), redondeado hacia arriba.",
      "Un circuito cerrado usa cuatro esquinas exteriores y ningún tapón, porque el canalón se cierra sobre sí. Los tramos abiertos usan dos tapones por tramo y no suman esquinas salvo que las cargues. Los bajantes son el largo del alero dividido por la separación que elijas (unos 9–10 m o 30 ft con lluvia moderada), hacia arriba, con un mínimo de uno.",
      "Los soportes siguen la separación que indiques: unos 0,6 m / 24 in en canalón K de 5 pulgadas, más juntos si hay nieve. Los codos salen en dos por bajante para un desvío típico. Es un conteo de material, no el cálculo hidráulico de 5 vs 6 pulgadas ni una revisión de normativa local.",
      "No se sube nada. Se rechazan largos nulos, negativos o enormes para que un error de tipeo no parezca un pedido real.",
    ],
    steps: [
      "Choose meters or feet, then a closed loop, open sides, or a known length.",
      "Pick a stock-length preset or enter section length, hanger spacing, and downspout spacing.",
      "Set elbows per downspout, extra corners, waste, and optional prices.",
      "Review sections, hangers, downspouts, and elbows, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un circuito cerrado, lados abiertos o un largo conocido.",
      "Usá un preset de pieza o cargá el largo de tramo, la separación de soportes y la de bajantes.",
      "Definí codos por bajante, esquinas extra, desperdicio y precios si querés.",
      "Revisá tramos, soportes, bajantes y codos, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the gutter count calculated?",
        a: "Eave length comes from the layout (2 × (length + width) when closed). Order length is eave × (1 + waste). Sections are that length divided by stock length, rounded up. Hangers and downspouts use your spacing, also rounded up.",
      },
      {
        q: "Does this replace the roof or fence calculator?",
        a: "No. The roof tool counts shingle squares and bundles. The fence tool counts posts, rails, and pickets. This one only counts gutter sections, hangers, and downspouts along the eaves.",
      },
      {
        q: "How far apart should downspouts be?",
        a: "A common planning figure is one downspout about every 30 ft (9–10 m) of gutter, closer on steep roofs or heavy-rain sites. The heavy-rain preset uses 20 ft / 6 m. Confirm outlet size with the gutter maker.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Lengths, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de canalones?",
        a: "El largo del alero sale del esquema (2 × (largo + ancho) si es cerrado). El largo a pedir es alero × (1 + desperdicio). Los tramos son ese largo dividido por la pieza, hacia arriba. Soportes y bajantes usan tu separación, también hacia arriba.",
      },
      {
        q: "¿Reemplaza a la calculadora de tejado o de valla?",
        a: "No. El tejado cuenta tejas y squares. La valla cuenta postes, travesaños y tablas. Esta tool solo cuenta tramos de canalón, soportes y bajantes en el alero.",
      },
      {
        q: "¿Cada cuánto conviene un bajante?",
        a: "Una cifra habitual de planificación es un bajante cada unos 9–10 m (30 ft) de canalón, más juntos en cubiertas empinadas o zonas de mucha lluvia. El preset de lluvia fuerte usa 6 m / 20 ft. Confirmá el diámetro de salida con el fabricante.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
