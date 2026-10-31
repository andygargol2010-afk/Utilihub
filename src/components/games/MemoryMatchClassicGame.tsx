import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const SIZES = [
  { id: "4x3", cols: 4, rows: 3, pairs: 6, labelEn: "4×3 (6 pairs)", labelEs: "4×3 (6 pares)" },
  { id: "4x4", cols: 4, rows: 4, pairs: 8, labelEn: "4×4 (8 pairs)", labelEs: "4×4 (8 pares)" },
  { id: "6x4", cols: 6, rows: 4, pairs: 12, labelEn: "6×4 (12 pairs)", labelEs: "6×4 (12 pares)" },
] as const;

type SizeId = (typeof SIZES)[number]["id"];

const ICONS = ["🍎", "🍋", "🍇", "🍒", "🥝", "🍑", "🍉", "🍍", "🍓", "🍌", "🍊", "🥭"];

type Card = { id: number; icon: string; flipped: boolean; matched: boolean };

function buildDeck(pairCount: number): Card[] {
  const icons = ICONS.slice(0, pairCount);
  const pairs = icons.flatMap((icon, i) => [
    { id: i * 2, icon, flipped: false, matched: false },
    { id: i * 2 + 1, icon, flipped: false, matched: false },
  ]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j]!, pairs[i]!];
  }
  return pairs;
}

export function MemoryMatchClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [sizeId, setSizeId] = useState<SizeId>("4x4");
  const size = SIZES.find((s) => s.id === sizeId) ?? SIZES[1];
  const [cards, setCards] = useState<Card[]>(() => buildDeck(size.pairs));
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [burst, setBurst] = useState<number[]>([]);

  useEffect(() => {
    setBest(readBestLow(`memory-match-classic-${sizeId}`));
  }, [sizeId]);

  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length / 2, [cards]);
  const done = matchedCount === size.pairs;

  useEffect(() => {
    if (!done) return;
    setBest(writeBestLow(`memory-match-classic-${sizeId}`, moves));
  }, [done, moves, sizeId]);

  const reset = useCallback(() => {
    setCards(buildDeck(size.pairs));
    setOpen([]);
    setMoves(0);
    setLocked(false);
    setBurst([]);
  }, [size.pairs]);

  const changeSize = (id: SizeId) => {
    setSizeId(id);
    const s = SIZES.find((x) => x.id === id) ?? SIZES[1];
    setCards(buildDeck(s.pairs));
    setOpen([]);
    setMoves(0);
    setLocked(false);
    setBurst([]);
  };

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
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-2">
      <style>{`
        .mmc-scene { perspective: 900px; }
        .mmc-card {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d; transition: transform 0.45s cubic-bezier(.2,.8,.2,1);
        }
        .mmc-card.is-flipped { transform: rotateY(180deg); }
        .mmc-face {
          position: absolute; inset: 0; border-radius: 0.75rem;
          backface-visibility: hidden; display: flex; align-items: center; justify-content: center;
        }
        .mmc-back { transform: rotateY(180deg); }
        .mmc-matched .mmc-card { box-shadow: 0 0 0 2px rgba(251,191,36,0.75), 0 6px 16px rgba(0,0,0,0.35); }
        @keyframes mmc-burst {
          0% { transform: scale(1); }
          40% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .mmc-burst { animation: mmc-burst 0.45s ease; }
        @keyframes mmc-win-pop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .mmc-win { animation: mmc-win-pop 0.35s ease-out; }
      `}</style>

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {SIZES.map((s) => (
          <GameSecondaryButton
            key={s.id}
            active={sizeId === s.id}
            onClick={() => changeSize(s.id)}
          >
            {es ? s.labelEs : s.labelEn}
          </GameSecondaryButton>
        ))}
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
          {es ? "Movimientos" : "Moves"}: <span className="tabular-nums text-white">{moves}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1">
          {es ? "Pares" : "Pairs"}:{" "}
          <span className="tabular-nums text-white">
            {matchedCount}/{size.pairs}
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
        <p className="mmc-win text-base font-black text-amber-300 drop-shadow">
          {es ? `¡Completado en ${moves} movimientos!` : `Cleared in ${moves} moves!`}
        </p>
      )}

      <div
        className="grid gap-2 rounded-2xl border border-emerald-500/20 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.4)] sm:gap-2.5 sm:p-3"
        style={{
          gridTemplateColumns: `repeat(${size.cols}, minmax(0, 1fr))`,
          background:
            "radial-gradient(circle at 30% 20%, rgba(52,211,153,0.15), transparent 50%), linear-gradient(145deg, #123528 0%, #0a1c14 100%)",
          maxWidth: size.cols >= 6 ? "100%" : "28rem",
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
              className={`mmc-scene aspect-square w-full ${card.matched ? "mmc-matched" : ""} ${
                burst.includes(i) ? "mmc-burst" : ""
              }`}
              aria-label={show ? card.icon : es ? "Carta boca abajo" : "Face-down card"}
            >
              <div className={`mmc-card ${show ? "is-flipped" : ""}`}>
                <div
                  className="mmc-face border border-emerald-400/30"
                  style={{
                    background:
                      "repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0 2px, transparent 2px 10px), linear-gradient(145deg, #059669, #064e3b)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.35)",
                  }}
                >
                  <span className="text-xs font-black tracking-widest text-white/85 sm:text-sm">UH</span>
                </div>
                <div
                  className="mmc-face mmc-back text-2xl border border-white/20 sm:text-3xl"
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
