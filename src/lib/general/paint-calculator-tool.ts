import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-pintura",
  "Paint Calculator",
  "hogar",
  "calculator",
  "Estimate how many gallons of paint are needed for room walls based on dimensions, coats, and coverage rate.",
  [
    "paint calculator",
    "how much paint do I need",
    "calculadora de pintura",
    "cuánta pintura necesito",
    "gallons of paint calculator",
  ],
  {
    title: "Paint Calculator — how many gallons for walls | UtiliHub",
    description: "Free paint calculator. Enter room length, width, height, coats, and coverage to estimate gallons needed. Runs in your browser.",
  },
);
tool.faq.push(faq("How is paint calculated?", "Wall area ≈ 2 × (length + width) × height minus typical openings. Gallons = area × coats ÷ coverage per gallon."));
tool.faq.push(faq("What coverage to use?", "Typical interior paint covers 350–400 sq ft per gallon. Check your can."));

export const PAINT_CALCULATOR_TOOLS = [tool];
