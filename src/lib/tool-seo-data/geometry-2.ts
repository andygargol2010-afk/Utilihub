// TOOL_SEO_OVERRIDES_GEOMETRY part 2 — split out of ../tool-seo-overrides-geometry.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGeometry } from "../tool-seo-overrides-geometry";
import { TOOL_SEO_OVERRIDES_GEOMETRY_2_PART1 } from "./geometry-2.part1";
import { TOOL_SEO_OVERRIDES_GEOMETRY_2_PART2 } from "./geometry-2.part2";


export const TOOL_SEO_OVERRIDES_GEOMETRY_2: Record<string, ToolSeoOverrideGeometry> = {
  ...TOOL_SEO_OVERRIDES_GEOMETRY_2_PART1,
  ...TOOL_SEO_OVERRIDES_GEOMETRY_2_PART2,
  "area-poligono-regular": {
    metaTitle: "Regular Polygon Area Calculator — n Sides × Side Length | UtiliHub",
    metaTitleEs: "Calculadora área polígono regular — n lados × longitud | UtiliHub",
    metaDescription:
      "Area of a regular n-gon: (n·s²)/(4·tan(π/n)). Also perimeter and apothem. Free geometry tool.",
    metaDescriptionEs:
      "Área de un n-ágono regular: (n·s²)/(4·tan(π/n)). También perímetro y apotema. Herramienta gratis.",
    about: [
      "Regular polygons have equal sides and angles; the area formula uses n and side length s.",
      "You also get perimeter and apothem for secondary checks.",
      "Works for triangles through high-n shapes approaching a circle.",
    ],
    aboutEs: [
      "Los polígonos regulares tienen lados y ángulos iguales; la fórmula usa n y la longitud s.",
      "También obtenés perímetro y apotema para verificaciones.",
      "Vale desde triángulos hasta formas con muchos lados que se acercan a un círculo.",
    ],
    steps: [
      "Enter integer n ≥ 3 and side length s.",
      "Calculate area, perimeter, and apothem.",
      "Keep s in your preferred length unit.",
    ],
    stepsEs: [
      "Ingresá el entero n ≥ 3 y la longitud s.",
      "Calculá área, perímetro y apotema.",
      "Mantené s en la unidad de longitud que uses.",
    ],
    faq: [
      { q: "What is the apothem?", a: "Distance from center perpendicular to a side." },
      { q: "n = 4?", a: "That is a square: area becomes s²." },
    ],
    faqEs: [
      { q: "¿Qué es la apotema?", a: "Distancia del centro perpendicular a un lado." },
      { q: "¿n = 4?", a: "Es un cuadrado: el área se reduce a s²." },
    ],
  },
  "area-elipse": {
    metaTitle: "Ellipse Area Calculator — π × a × b | UtiliHub",
    metaTitleEs: "Calculadora área de elipse — π × a × b | UtiliHub",
    metaDescription:
      "Area of an ellipse from semi-major and semi-minor axes. When a = b you recover the circle πr².",
    metaDescriptionEs:
      "Área de una elipse con semiejes mayor y menor. Si a = b recuperás el círculo πr².",
    about: [
      "Ellipse area is simply π times the product of the two semi-axes.",
      "Use half of the full major and minor axis lengths if your data are full widths.",
      "Rotation does not change the area — orientation is irrelevant here.",
    ],
    aboutEs: [
      "El área de la elipse es π por el producto de los dos semiejes.",
      "Usá la mitad de los ejes completos si tus datos son anchos totales.",
      "La rotación no cambia el área: la orientación no importa aquí.",
    ],
    steps: [
      "Enter semi-axis a and semi-axis b.",
      "Calculate the area.",
      "Halve full-axis lengths before entering if needed.",
    ],
    stepsEs: [
      "Ingresá el semieje a y el semieje b.",
      "Calculá el área.",
      "Si tenés ejes completos, dividilos por dos antes de ingresar.",
    ],
    faq: [
      { q: "Semi-axis vs full axis?", a: "This tool wants semi-axes (center to edge)." },
      { q: "Perimeter?", a: "No simple elementary formula; this calculator focuses on area." },
    ],
    faqEs: [
      { q: "¿Semieje o eje completo?", a: "Esta herramienta pide semiejes (centro al borde)." },
      { q: "¿Perímetro?", a: "No hay fórmula elemental simple; aquí nos centramos en el área." },
    ],
  },
};
