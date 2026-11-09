import { makeTool } from "./types";

/** Gap: CUIT and Spanish DNI letter exist. Chilean RUT uses a mod-11 series 2–7 and K. */
export const RUT_CHILE_TOOLS = [
  makeTool(
    "validador-rut-chile",
    "Chilean RUT validator",
    "utilidades",
    "validator",
    "Check or calculate the Chilean RUT check digit, including K, and format the number.",
    [
      "chilean rut validator",
      "rut check digit calculator",
      "chile run verifier",
      "validador rut chile",
      "digito verificador rut",
      "calcular rut chileno",
    ],
    {
      mode: "rut-chile",
      title: "Chilean RUT Validator — Check Digit and Format | UtiliHub",
      description:
        "Validate a Chilean RUT or calculate its check digit. 12.345.678-5 is valid. K is the remainder-10 digit. Nothing is uploaded.",
    },
  ),
];
