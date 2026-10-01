import { makeTool } from "./types";

/** Gap: iva-compra only adds tax to a net price. This tool extracts VAT from an inclusive price. */
export const VAT_EXTRACTOR_TOOLS = [
  makeTool(
    "quitar-iva",
    "Remove VAT from price",
    "hogar",
    "formula",
    "Extract the net price and VAT amount from a tax-inclusive price, or add VAT with common rate presets.",
    [
      "remove vat",
      "price without vat",
      "vat calculator",
      "quitar iva",
      "precio sin iva",
      "calcular iva incluido",
      "iva incluido",
    ],
    {
      mode: "vat-extractor",
      title: "Remove VAT from a price — net and tax | UtiliHub",
      description:
        "Calculate the price without VAT and the tax amount from an inclusive total. Presets for 21%, 19%, 16%, and 10.5%. Free in the browser.",
    },
  ),
];
