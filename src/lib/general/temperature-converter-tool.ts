import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-temperatura",
  "Temperature Converter",
  "conversiones",
  "converter",
  "Convert temperatures between Celsius, Fahrenheit, and Kelvin instantly.",
  [
    "temperature converter",
    "celsius to fahrenheit",
    "fahrenheit to celsius",
    "kelvin converter",
    "conversor de temperatura",
    "celsius a fahrenheit",
    "conversor celsius fahrenheit",
  ],
  {
    title: "Temperature Converter — Celsius, Fahrenheit, Kelvin | UtiliHub",
    description: "Free online temperature converter. Switch between °C, °F, and K with accurate formulas. Fast, no signup, runs in your browser.",
  },
);
tool.faq.push(faq("What is the formula for Celsius to Fahrenheit?", "°F = (°C × 9/5) + 32."));
tool.faq.push(faq("What is absolute zero?", "0 K = −273.15 °C = −459.67 °F. The converter handles it correctly."));

export const TEMPERATURE_CONVERTER_TOOLS = [tool];
