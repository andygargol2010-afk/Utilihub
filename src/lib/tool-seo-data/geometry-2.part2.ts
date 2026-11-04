// Part 2 of 3 — entries of TOOL_SEO_OVERRIDES_GEOMETRY_2, split from geometry-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGeometry } from "../tool-seo-overrides-geometry";

export const TOOL_SEO_OVERRIDES_GEOMETRY_2_PART2: Record<string, ToolSeoOverrideGeometry> = {  "punto-medio": {
    metaTitle: "Midpoint Calculator — Average of Two Coordinates | UtiliHub",
    metaTitleEs: "Calculadora de punto medio — promedio de coordenadas | UtiliHub",
    metaDescription:
      "Find the midpoint ((x₁+x₂)/2, (y₁+y₂)/2) of a segment. Free analytic geometry helper.",
    metaDescriptionEs:
      "Obtené el punto medio ((x₁+x₂)/2, (y₁+y₂)/2) de un segmento. Ayuda de geometría analítica gratis.",
    about: [
      "The midpoint averages each coordinate of the endpoints.",
      "It is also the center of the circle that has the segment as diameter.",
      "Use alongside the distance formula for segment length and center.",
    ],
    aboutEs: [
      "El punto medio promedia cada coordenada de los extremos.",
      "También es el centro del círculo que tiene el segmento como diámetro.",
      "Usalo junto con la distancia para longitud y centro del segmento.",
    ],
    steps: [
      "Enter both endpoints.",
      "Read the midpoint x and y.",
      "Combine with distance if you need the length too.",
    ],
    stepsEs: [
      "Ingresá ambos extremos.",
      "Leé el punto medio en x e y.",
      "Combiná con la distancia si también necesitás la longitud.",
    ],
    faq: [
      { q: "Unique midpoint?", a: "Yes — every segment has exactly one." },
      { q: "3D?", a: "Average z as well; this tool covers the plane." },
    ],
    faqEs: [
      { q: "¿Punto medio único?", a: "Sí: cada segmento tiene exactamente uno." },
      { q: "¿3D?", a: "Promediá también z; esta herramienta cubre el plano." },
    ],
  },
};
