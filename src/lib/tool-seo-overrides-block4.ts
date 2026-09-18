/** Block 4 SEO overrides (math + everyday). */

export type ToolSeoOverrideBlock4 = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_BLOCK4: Record<string, ToolSeoOverrideBlock4> = {
  "regla-de-tres": {
    metaTitle: "Rule of Three Calculator — Direct & Inverse | UtiliHub",
    metaTitleEs: "Calculadora de regla de tres directa e inversa | UtiliHub",
    metaDescription:
      "Solve direct and inverse proportions with the rule of three. Free proportion calculator, no signup.",
    metaDescriptionEs:
      "Resolvé proporciones directas e inversas con regla de tres. Calculadora de proporciones gratis, sin registro.",
    about: [
      "The rule of three finds an unknown in a proportion when three values are known. Direct proportion: if A relates to B as C relates to X, then X = (B × C) / A.",
      "Inverse proportion is used when one quantity rises as the other falls (e.g. more workers, fewer days for the same job).",
      "All math runs locally so you can check homework, recipes scaled up, or simple business ratios without a spreadsheet.",
    ],
    aboutEs: [
      "La regla de tres obtiene una incógnita en una proporción cuando conocés tres valores. Proporción directa: si A es a B como C es a X, entonces X = (B × C) / A.",
      "La proporción inversa se usa cuando una magnitud sube y la otra baja (p. ej. más trabajadores, menos días para el mismo trabajo).",
      "El cálculo es local: deberes, recetas escaladas o ratios simples de negocio sin planilla.",
    ],
    steps: [
      "Choose direct or inverse proportion.",
      "Enter the three known values.",
      "Read the unknown X and the formula used.",
    ],
    stepsEs: [
      "Elegí proporción directa o inversa.",
      "Ingresá los tres valores conocidos.",
      "Leé la incógnita X y la fórmula usada.",
    ],
    faq: [
      {
        q: "When is inverse rule of three needed?",
        a: "When increasing one variable decreases the other proportionally—classic example: more people finishing a job in fewer days.",
      },
      {
        q: "Can I use decimals?",
        a: "Yes. Decimal values are supported in the inputs.",
      },
    ],
    faqEs: [
      {
        q: "¿Cuándo usar la inversa?",
        a: "Cuando al subir una variable la otra baja en proporción—ejemplo clásico: más personas terminan el trabajo en menos días.",
      },
      {
        q: "¿Acepta decimales?",
        a: "Sí. Los campos admiten valores decimales.",
      },
    ],
  },

  promedio: {
    metaTitle: "Average Calculator — Arithmetic Mean Online | UtiliHub",
    metaTitleEs: "Calculadora de promedio (media aritmética) | UtiliHub",
    metaDescription:
      "Calculate the arithmetic mean of a list of numbers. Free average calculator in your browser.",
    metaDescriptionEs:
      "Calculá la media aritmética de una lista de números. Calculadora de promedio gratis en el navegador.",
    about: [
      "The arithmetic mean (average) is the sum of values divided by how many values you have. It is the most common summary of a numeric list.",
      "Paste or type numbers and get the mean instantly. Outliers can pull the average up or down; for skewed data, also check the median.",
      "Computation is local—your numbers never need to leave the device for this calculation.",
    ],
    aboutEs: [
      "La media aritmética (promedio) es la suma de los valores dividida por la cantidad de datos. Es el resumen más habitual de una lista numérica.",
      "Pegá o escribí números y obtené la media al instante. Los valores extremos pueden mover el promedio; en datos sesgados, mirá también la mediana.",
      "El cálculo es local: tus números no necesitan salir del dispositivo.",
    ],
    steps: [
      "Enter or paste a list of numbers.",
      "Calculate the arithmetic mean.",
      "Optionally compare with median on related tools.",
    ],
    stepsEs: [
      "Ingresá o pegá una lista de números.",
      "Calculá la media aritmética.",
      "Opcionalmente compará con la mediana en herramientas relacionadas.",
    ],
    faq: [
      {
        q: "Average vs median?",
        a: "The mean uses every value equally. The median is the middle value and resists extreme outliers better.",
      },
      {
        q: "Empty list?",
        a: "You need at least one number; an empty list has no defined mean.",
      },
    ],
    faqEs: [
      {
        q: "¿Promedio o mediana?",
        a: "La media usa todos los valores por igual. La mediana es el valor central y resiste mejor los extremos.",
      },
      {
        q: "¿Lista vacía?",
        a: "Hace falta al menos un número; una lista vacía no tiene media definida.",
      },
    ],
  },

  "slug-generator": {
    metaTitle: "Slug Generator — URL Slug from Title | UtiliHub",
    metaTitleEs: "Generador de slug para URLs | UtiliHub",
    metaDescription:
      "Turn a title into a clean URL slug: lowercase, hyphens, no special characters. Free slug generator.",
    metaDescriptionEs:
      "Convertí un título en un slug limpio para URLs: minúsculas, guiones, sin caracteres raros. Generador de slug gratis.",
    about: [
      "A URL slug is the readable part of a path (e.g. my-post-title). Good slugs are short, lowercase, and use hyphens instead of spaces.",
      "This generator normalizes accents and strips characters that are awkward in URLs so you can paste the result into a CMS or static site.",
      "Slugs should stay stable after publish when possible—changing them can break incoming links unless you add redirects.",
    ],
    aboutEs: [
      "Un slug es la parte legible de una ruta (p. ej. mi-titulo-de-post). Los buenos slugs son cortos, en minúsculas y usan guiones en lugar de espacios.",
      "Este generador normaliza acentos y quita caracteres incómodos en URLs para pegar el resultado en un CMS o sitio estático.",
      "Conviene no cambiar el slug después de publicar: rompería enlaces entrantes salvo que agregues redirecciones.",
    ],
    steps: [
      "Paste the title or phrase.",
      "Generate the slug.",
      "Copy it into your CMS or filename.",
    ],
    stepsEs: [
      "Pegá el título o la frase.",
      "Generá el slug.",
      "Copialo a tu CMS o nombre de archivo.",
    ],
    faq: [
      {
        q: "Are accents removed?",
        a: "Typically yes—characters are normalized to ASCII-friendly forms so URLs stay portable.",
      },
      {
        q: "Spaces?",
        a: "Spaces become hyphens. Multiple spaces collapse to a single hyphen.",
      },
    ],
    faqEs: [
      {
        q: "¿Se quitan los acentos?",
        a: "Suele normalizarse a formas ASCII para que la URL sea portable.",
      },
      {
        q: "¿Y los espacios?",
        a: "Pasan a guiones. Varios espacios se colapsan en uno.",
      },
    ],
  },

  "url-decode": {
    metaTitle: "URL Decode — Percent-Decode Online | UtiliHub",
    metaTitleEs: "Decodificar URL online | UtiliHub",
    metaDescription:
      "Decode percent-encoded URLs and query strings back to readable text. Free URL decoder.",
    metaDescriptionEs:
      "Decodificá URLs y query strings con percent-encoding a texto legible. Decoder de URL gratis.",
    about: [
      "URL decoding reverses percent-encoding: sequences like %20 become spaces and %2F becomes /.",
      "Use it when you paste an encoded query parameter and need the original value for debugging or documentation.",
      "Decoding is local and is not decryption—anyone can decode the same string.",
    ],
    aboutEs: [
      "Decodificar URL invierte el percent-encoding: secuencias como %20 vuelven a espacios y %2F a /.",
      "Úsalo cuando pegás un parámetro codificado y necesitás el valor original para depurar o documentar.",
      "La decodificación es local y no es descifrado: cualquiera puede decodificar la misma cadena.",
    ],
    steps: [
      "Paste the encoded string.",
      "Decode to plain text.",
      "Copy the readable result.",
    ],
    stepsEs: [
      "Pegá la cadena codificada.",
      "Decodificá a texto plano.",
      "Copiá el resultado legible.",
    ],
    faq: [
      {
        q: "Invalid % sequences?",
        a: "Malformed encodings can throw errors or leave characters unchanged depending on the decoder strictness.",
      },
      {
        q: "Plus signs?",
        a: "In some form encodings + means space. If needed, replace + with %20 before decoding.",
      },
    ],
    faqEs: [
      {
        q: "¿Secuencias % inválidas?",
        a: "Una codificación mal formada puede dar error o dejar caracteres igual según el decoder.",
      },
      {
        q: "¿Signos +?",
        a: "En algunos formularios + significa espacio. Si hace falta, reemplazá + por %20 antes de decodificar.",
      },
    ],
  },
};
