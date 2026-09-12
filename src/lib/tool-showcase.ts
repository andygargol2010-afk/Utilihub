/** Premium presentation config for high-traffic tools (Day 1: image suite). */

export type ToolShowcase = {
  badge: string;
  badgeEs: string;
  titleHighlight?: string;
  tagline: string;
  taglineEs: string;
  fromLabel?: string;
  toLabel?: string;
  accent: "blue" | "violet" | "emerald" | "amber" | "rose" | "cyan";
  visual: "convert" | "compress" | "resize" | "crop" | "rotate" | "filter" | "favicon";
};

export const TOOL_SHOWCASE: Record<string, ToolShowcase> = {
  "png-a-jpg": {
    badge: "Converter",
    badgeEs: "Conversor",
    tagline: "Convert PNG images to JPG locally. Fast, easy and free — no installation required.",
    taglineEs: "Convierte imágenes PNG a JPG en tu navegador. Rápido, fácil y gratis.",
    fromLabel: "PNG",
    toLabel: "JPG",
    accent: "blue",
    visual: "convert",
  },
  "jpg-a-png": {
    badge: "Converter",
    badgeEs: "Conversor",
    tagline: "Convert JPG images to PNG locally with transparency support.",
    taglineEs: "Convierte imágenes JPG a PNG en local, con soporte de transparencia.",
    fromLabel: "JPG",
    toLabel: "PNG",
    accent: "violet",
    visual: "convert",
  },
  "jpg-a-webp": {
    badge: "Converter",
    badgeEs: "Conversor",
    tagline: "Convert JPG to modern WebP for smaller files and the same quality.",
    taglineEs: "Convierte JPG a WebP moderno: menos peso, misma calidad.",
    fromLabel: "JPG",
    toLabel: "WebP",
    accent: "emerald",
    visual: "convert",
  },
  "webp-a-jpg": {
    badge: "Converter",
    badgeEs: "Conversor",
    tagline: "Convert WebP images back to JPG for maximum compatibility.",
    taglineEs: "Convierte WebP a JPG para máxima compatibilidad.",
    fromLabel: "WebP",
    toLabel: "JPG",
    accent: "cyan",
    visual: "convert",
  },
  "comprimir-imagen": {
    badge: "Optimizer",
    badgeEs: "Optimizador",
    tagline: "Compress images in your browser. Control quality and download instantly.",
    taglineEs: "Comprime imágenes en el navegador. Controlá la calidad y descargá al instante.",
    fromLabel: "IMG",
    toLabel: "ZIP",
    accent: "amber",
    visual: "compress",
  },
  "redimensionar-imagen": {
    badge: "Editor",
    badgeEs: "Editor",
    tagline: "Resize images to exact pixel dimensions without uploading them.",
    taglineEs: "Redimensioná imágenes a píxeles exactos sin subirlas a un servidor.",
    fromLabel: "W×H",
    toLabel: "NEW",
    accent: "blue",
    visual: "resize",
  },
  "recortar-imagen": {
    badge: "Editor",
    badgeEs: "Editor",
    tagline: "Crop images to the size you need, fully local and private.",
    taglineEs: "Recortá imágenes al tamaño que necesitás, 100% local y privado.",
    fromLabel: "FULL",
    toLabel: "CROP",
    accent: "rose",
    visual: "crop",
  },
  "rotar-imagen": {
    badge: "Editor",
    badgeEs: "Editor",
    tagline: "Rotate photos by any angle without uploading them — everything stays on your device.",
    taglineEs: "Rotá fotos en cualquier ángulo. Todo ocurre en tu dispositivo.",
    fromLabel: "0°",
    toLabel: "90°",
    accent: "violet",
    visual: "rotate",
  },
  "escala-grises": {
    badge: "Filter",
    badgeEs: "Filtro",
    tagline: "Convert any image to clean grayscale in one click.",
    taglineEs: "Convertí cualquier imagen a escala de grises en un clic.",
    fromLabel: "COLOR",
    toLabel: "B&W",
    accent: "cyan",
    visual: "filter",
  },
  favicon: {
    badge: "Generator",
    badgeEs: "Generador",
    tagline: "Create a favicon from your logo or image — ready for any site.",
    taglineEs: "Creá un favicon desde tu logo o imagen, listo para cualquier sitio.",
    fromLabel: "IMG",
    toLabel: "ICO",
    accent: "emerald",
    visual: "favicon",
  },
};

export function getToolShowcase(slug: string): ToolShowcase | undefined {
  return TOOL_SHOWCASE[slug];
}

export function isShowcaseTool(slug: string): boolean {
  return slug in TOOL_SHOWCASE;
}
