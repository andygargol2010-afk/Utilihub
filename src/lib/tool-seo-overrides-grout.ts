import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GROUT: Record<string, ToolSeoOverride> = {
  "calculadora-junta-baldosas": {
    metaTitle: "Grout Calculator — Bags and Coverage | UtiliHub",
    metaTitleEs: "Calculadora de junta de baldosas | UtiliHub",
    metaDescription:
      "Estimate grout kilograms and bags from tile size, joint width, and depth. Sanded, unsanded, or epoxy. Free, in the browser.",
    metaDescriptionEs:
      "Calculá kilos y sacos de junta según el tamaño de la baldosa, el ancho y la profundidad. Con arena, sin arena o epoxi. Gratis, en el navegador.",
    about: [
      "Enter the tiled area, or a rectangle of length and width, plus tile length, tile width, joint width, and joint depth. Coverage in kilograms per square metre is (tile length + tile width) divided by their product, times joint width, times joint depth, times a density factor. All tile and joint sizes are in millimetres. Bags to buy are that mass times one plus waste, divided by the bag size, rounded up.",
      "A 600 by 600 mm tile with a 2 mm joint and 10 mm depth uses about 0.11 kg/m² of sanded grout before waste. A 75 by 150 mm subway tile with a 3 mm joint and 8 mm depth uses about 0.64 kg/m². A 25 mm mosaic with a 2 mm joint uses much more per square metre because there is more joint length. The density factors are planning values: 1.6 for sanded cement, 1.5 for unsanded, and 1.55 for epoxy.",
      "Presets cover a large-format floor, a subway backsplash, a mosaic sheet, and a 12 by 12 inch floor in imperial units. Waste defaults to 10 percent. A joint wider than about 5 mm usually wants sanded grout; a narrow joint on polished tile often wants unsanded. Epoxy is counted by mass, not by the resin-to-hardener split on the label.",
      "Nothing is uploaded. Empty areas, tiles outside 10 to 1200 mm, joints outside 1 to 20 mm, and waste above 30 percent are rejected. The tile calculator counts pieces and boxes. The caulk calculator sizes a sealant bead. This one only sizes the grout in the joint.",
    ],
    aboutEs: [
      "Ingresá el área revestida, o un rectángulo de largo y ancho, más el largo y el ancho de la baldosa, el ancho de junta y la profundidad. La cobertura en kilos por metro cuadrado es (largo + ancho) dividido por su producto, por el ancho de junta, por la profundidad y por un factor de densidad. Las medidas de baldosa y junta van en milímetros. Los sacos a comprar son esa masa por uno más el desperdicio, dividido el tamaño del saco, redondeado hacia arriba.",
      "Una baldosa de 600 por 600 mm con junta de 2 mm y 10 mm de profundidad usa unos 0,11 kg/m² de junta con arena antes del desperdicio. Un subway de 75 por 150 mm con junta de 3 mm y 8 mm de profundidad usa unos 0,64 kg/m². Un mosaico de 25 mm con junta de 2 mm gasta mucho más por metro cuadrado porque hay más largo de junta. Los factores de densidad son de planificación: 1,6 con arena, 1,5 sin arena y 1,55 para epoxi.",
      "Los presets cubren un piso de gran formato, un salpicadero subway, un mosaico y un piso de 12 por 12 pulgadas. El desperdicio por defecto es 10%. Una junta de más de unos 5 mm suele pedir junta con arena; una junta fina en baldosa pulida suele pedir sin arena. El epoxi se cuenta por masa, no por la proporción resina-endurecedor del envase.",
      "No se sube nada. Se rechazan áreas vacías, baldosas fuera de 10 a 1200 mm, juntas fuera de 1 a 20 mm y desperdicio mayor a 30%. La calculadora de baldosas cuenta piezas y cajas. La de silicona mide el cordón de sellador. Esta solo mide la junta entre piezas.",
    ],
    steps: [
      "Choose metres or feet, then a known area or a rectangle.",
      "Enter tile length and width, joint width, and joint depth.",
      "Pick sanded, unsanded, or epoxy, plus bag size, waste, and an optional price.",
      "Review kilograms per square metre, bags to order, leftover, and cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un área conocida o un rectángulo.",
      "Cargá el largo y el ancho de la baldosa, el ancho de junta y la profundidad.",
      "Elegí con arena, sin arena o epoxi, más el saco, el desperdicio y un precio opcional.",
      "Revisá los kilos por metro cuadrado, los sacos, el sobrante y el costo, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How much grout do I need?",
        a: "Multiply kilograms per square metre by the area, add waste, and divide by the bag size. A 600 mm tile with a 2 mm joint uses about 0.11 kg/m² of sanded grout before waste. A smaller tile uses more because the joint length per square metre is longer.",
      },
      {
        q: "What is the formula?",
        a: "kg/m² = (tile length + tile width) / (tile length × tile width) × joint width × joint depth × density. Sizes are millimetres. Density is 1.6 for sanded cement, 1.5 for unsanded, and 1.55 for epoxy.",
      },
      {
        q: "Sanded or unsanded grout?",
        a: "Sanded grout is the usual pick for joints wider than about 5 mm. Unsanded is for narrow joints, often under 3 mm, especially on polished or glass tile. This tool does not choose the product; it only changes the density factor.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Areas, tile sizes, prices, and the bag count stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuánta junta necesito?",
        a: "Multiplicá los kilos por metro cuadrado por el área, sumá el desperdicio y dividí por el tamaño del saco. Una baldosa de 600 mm con junta de 2 mm usa unos 0,11 kg/m² de junta con arena antes del desperdicio. Una baldosa más chica gasta más porque hay más largo de junta por metro cuadrado.",
      },
      {
        q: "¿Cuál es la fórmula?",
        a: "kg/m² = (largo + ancho) / (largo × ancho) × ancho de junta × profundidad × densidad. Las medidas van en milímetros. La densidad es 1,6 con arena, 1,5 sin arena y 1,55 para epoxi.",
      },
      {
        q: "¿Junta con arena o sin arena?",
        a: "La junta con arena es la opción habitual por encima de unos 5 mm. La sin arena es para juntas finas, a menudo bajo 3 mm, sobre todo en baldosa pulida o vidrio. Esta tool no elige el producto; solo cambia el factor de densidad.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las áreas, las medidas, los precios y la cantidad de sacos quedan en tu dispositivo.",
      },
    ],
  },
};
