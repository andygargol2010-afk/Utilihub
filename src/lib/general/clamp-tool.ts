import { makeTool } from "./types";

/** Gap: HEX/HSL and WCAG contrast exist; fluid type still needs a clamp() line. */
export const CLAMP_TOOLS = [
  makeTool(
    "generador-css-clamp",
    "CSS clamp generator",
    "diseno",
    "generator",
    "Build a fluid font-size clamp() from min and max sizes and viewports.",
    [
      "css clamp calculator",
      "fluid typography clamp generator",
      "generador css clamp",
      "tipografia fluida clamp",
      "font-size clamp rem",
    ],
    {
      mode: "css-clamp",
      title: "CSS clamp() Generator for Fluid Type | UtiliHub",
      description:
        "Generate font-size: clamp() from a minimum and maximum size and viewport. 16px at 320px to 24px at 1200px becomes clamp(1rem, 0.8182rem + 0.0568vw, 1.5rem). In the browser.",
    },
  ),
];
