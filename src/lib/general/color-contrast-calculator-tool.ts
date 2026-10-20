import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-contraste-color",
  "Color Contrast Calculator",
  "diseno",
  "calculator",
  "Check WCAG contrast ratio between two colors.",
  [
    "color contrast calculator",
    "wcag contrast checker",
    "calculadora contraste color",
    "ratio contraste wcag",
  ],
  {
    title: "Color Contrast Calculator — WCAG ratio | UtiliHub",
    description: "Free color contrast calculator. Enter two hex colors to get contrast ratio and WCAG level. Local browser calculation.",
  },
);
tool.faq.push(faq("What is a good contrast?", "AA requires 4.5:1 for normal text, 3:1 for large."));
tool.faq.push(faq("Hex format?", "Use #RRGGBB or RRGGBB."));

export const COLOR_CONTRAST_CALCULATOR_TOOLS = [tool];
