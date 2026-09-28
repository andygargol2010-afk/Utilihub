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
  config: { mode: "trig-suite" },
});

export const TRIG_SUITE_TOOLS: GeneralTool[] = [
  base(
    "circulo-unitario",
    "Unit circle calculator",
    "From an angle in degrees, get sin, cos, tan and the (x,y) point on the unit circle.",
    [
      "The unit circle has radius 1 centered at the origin; angle θ from the positive x-axis gives point (cos θ, sin θ).",
      "Tan is sin/cos when cos ≠ 0.",
      "Angles are accepted in degrees and normalized for display.",
    ],
    [
      "Enter an angle in degrees (any real value).",
      "Read sin, cos, tan and the coordinates.",
      "Undefined tan is reported when cos is ~0.",
    ],
    [
      { q: "Radians?", a: "Convert with the degrees↔radians tool first, or enter the degree equivalent." },
      { q: "Quadrant?", a: "Signs of sin and cos tell you the quadrant automatically." },
    ],
    ["unit circle", "sin cos tan", "círculo unitario"],
  ),
  base(
    "grados-radianes",
    "Degrees ↔ radians converter",
    "Convert degrees to radians and radians to degrees with exact π forms when possible.",
    [
      "π rad = 180°. So rad = deg · π/180 and deg = rad · 180/π.",
      "The tool shows both numeric values and a simplified multiple of π when clean.",
      "Essential companion for every trigonometry calculation.",
    ],
    [
      "Choose direction: degrees→radians or radians→degrees.",
      "Enter the value.",
      "Read the converted result.",
    ],
    [
      { q: "Is π exact?", a: "Numeric results use JS Math.PI; labels show π fractions when the ratio is simple." },
      { q: "Negative angles?", a: "Fully supported (clockwise vs counterclockwise conventions)." },
    ],
    ["degrees to radians", "radians to degrees", "grados a radianes"],
  ),
  base(
    "angulo-referencia",
    "Reference angle calculator",
    "Find the acute reference angle for any angle in degrees (0°–90° equivalent).",
    [
      "The reference angle is the acute angle between the terminal side and the x-axis.",
      "It is always between 0° and 90° and helps evaluate trig functions via quadrant signs.",
      "Input may be any real degree measure; it is reduced modulo 360 first.",
    ],
    [
      "Enter an angle in degrees.",
      "Read the reference angle and the quadrant (1–4).",
      "Use with the unit-circle tool for signed sin/cos.",
    ],
    [
      { q: "Why reference angles?", a: "They let you reuse acute-angle values with quadrant sign rules." },
      { q: "Coterminal angles?", a: "Angles that differ by 360°k share the same reference angle." },
    ],
    ["reference angle", "ángulo de referencia"],
  ),
  base(
    "triangulo-especial",
    "30-60-90 & 45-45-90 triangle calculator",
    "Solve special right triangles from any one known side using the standard side ratios.",
    [
      "45-45-90: legs equal; hypotenuse = leg·√2.",
      "30-60-90: sides x : x√3 : 2x (opposite 30°, 60°, 90° respectively).",
      "Pick the triangle type and which side you know; the rest are filled in.",
    ],
    [
      "Select 45-45-90 or 30-60-90.",
      "Choose which side is known and enter its length.",
      "Read all three sides.",
    ],
    [
      { q: "Can I enter the hypotenuse?", a: "Yes — select hypotenuse as the known side." },
      { q: "Isosceles right triangle?", a: "That is the 45-45-90 case." },
    ],
    ["30 60 90 triangle", "45 45 90 triangle", "triángulo especial"],
  ),
  base(
    "ternas-pitagoricas",
    "Pythagorean triples generator",
    "Generate primitive or scaled Pythagorean triples (a,b,c) with a²+b²=c².",
    [
      "Primitive triples come from integers m>n>0 of opposite parity, gcd 1: a=m²−n², b=2mn, c=m²+n².",
      "Multiply by a positive integer k to scale.",
      "Lists common triples for homework and contest problems.",
    ],
    [
      "Enter m > n > 0 (and optional scale k ≥ 1).",
      "Calculate the triple (a,b,c).",
      "Check a²+b²=c² on the verification card.",
    ],
    [
      { q: "What is primitive?", a: "gcd(a,b,c)=1 and not all even — generated when m,n coprime and opposite parity." },
      { q: "Order of a and b?", a: "We may swap so the even leg is shown consistently when using 2mn." },
    ],
    ["pythagorean triples", "ternas pitagóricas"],
  ),
];
