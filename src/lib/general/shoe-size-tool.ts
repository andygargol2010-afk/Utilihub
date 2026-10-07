import { makeTool } from "./types";

/** Gap: no EU/UK/US/cm shoe-size chart. Local retail Mondopoint table, not a brand fit. */
export const SHOE_SIZE_TOOLS = [
  makeTool(
    "conversor-tallas-zapatos",
    "Shoe size converter",
    "conversiones",
    "text",
    "Convert adult shoe size between EU, UK, US men, US women, and foot length in cm.",
    [
      "shoe size converter",
      "eu to us shoe size",
      "uk to eu shoe size chart",
      "conversor tallas zapatos",
      "talla zapatos eu a us",
      "equivalencia tallas zapatos uk",
    ],
    {
      mode: "shoe-size",
      title: "Shoe Size Converter — EU, UK, US, and cm | UtiliHub",
      description:
        "Convert adult shoe sizes between EU, UK, US men, US women, and foot length. Local retail chart, not a brand fit. Free in the browser.",
    },
  ),
];
