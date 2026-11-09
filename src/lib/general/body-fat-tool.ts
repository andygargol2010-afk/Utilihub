import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-grasa-corporal",
  "Body Fat Calculator",
  "productividad",
  "calculator",
  "Estimate body fat percentage with the US Navy method and a BMI-based estimate. Fully in the browser.",
  [
    "body fat calculator",
    "navy body fat calculator",
    "body fat percentage",
    "calculadora de grasa corporal",
    "porcentaje de grasa",
    "metodo navy",
  ],
  {
    title: "Body Fat Calculator — US Navy Method & BMI Estimate | UtiliHub",
    description:
      "Free body fat percentage calculator. Enter measurements for the US Navy method plus a BMI-based estimate. Instant, local, no signup.",
  },
);
tool.faq.push(
  faq(
    "How accurate is the Navy method?",
    "It is a widely used circumference estimate. Results are approximate; DEXA or other methods are more precise. Measure consistently.",
  ),
);
tool.faq.push(
  faq(
    "Do I need hip measurement?",
    "Yes for women (waist + hip - neck). Men use waist - neck. Measure at the navel for waist and widest point for hips.",
  ),
);

export const BODY_FAT_TOOLS = [tool];
