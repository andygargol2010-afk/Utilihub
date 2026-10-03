import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ROOF: Record<string, ToolSeoOverride> = {
  "calculadora-tejado": {
    metaTitle: "Roof shingle calculator — squares and bundles",
    metaTitleEs: "Calculadora de tejado — tejas y paquetes",
    metaDescription:
      "Estimate roof squares and shingle bundles from footprint, pitch, and waste. Ridge caps and optional bundle price. 3-tab and architectural presets. Local.",
    metaDescriptionEs:
      "Calculá squares y paquetes de tejas según planta, pendiente y desperdicio. Cumbreras y precio opcional. Presets de 3-tab y arquitectónica. En el navegador.",
    about: [
      "This roof shingle calculator turns a horizontal footprint and a pitch into sloped area, roofing squares, and whole bundles to buy. It is a purchase planner, not a structural or code review.",
      "Plan area is length times width. The pitch factor is the square root of 1 plus (rise/run) squared, which converts horizontal area into sloped roof area. One square is 100 square feet (about 9.29 m²). Bundles are the sloped area with waste, divided by that square, times bundles per square, then rounded up.",
      "Use it when a supplier sells asphalt shingles by the bundle and quotes coverage as three bundles per square for 3-tab, or three to five for architectural products. Optional ridge length uses a separate coverage per bundle so hip-and-ridge caps are not mixed into field shingles.",
      "It assumes a simple rectangular footprint. Valleys, dormers, and cut-up roofs need the extra-area field or a higher waste percentage (often 15% instead of 10%). Slopes under 2/12 are usually not shingle roofs; the tool warns but does not block the math. Always confirm coverage on the bundle you will buy.",
    ],
    aboutEs: [
      "Esta calculadora de tejas pasa la planta horizontal y la pendiente a superficie inclinada, squares y paquetes enteros. Sirve para planear la compra, no para un cálculo estructural ni de normativa.",
      "La planta es largo por ancho. El factor de pendiente es la raíz de 1 más (subida/base) al cuadrado, y convierte el área horizontal en área de tejado. Un square son 100 pies cuadrados (unos 9,29 m²). Los paquetes salen del área con desperdicio, dividida por ese square, por los paquetes por square, redondeando hacia arriba.",
      "Usala cuando el proveedor vende teja asfáltica por paquete y el rendimiento es tres paquetes por square en 3-tab, o de tres a cinco en teja arquitectónica. La cumbrera opcional usa un rendimiento aparte para no mezclar tapajuntas de caballete con la teja de faldón.",
      "Supone una planta rectangular simple. Limahoyas, buhardillas y tejados recortados piden el campo de área extra o más desperdicio (a menudo 15% en vez de 10%). Pendientes bajo 2/12 no suelen llevar teja asfáltica; la herramienta avisa pero no bloquea el cálculo. Confirmá siempre el rendimiento del paquete que vas a comprar.",
    ],
    steps: [
      "Choose meters or feet, then enter the horizontal roof length and width.",
      "Set rise and run (6/12 is a common gable) or pick a preset.",
      "Add waste, bundles per square, and optional ridge length and price.",
      "Read squares, field bundles, and ridge bundles. Copy the summary before you order.",
    ],
    stepsEs: [
      "Elegí metros o pies y cargá el largo y el ancho horizontales del tejado.",
      "Indicá subida y base (6/12 es un hastial habitual) o usá un preset.",
      "Añadí desperdicio, paquetes por square y, si aplica, cumbrera y precio.",
      "Leé squares, paquetes de faldón y de cumbrera. Copiá el resumen antes de pedir.",
    ],
    faq: [
      {
        q: "How is a roofing square calculated?",
        a: "Sloped area in square feet divided by 100. In meters, area is converted with 1 m² = 10.7639 ft² before that division. Waste is applied before rounding bundles up.",
      },
      {
        q: "How many bundles are in a square?",
        a: "Most 3-tab asphalt shingles use 3 bundles per square. Architectural shingles are often 3, sometimes 4 or 5. The preset only fills the field; change it to match the label.",
      },
      {
        q: "Does the calculator run in the browser?",
        a: "Yes. Dimensions stay on your device. Nothing is uploaded and there is no account.",
      },
      {
        q: "What waste percentage should I use?",
        a: "About 10% for a simple gable and 15% for hips, valleys, or a steep cut-up roof. Waste does not replace measuring extra dormer area.",
      },
      {
        q: "Can I use this for metal or tile roofs?",
        a: "Only as an area and square estimate. Panel, clay, or concrete tile coverage is not the same as asphalt bundles. Set bundles per square to the product sheet or ignore bundle count and use the area.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula un square de tejado?",
        a: "Superficie inclinada en pies cuadrados dividida por 100. En metros se convierte con 1 m² = 10,7639 ft² antes de esa división. El desperdicio se aplica antes de redondear los paquetes hacia arriba.",
      },
      {
        q: "¿Cuántos paquetes tiene un square?",
        a: "La teja asfáltica 3-tab suele usar 3 paquetes por square. La arquitectónica suele ser 3, a veces 4 o 5. El preset solo rellena el campo; cambialo según la etiqueta.",
      },
      {
        q: "¿El cálculo se hace en el navegador?",
        a: "Sí. Las medidas se quedan en tu dispositivo. No se sube nada y no hace falta cuenta.",
      },
      {
        q: "¿Qué porcentaje de desperdicio uso?",
        a: "Un 10% en un hastial simple y un 15% con limas, limahoyas o un tejado recortado. El desperdicio no reemplaza medir el área extra de buhardillas.",
      },
      {
        q: "¿Sirve para chapa o teja cerámica?",
        a: "Solo como estimación de área y squares. El rendimiento de panel, teja árabe o de hormigón no es el de la teja asfáltica. Ajustá paquetes por square a la ficha o usá solo la superficie.",
      },
    ],
  },
};
