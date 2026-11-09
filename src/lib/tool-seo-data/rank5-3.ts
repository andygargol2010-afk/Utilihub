// TOOL_SEO_OVERRIDES_RANK5 part 3 — split out of ../tool-seo-overrides-rank5.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverride } from "../tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_RANK5_3: Record<string, ToolSeoOverride> = {
  "validador-cuit": {
    metaTitle: "CUIT CUIL Validator Argentina — Check Digit Online Free | UtiliHub",
    metaTitleEs: "Validador de CUIT / CUIL online gratis — dígito verificador AFIP | UtiliHub",
    metaDescription:
      "Validate Argentine CUIT or CUIL with the official check digit. Format XX-XXXXXXXX-X. Free, private, runs in your browser.",
    metaDescriptionEs:
      "Validá CUIT o CUIL argentino con el dígito verificador oficial. Formato XX-XXXXXXXX-X. Gratis, privado, en el navegador — sin registro.",
    about: [
      "Enter 11 digits with or without dashes. The tool checks the AFIP-style check digit and common person/company prefixes.",
      "Useful before invoices, AFIP forms and payroll when you need a fast format check.",
      "Validation is local — the number is not uploaded.",
    ],
    aboutEs: [
      "Ingresá 11 dígitos con o sin guiones. Se verifica el dígito verificador tipo AFIP y se indica si el prefijo es habitual (persona o empresa).",
      "Útil antes de facturar, trámites AFIP o liquidaciones cuando necesitás confirmar formato al instante.",
      "La validación es local: el número no se sube a un servidor.",
    ],
    steps: ["Paste the CUIT/CUIL.", "Validate.", "Read valid/invalid and normalized format."],
    stepsEs: ["Pegá el CUIT/CUIL.", "Validá.", "Leé válido/inválido y el formato normalizado."],
    faq: [
      {
        q: "How do I validate a CUIT online?",
        a: "Paste the 11 digits (with or without dashes). The check digit must match the official algorithm.",
      },
      {
        q: "CUIT vs CUIL?",
        a: "Same 11-digit structure and check digit; prefixes differ for individuals vs companies.",
      },
      {
        q: "Is the number uploaded?",
        a: "No. Validation runs only in your browser.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo validar un CUIT online?",
        a: "Pegá los 11 dígitos (con o sin guiones). El dígito verificador debe coincidir con el algoritmo oficial.",
      },
      {
        q: "¿Cuál es la diferencia entre CUIT y CUIL?",
        a: "Comparten estructura de 11 dígitos y el mismo algoritmo; cambian los prefijos según persona o empresa.",
      },
      {
        q: "¿Qué prefijos son habituales?",
        a: "Personas: 20, 23, 24, 27. Empresas: 30, 33, 34 (entre los más comunes).",
      },
      {
        q: "¿El validador de CUIT es gratis?",
        a: "Sí. Sin registro y sin enviar el número a un servidor.",
      },
    ],
  },
};
