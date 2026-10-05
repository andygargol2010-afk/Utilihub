import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_FIREWOOD: Record<string, ToolSeoOverride> = {
  "calculadora-lena": {
    metaTitle: "Firewood Calculator — Cords and Weight | UtiliHub",
    metaTitleEs: "Calculadora de leña en cuerdas | UtiliHub",
    metaDescription:
      "Estimate cords, face cords, steres, and weight of stacked firewood from length, height, and log depth. Seasoned or green. Free, in the browser.",
    metaDescriptionEs:
      "Calculá cuerdas, face cords, estéreos y peso de leña apilada desde largo, alto y fondo. Seca o verde. Gratis, en el navegador.",
    about: [
      "Enter the stacked pile: length along the wall, height, and depth equal to the log length. Stacked volume is length times height times depth. A full cord is 128 cubic feet, the classic 4 by 4 by 8 foot stack, about 3.62 cubic meters. Steres are the same number as stacked cubic meters.",
      "A face cord, or rick, is 4 feet high by 8 feet long by the log length. It equals one third of a cord only when the pieces are 16 inches. This tool divides your stack by that face-cord volume, so a 12-inch or 24-inch depth does not pretend to be a third cord.",
      "Weight uses a solid-wood share of the stack, default 65 percent, times a species density. Seasoned planning densities are oak 720, birch 640, maple 680, pine 450, and mixed 600 kilograms per solid cubic meter. Green wood multiplies that weight by 1.4. Match a supplier ticket if you have one.",
      "Nothing is uploaded. Empty, zero, and oversized stacks are rejected. This is a stacked-wood order, not a gravel, mulch, or grass-seed calculator.",
    ],
    aboutEs: [
      "Ingresá la pila apilada: largo contra la pared, alto y fondo igual al largo de los troncos. El volumen apilado es largo por alto por fondo. Una cuerda completa son 128 pies cúbicos, la pila clásica de 4 por 4 por 8 pies, unos 3,62 metros cúbicos. Los estéreos coinciden con los metros cúbicos apilados.",
      "Un face cord, o rick, mide 4 pies de alto por 8 de largo por el largo del tronco. Equivale a un tercio de cuerda solo si las piezas miden 16 pulgadas. Esta tool divide tu pila por ese volumen, así que un fondo de 12 o 24 pulgadas no se trata como un tercio de cuerda.",
      "El peso usa la parte de madera sólida de la pila, 65% por defecto, por una densidad de especie. Las densidades de planificación en leña seca son roble 720, abedul 640, arce 680, pino 450 y mezcla 600 kilos por metro cúbico sólido. La leña verde multiplica ese peso por 1,4. Igualalo al remito del proveedor si lo tenés.",
      "No se sube nada. Se rechazan pilas vacías, nulas o enormes. Es un pedido de leña apilada, no una calculadora de grava, mantillo o semilla de césped.",
    ],
    steps: [
      "Choose meters or feet, then a stack or a known stacked volume.",
      "Set length, height, and log depth, or paste the stacked volume.",
      "Pick species, seasoned or green, and a solid-wood share if the stack is loose.",
      "Review cords, face cords, steres, weight, and optional cost, then copy the order.",
    ],
    stepsEs: [
      "Elegí metros o pies, y una pila o un volumen apilado conocido.",
      "Cargá largo, alto y fondo de los troncos, o pegá el volumen apilado.",
      "Elegí especie, seca o verde, y la parte sólida si la pila está floja.",
      "Revisá cuerdas, face cords, estéreos, peso y el precio opcional, y copiá el pedido.",
    ],
    faq: [
      {
        q: "How is a cord of firewood calculated?",
        a: "Stacked volume is length times height times depth. Full cords are that volume divided by 128 cubic feet (about 3.62 cubic meters). Face cords use 4 feet by 8 feet times the log depth, so they change with piece length.",
      },
      {
        q: "Is a stere the same as a cubic meter?",
        a: "Yes for stacked firewood. One stere is one cubic meter of stacked wood, including the air gaps. It is not a solid cubic meter.",
      },
      {
        q: "Why is the weight only an estimate?",
        a: "Stacked wood is partly air. The default solid share is 65 percent. Species density and a green-wood factor of 1.4 are planning figures, not a moisture-meter reading.",
      },
      {
        q: "Does the calculation leave the browser?",
        a: "No. Stack sizes, species, prices, and the order summary stay on your device.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula una cuerda de leña?",
        a: "El volumen apilado es largo por alto por fondo. Las cuerdas completas son ese volumen dividido por 128 pies cúbicos (unos 3,62 metros cúbicos). Los face cords usan 4 pies por 8 pies por el fondo del tronco, así que cambian con el largo de la pieza.",
      },
      {
        q: "¿Un estéreo es lo mismo que un metro cúbico?",
        a: "Sí para leña apilada. Un estéreo es un metro cúbico de leña apilada, con los huecos de aire. No es un metro cúbico de madera sólida.",
      },
      {
        q: "¿Por qué el peso es solo una estimación?",
        a: "La pila es en parte aire. La parte sólida por defecto es 65%. La densidad por especie y el factor 1,4 de leña verde son cifras de planificación, no una lectura de higrómetro.",
      },
      {
        q: "¿El cálculo sale del navegador?",
        a: "No. Las medidas, la especie, los precios y el resumen del pedido quedan en tu dispositivo.",
      },
    ],
  },
};
