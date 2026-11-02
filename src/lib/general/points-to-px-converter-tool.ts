import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-pt-a-px",
  "Points to Pixels Converter",
  "diseno",
  "converter",
  "Convert typographic points (pt) to CSS pixels (px) and vice versa at standard 96 DPI (1 pt = 1.333 px).",
  [
    "points to pixels",
    "pt to px",
    "conversor pt a px",
    "puntos a pixeles",
    "font size converter",
    "tipografia pt px",
  ],
  {
    title: "Points to Pixels Converter | pt ↔ px | UtiliHub",
    description: "Free pt to px converter. Convert typographic points to CSS pixels and back at 96 DPI. EN+ES.",
    summaryEs: "Convierte puntos tipográficos (pt) a píxeles CSS (px) y viceversa.",
  },
);
tool.faq.push(faq("What is the conversion ratio?", "At the CSS standard of 96 DPI, 1 point = 1.333 pixels (or 4/3). 12 pt ≈ 16 px."));
tool.faq.push(faq("Why 96 DPI?", "CSS and most web browsers use 96 DPI as the reference for absolute units like pt."));

export const POINTS_TO_PX_CONVERTER_TOOLS = [tool];
