import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton } from "./GameShell";

const ICONS = ["🍎", "🍋", "🍇", "🍒", "🥝", "🍑", "🍉", "🍍"];

type Card = { id: number; icon: string; flipped: boolean; matched: boolean };

function buildDeck(): Card[] {
  const pairs = ICONS.flatMap((icon, i) => [
    { id: i * 2, icon, flipped: false, matched: false },
    { id: i * 2 + 1, icon, flipped: false, matched: false },
  ]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j]!, pairs[i]!];
  }
  return pairs;
}

export function MemoryGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    setBest(readBestLow("memory"));
  }, []);

  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length / 2, [cards]);
  const done = matchedCount === ICONS.length;

  useEffect(() => {
    if (!done) return;
    setBest(writeBestLow("memory", moves));
  }, [done, moves]);

  const reset = useCallback(() => {
    setCards(buildDeck());
    setOpen([]);
    setMoves(0);
    setLocked(false);
  }, []);

  const flip = (index: number) => {
    if (locked || done) return;
    const card = cards[index];
    if (!card || card.flipped || card.matched) return;
    if (open.includes(index)) return;

    const nextOpen = [...open, index];
    const nextCards = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c));
    setCards(nextCards);

    if (nextOpen.length === 1) {
      setOpen(nextOpen);
      return;
    }

    if (nextOpen.length === 2) {
      setMoves((m) => m + 1);
      setOpen(nextOpen);
      const [a, b] = nextOpen;
      const ca = nextCards[a!];
      const cb = nextCards[b!];
      if (ca && cb && ca.icon === cb.icon) {
        setCards((cur) =>
          cur.map((c, i) => (i === a || i === b ? { ...c, matched: true, flipped: true } : c)),
        );
        setOpen([]);
      } else {
        setLocked(true);
        window.setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)),
          );
          setOpen([]);
          setLocked(false);
        }, 700);
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span>
          {es ? "Movimientos" : "Moves"}: <span className="tabular-nums text-white">{moves}</span>
        </span>
        <span>
          {es ? "Pares" : "Pairs"}:{" "}
          <span className="tabular-nums text-white">
            {matchedCount}/{ICONS.length}
          </span>
        </span>
        {best != null && (
          <span>
            {es ? "Mejor" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
          </span>
        )}
        <GamePrimaryButton onClick={reset}>{es ? "Reiniciar" : "Restart"}</GamePrimaryButton>
      </div>

      {done && (
        <p className="text-sm font-bold text-emerald-300">
          {es ? `¡Completado en ${moves} movimientos!` : `Cleared in ${moves} moves!`}
        </p>
      )}

      <div
        className="grid grid-cols-4 gap-2.5 rounded-2xl p-3 sm:gap-3"
        style={{ background: "linear-gradient(145deg, #1a3a2a 0%, #0f2418 100%)" }}
      >
        {cards.map((card, i) => {
          const show = card.flipped || card.matched;
          const matched = card.matched;
          return (
            <button
              key={card.id}
              type="button"
              disabled={show || locked || done}
              onClick={() => flip(i)}
              className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-xl text-3xl transition-transform active:scale-95 sm:h-20 sm:w-20"
              style={
                matched
                  ? {
                      background: "linear-gradient(145deg, #fde68a, #fbbf24)",
                      boxShadow: "0 0 0 2px rgba(251,191,36,0.6), 0 4px 12px rgba(0,0,0,0.25)",
                    }
                  : show
                    ? {
                        background: "linear-gradient(145deg, #ecfdf5, #a7f3d0)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      }
                    : {
                        background: "linear-gradient(145deg, #34d399, #059669)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 8px rgba(0,0,0,0.3)",
                      }
              }
              aria-label={show ? card.icon : es ? "Carta boca abajo" : "Face-down card"}
            >
              {show ? (
                <span className="drop-shadow-sm">{card.icon}</span>
              ) : (
                <span className="text-2xl font-black text-white/90" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
