import { makeTool, faq } from "./types";

export const PALINDROME_TOOLS = [
  makeTool(
    "validador-palindromo",
    "Palindrome validator",
    "texto",
    "validator",
    "Check if a phrase is a palindrome, ignoring spaces, punctuation, and case. Empty text is not treated as a palindrome.",
    [
      "palindrome checker",
      "is it a palindrome",
      "palindrome validator",
      "validador de palindromos",
      "es un palindromo",
      "comprobar palindromo",
    ],
    {
      mode: "palindrome",
      title: "Palindrome Validator — A man a plan a canal Panama | UtiliHub",
      description:
        "Check if text is a palindrome, ignoring spaces, punctuation, and case. Empty input is not a palindrome. Runs in the browser.",
      summaryEs:
        "Comprueba si una frase es un palíndromo, ignorando espacios, signos de puntuación y mayúsculas.",
    },
  ),
];
PALINDROME_TOOLS[0].faq.push(
  faq(
    "How is a palindrome checked?",
    "The text is lowercased and spaces and punctuation are removed, then compared with its reverse. Example: \"A man, a plan, a canal: Panama!\" reads the same forwards and backwards, so it is a palindrome.",
  ),
  faq(
    "What about empty text?",
    "Empty input is not considered a palindrome, so no false positive is shown.",
  ),
);
