import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_BRICK: Record<string, ToolSeoOverride> = {
  "calculadora-ladrillos": {
    metaTitle: "Brick Calculator — Wall and Mortar | UtiliHub",
    metaTitleEs: "Calculadora de ladrillos y mortero | UtiliHub",
    metaDescription:
      "Estimate bricks and mortar bags for a single-wythe wall. Deduct openings, add waste, and price optional packs. Free, in the browser.",
    metaDescriptionEs:
      "Calculá ladrillos y sacos de mortero para una pared de una hoja. Descontá huecos, sumá desperdicio y un precio opcional. Gratis, en el navegador.",
    about: [
      "Enter a wall as length times height, or a known area. Window and door openings are subtracted before waste and cannot be larger than the gross area. The count is for one leaf (a single wythe), not a cavity wall with two skins.",
      "Bricks are the order area divided by the face module: (brick length + joint) times (brick height + joint), rounded up. Mortar volume is the ordered brick count times the joint block around each brick, (length + joint) × (height + joint) × depth minus the brick face times depth. Bags are that volume divided by the bag yield, rounded up.",
      "Presets set a US modular brick (7.625 × 2.25 × 3.625 in, 3/8 in joint, about 7 per ft²), a metric solid (24 × 5.2 × 11.5 cm, 1 cm joint), a hollow 24 × 11.5 cm face, and a UK brick (215 × 65 × 102.5 mm). An 80 lb US bag is about 0.65 ft³; a 25 kg bag is about 0.015 m³. Match the yield printed on the bag you buy.",
      "This is a material count, not a structural or code check, and it does not replace the patio paver calculator or the concrete volume calculator. Nothing is uploaded. Zero, negative, and oversized walls are rejected.",
    ],
    aboutEs: [
      "Cargá la pared como largo por alto, o un área conocida. Las ventanas y puertas se restan antes del desperdicio y no pueden superar el área bruta. El conteo es de una sola hoja, no de un muro de dos hojas con cámara.",
      "Los ladrillos son el área a pedir dividida por el módulo de cara: (largo + junta) por (alto + junta), hacia arriba. El volumen de mortero es esa cantidad por el bloque de junta de cada ladrillo: (largo + junta) × (alto + junta) × fondo menos la cara del ladrillo por el fondo. Los sacos son ese volumen dividido por el rendimiento del saco, hacia arriba.",
      "Los presets fijan un ladrillo modular de EE. UU. (7,625 × 2,25 × 3,625 in, junta 3/8 in, unos 7 por ft²), un macizo métrico (24 × 5,2 × 11,5 cm, junta 1 cm), un hueco de cara 24 × 11,5 cm y un ladrillo UK (215 × 65 × 102,5 mm). Un saco de 80 lb rinde unos 0,65 ft³; uno de 25 kg, unos 0,015 m³. Igualá el rendimiento que dice el saco.",
      "Es un conteo de material, no un cálculo estructural ni de normativa, y no reemplaza la calculadora de adoquines ni la de hormigón. No se sube nada. Se rechazan paredes nulas, negativas o enormes.",
    ],
    steps: [
      "Choose meters or feet, then a wall or a known area.",
      "Pick a modular, metric, hollow, or UK preset, or enter brick size and joint.",
      "Subtract openings, set waste, and adjust the mortar bag yield.",
      "Review bricks, bags, and optional cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y una pared o un área conocida.",
      "Usá un preset modular, métrico, hueco o UK, o cargá el ladrillo y la junta.",
      "Restá huecos, definí el desperdicio y el rendimiento del saco de mortero.",
      "Revisá ladrillos, sacos y el coste opcional, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is the brick count calculated?",
        a: "Gross area is wall length × height, or the area you type. Net area subtracts openings. Order area is net × (1 + waste). Bricks are order area divided by (length + joint) × (height + joint), rounded up.",
      },
      {
        q: "How are mortar bags estimated?",
        a: "Each ordered brick is assigned the mortar in its bed and head joint: the face module times brick depth, minus the brick itself. Bags are that volume divided by the bag yield, rounded up. A typical 80 lb bag is about 0.65 ft³ and a 25 kg bag about 0.015 m³; check the bag.",
      },
      {
        q: "Does this replace the paver or concrete calculator?",
        a: "No. Pavers count patio units and bedding sand. Concrete counts pour volume and cement bags. This tool only counts single-wythe wall bricks and mortar.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Dimensions, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de ladrillos?",
        a: "El área bruta es largo × alto, o el área que escribas. El neto resta los huecos. El área a pedir es neto × (1 + desperdicio). Los ladrillos son esa área dividida por (largo + junta) × (alto + junta), hacia arriba.",
      },
      {
        q: "¿Cómo se estiman los sacos de mortero?",
        a: "A cada ladrillo pedido se le asigna el mortero de junta horizontal y vertical: el módulo de cara por el fondo, menos el propio ladrillo. Los sacos son ese volumen dividido por el rendimiento del saco, hacia arriba. Un saco de 80 lb rinde unos 0,65 ft³ y uno de 25 kg unos 0,015 m³; confirmá el saco.",
      },
      {
        q: "¿Reemplaza a la calculadora de adoquines o de hormigón?",
        a: "No. Los adoquines cuentan piezas de patio y arena de asiento. El hormigón cuenta volumen de vertido y sacos de cemento. Esta tool solo cuenta ladrillos de una hoja y mortero.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
