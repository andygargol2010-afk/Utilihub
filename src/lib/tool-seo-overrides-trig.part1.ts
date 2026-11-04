// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_TRIG, split from tool-seo-overrides-trig.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideTrig } from "./tool-seo-overrides-trig";

export const TOOL_SEO_OVERRIDES_TRIG_PART1: Record<string, ToolSeoOverrideTrig> = {  "circulo-unitario": {
    metaTitle: "Unit Circle Calculator — sin cos tan from Angle | UtiliHub",
    metaTitleEs: "Calculadora círculo unitario — sen cos tan | UtiliHub",
    metaDescription: "Enter degrees to get sin, cos, tan and the (x,y) point on the unit circle.",
    metaDescriptionEs: "Ingresá grados y obtené sen, cos, tan y el punto (x,y) en el círculo unitario.",
    about: ["On the unit circle, angle θ maps to (cos θ, sin θ).", "Tan is sin/cos when defined.", "Any real degree measure is accepted."],
    aboutEs: ["En el círculo unitario, θ se mapea a (cos θ, sen θ).", "Tan es sen/cos cuando está definida.", "Se acepta cualquier medida en grados."],
    steps: ["Enter the angle in degrees.", "Read sin, cos, tan and coordinates.", "Watch for undefined tan at odd multiples of 90°."],
    stepsEs: ["Ingresá el ángulo en grados.", "Leé sen, cos, tan y coordenadas.", "Cuidado con tan indefinida en múltiplos impares de 90°."],
    faq: [{ q: "Radians input?", a: "Convert with the degrees↔radians tool first." }, { q: "Negative angles?", a: "Supported." }],
    faqEs: [{ q: "¿Entrada en radianes?", a: "Convertí antes con grados↔radianes." }, { q: "¿Ángulos negativos?", a: "Sí." }],
  },
};
