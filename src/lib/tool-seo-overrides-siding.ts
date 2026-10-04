import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SIDING: Record<string, ToolSeoOverride> = {
  "calculadora-siding": {
    metaTitle: "Vinyl Siding Calculator — Squares | UtiliHub",
    metaTitleEs: "Calculadora de siding vinílico | UtiliHub",
    metaDescription:
      "Estimate vinyl siding squares, panels, starter strip, and J-channel from wall area. Deduct openings, add waste, and price optional squares. Free, in the browser.",
    metaDescriptionEs:
      "Calculá squares, paneles, starter strip y canal J de siding vinílico según las paredes. Restá huecos, sumá desperdicio y un precio opcional. Gratis, en el navegador.",
    about: [
      "Enter walls as length times height times how many walls you are cladding, or a known wall area. Window and door area is subtracted before waste and cannot be larger than the gross area.",
      "A siding square is 100 square feet (about 9.29 m²). Order area is the net wall area times 1 plus the waste percent. Panels are that area divided by one panel’s exposure times its length, rounded up. Exposure is the visible course height, not the full manufactured width: a common double-4 panel exposes about 8 inches.",
      "Starter strip follows the bottom of each wall. J-channel follows the opening perimeter you enter (sides and heads of windows and doors). Outside corner pieces follow wall height times the number of outside corners. Presets set double-4, double-5, and a metric 203 mm exposure; they do not choose a color, wind rating, or housewrap.",
      "This is a material count, not a layout or code check, and it does not replace the brick calculator or the insulation calculator. Nothing is uploaded. Zero, negative, and oversized areas are rejected.",
    ],
    aboutEs: [
      "Cargá las paredes como largo por alto por cantidad de paredes, o un área de pared conocida. El área de ventanas y puertas se resta antes del desperdicio y no puede superar el área bruta.",
      "Un square de siding son 100 pies cuadrados (unos 9,29 m²). El área a pedir es el neto por 1 más el porcentaje de desperdicio. Los paneles son esa área dividida por la exposición de un panel por su largo, hacia arriba. La exposición es el alto visible de cada hilada, no el ancho fabricado: un double-4 habitual expone unos 20 cm.",
      "El starter strip sigue la base de cada pared. El canal J sigue el perímetro de huecos que indiques (laterales y dinteles de ventanas y puertas). Las esquinas exteriores siguen el alto de pared por la cantidad de esquinas. Los presets fijan double-4, double-5 y una exposición métrica de 203 mm; no eligen color, resistencia al viento ni barrera de agua.",
      "Es un conteo de material, no un replanteo ni una verificación de normativa, y no reemplaza la calculadora de ladrillos ni la de aislamiento. No se sube nada. Se rechazan áreas nulas, negativas o enormes.",
    ],
    steps: [
      "Choose meters or feet, then walls or a known area.",
      "Pick a double-4, double-5, or metric preset, or enter exposure and panel length.",
      "Subtract openings, enter the opening perimeter for J-channel, and set waste and outside corners.",
      "Review squares, panels, starter, and J-channel, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y paredes o un área conocida.",
      "Usá un preset double-4, double-5 o métrico, o cargá la exposición y el largo del panel.",
      "Restá huecos, indicá el perímetro de aberturas para el canal J, y definí desperdicio y esquinas.",
      "Revisá squares, paneles, starter y canal J, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the vinyl siding count calculated?",
        a: "Gross area is wall length × height × wall count, or the area you type. Net area subtracts openings. Order area is net × (1 + waste). Squares are order area divided by 100 ft² (or 9.29 m²). Panels are order area divided by exposure × panel length, rounded up.",
      },
      {
        q: "Does this replace the brick or insulation calculator?",
        a: "No. Bricks count masonry units and mortar bags. Insulation counts batts, rolls, and packages. This tool only counts vinyl siding squares, panels, starter strip, J-channel, and outside corners.",
      },
      {
        q: "What exposure should I use?",
        a: "Use the labeled exposure, not the full panel width. Double-4 is about 8 in (203 mm) and double-5 is about 10 in (254 mm). A 12.5 ft double-4 panel is a common US length; metric panels are often about 3.66 m. Match the package you buy.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Areas, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de siding?",
        a: "El área bruta es largo × alto × paredes, o el área que escribas. El neto resta los huecos. El área a pedir es neto × (1 + desperdicio). Los squares son esa área dividida por 100 ft² (o 9,29 m²). Los paneles son el área a pedir dividida por exposición × largo, hacia arriba.",
      },
      {
        q: "¿Reemplaza a la calculadora de ladrillos o de aislamiento?",
        a: "No. Los ladrillos cuentan piezas de mampostería y sacos de mortero. El aislamiento cuenta mantas, rollos y paquetes. Esta tool solo cuenta squares, paneles, starter strip, canal J y esquinas de siding vinílico.",
      },
      {
        q: "¿Qué exposición tengo que usar?",
        a: "Usá la exposición impresa, no el ancho total del panel. El double-4 expone unos 203 mm y el double-5 unos 254 mm. Un panel double-4 de 12,5 ft es un largo habitual en EE. UU.; los paneles métricos suelen medir unos 3,66 m. Igualá el paquete que vas a comprar.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las áreas, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
