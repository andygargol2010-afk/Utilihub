import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_ULID: Record<string, ToolSeoOverride> = {
  "generador-ulid": {
    metaTitle: "ULID Generator and Timestamp Decoder | UtiliHub",
    metaTitleEs: "Generador de ULID y decodificador de fecha | UtiliHub",
    metaDescription:
      "Generate a 26-character ULID or decode its timestamp. 01ARZ3NDEKTSV4RRFFQ69G5FAV is 2016-07-30T23:54:10.259Z. Not a UUID. In the browser.",
    metaDescriptionEs:
      "Generá un ULID de 26 caracteres o decodificá su fecha. 01ARZ3NDEKTSV4RRFFQ69G5FAV es 2016-07-30T23:54:10.259Z. No es un UUID. En el navegador.",
    about: [
      "A ULID is 26 Crockford base32 characters: 10 for a millisecond timestamp and 16 for 80 bits of randomness. Lexical order matches creation time.",
      "That is not UUID v4. UUID v4 is 36 hex characters with hyphens and is not time-sortable. This tool uses crypto.getRandomValues and does not upload the id.",
      "Decode accepts lowercase and Crockford aliases I and L as 1, O as 0. U and any other symbol are rejected. Length must be 26 after spaces and hyphens are removed.",
    ],
    aboutEs: [
      "Un ULID son 26 caracteres Crockford base32: 10 para la marca de tiempo en milisegundos y 16 para 80 bits aleatorios. El orden alfabético coincide con la creación.",
      "No es un UUID v4. El UUID v4 tiene 36 hexadecimales con guiones y no se ordena por tiempo. Esta tool usa crypto.getRandomValues y no sube el id.",
      "Al decodificar se aceptan minúsculas y los alias Crockford I y L como 1, O como 0. U y cualquier otro símbolo se rechazan. El largo debe ser 26 tras quitar espacios y guiones.",
    ],
    steps: [
      "Generate one or more ULIDs, or paste one to decode.",
      "Read the UTC timestamp and the randomness block.",
      "Copy the id. Nothing leaves the browser.",
    ],
    stepsEs: [
      "Generá uno o más ULID, o pegá uno para decodificarlo.",
      "Leé la fecha UTC y el bloque aleatorio.",
      "Copiá el id. No sale del navegador.",
    ],
    faq: [
      { q: "What time is 01ARZ3NDEKTSV4RRFFQ69G5FAV?", a: "2016-07-30T23:54:10.259Z. The first 10 characters encode 1469922850259 milliseconds." },
      { q: "Is a ULID the same as a UUID?", a: "No. A ULID is 26 Crockford characters and sorts by time. UUID v4 is random hex and is not ordered by creation." },
      { q: "Why is a trailing U rejected?", a: "Crockford base32 omits I, L, O, and U. I, L, and O are accepted as aliases on decode. U is not an alias." },
    ],
    faqEs: [
      { q: "¿Qué fecha es 01ARZ3NDEKTSV4RRFFQ69G5FAV?", a: "2016-07-30T23:54:10.259Z. Los primeros 10 caracteres codifican 1469922850259 milisegundos." },
      { q: "¿Un ULID es lo mismo que un UUID?", a: "No. Un ULID tiene 26 caracteres Crockford y se ordena por tiempo. El UUID v4 es hex aleatorio y no queda ordenado por creación." },
      { q: "¿Por qué se rechaza una U al final?", a: "Crockford base32 omite I, L, O y U. I, L y O se aceptan como alias al decodificar. U no es un alias." },
    ],
  },
};
