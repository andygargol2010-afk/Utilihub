import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_CAULK: Record<string, ToolSeoOverride> = {
  "calculadora-silicona": {
    metaTitle: "Caulk Calculator — Tubes and Bead | UtiliHub",
    metaTitleEs: "Calculadora de silicona y sellador | UtiliHub",
    metaDescription:
      "Estimate how many silicone or acrylic tubes you need from joint length and bead size. Fillet or butt joint, 300 ml and 10.1 oz. Free, in the browser.",
    metaDescriptionEs:
      "Calculá cuántos tubos de silicona o acrílico necesitás según el largo de junta y el cordón. Filete o junta a tope, 300 ml y 10,1 oz. Gratis, en el navegador.",
    about: [
      "Enter the total length of joints, or the count, width, and height of windows and doors. Volume is length times bead width times bead depth. A fillet (triangular corner bead) uses half of that rectangle; a butt joint uses the full rectangle. Tubes to buy are that volume times one plus waste, divided by the tube size, rounded up.",
      "A standard 300 ml cartridge is about 10.1 US fluid ounces. A 1/4 by 1/4 inch butt bead covers about 24 feet per 300 ml tube before waste. The same size as a triangular fillet covers about twice that, near 49 feet. A 5 by 5 mm fillet covers about 24 meters per 300 ml tube. A 600 ml sausage is two standard cartridges.",
      "Presets cover a bathroom silicone run, a set of interior windows, a kitchen counter in feet, and an exterior gap that needs a wider butt bead and a 600 ml sausage. Waste defaults to 10 percent for a straight run and 15 percent around corners and stops. The tool does not price primer, backer rod, or painter's tape.",
      "Nothing is uploaded. Empty lengths, beads outside 2 to 30 mm, and waste above 40 percent are rejected. Baseboard and paint calculators size trim and wall coverage; this one only sizes the sealant in the joint.",
    ],
    aboutEs: [
      "Ingresá el largo total de juntas, o la cantidad, el ancho y el alto de ventanas y puertas. El volumen es largo por ancho de cordón por profundidad. Un filete (cordón triangular de esquina) usa la mitad de ese rectángulo; una junta a tope usa el rectángulo completo. Los tubos a comprar son ese volumen por uno más el desperdicio, dividido el tamaño del tubo, redondeado hacia arriba.",
      "Un cartucho estándar de 300 ml son unos 10,1 onzas líquidas de EE. UU. Un cordón a tope de 1/4 por 1/4 de pulgada cubre unos 24 pies por tubo de 300 ml antes del desperdicio. El mismo tamaño en filete triangular cubre cerca del doble, unos 49 pies. Un filete de 5 por 5 mm cubre unos 24 metros por tubo de 300 ml. Una salchicha de 600 ml equivale a dos cartuchos estándar.",
      "Los presets cubren un baño con silicona, un conjunto de ventanas interiores, una mesada de cocina en pies y una junta exterior más ancha con salchicha de 600 ml. El desperdicio por defecto es 10% en un tramo recto y 15% con esquinas y topes. No cotiza imprimación, fondo de junta ni cinta de pintor.",
      "No se sube nada. Se rechazan largos vacíos, cordones fuera de 2 a 30 mm y desperdicio mayor a 40%. Las calculadoras de zócalo y pintura miden molduras y pared; esta solo mide el sellador de la junta.",
    ],
    steps: [
      "Choose meters or feet, then a total length or a count of openings.",
      "Set bead width and depth, and pick a fillet or a butt joint.",
      "Pick a 300 ml, 310 ml, 10.1 oz, or 600 ml tube, plus waste and an optional price.",
      "Review tube count, coverage per tube, leftover sealant, and cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y un largo total o una cantidad de aberturas.",
      "Cargá el ancho y la profundidad del cordón, y elegí filete o junta a tope.",
      "Elegí un tubo de 300 ml, 310 ml, 10,1 oz o 600 ml, más desperdicio y un precio opcional.",
      "Revisá los tubos, la cobertura por tubo, el sobrante y el costo, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How many tubes of caulk do I need?",
        a: "Divide joint volume by the tube size and round up. A 1/4 inch butt bead uses about one 10.1 oz tube every 24 feet before waste. Add 10 to 15 percent for stops, corners, and a messy first squeeze.",
      },
      {
        q: "Should I use a fillet or a butt joint?",
        a: "A fillet is the triangular bead in a corner, so the cross-section is half of width times depth. A butt joint fills a gap between two faces and uses the full rectangle. Using the fillet factor on a gap under-orders tubes.",
      },
      {
        q: "Is a 300 ml tube the same as 10.1 oz?",
        a: "Close enough for ordering. 10.1 US fluid ounces is about 299 ml. This tool treats the 10.1 oz preset as 299 ml and the 300 ml preset as 300 ml.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Lengths, bead sizes, prices, and the tube count stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuántos tubos de silicona necesito?",
        a: "Dividí el volumen de la junta por el tamaño del tubo y redondeá hacia arriba. Un cordón a tope de 1/4 de pulgada usa cerca de un tubo de 10,1 oz cada 24 pies antes del desperdicio. Sumá 10 a 15% por topes, esquinas y el primer disparo sucio.",
      },
      {
        q: "¿Uso filete o junta a tope?",
        a: "El filete es el cordón triangular de una esquina, así que la sección es la mitad del ancho por la profundidad. La junta a tope llena un hueco entre dos caras y usa el rectángulo completo. Aplicar el factor de filete a un hueco pide de menos.",
      },
      {
        q: "¿Un tubo de 300 ml es igual a 10,1 oz?",
        a: "Para pedir, sí. 10,1 onzas líquidas de EE. UU. son unos 299 ml. Esta tool trata el preset de 10,1 oz como 299 ml y el de 300 ml como 300 ml.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Los largos, los cordones, los precios y la cantidad de tubos quedan en tu dispositivo.",
      },
    ],
  },
};
