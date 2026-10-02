import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_PAINT: Record<string, ToolSeoOverride> = {
  "calculadora-pintura": {
    metaTitle: "Paint calculator — liters and cans",
    metaTitleEs: "Calculadora de pintura — litros y latas",
    metaDescription:
      "Estimate liters of paint and cans from wall length, height, openings, coats, and coverage per liter. Waste and can-size presets. Runs locally.",
    metaDescriptionEs:
      "Calculá litros de pintura y latas según largo, altura, huecos, manos y rendimiento por litro. Presets de desperdicio y tamaño de lata. Local.",
    about: [
      "This paint coverage calculator turns wall measurements into liters and whole cans. It is for planning a purchase, not for a contractor quote.",
      "Net area is wall length times height, minus door and window openings. Paintable area multiplies that net area by the number of coats and by a waste factor. Liters are paintable area divided by the coverage printed on the can, in square meters per liter.",
      "Use it when the label gives coverage (often 8–12 m²/L for interior latex) and you need to know whether a 4 L or 10 L can is enough. Optional price per liter estimates material cost only.",
      "It does not account for textured walls, dark-to-light color changes, porous masonry, or primer plus finish as separate products unless you run the calculator twice. Coverage on the label is a lab figure; rough surfaces can use 20–40% more.",
    ],
    aboutEs: [
      "Esta calculadora de rendimiento de pintura pasa las medidas de pared a litros y latas enteras. Sirve para planear la compra, no para un presupuesto de obra.",
      "La superficie neta es largo por altura, menos puertas y ventanas. La superficie a pintar multiplica esa neta por las manos y por un factor de desperdicio. Los litros son esa superficie dividida por el rendimiento del envase, en m² por litro.",
      "Usala cuando la etiqueta indica el rendimiento (suele ser 8–12 m²/L en látex interior) y querés saber si alcanza una lata de 4 L o de 10 L. El precio por litro es opcional y solo estima el material.",
      "No contempla paredes texturadas, cambios de oscuro a claro, mampostería porosa ni imprimación más acabado como productos distintos, salvo que corras el cálculo dos veces. El rendimiento de la etiqueta es de laboratorio; una superficie rugosa puede gastar un 20–40% más.",
    ],
    steps: [
      "Enter total wall length and height in meters, then subtract openings in square meters.",
      "Pick a preset or set coats, coverage in m² per liter, waste, and can size.",
      "Optionally add price per liter to see a material estimate.",
      "Read liters, cans to buy, and leftover paint. Round up to whole cans.",
      "Copy the result or reset and try another finish.",
    ],
    stepsEs: [
      "Ingresá el largo total y la altura en metros, y restá los huecos en metros cuadrados.",
      "Elegí un preset o cargá manos, rendimiento en m² por litro, desperdicio y tamaño de lata.",
      "Si querés, sumá el precio por litro para ver un estimado de material.",
      "Leé litros, latas a comprar y sobrante. Las latas se redondean hacia arriba.",
      "Copiá el resultado o restablecé y probá otro acabado.",
    ],
    faq: [
      {
        q: "How are paint liters calculated?",
        a: "Net area is length × height − openings. Paintable area is net area × coats × (1 + waste/100). Liters are paintable area divided by coverage in m² per liter. Cans are liters divided by can size, rounded up.",
      },
      {
        q: "What coverage should I enter?",
        a: "Use the figure on the can, usually m² per liter or per coat. Interior latex is often around 10 m²/L, primer a bit higher, exterior masonry lower. If the label is per gallon, convert first (1 US gallon ≈ 3.785 L).",
      },
      {
        q: "Does waste include cutting in and a second coat?",
        a: "Coats are a separate input. Waste covers offcuts, tray residue, and uneven suction. A typical allowance is 10% on smooth walls and 15% outside or on new plaster.",
      },
      {
        q: "Is the room measurement uploaded?",
        a: "No. The calculation stays in the browser and nothing is sent to a server.",
      },
      {
        q: "How is this different from a paint cost multiplier?",
        a: "A simple area × price tool does not split liters from can size or subtract openings. This calculator does both, and price is optional.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calculan los litros de pintura?",
        a: "La superficie neta es largo × altura − huecos. La superficie a pintar es neta × manos × (1 + desperdicio/100). Los litros son esa superficie dividida por el rendimiento en m² por litro. Las latas son los litros divididos por el tamaño de lata, redondeados hacia arriba.",
      },
      {
        q: "¿Qué rendimiento cargo?",
        a: "Usá el de la lata, en m² por litro o por mano. El látex interior ronda 10 m²/L, la imprimación un poco más y el exterior sobre mampostería menos. Si la etiqueta está por galón, convertí antes (1 galón US ≈ 3,785 L).",
      },
      {
        q: "¿El desperdicio incluye la segunda mano?",
        a: "Las manos van aparte. El desperdicio cubre recortes, resto en la bandeja y absorción irregular. Un margen habitual es 10% en pared lisa y 15% en exterior o yeso nuevo.",
      },
      {
        q: "¿Se envían las medidas de la habitación?",
        a: "No. El cálculo queda en el navegador y no se manda a un servidor.",
      },
      {
        q: "¿En qué se diferencia de multiplicar metros por precio?",
        a: "Un coste simple de área × precio no separa litros de tamaño de lata ni resta huecos. Esta calculadora hace las dos cosas y el precio es opcional.",
      },
    ],
  },
};
