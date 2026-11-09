// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_A_1, split from growth-a-1.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "../tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A_1_PART1: Record<string, ToolSeoOverrideGrowth> = {  "bmr-tdee": {
    metaTitle: "BMR & TDEE Calculator — Mifflin-St Jeor | UtiliHub",
    metaTitleEs: "Calculadora BMR y TDEE (Mifflin-St Jeor) | UtiliHub",
    metaDescription:
      "Estimate basal metabolic rate (BMR) and total daily energy expenditure (TDEE) with Mifflin-St Jeor and an activity factor.",
    metaDescriptionEs:
      "Estimá la tasa metabólica basal (BMR) y el gasto energético diario (TDEE) con Mifflin-St Jeor y un factor de actividad.",
    about: [
      "BMR is an estimate of calories burned at rest. TDEE multiplies BMR by an activity factor (roughly 1.2 sedentary to 1.9 very active).",
      "We use the Mifflin-St Jeor equations, which are widely used for adults: different constants for male and female estimates.",
      "These numbers are planning aids for diet or training logs—not prescriptions. Illness, medication, and body composition can change real needs.",
    ],
    aboutEs: [
      "El BMR estima calorías en reposo. El TDEE multiplica el BMR por un factor de actividad (aprox. 1,2 sedentario a 1,9 muy activo).",
      "Usamos las ecuaciones de Mifflin-St Jeor, habituales en adultos, con constantes distintas según el sexo indicado.",
      "Son ayudas de planificación, no prescripciones. Enfermedad, medicación y composición corporal cambian la necesidad real.",
    ],
    steps: [
      "Enter weight, height, age, sex code, and activity factor.",
      "Read BMR and TDEE in kcal.",
      "Adjust intake targets only with professional guidance when needed.",
    ],
    stepsEs: [
      "Ingresá peso, altura, edad, código de sexo y factor de actividad.",
      "Leé BMR y TDEE en kcal.",
      "Ajustá objetivos de ingesta solo con criterio profesional cuando haga falta.",
    ],
    faq: [
      {
        q: "What activity factor should I use?",
        a: "Common ranges: 1.2 desk job, ~1.55 moderate exercise, up toward 1.75–1.9 for hard training. Pick the closest match.",
      },
      {
        q: "Harris-Benedict vs Mifflin?",
        a: "Mifflin-St Jeor is often preferred for modern adult populations; this tool uses Mifflin.",
      },
    ],
    faqEs: [
      {
        q: "¿Qué factor de actividad uso?",
        a: "Rangos habituales: 1,2 trabajo de escritorio, ~1,55 ejercicio moderado, hasta 1,75–1,9 con entrenamiento duro.",
      },
      {
        q: "¿Harris-Benedict o Mifflin?",
        a: "Mifflin-St Jeor suele preferirse en poblaciones adultas actuales; esta tool usa Mifflin.",
      },
    ],
  },
};
