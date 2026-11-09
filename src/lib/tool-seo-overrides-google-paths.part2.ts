// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GOOGLE_PATHS, split from tool-seo-overrides-google-paths.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_GOOGLE_PATHS_PART2: Record<string, ToolSeoOverride> = {  "tareas-restantes": {
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
};
