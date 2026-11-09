// Part 2 of 3 — split from FormulaMemoryGame.tsx on 2026-11-04. Edit here; FormulaMemoryGame.tsx re-exports.
import type { GameLocale } from "@/lib/games/catalog";
import { type Topic } from "./FormulaMemoryGame.part1";

export type PairDef = {
  id: string;
  topic: Exclude<Topic, "all">;
  nameEn: string;
  nameEs: string;
  formula: string;
};

export const PAIRS: PairDef[] = [
  { id: "fma", topic: "physics", nameEn: "Newton's 2nd law", nameEs: "2.ª ley de Newton", formula: "F = m·a" },
  { id: "emc", topic: "physics", nameEn: "Mass–energy", nameEs: "Masa–energía", formula: "E = mc²" },
  { id: "vdt", topic: "physics", nameEn: "Average speed", nameEs: "Velocidad media", formula: "v = d/t" },
  { id: "ohm", topic: "physics", nameEn: "Ohm's law", nameEs: "Ley de Ohm", formula: "V = I·R" },
  { id: "pyth", topic: "geometry", nameEn: "Pythagoras", nameEs: "Pitágoras", formula: "a² + b² = c²" },
  { id: "circ", topic: "geometry", nameEn: "Circle area", nameEs: "Área del círculo", formula: "A = πr²" },
  { id: "tri", topic: "geometry", nameEn: "Triangle area", nameEs: "Área del triángulo", formula: "A = ½bh" },
  { id: "sph", topic: "geometry", nameEn: "Sphere volume", nameEs: "Volumen de la esfera", formula: "V = ⁴⁄₃πr³" },
  { id: "si", topic: "finance", nameEn: "Simple interest", nameEs: "Interés simple", formula: "I = P·r·t" },
  { id: "ci", topic: "finance", nameEn: "Compound interest", nameEs: "Interés compuesto", formula: "A = P(1+r)ⁿ" },
  { id: "roi", topic: "finance", nameEn: "Return on investment", nameEs: "Retorno de inversión", formula: "ROI = (G−C)/C" },
  { id: "pct", topic: "finance", nameEn: "Percentage change", nameEs: "Cambio porcentual", formula: "% = (N−O)/O·100" },
];

export type Card = {
  key: string;
  pairId: string;
  face: "name" | "formula";
  text: string;
  flipped: boolean;
  matched: boolean;
};

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function buildDeck(topic: Topic, locale: GameLocale): Card[] {
  const pool = PAIRS.filter((p) => (topic === "all" ? true : p.topic === topic));
  const chosen = shuffle(pool).slice(0, Math.min(6, pool.length));
  const cards: Card[] = [];
  for (const p of chosen) {
    const name = locale === "es" ? p.nameEs : p.nameEn;
    cards.push({
      key: `${p.id}-n`,
      pairId: p.id,
      face: "name",
      text: name,
      flipped: false,
      matched: false,
    });
    cards.push({
      key: `${p.id}-f`,
      pairId: p.id,
      face: "formula",
      text: p.formula,
      flipped: false,
      matched: false,
    });
  }
  return shuffle(cards);
}
