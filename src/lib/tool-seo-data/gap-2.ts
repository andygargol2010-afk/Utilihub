// TOOL_SEO_OVERRIDES_GAP part 2 — split out of ../tool-seo-overrides-gap.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";
import { TOOL_SEO_OVERRIDES_GAP_2_PART1 } from "./gap-2.part1";
import { TOOL_SEO_OVERRIDES_GAP_2_PART2 } from "./gap-2.part2";


export const TOOL_SEO_OVERRIDES_GAP_2: Record<string, ToolSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_GAP_2_PART1,
  ...TOOL_SEO_OVERRIDES_GAP_2_PART2,
  "validador-iban": {
    metaTitle: "IBAN Validator — Mod-97 Checksum Online | UtiliHub",
    metaTitleEs: "Validador IBAN — dígito de control mod-97 | UtiliHub",
    metaDescription: "Validate IBAN numbers with the ISO 13616 mod-97 checksum and country length. Free, local, no signup.",
    metaDescriptionEs: "Validá un IBAN con el checksum mod-97 de ISO 13616 y la longitud del país. Gratis, local y sin registro.",
    about: [
      "Paste an IBAN with or without spaces. The tool checks the country length when known and the ISO 13616 mod-97 checksum.",
      "A valid checksum does not prove the bank account exists — only that the number is well formed.",
    ],
    aboutEs: [
      "Pegá un IBAN con o sin espacios. Se comprueba la longitud del país si está en la tabla y el checksum mod-97 de ISO 13616.",
      "Un checksum válido no prueba que la cuenta exista: solo que el número está bien formado.",
    ],
    steps: ["Paste the IBAN.", "Press Validate.", "Read valid or invalid, the grouped format, and the length note."],
    stepsEs: ["Pegá el IBAN.", "Pulsá Validar.", "Leé válido o inválido, el formato agrupado y la nota de longitud."],
    faq: [
      { q: "Which countries are checked for length?", a: "Common SEPA and several other ISO registries (ES, DE, FR, GB, IT, PT, BR, and others). Unknown countries still get a checksum check if the length is 15–34." },
      { q: "Is the IBAN uploaded?", a: "No. The checksum runs in your browser." },
    ],
    faqEs: [
      { q: "¿Qué países tienen control de longitud?", a: "Los habituales de SEPA y otros del registro ISO (ES, DE, FR, GB, IT, PT, BR y más). Si el país no está en la tabla, igual se valida el checksum si hay entre 15 y 34 caracteres." },
      { q: "¿Se sube el IBAN?", a: "No. El checksum se calcula en el navegador." },
    ],
  },
  "validador-cuit": {
    metaTitle: "CUIT/CUIL Validator — Argentina Check Digit | UtiliHub",
    metaTitleEs: "Validador CUIT/CUIL Argentina | UtiliHub",
    metaDescription: "Validate Argentine CUIT/CUIL numbers with the official check-digit algorithm and format XX-XXXXXXXX-X.",
    metaDescriptionEs: "Validá CUIT/CUIL argentinos con el algoritmo oficial de dígito verificador y formato XX-XXXXXXXX-X.",
    about: [
      "Enter 11 digits (with or without dashes). The tool verifies the check digit and notes whether the prefix is a common AFIP type.",
    ],
    aboutEs: [
      "Ingresá 11 dígitos (con o sin guiones). Se verifica el dígito verificador y se indica si el prefijo es un tipo habitual de AFIP.",
    ],
    steps: ["Paste the CUIT/CUIL.", "Press Validate.", "Read valid/invalid and formatted output."],
    stepsEs: ["Pegá el CUIT/CUIL.", "Pulsá Validar.", "Leé válido/inválido y el formato."],
    faq: [
      { q: "What prefixes are common?", a: "20, 23, 24, 27 (individuals) and 30, 33, 34 (companies) are typical." },
      { q: "CUIT vs CUIL?", a: "Same 11-digit structure and algorithm; prefixes differ by person vs company use." },
    ],
    faqEs: [
      { q: "¿Qué prefijos son habituales?", a: "20, 23, 24, 27 (personas) y 30, 33, 34 (empresas) son típicos." },
      { q: "¿CUIT o CUIL?", a: "Comparten estructura de 11 dígitos y el mismo algoritmo; cambian los prefijos según persona o empresa." },
    ],
  },
};
