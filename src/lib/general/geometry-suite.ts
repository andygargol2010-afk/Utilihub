import type { GeneralTool } from "./types";

const base = (
  slug: string,
  name: string,
  summary: string,
  about: string[],
  steps: string[],
  faq: { q: string; a: string }[],
  keywords: string[],
): GeneralTool => ({
  slug,
  name,
  title: `${name} free online | UtiliHub`,
  description: summary,
  summary,
  category: "matematicas",
  kind: "number",
  keywords,
  about,
  steps,
  faq,
  config: { mode: "geometry-suite" },
});

export const GEOMETRY_SUITE_TOOLS: GeneralTool[] = [
  base(
    "formula-heron",
    "Heron's formula calculator",
    "Find the area of any triangle from its three side lengths using Heron's formula.",
    [
      "Heron's formula needs only the three sides: s = (a+b+c)/2 and Area = √[s(s−a)(s−b)(s−c)].",
      "No height or angle is required, so it works for scalene, isosceles, and equilateral triangles.",
      "The sides must satisfy the triangle inequality; otherwise no real triangle exists.",
    ],
    [
      "Enter the three side lengths a, b, and c.",
      "Calculate to get the area and semi-perimeter.",
      "If the sides cannot form a triangle, the tool reports the inequality failure.",
    ],
    [
      { q: "Do units matter?", a: "Use the same unit for all three sides. Area is in that unit squared." },
      { q: "What is the triangle inequality?", a: "Each side must be shorter than the sum of the other two." },
    ],
    ["heron's formula", "triangle area three sides", "fórmula de herón"],
  ),
  base(
    "triangulo-rectangulo",
    "Right triangle calculator",
    "Solve a right triangle from any two known sides: legs, hypotenuse, area, and acute angles.",
    [
      "Given two of the three sides of a right triangle, the third follows from the Pythagorean theorem.",
      "Acute angles are recovered with inverse trigonometric functions (atan of opposite/adjacent).",
      "Useful for construction, roof pitch, and basic physics force diagrams.",
    ],
    [
      "Enter any two of: leg a, leg b, hypotenuse c (leave the unknown blank is not supported — pick a mode).",
      "This version takes leg a and leg b, or leg and hypotenuse via the mode toggle.",
      "Read the missing side, area, and both acute angles in degrees.",
    ],
    [
      { q: "Must the right angle be between a and b?", a: "Yes — a and b are the legs; c is the hypotenuse opposite the right angle." },
      { q: "Can I enter all three sides?", a: "Enter two known values via the selected mode; the third is computed." },
    ],
    ["right triangle calculator", "pythagorean solver", "triángulo rectángulo"],
  ),
  base(
    "ley-de-senos",
    "Law of sines calculator",
    "Relate sides and opposite angles with a/sin(A) = b/sin(B) = c/sin(C).",
    [
      "The law of sines connects each side of a triangle to the sine of the opposite angle.",
      "Enter a known side-angle pair plus one more side or angle to find the matching unknown.",
      "Watch for the ambiguous SSA case when two solutions can exist.",
    ],
    [
      "Enter side a, angle A (degrees), and either side b or angle B.",
      "Calculate the unknown using the law of sines.",
      "Angles must be between 0° and 180° exclusive for a proper triangle.",
    ],
    [
      { q: "SSA ambiguous case?", a: "When two sides and a non-included angle are given, zero, one, or two triangles may fit. This tool returns the principal acute/obtuse candidate when valid." },
      { q: "Degrees or radians?", a: "Angles are entered in degrees." },
    ],
    ["law of sines", "sine rule", "ley de senos"],
  ),
  base(
    "ley-de-cosenos",
    "Law of cosines calculator",
    "Find a side or angle from the other two sides and the included angle (or three sides).",
    [
      "c² = a² + b² − 2ab cos(C) generalizes Pythagoras to non-right triangles.",
      "Rearranged, it also recovers an angle when all three sides are known.",
      "Standard for SAS side and SSS angle problems.",
    ],
    [
      "Choose mode: find side c from a, b, angle C — or find angle C from sides a, b, c.",
      "Enter the required values.",
      "Read the result in length units or degrees.",
    ],
    [
      { q: "Relation to Pythagoras?", a: "When C = 90°, cos(C) = 0 and the formula reduces to c² = a² + b²." },
      { q: "Angle unit?", a: "Input and output angles are in degrees." },
    ],
    ["law of cosines", "cosine rule", "ley de cosenos"],
  ),
  base(
    "distancia-dos-puntos",
    "Distance between two points",
    "Compute the Euclidean distance between (x₁,y₁) and (x₂,y₂) in the plane.",
    [
      "Distance is √[(x₂−x₁)² + (y₂−y₁)²], the straight-line length between two Cartesian points.",
      "Also shows Δx and Δy so you can see the horizontal and vertical components.",
      "Foundation for midpoint, slope, and coordinate-geometry word problems.",
    ],
    [
      "Enter coordinates of point 1 and point 2.",
      "Calculate distance, Δx, and Δy.",
      "Use the same axis units for both points.",
    ],
    [
      { q: "3D distance?", a: "This tool is 2D. Add a z term under the square root for three dimensions." },
      { q: "Order of points?", a: "Distance is symmetric — swapping the points does not change the result." },
    ],
    ["distance formula", "distance between two points", "distancia entre dos puntos"],
  ),
  base(
    "punto-medio",
    "Midpoint calculator",
    "Find the midpoint of the segment joining (x₁,y₁) and (x₂,y₂).",
    [
      "The midpoint averages each coordinate: ((x₁+x₂)/2, (y₁+y₂)/2).",
      "It is the center of the segment and the center of the circle with that diameter.",
      "Often paired with the distance formula in coordinate geometry.",
    ],
    [
      "Enter both endpoints.",
      "Read the midpoint coordinates.",
      "Combine with the distance tool if you also need segment length.",
    ],
    [
      { q: "Is the midpoint unique?", a: "Yes — every segment has exactly one midpoint." },
      { q: "3D midpoint?", a: "Same idea: average x, y, and z. This tool handles the plane." },
    ],
    ["midpoint formula", "midpoint calculator", "punto medio"],
  ),
  base(
    "area-poligono-regular",
    "Regular polygon area calculator",
    "Area of a regular n-gon from number of sides and side length (or apothem).",
    [
      "A regular polygon has equal sides and equal angles. Area = (n × s²) / (4 × tan(π/n)).",
      "Equivalently Area = (perimeter × apothem) / 2 when the apothem is known.",
      "Covers equilateral triangle (n=3), square (n=4), pentagon, hexagon, and beyond.",
    ],
    [
      "Enter the number of sides n (integer ≥ 3) and the side length s.",
      "Calculate area, perimeter, and apothem.",
      "n must be an integer of at least 3.",
    ],
    [
      { q: "What is the apothem?", a: "The perpendicular distance from the center to a side." },
      { q: "Does it work for a circle limit?", a: "As n grows large the polygon approaches a circle of similar perimeter." },
    ],
    ["regular polygon area", "hexagon area", "área polígono regular"],
  ),
  base(
    "area-elipse",
    "Ellipse area calculator",
    "Compute the area of an ellipse from semi-major axis a and semi-minor axis b.",
    [
      "Ellipse area is π × a × b. When a = b the formula becomes the familiar circle area πr².",
      "a and b are the distances from center to the ellipse along the two principal axes.",
      "Does not require rotation angle — area is invariant under rotation.",
    ],
    [
      "Enter semi-axis a and semi-axis b.",
      "Read the area.",
      "If you only know full axes lengths, use half of each as a and b.",
    ],
    [
      { q: "Full major axis vs semi-major?", a: "This tool expects semi-axes (half the full widths). Halve full-axis lengths first." },
      { q: "Perimeter of ellipse?", a: "Perimeter has no elementary closed form; this tool focuses on area only." },
    ],
    ["ellipse area", "area of an ellipse", "área de elipse"],
  ),
];
