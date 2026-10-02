import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_WALLPAPER: Record<string, ToolSeoOverride> = {
  "calculadora-papel-pintado": {
    metaTitle: "Wallpaper calculator — rolls and repeat | UtiliHub",
    metaTitleEs: "Calculadora de papel pintado y rollos | UtiliHub",
    metaDescription:
      "Estimate wallpaper strips and rolls from wall size, roll width, roll length, and pattern repeat. Presets for 53 cm and 70 cm rolls. Free in the browser.",
    metaDescriptionEs:
      "Calculá tiras y rollos de papel pintado según pared, ancho y largo del rollo y rapport. Presets de 53 cm y 70 cm. Gratis en el navegador.",
    about: [
      "This wallpaper calculator estimates how many drops (strips) and rolls to buy for a wall or a run of walls. It is meant for planning a purchase, not for a contractor takeoff that already includes site cuts.",
      "Enter the total wall length and the ceiling height. Openings such as doors and windows are subtracted as area and converted into an equivalent length at that height, so a full-height opening reduces strips and a small window reduces them less.",
      "Each strip needs the wall height plus one pattern repeat when the design must match. Strips per roll are the roll length divided by that drop length, rounded down. Rolls are rounded up after an optional waste percentage on the strip count.",
      "Limits: the tool assumes straight walls, a single roll size, and that every strip is cut to the same length. It does not model angled ceilings, borders, or centering a motif. Confirm the usable width on the label, because some rolls quote the nominal width including a trim edge.",
    ],
    aboutEs: [
      "Esta calculadora de papel pintado estima cuántas tiras y rollos comprar para una pared o un tramo de paredes. Sirve para planificar la compra, no para un cómputo de obra que ya incluye recortes de obra.",
      "Ingresá el largo total de pared y la altura al techo. Puertas y ventanas se restan como superficie y se convierten en un largo equivalente a esa altura: un hueco de piso a techo baja más tiras que una ventana chica.",
      "Cada tira pide la altura de la pared más un rapport cuando el dibujo debe coincidir. Las tiras por rollo son el largo del rollo dividido por esa caída, redondeado hacia abajo. Los rollos se redondean hacia arriba después de un porcentaje opcional de desperdicio sobre las tiras.",
      "Límites: asume paredes rectas, un solo tamaño de rollo y tiras del mismo largo. No modela techos inclinados, cenefas ni centrar un motivo. Confirmá el ancho útil en la etiqueta: algunos rollos publican el ancho nominal con el borde de recorte.",
    ],
    steps: [
      "Measure the total wall length and the height from skirting to ceiling.",
      "Subtract door and window area, or leave openings at 0 if you prefer a conservative order.",
      "Pick a roll preset (53×10.05 m or 70×10 m) or type the label size and pattern repeat.",
      "Set waste to about 10% for plain paper and 15% for a large repeat or first-time hanging.",
      "Read strips, rolls to buy, and leftover length, then copy the summary.",
    ],
    stepsEs: [
      "Medí el largo total de pared y la altura del zócalo al techo.",
      "Restá la superficie de puertas y ventanas, o dejá los huecos en 0 si preferís pedir de más.",
      "Elegí un preset de rollo (53×10,05 m o 70×10 m) o cargá el tamaño de la etiqueta y el rapport.",
      "Usá cerca de 10% de desperdicio en liso y 15% si el dibujo es grande o es la primera vez.",
      "Leé tiras, rollos a comprar y largo sobrante, y copiá el resumen.",
    ],
    faq: [
      {
        q: "How are wallpaper rolls calculated?",
        a: "Strips equal the effective wall length divided by roll width, rounded up. Drop length is wall height plus one pattern repeat. Strips per roll are the roll length divided by that drop, rounded down. Rolls are the total strips, including waste, divided by strips per roll, rounded up.",
      },
      {
        q: "What roll size should I use?",
        a: "A common European roll is 53 cm by 10.05 m. Wide non-woven rolls are often 70 cm by 10 m. Always use the usable width printed on the batch label.",
      },
      {
        q: "Does pattern repeat add extra rolls?",
        a: "Yes. A repeat of 0 is plain paper. A non-zero repeat adds that length to every strip so the motif can match, which can drop the number of strips you get from one roll.",
      },
      {
        q: "Is my room size uploaded?",
        a: "No. Measurements stay in the browser and nothing is sent to a server.",
      },
      {
        q: "Why might I still be short on site?",
        a: "Angled walls, centering a motif, damaged edges, and different dye lots are not included. Order the same batch number and keep one spare roll if the pattern is large.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calculan los rollos de papel pintado?",
        a: "Las tiras son el largo útil de pared dividido por el ancho del rollo, redondeado hacia arriba. La caída es la altura más un rapport. Las tiras por rollo son el largo del rollo dividido por esa caída, hacia abajo. Los rollos son las tiras totales, con desperdicio, divididas por las tiras por rollo, hacia arriba.",
      },
      {
        q: "¿Qué medida de rollo uso?",
        a: "Un rollo europeo habitual es 53 cm por 10,05 m. El no tejido ancho suele ser 70 cm por 10 m. Usá siempre el ancho útil impreso en la etiqueta del lote.",
      },
      {
        q: "¿El rapport suma rollos?",
        a: "Sí. Rapport 0 es papel liso. Si es mayor a 0, esa longitud se suma a cada tira para empatar el dibujo y puede bajar cuántas tiras salen de un rollo.",
      },
      {
        q: "¿Se envían las medidas de la habitación?",
        a: "No. El cálculo queda en el navegador y no se manda a un servidor.",
      },
      {
        q: "¿Por qué podría faltar papel en obra?",
        a: "No contempla paredes en ángulo, centrar un motivo, bordes dañados ni lotes de tinta distintos. Pedí el mismo número de lote y un rollo de reserva si el dibujo es grande.",
      },
    ],
  },
};
