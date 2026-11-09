import { makeTool } from "./types";

/** Gap: coffee ratio and baker's percent do not encode rice absorption by variety. */
export const RICE_TOOLS = [
  makeTool(
    "calculadora-arroz",
    "Rice water ratio",
    "cocina",
    "calculator",
    "Estimate absorption-method water and cooked weight for white, basmati, jasmine, sushi, brown, and parboiled rice.",
    [
      "rice water ratio",
      "rice to water calculator",
      "how much water for rice",
      "basmati rice water ratio",
      "proporcion arroz agua",
      "calculadora de arroz",
      "cuanta agua para el arroz",
      "proporcion arroz basmati",
    ],
    {
      mode: "rice",
      title: "Rice Water Ratio Calculator — White, Basmati, Brown | UtiliHub",
      description:
        "Find absorption-method water and cooked weight for white, basmati, jasmine, sushi, brown, and parboiled rice. Zero grams does not invent a pot. Runs locally.",
    },
  ),
];
