import { makeTool, faq } from "./types";

const tool = makeTool(
  "calculadora-porciones-pizza",
  "Pizza Portions Calculator",
  "cocina",
  "calculator",
  "Calculate how many pizzas to order based on people and slices per person.",
  [
    "pizza portions calculator",
    "how many pizzas for party",
    "calculadora porciones pizza",
    "cuántas pizzas pedir",
    "pizza slices per person",
  ],
  {
    title: "Pizza Portions Calculator | How Many Pizzas to Order | UtiliHub",
    description: "Free pizza portions calculator. People, slices per person, slices per pizza. Instant result. Browser-only.",
    summaryEs: "Calcula cuántas pizzas pedir según personas y porciones por persona.",
  },
);
tool.faq.push(
  faq(
    "How many slices per person?",
    "Adults often 2–4 slices. Kids 1–2. Adjust for appetite and other food.",
  ),
  faq(
    "Standard pizza sizes?",
    "Personal ~6 slices, medium 8, large 8–10. Use your pizza place's cut.",
  ),
);

export const PIZZA_PORTIONS_CALCULATOR_TOOLS = [tool];
