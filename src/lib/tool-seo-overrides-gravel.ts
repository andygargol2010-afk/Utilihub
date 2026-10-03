import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GRAVEL: Record<string, ToolSeoOverride> = {
  "calculadora-grava": {
    metaTitle: "Gravel and mulch calculator | UtiliHub",
    metaTitleEs: "Calculadora de grava y mantillo | UtiliHub",
    metaDescription:
      "Estimate gravel, mulch, or topsoil in cubic meters, tonnes, bags, and cubic yards from area and depth. Waste and bag presets. Free in the browser.",
    metaDescriptionEs:
      "Calculá grava, mantillo o tierra vegetal en metros cúbicos, toneladas, sacos y yardas cúbicas según área y espesor. Desperdicio y sacos. Gratis en el navegador.",
    about: [
      "This calculator turns a bed, path, or driveway into a bulk order: area times depth, plus waste, then mass from a typical loose density. It covers crushed gravel, decorative stone, mulch, and topsoil. It is not a structural concrete mix — that lives in the concrete calculator.",
      "Rectangle area is length times width. A circle uses π times radius squared. If you already measured the bed, enter the area directly. Depth is in centimetres and is converted to metres before multiplying, so 5 cm over 10 m² is 0.5 m³ before waste.",
      "Order volume is the geometric volume times one plus the waste percent. Tonnes are order volume times the density you keep or change. Bags round up: by kilograms for stone and soil, or by litres for mulch sold in volume bags. Cubic yards are shown beside cubic metres (1 m³ ≈ 1.308 yd³) for suppliers who quote in yards.",
      "Densities are loose bulk figures, not compacted in place. Gravel can settle 10–20% after traffic; add that as extra depth or waste if the finished level must stay at the target. Prices are optional material checks and exclude delivery, fabric, or edging.",
    ],
    aboutEs: [
      "Esta calculadora convierte un cantero, sendero o entrada en un pedido a granel: área por espesor, más desperdicio, y luego masa con una densidad suelta típica. Cubre grava triturada, piedra decorativa, mantillo y tierra vegetal. No es una dosificación de hormigón: eso está en la calculadora de hormigón.",
      "El área rectangular es largo por ancho. El círculo usa π por radio al cuadrado. Si ya mediste el cantero, cargá el área directo. El espesor va en centímetros y se pasa a metros antes de multiplicar: 5 cm sobre 10 m² son 0,5 m³ antes del desperdicio.",
      "El volumen a pedir es el volumen geométrico por uno más el porcentaje de desperdicio. Las toneladas son ese volumen por la densidad que dejes o cambies. Los sacos se redondean hacia arriba: por kilogramos en piedra y tierra, o por litros si el mantillo se vende en sacos de volumen. Las yardas cúbicas aparecen junto a los metros cúbicos (1 m³ ≈ 1,308 yd³) para proveedores que cotizan en yardas.",
      "Las densidades son a granel suelto, no compactadas en obra. La grava puede asentarse un 10–20% con el tránsito; sumá ese extra como espesor o desperdicio si el nivel terminado tiene que quedar en el objetivo. Los precios son un control de material y no incluyen flete, geotextil ni bordes.",
    ],
    steps: [
      "Pick a material preset or set density and bag size yourself.",
      "Enter a rectangle, a circle, or a known area, then the depth in centimetres.",
      "Set waste (and bag unit: kg or litres). Prices are optional.",
      "Read cubic metres, tonnes, bags, and cubic yards, then copy the order.",
    ],
    stepsEs: [
      "Elegí un preset de material o cargá densidad y tamaño de saco.",
      "Ingresá un rectángulo, un círculo o un área conocida, y el espesor en centímetros.",
      "Definí el desperdicio y si el saco es por kg o por litros. Los precios son opcionales.",
      "Leé metros cúbicos, toneladas, sacos y yardas cúbicas, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How do I calculate how much gravel I need?",
        a: "Volume in cubic metres is area in m² times depth in centimetres divided by 100. A 4 m by 2.5 m path at 5 cm is 0.5 m³ before waste. At 1.5 t/m³ that is 0.75 tonnes.",
      },
      {
        q: "What density should I use?",
        a: "Crushed gravel is often about 1.4–1.6 t/m³ loose, decorative stone near 1.6, topsoil about 1.2–1.4, and mulch about 0.3–0.5. Match the supplier sheet if you have one; the presets are planning figures.",
      },
      {
        q: "Why show cubic yards and bags?",
        a: "Bulk yards are common in US quotes (m³ × 1.308). Bags round up so you do not stop short: weight bags use kilograms, volume bags use litres. Mulch is usually sold by the bag or by the yard, not by the tonne.",
      },
      {
        q: "Does compaction change the order?",
        a: "The tool orders loose material. If gravel will compact under traffic, increase depth or waste. It does not model a compacted density in place.",
      },
      {
        q: "Are measurements uploaded?",
        a: "No. Dimensions and prices stay in the browser and are not sent to a server.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo calculo cuánta grava necesito?",
        a: "El volumen en m³ es el área en m² por el espesor en centímetros dividido 100. Un sendero de 4 m por 2,5 m a 5 cm son 0,5 m³ antes del desperdicio. A 1,5 t/m³ son 0,75 toneladas.",
      },
      {
        q: "¿Qué densidad uso?",
        a: "La grava triturada suele estar cerca de 1,4–1,6 t/m³ suelta, la piedra decorativa cerca de 1,6, la tierra vegetal en 1,2–1,4 y el mantillo en 0,3–0,5. Si el proveedor da ficha, usá esa; los presets son de planificación.",
      },
      {
        q: "¿Por qué aparecen yardas cúbicas y sacos?",
        a: "Las yardas a granel son habituales en cotizaciones de EE.UU. (m³ × 1,308). Los sacos se redondean hacia arriba: por kilogramos o por litros. El mantillo se vende más por saco o por yarda que por tonelada.",
      },
      {
        q: "¿La compactación cambia el pedido?",
        a: "La herramienta pide material suelto. Si la grava se va a compactar con el tránsito, subí el espesor o el desperdicio. No modela una densidad compactada en sitio.",
      },
      {
        q: "¿Se envían las medidas?",
        a: "No. Dimensiones y precios quedan en el navegador y no se mandan a un servidor.",
      },
    ],
  },
};
