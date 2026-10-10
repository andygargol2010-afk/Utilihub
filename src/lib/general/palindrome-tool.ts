import { makeTool } from "./types";

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
    },
  ),
];
