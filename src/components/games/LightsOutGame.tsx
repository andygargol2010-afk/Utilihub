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
  // Start from all off, apply random moves — always solvable
  let board: Board = Array(SIZE * SIZE).fill(false);
  const moves = 8 + Math.floor(Math.random() * 12);
  for (let k = 0; k < moves; k++) {
    const i = Math.floor(Math.random() * board.length);
    board = toggleAt(board, i);
  }
  // Ensure not already solved
  if (board.every((b) => !b)) return randomSolvable();
  return board;
}

export function LightsOutGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState<Board>(() => randomSolvable());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const litCount = useMemo(() => board.filter(Boolean).length, [board]);

  const reset = useCallback(() => {
    setBoard(randomSolvable());
    setMoves(0);
    setWon(false);
  }, []);

  const play = useCallback(
    (i: number) => {
      if (won) return;
      const next = toggleAt(board, i);
      setBoard(next);
      setMoves((m) => m + 1);
      if (next.every((b) => !b)) setWon(true);
    },
    [board, won],
  );

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-emerald-200/90">
        <span>
          {es ? "Movimientos" : "Moves"}: <span className="tabular-nums text-white">{moves}</span>
        </span>
        <span className="text-white/40">·</span>
        <span>
          {es ? "Encendidas" : "Lit"}: <span className="tabular-nums text-white">{litCount}</span>
        </span>
      </div>

      {won && (
        <p className="rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-bold text-emerald-300">
          {es ? "¡Resuelto!" : "Solved!"} ✨
        </p>
      )}

      <div
        className="grid gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-3 shadow-inner"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
        role="grid"
        aria-label={es ? "Tablero Luces fuera" : "Lights Out board"}
      >
        {board.map((on, i) => (
          <button
            key={i}
            type="button"
            role="gridcell"
            aria-pressed={on}
            aria-label={es ? `Celda ${i + 1}${on ? ", encendida" : ", apagada"}` : `Cell ${i + 1}${on ? ", on" : ", off"}`}
            disabled={won}
            onClick={() => play(i)}
            className={`aspect-square h-12 w-12 rounded-xl border transition duration-150 active:scale-95 sm:h-14 sm:w-14 ${
              on
                ? "border-amber-300/60 bg-gradient-to-br from-amber-300 to-yellow-500 shadow-[0_0_18px_rgba(251,191,36,0.55)]"
                : "border-white/10 bg-slate-800/80 hover:bg-slate-700/80"
            }`}
          />
        ))}
      </div>

      <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>

      <p className="max-w-xs text-center text-xs text-white/50">
        {es
          ? "Clic en una luz apaga/enciende ella y sus vecinas. Objetivo: todas apagadas."
          : "Click a light to toggle it and its neighbors. Goal: turn all off."}
      </p>
    </div>
  );
}
