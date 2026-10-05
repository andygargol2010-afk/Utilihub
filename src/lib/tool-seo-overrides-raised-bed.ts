import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RAISED_BED: Record<string, ToolSeoOverride> = {
  "calculadora-jardinera": {
    metaTitle: "Raised Bed Soil Calculator — Bags | UtiliHub",
    metaTitleEs: "Calculadora de tierra para jardinera | UtiliHub",
    metaDescription:
      "Estimate soil volume, compost, and bags for raised garden beds from length, width, and fill height. Cubic yards or meters. Free, in the browser.",
    metaDescriptionEs:
      "Calculá volumen de tierra, compost y sacos para bancales o jardineras según largo, ancho y altura de relleno. Metros o yardas cúbicas. Gratis, en el navegador.",
    about: [
      "Enter the inside length and width of the box, the soil fill height (not the wall height if you leave a lip), and how many identical beds you are filling. Order volume is length × width × fill height × bed count × (1 + waste). Bags are that volume divided by the bag you buy, rounded up.",
      "A planning mix splits the order into compost and the rest as topsoil or potting mix. The default is 30% compost by volume, a common vegetable-bed starting point, not a soil test. Drop compost to 0% for a straight topsoil order, or raise it when the bag blend already includes less organic matter than you want.",
      "Metric results show cubic meters and liters per bag. Foot results show cubic feet, cubic yards (cubic feet ÷ 27), and cubic-foot bags. Leftover is purchased bag volume minus the order volume. Optional price is bags times price per bag.",
      "Nothing is uploaded. Zero, negative, and oversized boxes are rejected. This is a planter-box soil list. Open mulch, gravel, or topsoil spread by area and depth stays in the gravel calculator; seed weight stays in the grass seed calculator.",
    ],
    aboutEs: [
      "Ingresá el largo y el ancho interiores de la caja, la altura de relleno de tierra (no la altura del borde si dejás un labio) y cuántos bancales iguales vas a llenar. El volumen a pedir es largo × ancho × altura de relleno × cantidad × (1 + desperdicio). Los sacos son ese volumen dividido por el saco que comprás, redondeado hacia arriba.",
      "Una mezcla de planificación parte el pedido en compost y el resto en tierra vegetal o sustrato. El 30% de compost por volumen es un punto de partida habitual para huerto, no un análisis de suelo. Bajalo a 0% si pedís solo tierra, o subilo si la mezcla del saco trae menos materia orgánica de la que querés.",
      "En metros el resultado va en metros cúbicos y el saco en litros. En pies va en pies cúbicos, yardas cúbicas (pies cúbicos ÷ 27) y sacos en pies cúbicos. El sobrante es el volumen comprado menos el volumen a pedir. El precio opcional es sacos por precio del saco.",
      "No se sube nada. Se rechazan cajas nulas, negativas o enormes. Es una lista de sustrato para jardinera. El mantillo, la grava o la tierra vegetal a granel por área y profundidad siguen en la calculadora de grava; el peso de semilla, en la de semilla de césped.",
    ],
    steps: [
      "Choose meters or feet, then enter inside length, width, and fill height.",
      "Set the number of identical beds and a waste allowance for settling or spillage.",
      "Pick a compost share and the bag size you will buy.",
      "Review total volume, compost, topsoil, bags, leftover, and optional cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y cargá largo interior, ancho y altura de relleno.",
      "Indicá cuántos bancales iguales hay y un desperdicio por asentamiento o derrame.",
      "Elegí el porcentaje de compost y el tamaño de saco que vas a comprar.",
      "Revisá volumen total, compost, tierra, sacos, sobrante y el precio opcional, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is raised bed soil calculated?",
        a: "Volume is inside length × inside width × fill height × number of beds × (1 + waste). Compost is that volume times the compost share. Bags are order volume divided by one bag, rounded up. Cubic yards are cubic feet divided by 27.",
      },
      {
        q: "Should I use wall height or fill height?",
        a: "Use the soil depth you will actually fill. Leaving 2–5 cm (about an inch) below the rim avoids spill when you water. Do not use the outside wall height if the boards sit above the soil line.",
      },
      {
        q: "Does this replace the gravel calculator?",
        a: "No. Gravel, mulch, and open topsoil spreads use area and a thin depth. This tool is for boxed beds: bed count, fill height, and a compost versus topsoil split.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Dimensions, mix, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la tierra del bancal?",
        a: "El volumen es largo interior × ancho interior × altura de relleno × cantidad de bancales × (1 + desperdicio). El compost es ese volumen por el porcentaje de compost. Los sacos son el volumen a pedir dividido por un saco, redondeado hacia arriba. Las yardas cúbicas son los pies cúbicos divididos por 27.",
      },
      {
        q: "¿Uso la altura del borde o la de relleno?",
        a: "Usá la profundidad de tierra que vas a cargar de verdad. Dejar 2–5 cm (cerca de una pulgada) bajo el borde evita derrames al regar. No uses la altura exterior de la tabla si la madera queda por encima de la tierra.",
      },
      {
        q: "¿Reemplaza a la calculadora de grava?",
        a: "No. Grava, mantillo y tierra vegetal a cielo abierto usan área y una profundidad fina. Esta tool es para cajas: cantidad de bancales, altura de relleno y el reparto compost contra tierra.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, la mezcla, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
