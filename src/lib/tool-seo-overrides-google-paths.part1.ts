// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GOOGLE_PATHS, split from tool-seo-overrides-google-paths.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GOOGLE_PATHS_PART1: Record<string, ToolSeoOverride> = {  "validador-cuit": {
    metaTitle: "CUIT/CUIL Validator Argentina — Check Digit Online | UtiliHub",
    metaTitleEs: "Validador de CUIT/CUIL online — dígito verificador AFIP | UtiliHub",
    metaDescription:
      "Validate Argentine CUIT or CUIL with the official AFIP check digit. Format XX-XXXXXXXX-X. Free, local, no signup.",
    metaDescriptionEs:
      "Validá CUIT o CUIL argentino con el dígito verificador oficial de AFIP. Formato XX-XXXXXXXX-X. Gratis, en el navegador, sin registro.",
    about: [
      "Enter 11 digits (with or without dashes). The tool verifies the check digit and notes whether the prefix is a common AFIP type.",
      "Useful before invoices, AFIP forms, and payroll when you need a quick format and check-digit check.",
    ],
    aboutEs: [
      "Ingresá 11 dígitos (con o sin guiones). Se verifica el dígito verificador y se indica si el prefijo es un tipo habitual de AFIP.",
      "Útil antes de facturas, trámites AFIP y sueldos cuando necesitás confirmar formato y dígito verificador al instante.",
    ],
    steps: ["Paste the CUIT/CUIL.", "Press Validate.", "Read valid/invalid and formatted output."],
    stepsEs: ["Pegá el CUIT/CUIL.", "Pulsá Validar.", "Leé válido/inválido y el formato normalizado."],
    faq: [
      { q: "What prefixes are common?", a: "20, 23, 24, 27 (individuals) and 30, 33, 34 (companies) are typical." },
      { q: "CUIT vs CUIL?", a: "Same 11-digit structure and algorithm; prefixes differ by person vs company use." },
      { q: "Is the number uploaded?", a: "No. Validation runs in your browser only." },
    ],
    faqEs: [
      {
        q: "¿Cómo validar un CUIT online?",
        a: "Ingresá los 11 dígitos (con o sin guiones) y comprobá el dígito verificador. Si falla, revisá tipografía o el número en AFIP.",
      },
      { q: "¿Qué prefijos son habituales?", a: "20, 23, 24, 27 (personas) y 30, 33, 34 (empresas) son típicos." },
      { q: "¿CUIT o CUIL?", a: "Comparten estructura de 11 dígitos y el mismo algoritmo; cambian los prefijos según persona o empresa." },
      { q: "¿Se sube el número?", a: "No. La validación corre solo en tu navegador." },
    ],
  },
};
