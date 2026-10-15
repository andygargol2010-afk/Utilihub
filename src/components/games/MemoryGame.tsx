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
  const [burst, setBurst] = useState<number[]>([]);

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
    setBurst([]);
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
          setBurst([a!, b!]);
          setCards((cur) =>
            cur.map((c, i) => (i === a || i === b ? { ...c, matched: true, flipped: true } : c)),
          );
          setOpen([]);
          window.setTimeout(() => setBurst([]), 500);
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
        .mem-scene { perspective: 900px; }
        .mem-card {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d; transition: transform 0.45s cubic-bezier(.2,.8,.2,1);
        }
        .mem-card.is-flipped { transform: rotateY(180deg); }
        .mem-face {
          position: absolute; inset: 0; border-radius: 1rem;
          backface-visibility: hidden; display: flex; align-items: center; justify-content: center;
        }
        .mem-back { transform: rotateY(180deg); }
        .mem-matched .mem-card { box-shadow: 0 0 0 2px rgba(251,191,36,0.75), 0 8px 20px rgba(0,0,0,0.35); }
        @keyframes mem-burst {
          0% { transform: scale(1); }
          40% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .mem-burst { animation: mem-burst 0.45s ease; }
        @keyframes mem-win-pop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .mem-win { animation: mem-win-pop 0.35s ease-out; }
      `}</style>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
          {es ? "Movimientos" : "Moves"}: <span className="tabular-nums text-white">{moves}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
          {es ? "Pares" : "Pairs"}:{" "}
          <span className="tabular-nums text-white">
            {matchedCount}/{ICONS.length}
          </span>
        </span>
        {best != null && (
          <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1">
            {es ? "Mejor" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
          </span>
        )}
        <GamePrimaryButton onClick={reset}>{es ? "Reiniciar" : "Restart"}</GamePrimaryButton>
      </div>

      {done && (
        <p className="mem-win text-base font-black text-amber-300 drop-shadow">
          {es ? `¡Completado en ${moves} movimientos!` : `Cleared in ${moves} moves!`}
        </p>
      )}

      <div
        className="grid grid-cols-4 gap-2.5 rounded-2xl border border-emerald-500/20 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.4)] sm:gap-3"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(52,211,153,0.15), transparent 50%), linear-gradient(145deg, #123528 0%, #0a1c14 100%)",
        }}
      >
        {cards.map((card, i) => {
          const show = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              type="button"
              disabled={show || locked || done}
              onClick={() => flip(i)}
              className={`mem-scene h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 ${card.matched ? "mem-matched" : ""} ${
                burst.includes(i) ? "mem-burst" : ""
              }`}
              aria-label={show ? card.icon : es ? "Carta boca abajo" : "Face-down card"}
            >
              <div className={`mem-card ${show ? "is-flipped" : ""}`}>
                <div
                  className="mem-face border border-emerald-400/30"
                  style={{
                    background:
                      "repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0 2px, transparent 2px 10px), linear-gradient(145deg, #059669, #064e3b)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.35)",
                  }}
                >
                  <span className="text-lg font-black tracking-widest text-white/85">UH</span>
                </div>
                <div
                  className="mem-face mem-back text-3xl border border-white/20"
                  style={{
                    background: card.matched
                      ? "linear-gradient(145deg, #fde68a, #f59e0b)"
                      : "linear-gradient(145deg, #ecfdf5, #6ee7b7)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  }}
                >
                  <span className="drop-shadow-sm">{card.icon}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
