// Part 2 of 3 — split from ChoiceStoryJourney.tsx on 2026-11-04. Edit here; ChoiceStoryJourney.tsx re-exports.
import { type Locale } from "./ChoiceStoryJourney.part1";

export type Choice = { text: Record<Locale, string>; next: string };
export type Stage = { id: string; text: Record<Locale, string>; choices: Choice[] };
export type Ending = { id: string; title: Record<Locale, string>; summary: Record<Locale, string>; accent: string };

export const STAGES: Stage[] = [
  {
    id: "start",
    text: {
      en: "You stand at the edge of an ancient forest. Two paths open before you.",
      es: "Estás al borde de un bosque antiguo. Dos caminos se abren ante ti.",
    },
    choices: [
      { text: { en: "Take the sunlit path", es: "Tomar el camino iluminado" }, next: "sunlit" },
      { text: { en: "Enter the shadowed trail", es: "Entrar en el sendero sombrío" }, next: "shadow" },
    ],
  },
  {
    id: "sunlit",
    text: {
      en: "The path glows. A wise traveler offers guidance or a shortcut.",
      es: "El camino brilla. Un viajero sabio ofrece guía o un atajo.",
    },
    choices: [
      { text: { en: "Accept the guidance", es: "Aceptar la guía" }, next: "guide" },
      { text: { en: "Take the shortcut alone", es: "Tomar el atajo solo" }, next: "shortcut" },
    ],
  },
  {
    id: "shadow",
    text: {
      en: "Darkness deepens. You hear distant music or see a faint light.",
      es: "La oscuridad se profundiza. Oyes música lejana o ves una luz tenue.",
    },
    choices: [
      { text: { en: "Follow the music", es: "Seguir la música" }, next: "music" },
      { text: { en: "Head toward the light", es: "Ir hacia la luz" }, next: "light" },
    ],
  },
  {
    id: "guide",
    text: {
      en: "The traveler shares old maps. You learn secrets of the land.",
      es: "El viajero comparte mapas antiguos. Aprendes secretos de la tierra.",
    },
    choices: [{ text: { en: "Continue to the clearing", es: "Continuar al claro" }, next: "end-discovery" }],
  },
  {
    id: "shortcut",
    text: {
      en: "The shortcut is rough but fast. You reach a crossroads quickly.",
      es: "El atajo es áspero pero rápido. Llegas pronto a un cruce.",
    },
    choices: [{ text: { en: "Press onward", es: "Seguir adelante" }, next: "end-return" }],
  },
  {
    id: "music",
    text: {
      en: "The music leads to a hidden grove of glowing flowers.",
      es: "La música lleva a un claro oculto de flores brillantes.",
    },
    choices: [{ text: { en: "Rest and listen", es: "Descansar y escuchar" }, next: "end-mystery" }],
  },
  {
    id: "light",
    text: {
      en: "The light is a lantern left by someone who came before.",
      es: "La luz es un farol dejado por alguien que vino antes.",
    },
    choices: [{ text: { en: "Take the lantern", es: "Tomar el farol" }, next: "end-discovery" }],
  },
];

export const ENDINGS: Record<string, Ending> = {
  "end-discovery": {
    id: "end-discovery",
    title: { en: "Discovery", es: "Descubrimiento" },
    summary: {
      en: "You uncover ancient knowledge and leave with new purpose.",
      es: "Descubres conocimiento antiguo y partes con un nuevo propósito.",
    },
    accent: "#22d3ee",
  },
  "end-return": {
    id: "end-return",
    title: { en: "Return Home", es: "Regreso a Casa" },
    summary: {
      en: "The journey was short but memorable. You return wiser.",
      es: "El viaje fue corto pero memorable. Regresas más sabio.",
    },
    accent: "#a78bfa",
  },
  "end-mystery": {
    id: "end-mystery",
    title: { en: "Mystery", es: "Misterio" },
    summary: {
      en: "The grove holds secrets still. You stay to unravel them.",
      es: "El claro guarda secretos aún. Te quedas para desentrañarlos.",
    },
    accent: "#f472b6",
  },
};

export function encodePath(ids: string[]): string {
  return ids.join(">");
}

export function decodePath(s: string | null): string[] {
  if (!s) return ["start"];
  return s.split(">").filter(Boolean);
}
