import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_DECK: Record<string, ToolSeoOverride> = {
  "calculadora-deck": {
    metaTitle: "Deck board calculator — joists and screws | UtiliHub",
    metaTitleEs: "Calculadora de deck y tarima exterior | UtiliHub",
    metaDescription:
      "Estimate deck boards, joists, and screw boxes from deck size, board width, gap, stock length, and joist spacing. Patio presets. Free in the browser.",
    metaDescriptionEs:
      "Calculá tablas de deck, vigas y cajas de tornillos según medidas, ancho de tabla, junta, largo de pieza y separación de vigas. Presets de patio. Gratis en el navegador.",
    about: [
      "This deck board calculator turns a rectangular outdoor deck into a materials list: decking boards, joists, rim length, and screw boxes. It is for a simple rectangle, not a multi-level deck with stairs, landings, or angled corners.",
      "Boards run along the length or the width you choose. Rows are the across dimension divided by board width plus gap, rounded up. Each row is split into stock lengths, then the waste percent is applied and the total is rounded up. A 140 mm board with a 5 mm gap is a common composite or treated-pine pitch.",
      "Joists sit perpendicular to the boards. The count is the run divided by center-to-center spacing, rounded up, plus one so both ends are included. Each joist is cut to the across dimension. Rim length is two times the run and does not include a ledger, beam, or posts.",
      "Screws are rows times joists times screws per crossing, then packed into the box size you enter. Optional prices are a material check only. The tool does not size beams, footings, spans for snow load, or local code. Confirm joist spacing with the board manufacturer, often 400 mm for diagonal or composite and 600 mm for some timber decks.",
    ],
    aboutEs: [
      "Esta calculadora de deck convierte una terraza rectangular en lista de materiales: tablas, vigas, metros de remate y cajas de tornillos. Sirve para un rectángulo simple, no para un deck en varios niveles con escaleras, descansos o esquinas en ángulo.",
      "Las tablas corren a lo largo o a lo ancho, según elijas. Las filas son la dimensión cruzada dividida por el ancho de tabla más la junta, redondeado hacia arriba. Cada fila se parte en el largo de pieza, se aplica el porcentaje de desperdicio y se redondea hacia arriba. Una tabla de 140 mm con 5 mm de junta es un paso habitual en composite o pino tratado.",
      "Las vigas van perpendiculares a las tablas. La cantidad es el largo de corrida dividido por la separación entre ejes, redondeado hacia arriba, más una para incluir ambos extremos. Cada viga se corta a la dimensión cruzada. El remate es dos veces la corrida y no incluye solera, viga principal ni pilares.",
      "Los tornillos son filas por vigas por tornillos en cada cruce, agrupados en el tamaño de caja que indiques. Los precios son opcionales y solo cubren material. La herramienta no dimensiona vigas de carga, bases, nieve ni normativa local. Confirmá la separación con el fabricante de la tabla: a menudo 400 mm en composite o diagonal y 600 mm en algunos decks de madera.",
    ],
    steps: [
      "Enter deck length and width in meters.",
      "Set board width, gap, and the stock length you can buy.",
      "Choose board direction and joist spacing, then add a waste percent.",
      "Optional: set screws per crossing, box size, and unit prices.",
      "Read boards, joists, rim meters, and screw boxes, then copy the list.",
    ],
    stepsEs: [
      "Ingresá largo y ancho del deck en metros.",
      "Definí ancho de tabla, junta y el largo de pieza que vas a comprar.",
      "Elegí la dirección de las tablas y la separación de vigas, y sumá desperdicio.",
      "Opcional: tornillos por cruce, tamaño de caja y precios unitarios.",
      "Leé tablas, vigas, metros de remate y cajas de tornillos, y copiá la lista.",
    ],
    faq: [
      {
        q: "How are deck boards counted?",
        a: "Rows equal the across dimension divided by board width plus gap, rounded up. Pieces per row equal the run divided by stock length, rounded up. Waste is applied to that product and the result is rounded up again.",
      },
      {
        q: "What joist spacing should I use?",
        a: "400 mm (about 16 in) is a common preset for composite and diagonal boards. 600 mm (about 24 in) is a wider timber preset. Always match the board warranty and local code; this tool only counts pieces.",
      },
      {
        q: "Does it include posts, beams, and stairs?",
        a: "No. It estimates decking, joists that span the across dimension, rim length along the run, and screws. Ledger, beams, posts, footings, and stairs are separate.",
      },
      {
        q: "Is the calculation private?",
        a: "Yes. Dimensions stay in the browser. Nothing is uploaded to calculate boards or prices.",
      },
      {
        q: "Can I enter inches?",
        a: "Inputs are metric. 5.5 in is about 140 mm, 16 in spacing is about 406 mm, and 12 ft is about 3.66 m. Use the patio presets as a starting point and adjust.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se cuentan las tablas de deck?",
        a: "Las filas son la dimensión cruzada dividida por ancho de tabla más junta, redondeado hacia arriba. Las piezas por fila son la corrida dividida por el largo de pieza, redondeado hacia arriba. El desperdicio se aplica a ese producto y se vuelve a redondear hacia arriba.",
      },
      {
        q: "¿Qué separación de vigas uso?",
        a: "400 mm (unos 16 in) es un preset habitual para composite y tablas en diagonal. 600 mm (unos 24 in) es un preset más abierto para madera. Tiene que coincidir con la garantía de la tabla y la norma local; esta herramienta solo cuenta piezas.",
      },
      {
        q: "¿Incluye pilares, vigas de carga y escaleras?",
        a: "No. Estima tablas, vigas que cruzan el ancho, metros de remate a lo largo de la corrida y tornillos. Solera, vigas principales, pilares, bases y escaleras van aparte.",
      },
      {
        q: "¿El cálculo es privado?",
        a: "Sí. Las medidas se quedan en el navegador. No se sube nada para calcular tablas o precios.",
      },
      {
        q: "¿Puedo usar pulgadas?",
        a: "Las entradas son métricas. 5,5 in son unos 140 mm, 16 in de separación unos 406 mm y 12 ft unos 3,66 m. Partí de un preset de patio y ajustá.",
      },
    ],
  },
};
