import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-celsius-kelvin",
  "Celsius to Kelvin Converter",
  "ciencia",
  "converter",
  "Convert Celsius to Kelvin and back. Exact scientific conversion (K = °C + 273.15). Runs fully in the browser.",
  [
    "celsius to kelvin",
    "celsius kelvin converter",
    "grados celsius a kelvin",
    "conversor celsius kelvin",
    "temperature kelvin",
  ],
  {
    title: "Celsius to Kelvin Converter — °C ↔ K | UtiliHub",
    description: "Free Celsius to Kelvin converter. Convert °C to K instantly with the exact offset. Local, private, no signup.",
    summaryEs: "Convierte grados Celsius a Kelvin y viceversa. Conversión científica exacta (K = °C + 273.15).",
  },
);
tool.faq.push(
  faq(
    "How do I convert Celsius to Kelvin?",
    "Add 273.15 to the Celsius temperature: K = °C + 273.15.",
  ),
);
tool.faq.push(
  faq(
    "Is absolute zero 0 K?",
    "Yes. Absolute zero is 0 K, which equals -273.15 °C.",
  ),
);

export const CELSIUS_KELVIN_CONVERTER_TOOLS = [tool];
