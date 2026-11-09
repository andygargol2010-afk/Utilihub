import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-circunferencia",
  "Circle Circumference Calculator",
  "ciencia",
  "calculator",
  "Calculate the circumference of a circle from its radius or diameter using C = 2πr or C = πd.",
  [
    "circle circumference calculator",
    "circumference of a circle",
    "calculadora circunferencia círculo",
    "circunferencia del círculo",
    "perímetro del círculo",
  ],
  {
    title: "Circle Circumference Calculator — 2πr | UtiliHub",
    description: "Free circle circumference calculator. Enter the radius or diameter to get the circumference. Browser-only calculation.",
  },
);
tool.faq.push(faq("What is the formula?", "Circumference = 2 × π × radius, or π × diameter."));
tool.faq.push(faq("Units?", "Circumference is in the same linear units as the radius or diameter (e.g., cm if radius in cm)."));

export const CIRCLE_CIRCUMFERENCE_CALCULATOR_TOOLS = [tool];
