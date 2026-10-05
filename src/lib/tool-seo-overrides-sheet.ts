import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SHEET: Record<string, ToolSeoOverride> = {
  "calculadora-tableros": {
    metaTitle: "Plywood Sheet Calculator — OSB and MDF | UtiliHub",
    metaTitleEs: "Calculadora de tableros OSB y MDF | UtiliHub",
    metaDescription:
      "Estimate plywood, OSB, and MDF sheets from floor or wall area, openings, and sheet size. Includes waste and weight. Free, in the browser.",
    metaDescriptionEs:
      "Calculá tableros de contrachapado, OSB y MDF desde el área, los huecos y el tamaño de placa. Incluye desperdicio y peso. Gratis, en el navegador.",
    about: [
      "Enter a rectangle or a known area, then subtract doors, windows, or other openings. Net area is gross area minus openings. Sheets to order are the net area times one plus waste, divided by the face area of one sheet, rounded up.",
      "Presets cover a 4 by 8 foot OSB subfloor, 7/16 inch wall sheathing, an 18 mm MDF cabinet run, and a 1250 by 2500 mm plywood sheet common in metric yards. You can type any sheet length and width. A 4 by 8 sheet is 32 square feet, about 2.97 square meters. A 1220 by 2440 mm sheet is about 2.98 square meters.",
      "Weight is net sheet area times thickness times a planning density: plywood 550, OSB 650, and MDF 750 kilograms per cubic meter. It is the boards themselves, not pallets or fasteners. Waste default is 10 percent for straight sheathing and 15 percent when cuts are awkward. It does not nest a cut list.",
      "Nothing is uploaded. Empty areas, openings larger than the surface, and oversized sheets are rejected. Drywall and vinyl siding have their own calculators; this one is only for wood-based sheet goods.",
    ],
    aboutEs: [
      "Ingresá un rectángulo o un área conocida y restá puertas, ventanas u otros huecos. El área neta es el área bruta menos los huecos. Los tableros a pedir son el área neta por uno más el desperdicio, dividido el área de una placa, redondeado hacia arriba.",
      "Los presets cubren un contrapiso de OSB de 4 por 8 pies, un cerramiento de pared de 7/16 pulgada, un mueble de MDF de 18 mm y una placa de contrachapado de 1250 por 2500 mm habitual en depósitos métricos. Podés escribir cualquier largo y ancho. Una placa de 4 por 8 son 32 pies cuadrados, unos 2,97 metros cuadrados. Una de 1220 por 2440 mm son unos 2,98 metros cuadrados.",
      "El peso es el área neta de placas por el espesor por una densidad de planificación: contrachapado 550, OSB 650 y MDF 750 kilos por metro cúbico. Son las placas, no el pallet ni los tornillos. El desperdicio por defecto es 10% para un cerramiento recto y 15% si los cortes son incómodos. No optimiza un despiece.",
      "No se sube nada. Se rechazan áreas vacías, huecos mayores que la superficie y placas enormes. El pladur y el siding vinílico tienen calculadoras propias; esta es solo para tableros de madera.",
    ],
    steps: [
      "Choose meters or feet, then a rectangle or a known area.",
      "Subtract openings and pick a plywood, OSB, or MDF preset, or type the sheet size.",
      "Set thickness, waste, and an optional price per sheet.",
      "Review sheet count, leftover area, weight, and cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un rectángulo o un área conocida.",
      "Restá los huecos y elegí un preset de contrachapado, OSB o MDF, o escribí el tamaño de la placa.",
      "Cargá el espesor, el desperdicio y un precio por placa opcional.",
      "Revisá la cantidad, el sobrante, el peso y el costo, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How many 4x8 sheets of plywood do I need?",
        a: "Divide the net area by 32 square feet, multiply by one plus the waste fraction, and round up. A 10 by 12 foot floor is 120 square feet, about 4.13 sheets before waste and 5 sheets at 10 percent waste.",
      },
      {
        q: "Does this replace the drywall calculator?",
        a: "No. Drywall uses gypsum board sizes plus joint compound and screws. This tool only counts plywood, OSB, and MDF faces.",
      },
      {
        q: "Why is the sheet count rounded up?",
        a: "Yards sell whole sheets. Leftover area is the unused face of the last sheet after waste, not a guaranteed offcut you can reuse on another wall.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Areas, sheet sizes, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántas placas de 4x8 necesito?",
        a: "Dividí el área neta por 32 pies cuadrados, multiplicá por uno más la fracción de desperdicio y redondeá hacia arriba. Un piso de 10 por 12 pies son 120 pies cuadrados, unas 4,13 placas sin desperdicio y 5 placas con 10%.",
      },
      {
        q: "¿Reemplaza a la calculadora de pladur?",
        a: "No. El pladur usa placas de yeso más masilla y tornillos. Esta tool solo cuenta caras de contrachapado, OSB y MDF.",
      },
      {
        q: "¿Por qué se redondea hacia arriba?",
        a: "El depósito vende placas enteras. El sobrante es la cara no usada de la última placa después del desperdicio, no un recorte garantizado para otra pared.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las áreas, los tamaños, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
