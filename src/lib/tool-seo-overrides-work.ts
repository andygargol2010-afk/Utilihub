import type { ToolSeoOverride } from "./tool-seo-overrides";

export const TOOL_SEO_OVERRIDES_WORK: Record<string, ToolSeoOverride> = {
  "calculadora-trabajo": {
    metaTitle: "Work Calculator — Force × Distance in Joules | UtiliHub",
    metaTitleEs: "Calculadora de trabajo — fuerza por distancia en joules | UtiliHub",
    metaDescription:
      "Free work calculator. Enter force (N) and distance (m) to get work in joules (J) with the physics formula W = F × d.",
    metaDescriptionEs:
      "Calculá el trabajo físico con fuerza (N) y distancia (m). Resultado en joules con la fórmula W = F × d. Gratis y sin registro.",
    about: [
      "A work calculator computes the energy transferred by a force acting along a displacement. Enter force in newtons and distance in meters to get work in joules.",
      "Formula: W = F × d. Example: 50 N over 3 m → 150 J. Assumes the force is constant and parallel to the displacement.",
      "If the force is at an angle, only the component along the motion counts: W = F × d × cos(θ).",
      "Calculation stays in your browser. Nothing is uploaded.",
    ],
    aboutEs: [
      "Una calculadora de trabajo calcula la energía transferida por una fuerza a lo largo de un desplazamiento. Ingresá fuerza en newtons y distancia en metros para obtener el trabajo en joules.",
      "Fórmula: W = F × d. Ejemplo: 50 N en 3 m → 150 J. Asume fuerza constante y paralela al desplazamiento.",
      "Si la fuerza forma un ángulo, solo cuenta la componente en la dirección del movimiento: W = F × d × cos(θ).",
      "El cálculo queda en tu navegador. No se sube nada.",
    ],
    steps: [
      "Enter the force in newtons (N).",
      "Enter the distance in meters (m).",
      "Read the work in joules (J); copy it if needed.",
    ],
    stepsEs: [
      "Ingresá la fuerza en newtons (N).",
      "Ingresá la distancia en metros (m).",
      "Leé el trabajo en joules (J); copiá si hace falta.",
    ],
    faq: [
      {
        q: "How is work calculated?",
        a: "Work (J) = Force (N) × Distance (m), assuming the force is constant and parallel to the displacement.",
      },
      {
        q: "What is the unit of work?",
        a: "The joule (J): 1 J = 1 N × 1 m.",
      },
      {
        q: "Can I use kilograms instead of newtons?",
        a: "No. Force must be in newtons. For a mass m in kilograms under gravity, use F = m × 9.81 m/s².",
      },
      {
        q: "Is this work calculator free?",
        a: "Yes. It runs in your browser with no account required.",
      },
    ],
    faqEs: [
      {
        q: "¿Cómo se calcula el trabajo?",
        a: "Trabajo (J) = Fuerza (N) × Distancia (m), asumiendo fuerza constante y paralela al desplazamiento.",
      },
      {
        q: "¿Cuál es la unidad del trabajo?",
        a: "El joule (J): 1 J = 1 N × 1 m.",
      },
      {
        q: "¿Puedo usar kilogramos en vez de newtons?",
        a: "No. La fuerza va en newtons. Para una masa m en kilogramos bajo gravedad, usá F = m × 9,81 m/s².",
      },
      {
        q: "¿Hay calculadora de trabajo gratis?",
        a: "Sí. Calcula en el navegador, sin registro.",
      },
    ],
  },
};
