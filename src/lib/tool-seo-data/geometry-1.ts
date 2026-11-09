// TOOL_SEO_OVERRIDES_GEOMETRY part 1 — split out of ../tool-seo-overrides-geometry.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGeometry } from "../tool-seo-overrides-geometry";
import { TOOL_SEO_OVERRIDES_GEOMETRY_1_PART1 } from "./geometry-1.part1";
import { TOOL_SEO_OVERRIDES_GEOMETRY_1_PART2 } from "./geometry-1.part2";


export const TOOL_SEO_OVERRIDES_GEOMETRY_1: Record<string, ToolSeoOverrideGeometry> = {
  ...TOOL_SEO_OVERRIDES_GEOMETRY_1_PART1,
  ...TOOL_SEO_OVERRIDES_GEOMETRY_1_PART2,
  "ley-de-senos": {
    metaTitle: "Law of Sines Calculator — a/sin(A) = b/sin(B) | UtiliHub",
    metaTitleEs: "Calculadora ley de senos — a/sen(A) = b/sen(B) | UtiliHub",
    metaDescription:
      "Apply the law of sines to find a side or opposite angle. Handles the SSA ambiguous case when two angles are possible.",
    metaDescriptionEs:
      "Aplicá la ley de senos para hallar un lado o el ángulo opuesto. Incluye el caso ambiguo SSA si hay dos soluciones.",
    about: [
      "The law of sines states that each side over the sine of its opposite angle is constant.",
      "Provide side a with angle A, then either side b or angle B.",
      "When SSA data allow two triangles, both candidate angles are listed.",
    ],
    aboutEs: [
      "La ley de senos dice que cada lado sobre el seno del ángulo opuesto es constante.",
      "Indicá el lado a con el ángulo A, y luego el lado b o el ángulo B.",
      "Si el caso SSA admite dos triángulos, se listan ambos ángulos candidatos.",
    ],
    steps: [
      "Enter side a and angle A in degrees.",
      "Add either side b or angle B.",
      "Calculate the unknown and the ratio a/sin(A).",
    ],
    stepsEs: [
      "Ingresá el lado a y el ángulo A en grados.",
      "Sumá el lado b o el ángulo B.",
      "Calculá la incógnita y el cociente a/sen(A).",
    ],
    faq: [
      { q: "Ambiguous SSA?", a: "Two sides and a non-included angle can yield zero, one, or two triangles." },
      { q: "Angle unit?", a: "Degrees between 0 and 180 exclusive." },
    ],
    faqEs: [
      { q: "¿Caso ambiguo SSA?", a: "Dos lados y un ángulo no incluido pueden dar cero, uno o dos triángulos." },
      { q: "¿Unidad de ángulos?", a: "Grados entre 0 y 180, exclusive." },
    ],
  },
  "ley-de-cosenos": {
    metaTitle: "Law of Cosines Calculator — SAS Side or SSS Angle | UtiliHub",
    metaTitleEs: "Calculadora ley de cosenos — lado SAS o ángulo SSS | UtiliHub",
    metaDescription:
      "Find side c from a, b, and included angle C — or find angle C from three sides. Generalizes Pythagoras.",
    metaDescriptionEs:
      "Hallá el lado c con a, b y el ángulo incluido C — o el ángulo C con tres lados. Generaliza Pitágoras.",
    about: [
      "c² = a² + b² − 2ab cos(C) covers any triangle, not only right-angled ones.",
      "Switch mode to solve for a side (SAS) or an angle (SSS).",
      "When C = 90° the cosine term vanishes and Pythagoras appears.",
    ],
    aboutEs: [
      "c² = a² + b² − 2ab cos(C) vale para cualquier triángulo, no solo rectángulos.",
      "Cambiá el modo para resolver un lado (SAS) o un ángulo (SSS).",
      "Si C = 90° el término del coseno se anula y aparece Pitágoras.",
    ],
    steps: [
      "Choose find-side or find-angle mode.",
      "Enter a, b, and either C or c.",
      "Read the result in length or degrees.",
    ],
    stepsEs: [
      "Elegí modo hallar-lado o hallar-ángulo.",
      "Ingresá a, b y C o c según el modo.",
      "Leé el resultado en longitud o grados.",
    ],
    faq: [
      { q: "Included angle?", a: "Angle C must be the angle between sides a and b when finding side c." },
      { q: "Angle unit?", a: "Degrees." },
    ],
    faqEs: [
      { q: "¿Ángulo incluido?", a: "El ángulo C debe ser el que está entre los lados a y b al buscar el lado c." },
      { q: "¿Unidad de ángulos?", a: "Grados." },
    ],
  },
};
