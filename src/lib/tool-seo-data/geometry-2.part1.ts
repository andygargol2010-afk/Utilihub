// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GEOMETRY_2, split from geometry-2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGeometry } from "../tool-seo-overrides-geometry";

export const TOOL_SEO_OVERRIDES_GEOMETRY_2_PART1: Record<string, ToolSeoOverrideGeometry> = {  "distancia-dos-puntos": {
    metaTitle: "Distance Between Two Points Calculator — 2D Formula | UtiliHub",
    metaTitleEs: "Calculadora distancia entre dos puntos — fórmula 2D | UtiliHub",
    metaDescription:
      "Euclidean distance √[(x₂−x₁)²+(y₂−y₁)²] plus Δx and Δy. Free coordinate-geometry tool.",
    metaDescriptionEs:
      "Distancia euclídea √[(x₂−x₁)²+(y₂−y₁)²] más Δx y Δy. Herramienta de geometría analítica gratis.",
    about: [
      "The distance formula is the Pythagorean theorem applied to coordinate differences.",
      "Δx and Δy are shown so you can inspect horizontal and vertical components.",
      "Pair it with the midpoint tool for full segment analysis.",
    ],
    aboutEs: [
      "La fórmula de la distancia es Pitágoras aplicado a las diferencias de coordenadas.",
      "Se muestran Δx y Δy para ver las componentes horizontal y vertical.",
      "Combinála con el punto medio para analizar el segmento completo.",
    ],
    steps: [
      "Enter (x₁, y₁) and (x₂, y₂).",
      "Calculate distance and deltas.",
      "Keep both points in the same unit system.",
    ],
    stepsEs: [
      "Ingresá (x₁, y₁) y (x₂, y₂).",
      "Calculá la distancia y los deltas.",
      "Mantené ambos puntos en el mismo sistema de unidades.",
    ],
    faq: [
      { q: "3D points?", a: "Add (z₂−z₁)² under the square root; this tool is planar." },
      { q: "Order of points?", a: "Distance does not change if you swap the endpoints." },
    ],
    faqEs: [
      { q: "¿Puntos 3D?", a: "Sumá (z₂−z₁)² bajo la raíz; esta herramienta es plana." },
      { q: "¿Orden de los puntos?", a: "La distancia no cambia si intercambiás los extremos." },
    ],
  },
};
