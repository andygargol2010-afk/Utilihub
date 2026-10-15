import { useCallback, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton } from "./GameShell";

const SIZE = 5;

type Board = boolean[]; // true = on (lit)

function idx(r: number, c: number) {
  return r * SIZE + c;
}

function neighbors(i: number): number[] {
  const r = Math.floor(i / SIZE);
  const c = i % SIZE;
  const out = [i];
  if (r > 0) out.push(idx(r - 1, c));
  if (r < SIZE - 1) out.push(idx(r + 1, c));
  if (c > 0) out.push(idx(r, c - 1));
  if (c < SIZE - 1) out.push(idx(r, c + 1));
  return out;
}

function toggleAt(board: Board, i: number): Board {
  const next = board.slice();
  for (const n of neighbors(i)) next[n] = !next[n];
  return next;
}

function randomSolvable(): Board {
  let board: Board = Array(SIZE * SIZE).fill(false);
  const moves = 8 + Math.floor(Math.random() * 12);
  for (let k = 0; k < moves; k++) {
    const i = Math.floor(Math.random() * board.length);
    board = toggleAt(board, i);
  }
  if (board.every((b) => !b)) return randomSolvable();
  return board;
}

export function LightsOutGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState<Board>(() => randomSolvable());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [pulse, setPulse] = useState<number | null>(null);

  const litCount = useMemo(() => board.filter(Boolean).length, [board]);
  const progress = ((SIZE * SIZE - litCount) / (SIZE * SIZE)) * 100;

  const reset = useCallback(() => {
    setBoard(randomSolvable());
    setMoves(0);
    setWon(false);
    setPulse(null);
  }, []);

  const play = useCallback(
    (i: number) => {
      if (won) return;
      setPulse(i);
      window.setTimeout(() => setPulse((p) => (p === i ? null : p)), 320);
      const next = toggleAt(board, i);
      setBoard(next);
      setMoves((m) => m + 1);
      if (next.every((b) => !b)) setWon(true);
    },
    [board, won],
  );

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5">
      <style>{`
        @keyframes lo-pulse {
          0% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.55); }
          100% { box-shadow: 0 0 0 14px rgba(251, 191, 36, 0); }
        }
        .lo-pulse { animation: lo-pulse 0.32s ease-out; }
        @keyframes lo-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.12); }
        }
        .lo-lit { animation: lo-glow 2.4s ease-in-out infinite; }
      `}</style>

      <div className="flex w-full flex-wrap items-center justify-center gap-3 text-sm font-semibold text-amber-100/90">
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1">
          {es ? "Movimientos" : "Moves"}: <span className="tabular-nums text-white">{moves}</span>
        </span>
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1">
          {es ? "Encendidas" : "Lit"}: <span className="tabular-nums text-white">{litCount}</span>
        </span>
      </div>

      <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {won && (
        <p className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-1.5 text-sm font-bold text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.35)]">
          {es ? `¡Apagaste todas en ${moves} movimientos!` : `All lights out in ${moves} moves!`}
        </p>
      )}

      <div
        className="relative rounded-3xl border border-amber-500/20 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.12), transparent 55%), linear-gradient(165deg, #1a1520 0%, #0c0a12 100%)",
        }}
      >
        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
          role="grid"
          aria-label="Lights Out"
        >
          {board.map((on, i) => (
            <button
              key={i}
              type="button"
              role="gridcell"
              aria-pressed={on}
              disabled={won}
              onClick={() => play(i)}
              className={`aspect-square h-12 w-12 rounded-xl border transition duration-150 active:scale-95 sm:h-14 sm:w-14 ${
                pulse === i ? "lo-pulse" : ""
              } ${
                on
                  ? "lo-lit border-amber-300/70 bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-[0_0_22px_rgba(251,191,36,0.55),inset_0_2px_4px_rgba(255,255,255,0.45)]"
                  : "border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 shadow-[inset_0_2px_6px_rgba(0,0,0,0.65)] hover:from-slate-700 hover:to-slate-900"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="max-w-xs text-center text-xs text-white/50">
        {es
          ? "Tocá una casilla para alternar esa y sus vecinas. Apagá todas."
          : "Tap a cell to toggle it and its neighbors. Turn all lights off."}
      </p>

      <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New puzzle"}</GamePrimaryButton>
    </div>
  );
}
