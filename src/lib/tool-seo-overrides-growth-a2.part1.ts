// Part 1 of 3 — entries of TOOL_SEO_OVERRIDES_GROWTH_A2, split from tool-seo-overrides-growth-a2.ts on 2026-11-04. Add new entries in the smallest part.
import type { ToolSeoOverrideGrowth } from "./tool-seo-overrides-growth";

export const TOOL_SEO_OVERRIDES_GROWTH_A2_PART1: Record<string, ToolSeoOverrideGrowth> = {  "relacion-aspecto": {
    metaTitle: "Aspect Ratio Calculator — Simplify Width × Height | UtiliHub",
    metaTitleEs: "Calculadora de relación de aspecto | UtiliHub",
    metaDescription:
      "Reduce pixel dimensions to the simplest ratio (e.g. 1920×1080 → 16:9) and show the decimal aspect.",
    metaDescriptionEs:
      "Reducí dimensiones en píxeles a la razón más simple (p. ej. 1920×1080 → 16:9) y el aspecto decimal.",
    about: [
      "Aspect ratio is width divided by height. Designers and video editors talk about 16:9, 4:3, 1:1, and 9:16 vertical.",
      "We simplify integer sides with the GCD so 1280×720 becomes 16:9, matching common video standards.",
      "Cropping to a new ratio changes composition; this tool only describes the ratio of the numbers you enter.",
    ],
    aboutEs: [
      "La relación de aspecto es ancho entre alto. En diseño y video se habla de 16:9, 4:3, 1:1 y 9:16 vertical.",
      "Simplificamos enteros con el MCD: 1280×720 pasa a 16:9, el estándar de video más común.",
      "Recortar a otra ratio cambia la composición; esta tool solo describe la razón de los números que ingresás.",
    ],
    steps: [
      "Enter width and height in pixels.",
      "Calculate the reduced ratio and decimal value.",
      "Match the ratio when exporting video or designing frames.",
    ],
    stepsEs: [
      "Ingresá ancho y alto en píxeles.",
      "Calculá la razón reducida y el valor decimal.",
      "Usá esa ratio al exportar video o diseñar marcos.",
    ],
    faq: [
      {
        q: "Non-integer sizes?",
        a: "Enter whole pixels for a clean ratio; fractional CSS sizes still have an effective aspect as width/height.",
      },
      {
        q: "Letterboxing?",
        a: "If content and frame ratios differ, black bars appear. Match ratios or crop to avoid them.",
      },
    ],
    faqEs: [
      {
        q: "¿Tamaños no enteros?",
        a: "Para una razón limpia usá píxeles enteros; en CSS el aspecto efectivo sigue siendo ancho/alto.",
      },
      {
        q: "¿Letterbox?",
        a: "Si el contenido y el marco tienen distinta ratio aparecen bandas. Igualá ratios o recortá.",
      },
    ],
  },
};
