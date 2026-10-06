import { makeTool } from "./types";

/** Gap: aspect ratio and color pickers exist; this checks WCAG contrast, not a palette. */
export const CONTRAST_TOOLS = [
  makeTool(
    "validador-contraste",
    "WCAG contrast checker",
    "diseno",
    "validator",
    "Check WCAG 2 contrast between text and background, with AA/AAA for normal and large text.",
    [
      "wcag contrast checker",
      "color contrast ratio calculator",
      "wcag aa aaa contrast",
      "comprobar contraste wcag",
      "validador contraste texto fondo",
      "ratio contraste accesibilidad",
    ],
    {
      mode: "contrast",
      title: "WCAG Contrast Checker — AA and AAA Ratio | UtiliHub",
      description:
        "Check WCAG 2 contrast from two hex colors. Shows the (L1+0.05)/(L2+0.05) ratio and AA/AAA for normal and large text.",
    },
  ),
];
