import { makeTool } from "./types";

export const CURRENCY_CONVERTER_TOOLS = [
  makeTool(
    "conversor-divisas",
    "Currency converter",
    "conversiones",
    "converter",
    "Convert amounts between currencies using a custom exchange rate.",
    ["currency converter", "conversor de monedas", "exchange rate calculator", "divisas", "conversor divisas"],
    {
      title: "Currency converter — free online | UtiliHub",
      description: "Convert any amount using your own exchange rate. Instant results, no signup, runs in the browser.",
    }
  ),
];
