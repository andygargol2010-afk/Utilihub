// Part 2 of 3 — split from HangmanGame.tsx on 2026-11-04. Edit here; HangmanGame.tsx re-exports.
import { type Cat } from "./HangmanGame.part1";

export type Diff = "easy" | "normal" | "hard";

export const CATS: { id: Cat; en: string; es: string }[] = [
  { id: "random", en: "Random", es: "Aleatorio" },
  { id: "animals", en: "Animals", es: "Animales" },
  { id: "countries", en: "Countries", es: "Países" },
  { id: "food", en: "Food", es: "Comida" },
  { id: "tech", en: "Tech", es: "Tecnología" },
];

export const DIFFS: { id: Diff; en: string; es: string; max: number }[] = [
  { id: "easy", en: "Easy", es: "Fácil", max: 8 },
  { id: "normal", en: "Normal", es: "Normal", max: 6 },
  { id: "hard", en: "Hard", es: "Difícil", max: 4 },
];

export const WORDS: Record<Exclude<Cat, "random">, { en: string[]; es: string[] }> = {
  animals: {
    en: ["LION", "TIGER", "ELEPHANT", "GIRAFFE", "DOLPHIN", "PENGUIN", "KANGAROO", "ZEBRA", "PANDA", "EAGLE", "WHALE", "FOX", "BEAR", "WOLF"],
    es: ["LEON", "TIGRE", "ELEFANTE", "JIRAFA", "DELFIN", "PINGUINO", "CANGURO", "CEBRA", "PANDA", "AGUILA", "BALLENA", "ZORRO", "OSO", "LOBO"],
  },
  countries: {
    en: ["CANADA", "BRAZIL", "JAPAN", "FRANCE", "ITALY", "SPAIN", "MEXICO", "AUSTRALIA", "INDIA", "GERMANY", "ARGENTINA", "CHILE", "PERU", "PORTUGAL"],
    es: ["CANADA", "BRASIL", "JAPON", "FRANCIA", "ITALIA", "ESPANA", "MEXICO", "AUSTRALIA", "INDIA", "ALEMANIA", "ARGENTINA", "CHILE", "PERU", "PORTUGAL"],
  },
  food: {
    en: ["PIZZA", "SUSHI", "TACO", "BURGER", "PASTA", "SALAD", "STEAK", "CURRY", "APPLE", "BANANA", "RICE", "BREAD", "CHEESE", "SOUP"],
    es: ["PIZZA", "SUSHI", "TACO", "HAMBURGUESA", "PASTA", "ENSALADA", "BISTEC", "CURRY", "MANZANA", "PLATANO", "ARROZ", "PAN", "QUESO", "SOPA"],
  },
  tech: {
    en: ["REACT", "TYPESCRIPT", "BROWSER", "COMPONENT", "FUNCTION", "VARIABLE", "ALGORITHM", "INTERFACE", "ASYNC", "PROMISE", "HOOK", "STATE", "RENDER", "BUNDLE"],
    es: ["REACT", "TYPESCRIPT", "NAVEGADOR", "COMPONENTE", "FUNCION", "VARIABLE", "ALGORITMO", "INTERFAZ", "ASINCRONO", "PROMESA", "HOOK", "ESTADO", "RENDER", "BUNDLE"],
  },
};

export const ALL_EN = Object.values(WORDS).flatMap((w) => w.en);
export const ALL_ES = Object.values(WORDS).flatMap((w) => w.es);

export function pickWord(list: string[], seed?: number) {
  if (seed != null && list.length) {
    const i = Math.abs(seed) % list.length;
    return list[i]!;
  }
  return list[Math.floor(Math.random() * list.length)]!;
}
