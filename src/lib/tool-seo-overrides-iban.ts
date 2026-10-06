import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_IBAN: Record<string, ToolSeoOverride> = {
  "validador-iban": {
    metaTitle: "IBAN Validator — MOD-97 Checksum and Country Length | UtiliHub",
    metaTitleEs: "Validador de IBAN — resto MOD-97 y longitud por país | UtiliHub",
    metaDescription:
      "Check an IBAN in the browser: format, country length, and ISO 13616 MOD-97-10. No bank lookup and no upload.",
    metaDescriptionEs:
      "Comprobá un IBAN en el navegador: formato, longitud por país y MOD-97-10 de ISO 13616. Sin consulta bancaria ni subida.",
    about: [
      "The validator strips spaces and hyphens, checks the IBAN pattern, compares length with a country table, then runs the MOD-97-10 remainder. A valid IBAN leaves remainder 1.",
      "It does not confirm that the account exists. Unknown country codes still get a checksum if the string matches the generic pattern.",
    ],
    aboutEs: [
      "El validador quita espacios y guiones, controla el patrón IBAN, compara la longitud con una tabla por país y calcula el resto MOD-97-10. Un IBAN válido deja resto 1.",
      "No confirma que la cuenta exista. Un país fuera de la tabla igual recibe el checksum si el texto cumple el patrón genérico.",
    ],
    steps: [
      "Paste an IBAN. Spaces and hyphens are ignored. Empty input stays unchecked.",
      "Read format, country length, and the MOD-97 remainder. Copy the summary or reset to clear the field.",
    ],
    stepsEs: [
      "Pegá un IBAN. Se ignoran espacios y guiones. Un campo vacío no se valida.",
      "Leé formato, longitud del país y el resto MOD-97. Copiá el resumen o reiniciá para vaciar.",
    ],
    faq: [
      {
        q: "Is GB82 WEST 1234 5698 7654 32 valid?",
        a: "Yes. Country GB expects 22 characters. After rearranging, the MOD-97-10 remainder is 1.",
      },
      {
        q: "Is ES91 2100 0418 4502 0005 1332 valid?",
        a: "Yes. Spain expects 24 characters and the checksum remainder is 1. Changing the last digit to 3 fails the remainder.",
      },
      {
        q: "Which formula and units are used?",
        a: "Move the first four characters to the end, map A–Z to 10–35, and take the number mod 97. Valid means remainder 1. Length is characters after removing spaces.",
      },
      {
        q: "What happens with empty input, a short string, or a bad check digit?",
        a: "Empty input is not a pass. A string that breaks the pattern fails format. A known country with the wrong length fails before the checksum. A wrong check digit shows a remainder other than 1.",
      },
    ],
    faqEs: [
      {
        q: "¿Es válido GB82 WEST 1234 5698 7654 32?",
        a: "Sí. GB exige 22 caracteres. Tras reordenar, el resto MOD-97-10 es 1.",
      },
      {
        q: "¿Es válido ES91 2100 0418 4502 0005 1332?",
        a: "Sí. España exige 24 caracteres y el resto es 1. Cambiar el último dígito a 3 falla el resto.",
      },
      {
        q: "¿Qué fórmula y unidades se usan?",
        a: "Se mueven los primeros 4 caracteres al final, A–Z pasan a 10–35 y se toma el número módulo 97. Válido significa resto 1. La longitud es en caracteres sin espacios.",
      },
      {
        q: "¿Qué pasa con vacío, un texto corto o un dígito de control malo?",
        a: "Vacío no aprueba. Un texto que rompe el patrón falla el formato. Un país conocido con longitud incorrecta falla antes del checksum. Un dígito malo muestra un resto distinto de 1.",
      },
    ],
  },
};
