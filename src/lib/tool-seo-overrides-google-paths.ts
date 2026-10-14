import type { ToolSeoOverride } from "./tool-seo-overrides";

/** SEO for paths that already get ≥2 Google visits (Analytics). */
export const TOOL_SEO_OVERRIDES_GOOGLE_PATHS: Record<string, ToolSeoOverride> = {
  "validador-cuit": {
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
  "tareas-restantes": {
    metaTitle: "Remaining Tasks Calculator — Total minus done | UtiliHub",
    metaTitleEs: "Calculadora de tareas restantes — total menos hechas | UtiliHub",
    metaDescription:
      "How many tasks are left? Enter total and completed to get pending count. Free productivity helper, no signup.",
    metaDescriptionEs:
      "¿Cuántas tareas te faltan? Ingresá el total y las completadas para ver las pendientes. Gratis, sin registro.",
    about: [
      "Remaining tasks = total − completed. Use the same unit for both fields (tasks, tickets, chapters).",
      "If completed exceeds total, double-check both numbers—scope may have changed mid-sprint.",
    ],
    aboutEs: [
      "Tareas restantes = total − completadas. Usá la misma unidad en ambos campos (tareas, tickets, capítulos).",
      "Si lo completado supera el total, revisá los números: el plan pudo cambiar a mitad de sprint.",
    ],
    steps: ["Enter total tasks and how many are done.", "Read the remaining count.", "Update when progress changes."],
    stepsEs: [
      "Ingresá el total de tareas y cuántas están hechas.",
      "Leé cuántas quedan pendientes.",
      "Actualizá cuando avance el progreso.",
    ],
    faq: [
      { q: "Can completed be higher than total?", a: "Usually a data entry error or reduced scope—double-check both numbers." },
      { q: "Is this a to-do app?", a: "No. It only calculates remaining count; it does not store lists." },
    ],
    faqEs: [
      { q: "¿Cómo calcular tareas pendientes?", a: "Restá las completadas al total: pendientes = total − hechas." },
      { q: "¿Puede lo completado ser mayor que el total?", a: "Suele ser un error de carga o un alcance reducido: revisá ambos números." },
      { q: "¿Es una app de to-do?", a: "No. Solo calcula el restante; no guarda listas." },
    ],
  },
  "generador-numero-aleatorio": {
    metaTitle: "Random Number Generator — Integer between min and max | UtiliHub",
    metaTitleEs: "Generador de número aleatorio — entre mínimo y máximo | UtiliHub",
    metaDescription:
      "Generate a random integer between two bounds. Fair uniform pick in the browser. Free, no signup.",
    metaDescriptionEs:
      "Generá un número entero aleatorio entre dos límites. Sorteo uniforme en el navegador. Gratis, sin registro.",
    about: [
      "Enter a minimum and maximum (inclusive). The tool picks a uniform random integer in that range.",
      "Useful for raffles, classroom picks, dice ranges, and quick samples without a spreadsheet.",
    ],
    aboutEs: [
      "Ingresá un mínimo y un máximo (incluidos). La herramienta elige un entero aleatorio uniforme en ese rango.",
      "Útil para sorteos, elegir en clase, rangos tipo dado y muestras rápidas sin una hoja de cálculo.",
    ],
    steps: ["Set minimum and maximum.", "Generate to get a random integer.", "Generate again for a new value."],
    stepsEs: ["Definí mínimo y máximo.", "Generá para obtener un entero aleatorio.", "Volvé a generar para otro valor."],
    faq: [
      { q: "Is max inclusive?", a: "Yes—both ends of the range can appear." },
      { q: "Is it cryptographically secure?", a: "No. It uses the browser PRNG for everyday picks, not security tokens." },
    ],
    faqEs: [
      { q: "¿El máximo está incluido?", a: "Sí: ambos extremos del rango pueden salir." },
      { q: "¿Es criptográficamente seguro?", a: "No. Usa el PRNG del navegador para sorteos cotidianos, no para tokens de seguridad." },
    ],
  },
};
