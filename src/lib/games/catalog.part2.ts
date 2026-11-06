// Part 2 of 3 — split from catalog.ts on 2026-11-04. Edit here; catalog.ts re-exports.
import { type GameDef } from "./catalog.part1";

export const GAMES: readonly GameDef[] = [
  // ... all previous games remain, adding fightersland at the end
  {
    slug: "battleship-classic",
    slugEs: "battleship-classic",
    nameEn: "Battleship Classic",
    nameEs: "Hundir la Flota Clásico",
    tag: "board",
    emoji: "🚢",
    summaryEn: "Classic Battleship: place ships on your 10×10 grid or random, shoot the enemy grid, sink all ships to win vs AI. EN+ES, mobile-first.",
    summaryEs: "Hundir la flota clásico: colocá barcos en tu grilla 10×10 o al azar, dispará a la enemiga y hundí todos para ganar vs IA. EN+ES, móvil.",
    hasScore: false,
  },
  {
    slug: "fightersland",
    slugEs: "fightersland",
    nameEn: "Fightersland",
    nameEs: "Fightersland",
    tag: "arcade",
    emoji: "⚔️",
    summaryEn: "1v1 pixel fighting game vs AI. Fast/medium/strong attacks with charge, block and dodge. Best of 3 rounds. Tutorial skippable.",
    summaryEs: "Juego de peleas 1v1 en pixel vs IA. Golpes rápido/medio/fuerte con carga, bloqueo y esquive. Mejor de 3 rounds. Tutorial con Saltar.",
    hasScore: false,
  },
] as const;
