import { makeTool } from "./types";

/** Gap: ISBN and Luhn exist; retail GTIN uses the GS1 weight, not Luhn. */
export const EAN_TOOLS = [
  makeTool(
    "validador-ean",
    "EAN and UPC check digit",
    "utilidades",
    "validator",
    "Calculate or check the GS1 digit for EAN-8, UPC-A, EAN-13, and GTIN-14.",
    [
      "ean 13 check digit calculator",
      "upc check digit validator",
      "calcular digito de control ean-13",
      "validador codigo de barras ean",
      "gtin check digit",
    ],
    {
      mode: "ean",
      title: "EAN-13 and UPC Check Digit Calculator | UtiliHub",
      description:
        "Calculate or verify the GS1 check digit for EAN-13, UPC-A, EAN-8, and GTIN-14. 5901234123457 is valid. Not the Luhn card algorithm. In the browser.",
    },
  ),
];
