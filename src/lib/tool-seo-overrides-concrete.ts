import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CONCRETE: Record<string, ToolSeoOverride> = {
  "calculadora-hormigon": {
    metaTitle: "Concrete calculator — volume and bags | UtiliHub",
    metaTitleEs: "Calculadora de hormigón — m³ y sacos | UtiliHub",
    metaDescription:
      "Estimate concrete volume, cement bags, sand, and gravel for a slab or columns. Mix presets 1:2:3, 1:3:5, and 1:1.5:3. Free in the browser.",
    metaDescriptionEs:
      "Estimá metros cúbicos de hormigón, sacos de cemento, arena y grava para una losa o columnas. Dosificaciones 1:2:3, 1:3:5 y 1:1,5:3. Gratis en el navegador.",
    about: [
      "This calculator turns a slab or a set of round columns into wet cubic meters, then into a buying list: cement bags, sand, and gravel.",
      "Dry volume is the wet volume multiplied by 1.54, a common allowance for voids in sand and aggregate. Cement, sand, and gravel are split by the mix parts you pick. A 50 kg bag is treated as about 0.035 m³ of cement (bulk density 1,440 kg/m³).",
      "Use it to order materials for a patio, sidewalk, or post bases. It is a planning estimate, not a structural design. Local mixes, bag weights, and waste vary.",
      "Nothing is uploaded. Change the waste percentage if the pour is uneven or you expect spillage.",
    ],
    aboutEs: [
      "Esta calculadora pasa una losa o columnas redondas a metros cúbicos húmedos y después a una lista de compra: sacos de cemento, arena y grava.",
      "El volumen seco es el húmedo multiplicado por 1,54, un margen habitual por los huecos de la arena y el árido. El cemento, la arena y la grava se reparten según las partes de la dosificación. Un saco de 50 kg se toma como unos 0,035 m³ de cemento (densidad aparente 1.440 kg/m³).",
      "Sirve para pedir material de un patio, una vereda o bases de postes. Es una estimación de obra, no un cálculo estructural. La mezcla local, el peso del saco y el desperdicio cambian.",
      "No se sube nada. Subí el desperdicio si el vaciado es irregular o esperás derrames.",
    ],
    steps: [
      "Choose a slab or round columns, then apply a preset or type the dimensions and thickness.",
      "Pick a mix (1:3:5, 1:2:3, or 1:1.5:3) and a bag size. Add waste if you need spare material.",
      "Read wet volume, bags to buy, sand, gravel, and an optional bag-price total.",
      "Copy the result before ordering. Round bags up; suppliers sell whole bags.",
    ],
    stepsEs: [
      "Elegí losa o columnas redondas, y aplicá un preset o escribí medidas y espesor.",
      "Elegí la dosificación (1:3:5, 1:2:3 o 1:1,5:3) y el tamaño del saco. Sumá desperdicio si querés material de más.",
      "Revisá el volumen húmedo, los sacos a comprar, la arena, la grava y, si cargás precio, el total.",
      "Copiá el resultado antes de pedir. Los sacos se redondean hacia arriba.",
    ],
    faq: [
      {
        q: "How is the concrete volume calculated?",
        a: "For a slab, wet m³ = length × width × thickness. For columns, wet m³ = count × π × radius² × height. Waste is applied after that.",
      },
      {
        q: "How many cement bags are in one cubic meter?",
        a: "It depends on the mix. With 1:2:3 and the 1.54 dry factor, one wet cubic meter is about 7 bags of 50 kg. A leaner 1:3:5 mix uses fewer bags.",
      },
      {
        q: "Which bag size should I select?",
        a: "Match the bag sold locally: 25 kg, 40 kg, 42.5 kg, or 50 kg. The cement mass stays the same; only the bag count changes.",
      },
      {
        q: "Is this a structural specification?",
        a: "No. It estimates materials for a small pour. Footings, slabs on grade, and reinforced concrete need a local spec or an engineer.",
      },
      {
        q: "Are the dimensions uploaded?",
        a: "No. The calculation runs in the browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el volumen de hormigón?",
        a: "En una losa, m³ húmedos = largo × ancho × espesor. En columnas, m³ = cantidad × π × radio² × altura. El desperdicio se aplica después.",
      },
      {
        q: "¿Cuántos sacos de cemento entran en un metro cúbico?",
        a: "Depende de la mezcla. Con 1:2:3 y el factor seco 1,54, un metro cúbico húmedo pide unos 7 sacos de 50 kg. Una mezcla 1:3:5 usa menos.",
      },
      {
        q: "¿Qué tamaño de saco elijo?",
        a: "El que venden en tu zona: 25 kg, 40 kg, 42,5 kg o 50 kg. La masa de cemento no cambia; cambia la cantidad de sacos.",
      },
      {
        q: "¿Esto reemplaza un cálculo estructural?",
        a: "No. Estima materiales para un vaciado chico. Cimientos, losas y hormigón armado necesitan especificación local o un profesional.",
      },
      {
        q: "¿Se suben las medidas?",
        a: "No. El cálculo corre en el navegador.",
      },
    ],
  },
};
