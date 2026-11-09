import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_DECIBEL: Record<string, ToolSeoOverride> = {
  "sumador-decibelios": {
    metaTitle: "Decibel Adder — Combine Sound Levels in dB | UtiliHub",
    metaTitleEs: "Sumador de decibelios — combinar niveles de sonido | UtiliHub",
    metaDescription:
      "Add sound levels the right way: 60 dB + 60 dB is 63.01 dB, and 70 dB + 60 dB is 70.41 dB. Not a linear sum. In the browser.",
    metaDescriptionEs:
      "Sumá niveles de sonido bien: 60 dB + 60 dB son 63,01 dB, y 70 dB + 60 dB son 70,41 dB. No es una suma lineal. En el navegador.",
    about: [
      "Decibels are a logarithmic scale. Two identical incoherent sources raise the level by about 3.01 dB, because power doubles.",
      "The combined level is 10 log10 of the sum of 10^(L/10). A much quieter source barely moves the louder one.",
      "This is not an arithmetic average and not L1 + L2. Empty input and values outside -200 to 200 dB are rejected. Nothing is uploaded.",
    ],
    aboutEs: [
      "El decibelio es una escala logarítmica. Dos fuentes incoherentes iguales suben el nivel unos 3,01 dB, porque la potencia se duplica.",
      "El nivel combinado es 10 log10 de la suma de 10^(L/10). Una fuente mucho más baja casi no mueve a la más alta.",
      "No es un promedio ni L1 + L2. Se rechaza la entrada vacía y los valores fuera de -200 a 200 dB. No se sube nada.",
    ],
    steps: [
      "Enter one sound level per line, or use an example.",
      "Read the combined level next to the wrong linear sum.",
      "Copy the result. The calculation stays in the browser.",
    ],
    stepsEs: [
      "Ingresá un nivel por línea, o usá un ejemplo.",
      "Leé el nivel combinado junto a la suma lineal incorrecta.",
      "Copiá el resultado. El cálculo queda en el navegador.",
    ],
    faq: [
      { q: "What is 60 dB plus 60 dB?", a: "63.01 dB. Equal incoherent sources add about 3 dB, not 120 dB." },
      { q: "What is 70 dB plus 60 dB?", a: "70.41 dB. The quieter source adds less than half a decibel." },
      { q: "Can I average the levels instead?", a: "No. An average understates combined power. Use the logarithmic sum." },
    ],
    faqEs: [
      { q: "¿Cuánto es 60 dB más 60 dB?", a: "63,01 dB. Fuentes incoherentes iguales suman unos 3 dB, no 120 dB." },
      { q: "¿Cuánto es 70 dB más 60 dB?", a: "70,41 dB. La fuente más baja suma menos de medio decibelio." },
      { q: "¿Puedo promediar los niveles?", a: "No. El promedio subestima la potencia combinada. Usá la suma logarítmica." },
    ],
  },
};
