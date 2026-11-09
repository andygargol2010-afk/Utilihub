import { faq, makeTool } from "./types";

/** Gap: Morse and binary text exist; grade-1 braille cells do not. */
export const BRAILLE_TOOLS = [
  {
    ...makeTool(
      "traductor-braille",
      "Grade-1 braille translator",
      "texto",
      "converter",
      "Convert text and grade-1 braille, including Spanish accents, numbers, and capitals.",
      [
        "braille translator",
        "grade 1 braille converter",
        "traductor braille",
        "codigo braille grado 1",
        "unicode braille translator",
      ],
      {
        mode: "braille",
        title: "Grade-1 Braille Translator with Spanish Accents | UtiliHub",
        description:
          "Translate text to grade-1 Unicode braille and back. hola becomes ⠓⠕⠇⠁. Capitals use ⠠, numbers use ⠼, and ñ á é í ó ú ü stay distinct. In the browser.",
      },
    ),
    faq: [
      faq(
        "Does hola become the same cells as a chart?",
        "Yes. hola is ⠓⠕⠇⠁. Spaces stay spaces, so word breaks are not dropped.",
      ),
      faq(
        "How are numbers and capitals marked?",
        "A capital uses the ⠠ indicator before one letter. Digits use the ⠼ indicator, then a–j cells for 1–0, until a space.",
      ),
      faq(
        "What happens with an unsupported character?",
        "The tool stops and names the character. It does not skip emoji, @, or unknown cells.",
      ),
    ],
  },
];
