/** Unique SEO for trig-suite calculators. */

export type ToolSeoOverrideTrig = {
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

export const TOOL_SEO_OVERRIDES_TRIG: Record<string, ToolSeoOverrideTrig> = {
  "circulo-unitario": {
    metaTitle: "Unit Circle Calculator — sin cos tan from Angle | UtiliHub",
    metaTitleEs: "Calculadora círculo unitario — sen cos tan | UtiliHub",
    metaDescription: "Enter degrees to get sin, cos, tan and the (x,y) point on the unit circle.",
    metaDescriptionEs: "Ingresá grados y obtené sen, cos, tan y el punto (x,y) en el círculo unitario.",
    about: ["On the unit circle, angle θ maps to (cos θ, sin θ).", "Tan is sin/cos when defined.", "Any real degree measure is accepted."],
    aboutEs: ["En el círculo unitario, θ se mapea a (cos θ, sen θ).", "Tan es sen/cos cuando está definida.", "Se acepta cualquier medida en grados."],
    steps: ["Enter the angle in degrees.", "Read sin, cos, tan and coordinates.", "Watch for undefined tan at odd multiples of 90°."],
    stepsEs: ["Ingresá el ángulo en grados.", "Leé sen, cos, tan y coordenadas.", "Cuidado con tan indefinida en múltiplos impares de 90°."],
    faq: [{ q: "Radians input?", a: "Convert with the degrees↔radians tool first." }, { q: "Negative angles?", a: "Supported." }],
    faqEs: [{ q: "¿Entrada en radianes?", a: "Convertí antes con grados↔radianes." }, { q: "¿Ángulos negativos?", a: "Sí." }],
  },
  "grados-radianes": {
    metaTitle: "Degrees to Radians Converter — and Back | UtiliHub",
    metaTitleEs: "Conversor grados a radianes — y viceversa | UtiliHub",
    metaDescription: "Convert degrees ↔ radians with numeric output and π multiples.",
    metaDescriptionEs: "Convertí grados ↔ radianes con salida numérica y múltiplos de π.",
    about: ["π radians equal 180 degrees.", "Converts in both directions.", "Companion for every trig problem."],
    aboutEs: ["π radianes equivalen a 180 grados.", "Convierte en ambos sentidos.", "Compañero de todo problema de trigonometría."],
    steps: ["Choose direction.", "Enter the value.", "Read the converted result."],
    stepsEs: ["Elegí la dirección.", "Ingresá el valor.", "Leé el resultado."],
    faq: [{ q: "Negative values?", a: "Fully supported." }],
    faqEs: [{ q: "¿Valores negativos?", a: "Totalmente soportados." }],
  },
  "angulo-referencia": {
    metaTitle: "Reference Angle Calculator | UtiliHub",
    metaTitleEs: "Calculadora ángulo de referencia | UtiliHub",
    metaDescription: "Find the 0°–90° reference angle and quadrant for any degree measure.",
    metaDescriptionEs: "Encontrá el ángulo de referencia 0°–90° y el cuadrante.",
    about: ["The reference angle is the acute angle to the x-axis.", "Always between 0° and 90°.", "Coterminal angles share the same reference."],
    aboutEs: ["Es el agudo entre el lado terminal y el eje x.", "Siempre entre 0° y 90°.", "Los coterminales comparten el mismo."],
    steps: ["Enter any angle in degrees.", "Read reference angle and quadrant.", "Combine with unit-circle signs."],
    stepsEs: ["Ingresá cualquier ángulo en grados.", "Leé referencia y cuadrante.", "Combiná con signos del círculo unitario."],
    faq: [{ q: "Why use it?", a: "Reuse acute trig values with quadrant sign rules." }],
    faqEs: [{ q: "¿Para qué sirve?", a: "Reutilizar valores agudos con reglas de signo." }],
  },
  "triangulo-especial": {
    metaTitle: "30-60-90 & 45-45-90 Triangle Calculator | UtiliHub",
    metaTitleEs: "Calculadora triángulos 30-60-90 y 45-45-90 | UtiliHub",
    metaDescription: "Solve special right triangles from any known side using standard ratios.",
    metaDescriptionEs: "Resolvé triángulos rectángulos especiales desde cualquier lado conocido.",
    about: ["45-45-90: legs equal, hyp = leg·√2.", "30-60-90: x : x√3 : 2x.", "Enter one side; the rest are filled."],
    aboutEs: ["45-45-90: catetos iguales, hip = cateto·√2.", "30-60-90: x : x√3 : 2x.", "Ingresá un lado; se completan los demás."],
    steps: ["Pick triangle type.", "Select known side.", "Enter length and calculate."],
    stepsEs: ["Elegí el tipo.", "Seleccioná el lado conocido.", "Ingresá la longitud y calculá."],
    faq: [{ q: "Only right triangles?", a: "Yes — the two classical special right triangles." }],
    faqEs: [{ q: "¿Solo rectángulos?", a: "Sí: los dos especiales clásicos." }],
  },
  "ternas-pitagoricas": {
    metaTitle: "Pythagorean Triples Generator — a²+b²=c² | UtiliHub",
    metaTitleEs: "Generador de ternas pitagóricas — a²+b²=c² | UtiliHub",
    metaDescription: "Generate Pythagorean triples from m>n with optional scale k.",
    metaDescriptionEs: "Generá ternas pitagóricas con m>n y escala k opcional.",
    about: ["Integer solutions to a²+b²=c².", "m>n generate primitives; multiply by k to scale.", "Great for contest prep."],
    aboutEs: ["Soluciones enteras de a²+b²=c².", "m>n generan primitivas; multiplicá por k.", "Útil para competencias."],
    steps: ["Enter m > n > 0.", "Optionally set k ≥ 1.", "Read (a,b,c) and verification."],
    stepsEs: ["Ingresá m > n > 0.", "Opcionalmente k ≥ 1.", "Leé (a,b,c) y la verificación."],
    faq: [{ q: "Famous example?", a: "m=2, n=1 → (3,4,5)." }],
    faqEs: [{ q: "¿Ejemplo famoso?", a: "m=2, n=1 → (3,4,5)." }],
  },
};
