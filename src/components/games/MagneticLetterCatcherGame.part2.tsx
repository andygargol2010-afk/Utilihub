// Part 2 of 3 — split from MagneticLetterCatcherGame.tsx on 2026-11-04. Edit here; MagneticLetterCatcherGame.tsx re-exports.
import type { GameLocale } from "@/lib/games/catalog";

export type Particle = {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  caught: boolean;
  targetX: number;
  targetY: number;
  order: number;
  trail: { x: number; y: number }[];
};

export type Confetti = { x: number; y: number; vx: number; vy: number; life: number; color: string };

export interface Props {
  locale?: GameLocale;
}

export const BEST_KEY = "utilihub-magnetic-letter-best";
export const CANVAS_W = 480;
export const CANVAS_H = 340;
