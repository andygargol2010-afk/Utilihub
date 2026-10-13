import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-relacion-aspecto",
  "Aspect Ratio Calculator",
  "utilidades",
  "calculator",
  "Calculate aspect ratio from width and height, or find missing dimension for a target ratio. Useful for images, video, and UI.",
  [
    "aspect ratio calculator",
    "ratio calculator",
    "width height ratio",
    "16:9 calculator",
    "calculadora de relación de aspecto",
    "relación de aspecto",
    "calculadora ratio",
  ],
  {
    title: "Aspect Ratio Calculator — width, height, ratio online | UtiliHub",
    description:
      "Free aspect ratio calculator. Compute ratio from dimensions or find width/height for 16:9, 4:3, 1:1 and custom ratios. Instant browser tool.",
  },
);
tool.faq.push(
  faq(
    "How is aspect ratio calculated?",
    "Aspect ratio = width / height, simplified to the smallest integers (e.g. 1920×1080 = 16:9).",
  ),
);
tool.faq.push(
  faq(
    "Can I calculate one side from the other?",
    "Yes. Enter one dimension and a target ratio to get the other side.",
  ),
);

export const ASPECT_RATIO_TOOLS = [tool];
