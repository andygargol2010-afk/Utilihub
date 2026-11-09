import { makeTool, faq } from "./types";

const tool = makeTool(
  "conversor-celsius-a-fahrenheit",
  "Celsius to Fahrenheit Converter",
  "conversiones",
  "converter",
  "Convert temperatures between Celsius and Fahrenheit instantly. Simple bidirectional converter that runs fully in the browser.",
  [
    "celsius to fahrenheit",
    "fahrenheit to celsius",
    "conversor celsius fahrenheit",
    "temperature converter",
    "convert c to f",
    "convertidor temperatura",
  ],
  {
    title: "Celsius to Fahrenheit Converter — Temperature Converter | UtiliHub",
    description: "Free Celsius Fahrenheit converter. Convert °C to °F and vice versa instantly. Local, private, no signup.",
    summaryEs: "Convierte temperaturas entre Celsius y Fahrenheit al instante.",
  },
);
tool.faq.push(
  faq(
    "How do I convert Celsius to Fahrenheit?",
    "°F = (°C × 9/5) + 32.",
  ),
);
tool.faq.push(
  faq(
    "How do I convert Fahrenheit to Celsius?",
    "°C = (°F − 32) × 5/9.",
  ),
);

export const CELSIUS_FAHRENHEIT_CONVERTER_TOOLS = [tool];
