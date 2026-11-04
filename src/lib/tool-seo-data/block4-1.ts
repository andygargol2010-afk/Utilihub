// TOOL_SEO_OVERRIDES_BLOCK4 part 1 — split out of ../tool-seo-overrides-block4.ts on 2026-10-28.
// Add new entries in the smallest file of this folder; never rewrite files wholesale.
import type { ToolSeoOverrideBlock4 } from "../tool-seo-overrides-block4";
import { TOOL_SEO_OVERRIDES_BLOCK4_1_PART1 } from "./block4-1.part1";
import { TOOL_SEO_OVERRIDES_BLOCK4_1_PART2 } from "./block4-1.part2";


export const TOOL_SEO_OVERRIDES_BLOCK4_1: Record<string, ToolSeoOverrideBlock4> = {
  ...TOOL_SEO_OVERRIDES_BLOCK4_1_PART1,
  ...TOOL_SEO_OVERRIDES_BLOCK4_1_PART2,

  "slug-generator": {
    metaTitle: "Slug Generator — URL Slug from Title | UtiliHub",
    metaTitleEs: "Generador de slug para URLs | UtiliHub",
    metaDescription:
      "Turn a title into a clean URL slug: lowercase, hyphens, no special characters. Free slug generator.",
    metaDescriptionEs:
      "Convertí un título en un slug limpio para URLs: minúsculas, guiones, sin caracteres raros. Generador de slug gratis.",
    about: [
      "A URL slug is the readable part of a path (e.g. my-post-title). Good slugs are short, lowercase, and use hyphens instead of spaces.",
      "This generator normalizes accents and strips characters that are awkward in URLs so you can paste the result into a CMS or static site.",
      "Slugs should stay stable after publish when possible—changing them can break incoming links unless you add redirects.",
    ],
    aboutEs: [
      "Un slug es la parte legible de una ruta (p. ej. mi-titulo-de-post). Los buenos slugs son cortos, en minúsculas y usan guiones en lugar de espacios.",
      "Este generador normaliza acentos y quita caracteres incómodos en URLs para pegar el resultado en un CMS o sitio estático.",
      "Conviene no cambiar el slug después de publicar: rompería enlaces entrantes salvo que agregues redirecciones.",
    ],
    steps: [
      "Paste the title or phrase.",
      "Generate the slug.",
      "Copy it into your CMS or filename.",
    ],
    stepsEs: [
      "Pegá el título o la frase.",
      "Generá el slug.",
      "Copialo a tu CMS o nombre de archivo.",
    ],
    faq: [
      {
        q: "Are accents removed?",
        a: "Typically yes—characters are normalized to ASCII-friendly forms so URLs stay portable.",
      },
      {
        q: "Spaces?",
        a: "Spaces become hyphens. Multiple spaces collapse to a single hyphen.",
      },
    ],
    faqEs: [
      {
        q: "¿Se quitan los acentos?",
        a: "Suele normalizarse a formas ASCII para que la URL sea portable.",
      },
      {
        q: "¿Y los espacios?",
        a: "Pasan a guiones. Varios espacios se colapsan en uno.",
      },
    ],
  },

};
