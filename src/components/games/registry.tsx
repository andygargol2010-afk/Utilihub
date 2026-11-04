import { Suspense } from "react";
import type { GameDef, GameLocale } from "@/lib/games/catalog";
import { MAP } from "./registry.part2";

export function GamePlayer({ game, locale = "en" }: { game: GameDef; locale?: GameLocale }) {
  const Comp = MAP[game.slug] ?? MAP[game.slugEs];
  if (!Comp) {
    return (
      <p className="py-16 text-center text-sm font-semibold text-emerald-200/80">
        {locale === "es" ? "Juego no disponible." : "Game not available."}
      </p>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md py-8">
          <div className="skeleton mx-auto h-48 w-full max-w-sm rounded-2xl" />
          <p className="mt-4 text-center text-xs text-white/50">
            {locale === "es" ? "Cargando…" : "Loading…"}
          </p>
        </div>
      }
    >
      <Comp locale={locale} />
    </Suspense>
  );
}
