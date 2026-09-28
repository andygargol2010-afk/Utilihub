/** Unique SEO for geometry-suite calculators — no generic templates. */

export type ToolSeoOverrideGeometry = {
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  about: string[];
  aboutEs?: string[];
  steps: string[];
  stepsEs?: string[];
  faq: { q: string; a: string }[];
  faqEs?: { q: string; a: string }[];
};

export const TOOL_SEO_OVERRIDES_GEOMETRY: Record<string, ToolSeoOverrideGeometry> = {
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
