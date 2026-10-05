import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_BOARD_FOOT: Record<string, ToolSeoOverride> = {
  "calculadora-pies-tablares": {
    metaTitle: "Board Foot Calculator — Lumber Volume | UtiliHub",
    metaTitleEs: "Calculadora de pies tablares | UtiliHub",
    metaDescription:
      "Convert lumber thickness, width, and length into board feet, cubic feet, and cost. Nominal or dressed sizes, waste, and a cut list. Free, in the browser.",
    metaDescriptionEs:
      "Pasá espesor, ancho y largo de madera a pies tablares, pies cúbicos y costo. Medida nominal o cepillada, desperdicio y lista de cortes. Gratis, en el navegador.",
    about: [
      "A board foot is 144 cubic inches: a board 12 inches wide, 12 inches long, and 1 inch thick. For each cut the tool uses board feet = thickness (in) × width (in) × length (ft) × quantity ÷ 12, then adds the waste percent you set.",
      "Softwood sold as a 2×4 is usually dressed to about 1.5 × 3.5 inches. Some yards bill the nominal name size, others bill the dressed size. Switch the size basis and the common-section chips fill the matching inches. Custom millimeter sizes are treated as the numbers you typed.",
      "The cut list can hold up to 12 lines. Cubic feet are board feet ÷ 12, and cubic meters use 0.00236 m³ per board foot. Optional price is per board foot after waste, not per stick. Pieces to order round the count up after waste.",
      "Nothing is uploaded. This is a volume and shopping estimate, not a span table or grade check. It does not add headers, hardware, or moisture shrinkage.",
    ],
    aboutEs: [
      "Un pie tablar son 144 pulgadas cúbicas: una tabla de 12 × 12 pulgadas y 1 pulgada de espesor. En cada corte se usa pies tablares = espesor (in) × ancho (in) × largo (ft) × cantidad ÷ 12, y después se suma el desperdicio que indiques.",
      "Un 2×4 de madera blanda cepillada suele medir 1,5 × 3,5 pulgadas. Algunos aserraderos facturan la medida nominal y otros la cepillada. Al cambiar la base, las secciones habituales cargan las pulgadas que corresponden. Si escribís milímetros a mano, se usan esos números.",
      "La lista admite hasta 12 cortes. Los pies cúbicos son pies tablares ÷ 12, y los metros cúbicos usan 0,00236 m³ por pie tablar. El precio opcional es por pie tablar ya con desperdicio, no por listón. Las piezas a pedir redondean hacia arriba después del desperdicio.",
      "No se sube nada. Es una estimación de volumen y compra, no una tabla de luces ni un control de grado. No suma dinteles, herrajes ni merma por humedad.",
    ],
    steps: [
      "Pick an example or add cuts with thickness, width, length, and quantity.",
      "Choose inches/feet or millimeters/meters, and nominal or dressed size.",
      "Set waste and, if you want a budget, the price per board foot.",
      "Read board feet, cubic volume, pieces to order, and copy the list.",
    ],
    stepsEs: [
      "Elegí un ejemplo o agregá cortes con espesor, ancho, largo y cantidad.",
      "Elegí pulgadas/pies o milímetros/metros, y medida nominal o cepillada.",
      "Indicá el desperdicio y, si querés un presupuesto, el precio por pie tablar.",
      "Leé pies tablares, volumen, piezas a pedir y copiá la lista.",
    ],
    faq: [
      {
        q: "How do you calculate board feet?",
        a: "Multiply thickness in inches by width in inches by length in feet by the number of pieces, then divide by 12. An 8 ft dressed 2×4 (1.5 × 3.5) is 3.5 board feet.",
      },
      {
        q: "Should I use nominal or actual size?",
        a: "Use the size your supplier bills. Dressed softwood is smaller than the name: a 2×4 is about 1.5 × 3.5 inches. Nominal billing uses 2 × 4 and gives a higher board-foot count.",
      },
      {
        q: "Can I enter metric lumber?",
        a: "Yes. Millimeters and meters are converted to inches and feet before the board-foot formula. A 20 × 200 mm board, 1.8 m long, is about 3.05 board feet.",
      },
      {
        q: "Is the cut list uploaded?",
        a: "No. Thickness, length, and price stay in the browser. There is no account and no server calculation.",
      },
      {
        q: "Does waste change the volume?",
        a: "Yes. The with-waste board feet and the piece count both apply your waste percent. Cost uses the with-waste volume. The base board-foot line does not include waste.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calculan los pies tablares?",
        a: "Multiplicá espesor en pulgadas por ancho en pulgadas por largo en pies por la cantidad, y dividí por 12. Un 2×4 cepillado de 8 ft (1,5 × 3,5) da 3,5 pies tablares.",
      },
      {
        q: "¿Uso la medida nominal o la cepillada?",
        a: "Usá la que factura el proveedor. La madera blanda cepillada es menor que el nombre: un 2×4 mide unos 1,5 × 3,5 in. Facturar el nominal 2 × 4 da más pies tablares.",
      },
      {
        q: "¿Puedo cargar madera en milímetros?",
        a: "Sí. Milímetros y metros se pasan a pulgadas y pies antes de la fórmula. Una tabla de 20 × 200 mm y 1,8 m da unos 3,05 pies tablares.",
      },
      {
        q: "¿Se sube la lista de cortes?",
        a: "No. Espesor, largo y precio se quedan en el navegador. No hay cuenta ni cálculo en el servidor.",
      },
      {
        q: "¿El desperdicio cambia el volumen?",
        a: "Sí. Los pies tablares con desperdicio y las piezas a pedir aplican ese porcentaje. El costo usa el volumen con desperdicio. La línea base no lo incluye.",
      },
    ],
  },
};
