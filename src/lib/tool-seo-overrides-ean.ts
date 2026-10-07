import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_EAN: Record<string, ToolSeoOverride> = {
  "validador-ean": {
    metaTitle: "EAN-13 and UPC Check Digit Calculator | UtiliHub",
    metaTitleEs: "Dígito de control EAN-13 y UPC | UtiliHub",
    metaDescription:
      "Calculate or verify the GS1 check digit for EAN-13, UPC-A, EAN-8, and GTIN-14. 5901234123457 is valid. Not the Luhn card algorithm. In the browser.",
    metaDescriptionEs:
      "Calculá o verificá el dígito GS1 de EAN-13, UPC-A, EAN-8 y GTIN-14. 5901234123457 es válido. No es el algoritmo Luhn de tarjetas. En el navegador.",
    about: [
      "GS1 weights digits from the right: the position next to the check digit is multiplied by 3, the next by 1, and so on. The check digit makes the total a multiple of 10.",
      "That is not the Luhn algorithm used on cards. UPC-A is the same math as EAN-13 with a leading zero. EAN-8 uses seven data digits; GTIN-14 uses thirteen.",
      "Spaces and hyphens are ignored. A missing check digit is filled in. A wrong one is flagged. Empty input does not invent a code. Letters are rejected.",
    ],
    aboutEs: [
      "GS1 pondera desde la derecha: la posición junto al dígito de control se multiplica por 3, la siguiente por 1, y así. El control hace que el total sea múltiplo de 10.",
      "No es el algoritmo Luhn de las tarjetas. UPC-A es el mismo cálculo que EAN-13 con un cero adelante. EAN-8 usa siete cifras de datos; GTIN-14 usa trece.",
      "Se ignoran espacios y guiones. Si falta el control, se completa. Si no coincide, se marca. Vacío no inventa un código. Las letras se rechazan.",
    ],
    steps: [
      "Paste an EAN-13, UPC-A, EAN-8, or GTIN-14, with or without the check digit.",
      "Read whether the digit matches, or the digit the tool calculated.",
      "Copy the full code. Nothing is uploaded.",
    ],
    stepsEs: [
      "Pegá un EAN-13, UPC-A, EAN-8 o GTIN-14, con o sin el dígito de control.",
      "Mirá si coincide, o el dígito que calculó la herramienta.",
      "Copiá el código completo. No se sube nada.",
    ],
    faq: [
      { q: "Is 5901234123457 a valid EAN-13?", a: "Yes. The first 12 digits sum to 83 with GS1 weights, so the check digit is 7." },
      { q: "Why is UPC-A 036000291452 valid?", a: "It is EAN-13 with a leading zero: 0036000291452. The check digit is 2." },
      { q: "Is this the same as a credit-card Luhn check?", a: "No. Luhn doubles every other digit from the right and sums the digits of those products. GS1 multiplies by 3 or 1 and does not split products." },
    ],
    faqEs: [
      { q: "¿5901234123457 es un EAN-13 válido?", a: "Sí. Las primeras 12 cifras suman 83 con los pesos GS1, así que el control es 7." },
      { q: "¿Por qué el UPC-A 036000291452 es válido?", a: "Es un EAN-13 con cero adelante: 0036000291452. El dígito de control es 2." },
      { q: "¿Es lo mismo que el Luhn de una tarjeta?", a: "No. Luhn duplica una de cada dos cifras desde la derecha y suma los dígitos de esos productos. GS1 multiplica por 3 o por 1 y no parte los productos." },
    ],
  },
};
