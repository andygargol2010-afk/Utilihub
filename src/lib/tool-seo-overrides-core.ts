import { TOOL_SEO_OVERRIDES_CORE_PART1 } from "./tool-seo-overrides-core.part1";
import { TOOL_SEO_OVERRIDES_CORE_PART2 } from "./tool-seo-overrides-core.part2";
/** High-traffic legacy/core tools (calculator, etc.).
 *  Do NOT import from tool-seo-overrides.ts (circular). Inline the shape.
 */

type CoreSeoOverride = {
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

export const TOOL_SEO_OVERRIDES_CORE: Record<string, CoreSeoOverride> = {
  ...TOOL_SEO_OVERRIDES_CORE_PART1,
  ...TOOL_SEO_OVERRIDES_CORE_PART2,
  "pixelihub": {
    metaTitle: "PixeliHub — Free Online Pixel Art Studio | UtiliHub",
    metaTitleEs: "PixeliHub — estudio de pixel art gratis online | UtiliHub",
    metaDescription:
      "Draw pixel art in the browser: grid sizes 8–256, layers, symmetry, pencil, eraser, fill, shapes. Export PNG or share a link. No signup.",
    metaDescriptionEs:
      "Dibujá pixel art en el navegador: grillas 8–256, capas, simetría, lápiz, goma, relleno y formas. Exportá PNG o compartí un enlace. Sin registro.",
    about: [
      "PixeliHub is a browser pixel-art studio built for sprites and icons: pick a canvas size from 8×8 to 256×256, paint with pencil or shapes, and stack up to four layers.",
      "Use symmetry (X, Y, or both), eyedropper, flood fill, and a fixed studio palette. Work autosaves on your device; export a sharp PNG or copy a share link for small scenes.",
    ],
    aboutEs: [
      "PixeliHub es un estudio de pixel art en el navegador para sprites e íconos: elegí un tamaño de 8×8 a 256×256, pintá con lápiz o formas y usá hasta cuatro capas.",
      "Tenés simetría (X, Y o ambas), gotero, relleno y una paleta fija de estudio. El trabajo se guarda en el dispositivo; exportá un PNG nítido o copiá un enlace en escenas chicas.",
    ],
    steps: [
      "Choose a canvas size (start with 32 or 64 for icons).",
      "Select a tool and color, then paint on the grid — use layers and symmetry as needed.",
      "Export PNG when finished, or copy a share link if the scene fits in the URL.",
    ],
    stepsEs: [
      "Elegí el tamaño del lienzo (32 o 64 sirve para íconos).",
      "Seleccioná herramienta y color, y pintá en la grilla — usá capas y simetría si hace falta.",
      "Exportá PNG al terminar, o copiá un enlace si la escena entra en la URL.",
    ],
    faq: [
      { q: "Do I need an account?", a: "No. PixeliHub runs entirely in your browser with no signup." },
      { q: "Where is my art stored?", a: "Autosave uses local storage on your device. Share links encode the scene in the URL hash when it is small enough." },
      { q: "Is export scaled?", a: "PNG export uses 1:1 pixels for a crisp sprite. You can rescale later in another editor if you need 2× or 4×." },
    ],
    faqEs: [
      { q: "¿Necesito cuenta?", a: "No. PixeliHub corre en el navegador sin registro." },
      { q: "¿Dónde se guarda el dibujo?", a: "El autoguardado usa almacenamiento local. Los enlaces codifican la escena en el hash de la URL cuando es lo bastante chica." },
      { q: "¿El PNG sale escalado?", a: "El export es 1:1 (píxeles nítidos). Si necesitás 2× o 4×, podés escalarlo después en otro editor." },
    ],
  },
};
