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
        window.setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) => (i === a || i === b ? { ...c, matched: true, flipped: true } : c)),
          );
          setOpen([]);
        }, 280);
      } else {
        setLocked(true);
        window.setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)),
          );
          setOpen([]);
          setLocked(false);
        }, 850);
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <style>{`
        .mem-scene {
          perspective: 800px;
        }
        .mem-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        .mem-card.is-flipped {
          transform: rotateY(180deg);
        }
        .mem-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.75rem;
        }
        .mem-back {
          transform: rotateY(180deg);
        }
        .mem-matched .mem-back {
          box-shadow: 0 0 0 2px rgba(251,191,36,0.7), 0 6px 16px rgba(0,0,0,0.3);
          animation: mem-matched-pulse 0.7s ease-in-out 2;
        }
        @keyframes mem-matched-pulse {
          0%, 100% { transform: rotateY(180deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.06); }
        }
        @keyframes mem-win {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .mem-win { animation: mem-win 0.8s ease-in-out infinite; }
      `}</style>

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
        <p className="mem-win text-base font-black text-amber-300">
          {es ? `¡Completado en ${moves} movimientos!` : `Cleared in ${moves} moves!`}
        </p>
      )}

      <div
        className="grid grid-cols-4 gap-2.5 rounded-2xl p-3 sm:gap-3"
        style={{ background: "rgba(15,23,42,0.5)", width: "100%", maxWidth: 360 }}
      >
        {cards.map((card, i) => {
          const show = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              type="button"
              disabled={locked || done || card.matched}
              onClick={() => flip(i)}
              className={`mem-scene aspect-square w-full ${card.matched ? "mem-matched" : ""}`}
              aria-label={show ? card.icon : es ? "Carta" : "Card"}
            >
              <div className={`mem-card ${show ? "is-flipped" : ""}`}>
                <div className="mem-face bg-emerald-700/80 text-2xl shadow-md">❓</div>
                <div className="mem-face mem-back bg-slate-800 text-3xl shadow-md">{card.icon}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
