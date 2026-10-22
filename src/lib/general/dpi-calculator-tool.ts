import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-dpi",
  "DPI Calculator",
  "diseno",
  "calculator",
  "Calculate screen DPI (dots per inch) from resolution and diagonal size.",
  [
    "dpi calculator",
    "pixels per inch calculator",
    "calculadora dpi",
    "calculadora ppi",
    "screen dpi",
  ],
  {
    title: "DPI Calculator — Screen Pixels Per Inch | UtiliHub",
    description: "Free DPI / PPI calculator. Enter width, height in pixels and diagonal inches to get dots per inch. Local calculation.",
  },
);
tool.faq.push(faq("What is DPI?", "Dots (or pixels) per inch measures pixel density of a display."));
tool.faq.push(faq("Formula?", "DPI = √(width² + height²) / diagonal_inches."));

export const DPI_CALCULATOR_TOOLS = [tool];
