import { makeTool } from "./types";

/** Gap: no IBAN checksum tool. Local MOD-97-10 plus country length, not a bank lookup. */
export const IBAN_TOOLS = [
  makeTool(
    "validador-iban",
    "IBAN validator",
    "utilidades",
    "text",
    "Check an IBAN with country length and the ISO 13616 MOD-97-10 remainder. Runs locally.",
    [
      "iban validator",
      "iban checksum mod 97",
      "validate iban country length",
      "validador iban",
      "comprobar iban modulo 97",
      "longitud iban espana",
    ],
    {
      mode: "iban",
      title: "IBAN Validator — MOD-97 Checksum and Country Length | UtiliHub",
      description:
        "Validate an IBAN locally: format, country length, and MOD-97-10 remainder. Does not contact a bank. Free in the browser.",
    },
  ),
];
