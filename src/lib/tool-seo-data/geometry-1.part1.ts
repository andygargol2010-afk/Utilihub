// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GEOMETRY_1, split from geometry-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGeometry } from "../tool-seo-overrides-geometry";

export const TOOL_SEO_OVERRIDES_GEOMETRY_1_PART1: Record<string, ToolSeoOverrideGeometry> = {  "formula-heron": {
    metaTitle: "Heron's Formula Calculator — Triangle Area from 3 Sides | UtiliHub",
    metaTitleEs: "Calculadora fórmula de Herón — área con 3 lados | UtiliHub",
    metaDescription:
      "Compute triangle area with Heron's formula: √[s(s−a)(s−b)(s−c)]. No height needed. Free, instant.",
    metaDescriptionEs:
      "Área del triángulo con la fórmula de Herón: √[s(s−a)(s−b)(s−c)]. Sin altura. Gratis e instantáneo.",
    about: [
      "Heron's formula finds area from three side lengths alone using the semi-perimeter s.",
      "It works for any non-degenerate triangle: scalene, isosceles, or equilateral.",
      "The tool also shows s and the perimeter so you can verify the triangle inequality.",
    ],
    aboutEs: [
      "La fórmula de Herón obtiene el área solo con los tres lados usando el semiperímetro s.",
      "Vale para cualquier triángulo no degenerado: escaleno, isósceles o equilátero.",
      "También muestra s y el perímetro para verificar la desigualdad triangular.",
    ],
    steps: [
      "Enter sides a, b, and c in the same unit.",
      "Calculate area and semi-perimeter.",
      "If the sides cannot form a triangle, fix the lengths.",
    ],
    stepsEs: [
      "Ingresá los lados a, b y c en la misma unidad.",
      "Calculá el área y el semiperímetro.",
      "Si no forman un triángulo, corregí las longitudes.",
    ],
    faq: [
      { q: "Need the height?", a: "No — that is the point of Heron's formula." },
      { q: "Triangle inequality?", a: "Each side must be shorter than the sum of the other two." },
    ],
    faqEs: [
      { q: "¿Hace falta la altura?", a: "No: esa es la ventaja de Herón." },
      { q: "¿Desigualdad triangular?", a: "Cada lado debe ser menor que la suma de los otros dos." },
    ],
  },
};
