import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_DRYWALL: Record<string, ToolSeoOverride> = {
  "calculadora-pladur": {
    metaTitle: "Drywall calculator — sheets and screws | UtiliHub",
    metaTitleEs: "Calculadora de pladur y placas | UtiliHub",
    metaDescription:
      "Estimate drywall sheets, screws, joint compound, and tape from wall size, openings, layers, and an optional ceiling. 1.2×2.4 m and 4×8 ft presets. Free in the browser.",
    metaDescriptionEs:
      "Calculá placas de pladur, tornillos, pasta de juntas y cinta según pared, huecos, capas y techo opcional. Presets de 1,2×2,4 m y 4×8 ft. Gratis en el navegador.",
    about: [
      "This drywall calculator estimates plasterboard sheets and the main consumables for a wall run or a simple room. It is a purchase planner, not a site takeoff that already accounts for staggered joints, backing, or cutouts around boxes.",
      "Net area is wall length times height, minus openings, plus an optional ceiling (length times room depth). Each layer multiplies that area. Sheets are the net area times layers and waste, divided by the sheet area, then rounded up.",
      "Screws use a planning density of about 11 per square metre (close to one screw per square foot) and can be edited. Joint compound uses 0.4 kg per square metre of board as a taping-and-finish allowance. Tape is estimated from the long joints implied by the sheet width, not from corner bead.",
      "Limits: openings are subtracted as area, so a door does not reserve a full sheet for patching. Double-layer walls, ceilings, and waste are included only when you enter them. Local sheet names (pladur, drywall, gypsum board) share the same area method.",
    ],
    aboutEs: [
      "Esta calculadora de pladur estima placas de yeso laminado y los consumibles principales de un tramo de pared o una habitación simple. Sirve para planear la compra, no para un despiece de obra que ya tenga juntas trabadas, refuerzos o cajas.",
      "La superficie neta es largo por alto, menos huecos, más un techo opcional (largo por fondo). Cada capa multiplica esa superficie. Las placas salen de la superficie neta por capas y desperdicio, dividida por el área de la placa y redondeada hacia arriba.",
      "Los tornillos usan una densidad de planificación de unos 11 por metro cuadrado (cerca de un tornillo por pie cuadrado) y se pueden editar. La pasta de juntas usa 0,4 kg por metro cuadrado de placa como margen de encintado y acabado. La cinta se estima por las juntas largas que implica el ancho de placa, no por el guardavivo.",
      "Límites: los huecos se restan como superficie, así que una puerta no reserva una placa entera para parches. Doble capa, techo y desperdicio solo entran si los cargás. Pladur, drywall y yeso laminado comparten el mismo método por área.",
    ],
    steps: [
      "Enter the total wall length, ceiling height, and the area of doors and windows to subtract.",
      "Turn on the ceiling only if you are boarding it, and enter the room depth.",
      "Pick a sheet preset (1.2×2.4 m, 1.2×2.5 m, or 4×8 ft) or type the sheet size, layers, and waste.",
      "Review sheets, screws, compound, and tape. Copy the result before ordering.",
    ],
    stepsEs: [
      "Cargá el largo total de pared, la altura y la superficie de puertas y ventanas a restar.",
      "Activá el techo solo si también lo vas a emplacar e indicá el fondo de la habitación.",
      "Elegí un preset de placa (1,2×2,4 m, 1,2×2,5 m o 4×8 ft) o escribí medida, capas y desperdicio.",
      "Revisá placas, tornillos, pasta y cinta. Copiá el resultado antes de comprar.",
    ],
    faq: [
      {
        q: "How are drywall sheets calculated?",
        a: "Net area is length × height − openings, plus ceiling if enabled. Sheets = ceil(net area × layers × (1 + waste) / sheet area). A 1.2×2.4 m board is 2.88 m².",
      },
      {
        q: "How many screws and how much mud should I buy?",
        a: "The default is 11 screws per m² of board and 0.4 kg of joint compound per m². Both fields are editable because screw spacing and finish level change the real quantity.",
      },
      {
        q: "Does subtracting a door save a full sheet?",
        a: "No. Openings reduce area only. Small offcuts around a door often cannot be reused on another wall, so keep the waste percentage if the layout is cut up.",
      },
      {
        q: "Is the room size sent anywhere?",
        a: "No. The estimate runs in the browser and is not uploaded.",
      },
      {
        q: "Why might the job still need more board?",
        a: "The tool does not lay out staggered joints, corner bead, soffits, or damaged edges. Order the same batch and an extra sheet if the pattern of cuts is awkward.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calculan las placas?",
        a: "La superficie neta es largo × alto − huecos, más techo si está activo. Placas = redondeo hacia arriba de superficie neta × capas × (1 + desperdicio) / área de placa. Una placa de 1,2×2,4 m son 2,88 m².",
      },
      {
        q: "¿Cuántos tornillos y cuánta pasta conviene comprar?",
        a: "El valor por defecto es 11 tornillos por m² de placa y 0,4 kg de pasta por m². Los dos campos se editan porque la separación de montantes y el nivel de acabado cambian la cantidad real.",
      },
      {
        q: "¿Restar una puerta ahorra una placa entera?",
        a: "No. Los huecos solo reducen superficie. Los recortes alrededor de una puerta muchas veces no sirven en otra pared, así que dejá desperdicio si hay muchos cortes.",
      },
      {
        q: "¿Se envían las medidas de la habitación?",
        a: "No. El cálculo queda en el navegador y no se sube a un servidor.",
      },
      {
        q: "¿Por qué en obra pueden faltar placas?",
        a: "No arma juntas trabadas, guardavivos, mochetas ni cantos dañados. Pedí el mismo lote y una placa de reserva si los cortes son incómodos.",
      },
    ],
  },
};
