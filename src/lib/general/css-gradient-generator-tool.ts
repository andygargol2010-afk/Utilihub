import { makeTool, faq } from "./types";

const tool = makeTool(
  "generador-gradiente-css",
  "CSS Gradient Generator",
  "diseno",
  "generator",
  "Build linear CSS gradients with angle and two colors. Copy the ready-to-use background property.",
  [
    "css gradient generator",
    "linear gradient generator",
    "css background gradient",
    "generador gradiente css",
    "generador de degradado css",
    "gradiente lineal css",
  ],
  {
    title: "CSS Gradient Generator — Linear Background | UtiliHub",
    description: "Free CSS linear gradient generator. Choose angle and colors, preview live, copy the CSS. Runs entirely in your browser.",
  },
);
tool.faq.push(faq("What is a linear gradient?", "A linear gradient transitions colors along a straight line defined by an angle (0deg = bottom to top in standard CSS). You get a background-image value ready for any element."));
tool.faq.push(faq("Can I use more than two colors?", "This tool focuses on a clean two-color linear gradient for speed. For multi-stop gradients you can extend the copied CSS by adding more color stops."));

export const CSS_GRADIENT_GENERATOR_TOOLS = [tool];
