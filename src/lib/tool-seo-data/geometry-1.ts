// TOOL_SEO_OVERRIDES_GEOMETRY part 1 — split out of ../tool-seo-overrides-geometry.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGeometry } from "../tool-seo-overrides-geometry";

export const TOOL_SEO_OVERRIDES_GEOMETRY_1: Record<string, ToolSeoOverrideGeometry> = {
  "formula-heron": {
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
  "triangulo-rectangulo": {
    metaTitle: "Right Triangle Calculator — Legs, Hypotenuse & Angles | UtiliHub",
    metaTitleEs: "Calculadora triángulo rectángulo — catetos, hipotenusa y ángulos | UtiliHub",
    metaDescription:
      "Solve a right triangle from two legs or leg + hypotenuse. Get the missing side, area, and acute angles.",
    metaDescriptionEs:
      "Resolvé un triángulo rectángulo con dos catetos o cateto + hipotenusa. Lado faltante, área y ángulos agudos.",
    about: [
      "Pythagoras links the legs and hypotenuse; inverse trig recovers the acute angles.",
      "Toggle between two-legs mode and leg-plus-hypotenuse mode depending on what you know.",
      "Common in framing, ramps, and vector magnitude problems.",
    ],
    aboutEs: [
      "Pitágoras relaciona catetos e hipotenusa; la trigometría inversa recupera los ángulos agudos.",
      "Elegí el modo según si conocés dos catetos o un cateto y la hipotenusa.",
      "Útil en estructuras, rampas y magnitudes de vectores.",
    ],
    steps: [
      "Select mode: two legs, or leg + hypotenuse.",
      "Enter the known lengths.",
      "Read the missing side, area, and angles.",
    ],
    stepsEs: [
      "Elegí el modo: dos catetos, o cateto + hipotenusa.",
      "Ingresá las longitudes conocidas.",
      "Leé el lado faltante, el área y los ángulos.",
    ],
    faq: [
      { q: "Where is the right angle?", a: "Between the two legs a and b; the hypotenuse is opposite it." },
      { q: "Angle unit?", a: "Degrees." },
    ],
    faqEs: [
      { q: "¿Dónde está el ángulo recto?", a: "Entre los catetos a y b; la hipotenusa es el lado opuesto." },
      { q: "¿Unidad de ángulos?", a: "Grados." },
    ],
  },
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
