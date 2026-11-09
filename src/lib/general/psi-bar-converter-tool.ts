import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-psi-bar",
  "PSI to Bar Converter",
  "conversiones",
  "converter",
  "Convert pressure between psi and bar. Practical for car tires, diving, industrial systems and science.",
  [
    "psi to bar",
    "bar to psi",
    "pressure converter",
    "conversor psi bar",
    "psi bar",
    "tire pressure converter",
  ],
  {
    title: "PSI to Bar Converter | Pressure | UtiliHub",
    description: "Free PSI ↔ bar pressure converter. Convert pounds per square inch to bar and vice versa. Accurate for tires and science. EN+ES.",
    summaryEs: "Convierte presión entre psi y bar de forma precisa.",
  },
);
tool.faq.push(faq("What is the conversion factor?", "1 psi = 0.0689476 bar. 1 bar = 14.5038 psi."));
tool.faq.push(faq("When is this useful?", "Car tire pressures, scuba diving, hydraulic systems, and scientific calculations."));

export const PSI_BAR_CONVERTER_TOOLS = [tool];
