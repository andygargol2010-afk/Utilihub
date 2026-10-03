import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_FLOORING: Record<string, ToolSeoOverride> = {
  "calculadora-suelo-laminado": {
    metaTitle: "Laminate flooring calculator — boxes | UtiliHub",
    metaTitleEs: "Calculadora de suelo laminado — cajas | UtiliHub",
    metaDescription:
      "Estimate laminate or vinyl plank boxes from room size, plank dimensions, layout waste, and pack coverage. Underlay included. Free in the browser.",
    metaDescriptionEs:
      "Calculá cajas de suelo laminado o vinílico según el ambiente, el tamaño de la lama, el desperdicio del patrón y la cobertura del paquete. Con base. Gratis.",
    about: [
      "This calculator estimates how many laminate or click-vinyl boxes to buy for a rectangular room. Enter length and width in meters, subtract fixed openings such as a hearth or island base, then set plank size and how many square meters come in a pack.",
      "Waste depends on the layout. A straight install often needs about 8% extra. Diagonal cuts and herringbone need more offcuts, so the presets start at 12% and 15%. Waste is applied to the net area before rounding boxes and planks up.",
      "Underlay is ordered from the net floor area plus a small overlap allowance, not from the plank waste percentage. An optional price per box turns the carton count into a material estimate. It does not include adhesive, trims, delivery, or labor.",
      "Results stay in the browser. Pack coverage and plank size should match the product label: some boxes list square meters, others list a piece count. If both differ, trust the printed coverage when ordering cartons.",
    ],
    aboutEs: [
      "Esta calculadora estima cuántas cajas de laminado o vinílico clic comprar para un ambiente rectangular. Ingresá largo y ancho en metros, restá huecos fijos como una chimenea o la base de una isla, y cargá el tamaño de la lama y los metros cuadrados del paquete.",
      "El desperdicio depende del patrón. Una colocación recta suele pedir cerca de un 8% extra. El corte en diagonal y la espiga necesitan más recortes: los presets arrancan en 12% y 15%. El desperdicio se aplica al área neta antes de redondear cajas y lamas hacia arriba.",
      "La base aislante se pide sobre el área neta más un solape chico, no con el mismo porcentaje de recorte de las lamas. El precio por caja es opcional y solo estima el material. No incluye adhesivo, perfiles, envío ni mano de obra.",
      "El cálculo queda en el navegador. La cobertura del paquete y el tamaño de la lama tienen que coincidir con la etiqueta: algunas cajas publican metros cuadrados y otras cantidad de piezas. Si no coinciden, priorizá la cobertura impresa al pedir cajas.",
    ],
    steps: [
      "Measure the room in meters and subtract openings that will not be floored.",
      "Pick a layout preset or enter plank size in millimeters and pack coverage in m².",
      "Set waste (8% straight, 12% diagonal, 15% herringbone are common starting points).",
      "Read boxes to buy, plank count, underlay rolls, and the optional material cost.",
    ],
    stepsEs: [
      "Medí el ambiente en metros y restá los huecos que no se van a cubrir.",
      "Elegí un preset de patrón o cargá la lama en milímetros y la cobertura de la caja en m².",
      "Indicá el desperdicio (8% recto, 12% diagonal y 15% en espiga son puntos de partida habituales).",
      "Revisá las cajas a comprar, las lamas, los rollos de base y el coste opcional de material.",
    ],
    faq: [
      {
        q: "How is the box count calculated?",
        a: "Net area is length × width minus openings. Order area is net × (1 + waste / 100). Boxes are that area divided by pack coverage, rounded up.",
      },
      {
        q: "Why does herringbone need more waste?",
        a: "Each piece is cut to keep the angle and the border. A 15% allowance is a planning figure, not a guarantee. Complex rooms with many jogs need more.",
      },
      {
        q: "Should underlay use the same waste percentage?",
        a: "No. Underlay is ordered from the net floor plus a small overlap (5% in this tool). Plank offcuts are not reused as underlay, and unused plank waste should not inflate the underlay order.",
      },
      {
        q: "Is my room size uploaded?",
        a: "No. Dimensions are processed locally in the browser and are not sent to a server.",
      },
      {
        q: "Does this replace the tile calculator?",
        a: "No. Ceramic and porcelain use grout joints and tiles per box. Laminate and vinyl click use plank size, pack coverage in square meters, and layout waste.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calculan las cajas?",
        a: "El área neta es largo × ancho menos huecos. El área a pedir es neta × (1 + desperdicio / 100). Las cajas son esa superficie dividida por la cobertura del paquete, redondeada hacia arriba.",
      },
      {
        q: "¿Por qué la espiga pide más desperdicio?",
        a: "Cada pieza se corta para mantener el ángulo y el perímetro. Un 15% es una cifra de planificación, no una garantía. Ambientes con muchos quiebres necesitan más.",
      },
      {
        q: "¿La base usa el mismo desperdicio que las lamas?",
        a: "No. La base se pide sobre el área neta más un solape chico (5% en esta tool). Los recortes de lama no sirven como base, y ese desperdicio no debería inflar el pedido de rollo.",
      },
      {
        q: "¿Se suben las medidas del ambiente?",
        a: "No. Las medidas se procesan en el navegador y no se envían a un servidor.",
      },
      {
        q: "¿Reemplaza a la calculadora de baldosas?",
        a: "No. La cerámica usa junta y piezas por caja. El laminado y el vinílico clic usan tamaño de lama, cobertura del paquete en m² y desperdicio según el patrón.",
      },
    ],
  },
};
