import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { type Topic } from "./FormulaMemoryGame.part1";
import { type Card, buildDeck } from "./FormulaMemoryGame.part2";

export function FormulaMemoryGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [topic, setTopic] = useState<Topic>("all");
  const [cards, setCards] = useState<Card[]>(() => buildDeck("all", locale));
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    setBest(readBestLow("formula-memory"));
  }, []);

  const pairTotal = useMemo(() => cards.length / 2, [cards.length]);
  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length / 2, [cards]);
  const done = pairTotal > 0 && matchedCount === pairTotal;

  useEffect(() => {
    if (!done) return;
    setBest(writeBestLow("formula-memory", moves));
  }, [done, moves]);

  const reset = useCallback(
    (nextTopic: Topic = topic) => {
      setCards(buildDeck(nextTopic, locale));
      setOpen([]);
      setMoves(0);
      setLocked(false);
    },
    [locale, topic],
  );

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
      if (ca && cb && ca.pairId === cb.pairId && ca.face !== cb.face) {
        window.setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) => (i === a || i === b ? { ...c, matched: true, flipped: true } : c)),
          );
          setOpen([]);
        }, 320);
      } else {
        setLocked(true);
        window.setTimeout(() => {
          setCards((cur) =>
            cur.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)),
          );
          setOpen([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4">
      <style>{`
        .fm-scene { perspective: 900px; }
        .fm-card {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.45s cubic-bezier(0.4, 0.2, 0.2, 1);
        }
        .fm-card.is-flipped { transform: rotateY(180deg); }
        .fm-face {
          position: absolute; inset: 0;
          backface-visibility: hidden; -webkit-backface-visibility: hidden;
          display: flex; align-items: center; justify-content: center;
          border-radius: 0.85rem;
          padding: 0.35rem;
          text-align: center;
        }
        .fm-back { transform: rotateY(180deg); }
        .fm-matched .fm-back {
          box-shadow: 0 0 0 2px rgba(251,191,36,0.75), 0 6px 16px rgba(0,0,0,0.3);
        }
        @keyframes fm-win {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .fm-win { animation: fm-win 0.85s ease-in-out infinite; }
      `}</style>

      <div className="flex w-full flex-wrap justify-center gap-2">
        {(
          [
            ["all", es ? "Todas" : "All"],
            ["physics", es ? "Física" : "Physics"],
            ["geometry", es ? "Geometría" : "Geometry"],
            ["finance", es ? "Finanzas" : "Finance"],
          ] as const
        ).map(([key, label]) => (
          <GameSecondaryButton
            key={key}
            active={topic === key}
            onClick={() => {
              setTopic(key);
              reset(key);
            }}
          >
            {label}
          </GameSecondaryButton>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-emerald-100/80">
        <span>
          {es ? "Movimientos" : "Moves"}:{" "}
          <span className="tabular-nums text-white">{moves}</span>
        </span>
        <span>
          {es ? "Pares" : "Pairs"}:{" "}
          <span className="tabular-nums text-white">
            {matchedCount}/{pairTotal}
          </span>
        </span>
        {best != null && (
          <span>
            {es ? "Mejor" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
          </span>
        )}
        <GamePrimaryButton onClick={() => reset()}>{es ? "Reiniciar" : "Restart"}</GamePrimaryButton>
      </div>

      {done && (
        <p className="fm-win text-base font-black text-amber-300">
          {es ? `¡Completado en ${moves} movimientos!` : `Cleared in ${moves} moves!`}
        </p>
      )}

      <div
        className="grid w-full grid-cols-3 gap-2 rounded-2xl p-3 sm:grid-cols-4 sm:gap-3"
        style={{ background: "linear-gradient(145deg, #1a2a3a 0%, #0f1824 100%)" }}
      >
        {cards.map((card, i) => {
          const show = card.flipped || card.matched;
          return (
            <button
              key={card.key}
              type="button"
              disabled={show || locked || done}
              onClick={() => flip(i)}
              className={`fm-scene h-24 w-full min-w-0 sm:h-28 ${card.matched ? "fm-matched" : ""}`}
              aria-label={show ? card.text : es ? "Carta boca abajo" : "Face-down card"}
            >
              <div className={`fm-card ${show ? "is-flipped" : ""}`}>
                <div
                  className="fm-face"
                  style={{
                    background: "linear-gradient(145deg, #38bdf8, #0284c7)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  <span className="text-xl font-black text-white/90">∫</span>
                </div>
                <div
                  className="fm-face fm-back"
                  style={{
                    background: card.matched
                      ? "linear-gradient(145deg, #fde68a, #fbbf24)"
                      : card.face === "formula"
                        ? "linear-gradient(145deg, #ecfdf5, #a7f3d0)"
                        : "linear-gradient(145deg, #eff6ff, #bfdbfe)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  <span
                    className={`leading-tight ${
                      card.face === "formula"
                        ? "font-mono text-xs font-bold text-slate-900 sm:text-sm"
                        : "text-[11px] font-bold text-slate-900 sm:text-xs"
                    }`}
                  >
                    {card.text}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/50">
        {es
          ? "Emparejá el nombre de la fórmula con su ecuación. Menos movimientos = mejor."
          : "Match each formula name with its equation. Fewer moves is better."}
      </p>
    </div>
  );
}
