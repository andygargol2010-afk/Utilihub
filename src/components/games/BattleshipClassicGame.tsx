import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

export function BattleshipClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  return <div>{es ? "Hundir la flota" : "Battleship"} core coming in this run</div>;
}
