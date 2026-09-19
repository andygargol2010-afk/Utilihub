import { useCallback, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Cell = "X" | "O" | null;
type Mode = "cpu" | "pvp";
type CpuLevel = "easy" | "hard";

const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function winnerOf(board: Cell[]): Cell | "draw" | null {
  for (const [a, b, c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

function emptyIndices(board: Cell[]) {
  return board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
}

function minimax(board: Cell[], isMax: boolean, ai: "O", human: "X"): number {
  const w = winnerOf(board);
  if (w === ai) return 10;
  if (w === human) return -10;
  if (w === "draw") return 0;
  const moves = emptyIndices(board);
  if (isMax) {
    let best = -Infinity;
    for (const i of moves) {
      board[i] = ai;
      best = Math.max(best, minimax(board, false, ai, human));
      board[i] = null;
    }
    return best;
  }
  let best = Infinity;
  for (const i of moves) {
    board[i] = human;
    best = Math.min(best, minimax(board, true, ai, human));
    board[i] = null;
  }
  return best;
}

function bestCpuMove(board: Cell[], level: CpuLevel): number {
  const moves = emptyIndices(board);
  if (!moves.length) return -1;
  if (level === "easy") return moves[Math.floor(Math.random() * moves.length)]!;
  let bestScore = -Infinity;
  let best = moves[0]!;
  for (const i of moves) {
    const copy = board.slice() as Cell[];
    copy[i] = "O";
    const score = minimax(copy, false, "O", "X");
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}

export function TicTacToeGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null));
  const [mode, setMode] = useState<Mode>("cpu");
  const [level, setLevel] = useState<CpuLevel>("hard");
  const [xIsNext, setXIsNext] = useState(true);

  const result = useMemo(() => winnerOf(board), [board]);
  const turn: Cell = xIsNext ? "X" : "O";

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }, []);

  const playAt = useCallback(
    (i: number) => {
      if (result || board[i]) return;
      if (mode === "cpu" && !xIsNext) return;

      const next = board.slice() as Cell[];
      next[i] = turn;
      setBoard(next);
      const afterHuman = winnerOf(next);
      if (afterHuman) return;

      setXIsNext(!xIsNext);

      if (mode === "cpu" && xIsNext) {
        window.setTimeout(() => {
          setBoard((cur) => {
            if (winnerOf(cur)) return cur;
            const move = bestCpuMove(cur, level);
            if (move < 0) return cur;
            const cpuBoard = cur.slice() as Cell[];
            cpuBoard[move] = "O";
            return cpuBoard;
          });
          setXIsNext(true);
        }, 280);
      }
    },
    [board, level, mode, result, xIsNext, turn],
  );

  let statusText: string;
  if (result === "draw") statusText = es ? "Empate" : "Draw";
  else if (result) statusText = es ? `Gana ${result}` : `${result} wins`;
  else if (mode === "cpu" && !xIsNext) statusText = es ? "CPU pensando…" : "CPU thinking…";
  else statusText = es ? `Turno de ${turn}` : `${turn}'s turn`;

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
      <style>{`
        @keyframes ttt-pop {
          0% { transform: scale(0.2); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        .ttt-mark { display: inline-block; animation: ttt-pop 0.28s cubic-bezier(0.34, 1.4, 0.64, 1) both; }
      `}</style>
      <div className="flex w-full flex-wrap justify-center gap-2">
        <GameSecondaryButton active={mode === "cpu"} onClick={() => { setMode("cpu"); reset(); }}>
          {es ? "Vs CPU" : "Vs CPU"}
        </GameSecondaryButton>
        <GameSecondaryButton active={mode === "pvp"} onClick={() => { setMode("pvp"); reset(); }}>
          {es ? "2 jugadores" : "2 players"}
        </GameSecondaryButton>
        {mode === "cpu" && (
          <>
            <GameSecondaryButton active={level === "easy"} onClick={() => { setLevel("easy"); reset(); }}>
              {es ? "Fácil" : "Easy"}
            </GameSecondaryButton>
            <GameSecondaryButton active={level === "hard"} onClick={() => { setLevel("hard"); reset(); }}>
              {es ? "Imposible" : "Hard"}
            </GameSecondaryButton>
          </>
        )}
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
      </div>

      <p className="text-sm font-bold text-emerald-300/90">{statusText}</p>

      <div className="grid grid-cols-3 gap-2" role="grid" aria-label={es ? "Tres en raya" : "Tic-tac-toe"}>
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            role="gridcell"
            aria-label={cell ? cell : es ? `Casilla ${i + 1}` : `Cell ${i + 1}`}
            disabled={Boolean(result || cell || (mode === "cpu" && !xIsNext))}
            onClick={() => playAt(i)}
            className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl font-black text-white transition duration-200 hover:bg-white/10 active:scale-95 disabled:cursor-default sm:h-24 sm:w-24"
          >
            {cell === "X" && <span className="ttt-mark text-sky-300">X</span>}
            {cell === "O" && <span className="ttt-mark text-rose-300">O</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
