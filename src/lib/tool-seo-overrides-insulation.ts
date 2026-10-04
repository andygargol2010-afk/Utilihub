import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_INSULATION: Record<string, ToolSeoOverride> = {
  "calculadora-aislamiento": {
    metaTitle: "Insulation Calculator — Batts and Rolls | UtiliHub",
    metaTitleEs: "Calculadora de aislamiento y lana de roca | UtiliHub",
    metaDescription:
      "Estimate insulation batts, rolls, and packages from wall or attic area. Deduct openings, add waste, and price optional packs. Free, in the browser.",
    metaDescriptionEs:
      "Calculá paneles, rollos y paquetes de aislante según pared o buhardilla. Descontá huecos, sumá desperdicio y un precio opcional. Gratis, en el navegador.",
    about: [
      "Enter walls as length times height times how many walls you are insulating, an attic as length times width, or a known area. Openings (windows and doors) are subtracted before waste, and cannot be larger than the gross area.",
      "Order area is the net area times 1 plus the waste percent. Pieces are that area divided by one batt, panel, or roll, rounded up. Packages are pieces divided by how many come in a bag, also rounded up. A US R-13 batt is about 15 in by 93 in (roughly 9.7 ft²); a common mineral-wool panel is 0.6 m by 1.2 m.",
      "Presets set typical piece size and bag count for R-13 walls, R-30 attic rolls, and metric panels. They do not pick an R-value for your climate. Match the cavity depth (about 3.5 in / 89 mm for a 2x4 wall, 5.5 in / 140 mm for a 2x6) and the labeled coverage on the package you buy.",
      "This is a material count, not a heat-loss or code check, and it does not replace the drywall sheet calculator or the wallpaper roll calculator. Nothing is uploaded. Zero, negative, and oversized areas are rejected.",
    ],
    aboutEs: [
      "Cargá las paredes como largo por alto por cantidad de paredes, la buhardilla como largo por ancho, o un área conocida. Los huecos (ventanas y puertas) se restan antes del desperdicio y no pueden superar el área bruta.",
      "El área a pedir es el neto por 1 más el porcentaje de desperdicio. Las piezas son esa área dividida por un panel, manta o rollo, hacia arriba. Los paquetes son las piezas divididas por cuántas trae la bolsa, también hacia arriba. Una manta R-13 de EE. UU. mide unos 15 in por 93 in (cerca de 0,9 m²); un panel habitual de lana mineral mide 0,6 m por 1,2 m.",
      "Los presets fijan el tamaño de pieza y el contenido de bolsa para paredes R-13, rollos de buhardilla R-30 y paneles métricos. No eligen el valor R de tu clima. Igualá la profundidad del hueco (unos 89 mm en un montante 2x4, 140 mm en un 2x6) con la cobertura que dice el paquete.",
      "Es un conteo de material, no un cálculo de pérdida de calor ni de normativa, y no reemplaza la calculadora de pladur ni la de papel pintado. No se sube nada. Se rechazan áreas nulas, negativas o enormes.",
    ],
    steps: [
      "Choose meters or feet, then walls, an attic, or a known area.",
      "Pick an R-13, attic-roll, or metric-panel preset, or enter piece size and pieces per pack.",
      "Subtract window and door area, set waste, and add an optional pack price.",
      "Review net area, pieces, and packages, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y paredes, buhardilla o un área conocida.",
      "Usá un preset R-13, rollo de buhardilla o panel métrico, o cargá el tamaño de pieza y las piezas por paquete.",
      "Restá ventanas y puertas, definí el desperdicio y un precio por paquete si querés.",
      "Revisá el área neta, las piezas y los paquetes, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the insulation count calculated?",
        a: "Gross area is wall length × height × wall count, attic length × width, or the area you type. Net area subtracts openings. Order area is net × (1 + waste). Pieces are order area divided by one piece, rounded up. Packages are pieces divided by the bag count, rounded up.",
      },
      {
        q: "Does this replace the drywall or wallpaper calculator?",
        a: "No. Drywall counts sheets, joint compound, and screws. Wallpaper counts rolls from drop length. This tool only counts insulation batts, panels, rolls, and packages.",
      },
      {
        q: "Which R-value should I buy?",
        a: "The presets only set a common piece size. R-13 is a typical 2x4 wall batt and R-30 is a common attic roll in mild US climates; colder roofs often need more. Check the package coverage and local energy code before ordering.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Areas, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de aislante?",
        a: "El área bruta es largo × alto × paredes, largo × ancho de buhardilla, o el área que escribas. El neto resta los huecos. El área a pedir es neto × (1 + desperdicio). Las piezas son esa área dividida por una pieza, hacia arriba. Los paquetes son las piezas divididas por el contenido de la bolsa, hacia arriba.",
      },
      {
        q: "¿Reemplaza a la calculadora de pladur o de papel pintado?",
        a: "No. El pladur cuenta placas, pasta y tornillos. El papel pintado cuenta rollos según el corte. Esta tool solo cuenta mantas, paneles, rollos y paquetes de aislante.",
      },
      {
        q: "¿Qué valor R conviene comprar?",
        a: "Los presets solo fijan un tamaño de pieza habitual. R-13 es una manta típica de pared 2x4 y R-30 un rollo de buhardilla en climas templados de EE. UU.; cubiertas frías suelen pedir más. Confirmá la cobertura del paquete y la normativa local antes de pedir.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las áreas, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
