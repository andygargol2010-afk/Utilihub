// Part 1 of 3 — split from GameShell.tsx on 2026-11-04. Edit here; GameShell.tsx re-exports.
import type { ReactNode } from "react";
import type { GameDef, GameLocale } from "@/lib/games/catalog";

export type Props = {
  game: GameDef;
  locale?: GameLocale;
  children: ReactNode;
  toolbar?: ReactNode;
  status?: ReactNode;
};
