// TOOL_SEO_OVERRIDES_GEOMETRY part 2 — split out of ../tool-seo-overrides-geometry.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideGeometry } from "../tool-seo-overrides-geometry";

export const TOOL_SEO_OVERRIDES_GEOMETRY_2: Record<string, ToolSeoOverrideGeometry> = {
  "distancia-dos-puntos": {
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
  "punto-medio": {
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
