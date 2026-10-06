import { makeTool } from "./types";

/** Gap: Morse and binary encode symbols; this spells letters with the ICAO word list. */
export const NATO_TOOLS = [
  makeTool(
    "traductor-fonetico-otan",
    "NATO phonetic alphabet translator",
    "texto",
    "text",
    "Spell letters and digits with the ICAO/NATO phonetic alphabet, including niner for 9.",
    [
      "nato phonetic alphabet converter",
      "icao spelling alphabet translator",
      "spell call sign phonetic",
      "traductor alfabeto fonetico otan",
      "alfabeto icao niner",
      "deletrear indicativo fonetico",
    ],
    {
      mode: "nato",
      title: "NATO Phonetic Alphabet Translator — ICAO Spelling | UtiliHub",
      description:
        "Spell a call sign or plate with the ICAO alphabet locally. Alfa through Zulu, with Tree and Niner, ready to copy.",
    },
  ),
];
