import { makeTool } from "./types";

/** Gap: Luhn checks payment digits. This checks ISBN-10/13 and converts 978 forms. */
export const ISBN_VALIDATOR_TOOLS = [
  makeTool(
    "validador-isbn",
    "ISBN check digit validator",
    "texto",
    "text",
    "Validate an ISBN-10 or ISBN-13 check digit, hyphenate common English groups, and convert between 978 forms.",
    [
      "isbn validator",
      "isbn 13 check digit",
      "isbn 10 to isbn 13",
      "isbn hyphenator",
      "validate book isbn",
      "validador isbn",
      "digito de control isbn",
      "isbn 10 a isbn 13",
      "comprobar isbn",
      "guiones isbn",
    ],
    {
      mode: "isbn-validator",
      title: "ISBN Validator — Check Digit and 10/13 Convert | UtiliHub",
      description:
        "Check an ISBN-10 or ISBN-13, see the expected check digit, and convert 978 forms. Hyphens stay in the browser.",
    },
  ),
];
