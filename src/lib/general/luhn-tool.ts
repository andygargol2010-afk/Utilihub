import { makeTool } from "./types";

/** Gap: ISBN checks book digits. This checks a Luhn payload (cards, IMEI) and names the expected check digit. */
export const LUHN_TOOLS = [
  makeTool(
    "validador-luhn",
    "Luhn check digit validator",
    "seguridad",
    "validator",
    "Check a Luhn digit string locally, guess the card brand, and show the expected check digit.",
    [
      "luhn validator",
      "luhn check digit",
      "credit card checksum",
      "validate card number luhn",
      "validador luhn",
      "digito de control luhn",
      "comprobar tarjeta luhn",
      "imei luhn check",
    ],
    {
      mode: "luhn-validator",
      title: "Luhn Check Digit Validator — Local Card Checksum | UtiliHub",
      description:
        "Paste 4111 1111 1111 1111 and see a valid Visa checksum. A flipped last digit shows the expected check digit. Nothing is uploaded.",
    },
  ),
];
