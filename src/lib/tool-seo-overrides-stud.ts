import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_STUD: Record<string, ToolSeoOverride> = {
  "calculadora-montantes": {
    metaTitle: "Wall Stud Calculator — 16 in OC | UtiliHub",
    metaTitleEs: "Calculadora de montantes de muro | UtiliHub",
    metaDescription:
      "Count wall studs, plates, and extra king or jack studs from length and on-center spacing. 16 in, 24 in, 40 cm, or 60 cm. Free, in the browser.",
    metaDescriptionEs:
      "Contá montantes, soleras y piezas extra de huecos según el largo y la separación a ejes. 40 cm, 60 cm, 16 in o 24 in. Gratis, en el navegador.",
    about: [
      "Enter the wall length, stud height, and on-center spacing. Layout studs are ceil(length ÷ spacing) + 1, so both ends are included. The last bay is the leftover distance after the regular spaces, which is useful when the wall is not an exact multiple of the spacing.",
      "Plate run defaults to three lengths of the wall: one bottom plate and a double top plate. Switch to two runs for a single top plate, or one if you only need a bottom plate. Plate pieces are that run, plus waste, divided by the stock length you buy, rounded up.",
      "Each door or window adds the extra pieces you set, defaulting to four (two king studs and two jack studs). Those extras are not subtracted from the layout count, so the order stays conservative. Corner studs are a separate add-on for an outside corner you are framing with this wall.",
      "Nothing is uploaded. This is a material list, not a structural design: it does not size headers, check bearing, or count drywall sheets. If the stud height is longer than the stock stick, the tool warns you to order a longer length.",
    ],
    aboutEs: [
      "Ingresá el largo del muro, el alto del montante y la separación a ejes. Los montantes de trama son techo(largo ÷ separación) + 1, así entran los dos extremos. El último vano es la distancia que sobra cuando el muro no es múltiplo exacto de la separación.",
      "El largo de soleras arranca en tres veces el muro: una solera inferior y una doble superior. Pasá a dos corridas si la superior es simple, o a una si solo necesitás la inferior. Las piezas son ese largo, más el desperdicio, dividido por el listón de tienda, redondeado hacia arriba.",
      "Cada puerta o ventana suma las piezas extra que indiques, por defecto cuatro (dos king y dos jack). No se restan de la trama, para no quedar corto. Los montantes de esquina son un extra aparte para una esquina exterior que armes con este muro.",
      "No se sube nada. Es una lista de material, no un cálculo estructural: no dimensiona dinteles, no verifica carga y no cuenta placas de pladur. Si el alto supera el listón de tienda, avisa que pidas un largo mayor.",
    ],
    steps: [
      "Choose meters or feet, then enter wall length and stud height.",
      "Set on-center spacing (0.4 m, 0.6 m, 1.333 ft for 16 in, or 2 ft for 24 in).",
      "Pick plate runs and add openings or corner studs if this wall has them.",
      "Set stock lengths and waste, then copy the stud and plate order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y cargá el largo del muro y el alto del montante.",
      "Indicá la separación a ejes (0,4 m, 0,6 m, 1,333 ft para 16 in o 2 ft para 24 in).",
      "Elegí las corridas de solera y sumá huecos o esquinas si este muro los tiene.",
      "Cargá los largos de tienda y el desperdicio, y copiá el pedido de montantes y soleras.",
    ],
    faq: [
      {
        q: "How is the stud count calculated?",
        a: "Layout studs are ceil(wall length ÷ on-center spacing) + 1. Extra opening and corner pieces are added, then waste is applied and the result is rounded up. Plate pieces use plate runs × length × (1 + waste), divided by the plate stock length.",
      },
      {
        q: "Does this replace the drywall calculator?",
        a: "No. Drywall counts sheets, screws, and joint compound. This tool only orders studs and plates for the frame. Siding and insulation stay in their own calculators.",
      },
      {
        q: "Why are opening studs added instead of removed?",
        a: "A door or window still needs king and jack studs beside the opening. Removing layout studs from the count often under-orders lumber. The default of four extras per opening is a planning allowance, not a header design.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Lengths, spacing, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula la cantidad de montantes?",
        a: "Los de trama son techo(largo ÷ separación a ejes) + 1. Se suman las piezas de huecos y esquinas, se aplica el desperdicio y se redondea hacia arriba. Las soleras usan corridas × largo × (1 + desperdicio), dividido por el listón de tienda.",
      },
      {
        q: "¿Reemplaza a la calculadora de pladur?",
        a: "No. El pladur cuenta placas, tornillos y pasta de juntas. Esta tool solo pide montantes y soleras del entramado. El siding y el aislamiento siguen en sus calculadoras.",
      },
      {
        q: "¿Por qué los huecos suman piezas en vez de restarlas?",
        a: "Una puerta o ventana igual necesita montantes king y jack al lado del hueco. Restar los de la trama suele dejar el pedido corto. Las cuatro piezas extra por hueco son una reserva de planificación, no el diseño del dintel.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Los largos, la separación, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};