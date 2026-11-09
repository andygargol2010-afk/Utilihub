import { makeTool } from "./types";

/** Gap: CUIT and IBAN exist; Spanish DNI/NIE letter (mod 23, X/Y/Z) does not. */
export const DNI_LETTER_TOOLS = [
  makeTool(
    "letra-dni-nie",
    "Spanish DNI and NIE letter",
    "utilidades",
    "text",
    "Calculate or check the control letter of a Spanish DNI or NIE.",
    [
      "spanish dni letter calculator",
      "nie check letter",
      "calcular letra del dni",
      "letra nie",
      "digito control dni",
    ],
    {
      mode: "dni-letter",
      title: "Spanish DNI and NIE Letter Calculator | UtiliHub",
      description:
        "Get the control letter for a Spanish DNI or NIE. 12345678 is Z. X1234567 is L. Checks a letter you already have. Runs in the browser.",
    },
  ),
];
