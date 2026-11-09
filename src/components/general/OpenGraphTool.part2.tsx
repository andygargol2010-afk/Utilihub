// Part 2 of 3 — split from OpenGraphTool.tsx on 2026-11-04. Edit here; OpenGraphTool.tsx re-exports.
import { type OgLocale, type OgType, type TwitterCard } from "@/lib/general/open-graph";

export const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
export const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export const EXAMPLE = {
  title: "Kitchen timer",
  description: "A free browser timer for cooking.",
  url: "https://utilihub.net/tools/kitchen-timer",
  image: "https://utilihub.net/og/kitchen.jpg",
  siteName: "UtiliHub",
  type: "website" as OgType,
  card: "summary_large_image" as TwitterCard,
  locale: "en_US" as OgLocale,
};

export const ISSUE_COPY: Record<string, { en: string; es: string }> = {
  "title-required": { en: "Title is required.", es: "El título es obligatorio." },
  "title-long": { en: "Title is over 60 characters. Some previews truncate it.", es: "El título pasa de 60 caracteres. Algunas vistas previas lo cortan." },
  "description-empty": { en: "Description is empty. Previews will fall back to page text.", es: "La descripción está vacía. La vista previa usará texto de la página." },
  "description-long": { en: "Description is over 200 characters.", es: "La descripción pasa de 200 caracteres." },
  "url-absolute": { en: "Page URL must be absolute (https://…).", es: "La URL de la página tiene que ser absoluta (https://…)." },
  "image-absolute": { en: "Image URL must be absolute (https://…).", es: "La URL de la imagen tiene que ser absoluta (https://…)." },
  "image-missing": { en: "summary_large_image expects an image. Tags are still copied.", es: "summary_large_image espera una imagen. Las tags igual se copian." },
  "image-http": { en: "Image is http, not https. Many crawlers drop it.", es: "La imagen es http, no https. Muchos crawlers la descartan." },
};
