import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_SHOE: Record<string, ToolSeoOverride> = {
  "conversor-tallas-zapatos": {
    metaTitle: "Shoe Size Converter — EU, UK, US Men and Women | UtiliHub",
    metaTitleEs: "Conversor de tallas de zapatos — EU, UK y US | UtiliHub",
    metaDescription:
      "Convert adult shoe sizes between EU, UK, US men, US women, and foot length in cm. Local retail chart, not a brand last. Free in the browser.",
    metaDescriptionEs:
      "Convertí tallas adultas entre EU, UK, US hombre, US mujer y largo del pie en cm. Tabla de venta, no horma de marca. Gratis en el navegador.",
    about: [
      "Match an adult shoe size across EU, UK, US men, US women, and centimetre foot length on one retail Mondopoint chart.",
      "EU 42 lands on UK 8, US men 9, US women 10.5, and 27.0 cm. US women 8 lands on EU 39, UK 5.5, and 25.0 cm.",
      "Half sizes and commas are accepted. Empty input does not convert. Values outside EU 35–48 or 22–31 cm stay out of range.",
    ],
    aboutEs: [
      "Equivalé una talla adulta entre EU, UK, US hombre, US mujer y el largo del pie en centímetros en una tabla Mondopoint de venta.",
      "EU 42 cae en UK 8, US hombre 9, US mujer 10.5 y 27,0 cm. US mujer 8 cae en EU 39, UK 5.5 y 25,0 cm.",
      "Acepta medias tallas y coma. Vacío no convierte. Fuera de EU 35–48 o 22–31 cm queda fuera de rango.",
    ],
    steps: [
      "Pick the system you already know: EU, UK, US men, US women, or centimetres.",
      "Type the size. Use a preset to check EU 42 or US women 8.",
      "Copy the matching row. Measure the foot if the brand runs large or small.",
    ],
    stepsEs: [
      "Elegí el sistema que ya conocés: EU, UK, US hombre, US mujer o centímetros.",
      "Escribí la talla. Usá un preset para revisar EU 42 o US mujer 8.",
      "Copiá la fila. Medí el pie si la marca va grande o chica.",
    ],
    faq: [
      { q: "Is EU 42 the same as US 9?", a: "On this adult chart, EU 42 matches US men 9, UK 8, US women 10.5, and 27.0 cm foot length. A brand last can still differ by half a size." },
      { q: "What does US women 8 convert to?", a: "US women 8 matches EU 39, UK 5.5, US men 6.5, and 25.0 cm. It is not the same number as US men 8." },
      { q: "What happens with an empty, odd, or huge size?", a: "Empty stays blank. Text that is not a number fails format. EU 20 or 60, and lengths outside 22–31 cm, are out of range instead of a fake match." },
    ],
    faqEs: [
      { q: "¿EU 42 es US 9?", a: "En esta tabla adulta, EU 42 equivale a US hombre 9, UK 8, US mujer 10.5 y 27,0 cm de largo. La horma de una marca puede variar media talla." },
      { q: "¿A qué equivale US mujer 8?", a: "US mujer 8 equivale a EU 39, UK 5.5, US hombre 6.5 y 25,0 cm. No es el mismo número que US hombre 8." },
      { q: "¿Qué pasa con vacío, un texto o una talla enorme?", a: "Vacío no convierte. Un texto que no es número falla el formato. EU 20 o 60, y largos fuera de 22–31 cm, quedan fuera de rango en vez de inventar una fila." },
    ],
  },
};
