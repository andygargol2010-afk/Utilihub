import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_THINSET: Record<string, ToolSeoOverride> = {
  "calculadora-adhesivo-baldosas": {
    metaTitle: "Tile Adhesive Calculator — Thinset Bags | UtiliHub",
    metaTitleEs: "Calculadora de adhesivo para baldosas | UtiliHub",
    metaDescription:
      "Estimate thinset kilograms and bags from area and trowel notch. Optional back-butter for large format. Free, in the browser.",
    metaDescriptionEs:
      "Calculá kilos y sacos de cemento cola según el área y la llana. Con doble encolado opcional para gran formato. Gratis, en el navegador.",
    about: [
      "Enter a known area or a rectangle, then pick a square-notch trowel. Coverage in kilograms per square metre is a planning rate for that notch: 1.5 for 3 mm, 3 for 6 mm, 4 for 8 mm, 5 for 10 mm, 6.5 for 12 mm, and 8 for 15 mm. Bags to buy are that rate times the area, times one plus waste, plus an optional back-butter skim, divided by the bag size and rounded up.",
      "A 4 by 3 metre floor with a 10 mm notch uses about 5 kg/m², or 60 kg before waste. At 10 percent waste and 25 kg bags that is 3 bags. The same floor with a 12 mm notch and back-buttering adds about 1 kg/m² of skim, so the order rises. A 4 m² mosaic wall on a 3 mm notch stays near 1.5 kg/m² before waste.",
      "Presets cover a 20 cm wall, a 60 cm floor, a large-format slab with back-butter, and a mosaic sheet. Waste defaults to 10 percent. Back-buttering is a flat skim on the tile back, common above about 300 mm on a side; it is not a second full notch bed. The rates assume a square notch that collapses to roughly half the notch volume, which is the usual field estimate, not a lab coverage from one brand.",
      "Nothing is uploaded. Empty areas, waste above 30 percent, and bag sizes outside 2 to 25 kg are rejected. The tile calculator counts pieces and boxes. The grout calculator sizes the joint. This one only sizes the adhesive under the tile.",
    ],
    aboutEs: [
      "Ingresá un área conocida o un rectángulo y elegí la llana de diente cuadrado. La cobertura en kilos por metro cuadrado es una tasa de planificación: 1,5 para 3 mm, 3 para 6 mm, 4 para 8 mm, 5 para 10 mm, 6,5 para 12 mm y 8 para 15 mm. Los sacos a comprar son esa tasa por el área, por uno más el desperdicio, más un enlucido opcional de doble encolado, dividido el tamaño del saco y redondeado hacia arriba.",
      "Un piso de 4 por 3 metros con llana de 10 mm usa unos 5 kg/m², o 60 kg antes del desperdicio. Con 10% de desperdicio y sacos de 25 kg son 3 sacos. El mismo piso con llana de 12 mm y doble encolado suma unos 1 kg/m² de enlucido, así que el pedido sube. Una pared de mosaico de 4 m² con llana de 3 mm queda cerca de 1,5 kg/m² antes del desperdicio.",
      "Los presets cubren una pared de 20 cm, un piso de 60 cm, una losa de gran formato con doble encolado y un mosaico. El desperdicio por defecto es 10%. El doble encolado es un enlucido plano en el reverso, habitual por encima de unos 300 mm de lado; no es una segunda cama con el diente completo. Las tasas asumen un diente cuadrado que se aplasta a cerca de la mitad del volumen, que es la estimación de obra habitual, no la cobertura de laboratorio de una marca.",
      "No se sube nada. Se rechazan áreas vacías, desperdicio mayor a 30% y sacos fuera de 2 a 25 kg. La calculadora de baldosas cuenta piezas y cajas. La de junta mide el mortero de juntas. Esta solo mide el adhesivo debajo de la pieza.",
    ],
    steps: [
      "Choose metres or feet, then a known area or a rectangle.",
      "Pick the trowel notch that matches the tile and the substrate.",
      "Set bag size, waste, and turn on back-buttering only for large format.",
      "Review kilograms per square metre, bags to order, leftover, and optional cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un área conocida o un rectángulo.",
      "Elegí el diente de llana que corresponde a la baldosa y al soporte.",
      "Cargá el saco, el desperdicio y activá el doble encolado solo en gran formato.",
      "Revisá los kilos por metro cuadrado, los sacos, el sobrante y el costo opcional, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How much thinset do I need?",
        a: "Multiply the notch rate by the area, add waste, and divide by the bag size. A 10 mm square notch is about 5 kg/m² before waste. A 6 mm notch is about 3 kg/m². Back-buttering adds about 1 kg/m² of skim.",
      },
      {
        q: "What is the formula?",
        a: "Order kg = area × notch rate × (1 + waste) + area × 1 kg/m² if back-buttering. Notch rates are 1.5, 3, 4, 5, 6.5, and 8 kg/m² for 3, 6, 8, 10, 12, and 15 mm square notches. Bags are that mass divided by the bag size, rounded up.",
      },
      {
        q: "When should I back-butter?",
        a: "Large-format tile, often over 300 mm on a side, and any tile that must reach full contact usually gets a flat skim on the back. This tool adds 1 kg/m² for that skim. It does not replace the trowel bed.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Areas, notch choice, prices, and the bag count stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuánto cemento cola necesito?",
        a: "Multiplicá la tasa de la llana por el área, sumá el desperdicio y dividí por el tamaño del saco. Una llana de 10 mm es unos 5 kg/m² antes del desperdicio. Una de 6 mm es unos 3 kg/m². El doble encolado suma unos 1 kg/m² de enlucido.",
      },
      {
        q: "¿Cuál es la fórmula?",
        a: "Kilos a pedir = área × tasa de llana × (1 + desperdicio) + área × 1 kg/m² si hay doble encolado. Las tasas son 1,5, 3, 4, 5, 6,5 y 8 kg/m² para dientes de 3, 6, 8, 10, 12 y 15 mm. Los sacos son esa masa dividida el tamaño del saco, redondeada hacia arriba.",
      },
      {
        q: "¿Cuándo conviene el doble encolado?",
        a: "El gran formato, a menudo por encima de 300 mm de lado, y cualquier pieza que deba quedar con contacto pleno suelen llevar un enlucido plano en el reverso. Esta tool suma 1 kg/m² por ese enlucido. No reemplaza la cama de la llana.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las áreas, la llana, los precios y la cantidad de sacos quedan en tu dispositivo.",
      },
    ],
  },
};
