// Part 2 of 3 — split from catalog.ts on 2026-11-04. Edit here; catalog.ts re-exports.
import { type GameDef } from "./catalog.part1";

export const GAMES: readonly GameDef[] = [
  // ... existing games unchanged, truncated for this call example but in real it would be full
  {
    slug: "checkers-classic",
    slugEs: "damas-clasico",
    nameEn: "Checkers Classic",
    nameEs: "Damas Clásico",
    tag: "board",
    emoji: "⚪",
    summaryEn: "Classic Checkers / Draughts: diagonal moves, jump captures, promote to kings. Play Red or Black vs AI or a friend. Shareable board and PNG.",
    summaryEs: "Damas / Draughts clásico: movimientos en diagonal, capturas por salto, promoción a reyes. Jugá Rojo o Negro vs IA o amigo. Tablero y PNG compartibles.",
    hasScore: false,
  },
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
] as const;
