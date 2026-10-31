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

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDeck(pairCount: number, seed?: number): Card[] {
  const icons = ICONS.slice(0, pairCount);
  const pairs = icons.flatMap((icon, i) => [
    { id: i * 2, icon, flipped: false, matched: false },
    { id: i * 2 + 1, icon, flipped: false, matched: false },
  ]);
  const rng = seed != null ? mulberry32(seed) : () => Math.random();
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j]!, pairs[i]!];
  }
  return pairs;
}

function updateUrl(sizeId: SizeId, seed: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("size", sizeId);
  url.searchParams.set("seed", String(seed));
  window.history.replaceState(null, "", url);
}

export function MemoryMatchClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [sizeId, setSizeId] = useState<SizeId>("4x4");
  const [seed, setSeed] = useState<number | null>(null);
  const size = SIZES.find((s) => s.id === sizeId) ?? SIZES[1];
  const [cards, setCards] = useState<Card[]>(() => buildDeck(size.pairs));
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [burst, setBurst] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sizeParam = params.get("size") as SizeId | null;
    const seedParam = params.get("seed");
    let initialSize: SizeId = "4x4";
    let initialSeed: number | null = null;
    if (sizeParam && SIZES.some((s) => s.id === sizeParam)) {
      initialSize = sizeParam;
    }
    if (seedParam) {
      const n = parseInt(seedParam, 10);
      if (!Number.isNaN(n) && n > 0) initialSeed = n;
    }
    if (initialSeed == null) {
      initialSeed = Math.floor(Math.random() * 1e9) + 1;
    }
    setSizeId(initialSize);
    setSeed(initialSeed);
    const s = SIZES.find((x) => x.id === initialSize) ?? SIZES[1];
    setCards(buildDeck(s.pairs, initialSeed));
    updateUrl(initialSize, initialSeed);
    setBest(readBestLow(`memory-match-classic-${initialSize}`));
  }, []);

  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length / 2, [cards]);
  const done = matchedCount === size.pairs;

  useEffect(() => {
    if (!done) return;
    setBest(writeBestLow(`memory-match-classic-${sizeId}`, moves));
  }, [done, moves, sizeId]);

  const reset = useCallback(() => {
    const nextSeed = Math.floor(Math.random() * 1e9) + 1;
    setSeed(nextSeed);
    setCards(buildDeck(size.pairs, nextSeed));
    setOpen([]);
    setMoves(0);
    setLocked(false);
    setBurst([]);
    updateUrl(sizeId, nextSeed);
  }, [size.pairs, sizeId]);

  const changeSize = (id: SizeId) => {
    const nextSeed = Math.floor(Math.random() * 1e9) + 1;
    setSizeId(id);
    setSeed(nextSeed);
    const s = SIZES.find((x) => x.id === id) ?? SIZES[1];
    setCards(buildDeck(s.pairs, nextSeed));
    setOpen([]);
    setMoves(0);
    setLocked(false);
    setBurst([]);
    updateUrl(id, nextSeed);
    setBest(readBestLow(`memory-match-classic-${id}`));
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

  const shareUrl = useCallback(async () => {
    if (seed != null) updateUrl(sizeId, seed);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [seed, sizeId]);

  const downloadPng = useCallback(() => {
    const cardSize = 72;
    const pad = 16;
    const headerH = 80;
    const footerH = 40;
    const cols = size.cols;
    const rows = size.rows;
    const w = pad * 2 + cols * cardSize + (cols - 1) * 8;
    const h = headerH + footerH + pad * 2 + rows * cardSize + (rows - 1) * 8;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#123528");
    bg.addColorStop(1, "#0a1c14");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Accent bar
    ctx.fillStyle = "#34d399";
    ctx.fillRect(0, 0, w, 8);

    // Header
    ctx.fillStyle = "#fef3c7";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Memoria de Pares" : "Memory Match", w / 2, 36);
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillStyle = "#a7f3d0";
    ctx.fillText(
      `${es ? "Movimientos" : "Moves"}: ${moves}  ·  ${es ? "Pares" : "Pairs"}: ${matchedCount}/${size.pairs}`,
      w / 2,
      62,
    );

    // Cards
    const startY = headerH + pad;
    cards.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = pad + col * (cardSize + 8);
      const y = startY + row * (cardSize + 8);
      const show = card.flipped || card.matched || done;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, cardSize, cardSize, 12);
      if (show) {
        ctx.fillStyle = card.matched ? "#fde68a" : "#ecfdf5";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#1f2937";
        ctx.font = "32px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(card.icon, x + cardSize / 2, y + cardSize / 2);
      } else {
        ctx.fillStyle = "#059669";
        ctx.fill();
        ctx.strokeStyle = "rgba(52,211,153,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "bold 14px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("UH", x + cardSize / 2, y + cardSize / 2);
      }
      ctx.restore();
    });

    // Footer branding
    ctx.fillStyle = "#6ee7b7";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("utilihub.app", w / 2, h - 18);

    const link = document.createElement("a");
    link.download = `memory-match-${sizeId}-${moves}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [cards, size, moves, matchedCount, done, es, sizeId]);

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
        <GameSecondaryButton onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir enlace" : "Share link"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={downloadPng}>
          {es ? "Descargar PNG" : "Download PNG"}
        </GameSecondaryButton>
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
