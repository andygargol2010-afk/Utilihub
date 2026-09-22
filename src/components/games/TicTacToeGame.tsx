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

type WinLine = readonly [number, number, number];

function winnerOf(board: Cell[]): Cell | "draw" | null {
  for (const [a, b, c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

/** Indices of the winning trio, or null. */
function winningLine(board: Cell[]): WinLine | null {
  for (const line of WINS) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
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

/** Map win line → SVG endpoints. Cell=100, gap=10 matches CSS grid gap. */
const CELL_U = 100;
const GAP_U = 10;
const BOARD_U = 3 * CELL_U + 2 * GAP_U; // 320

function cellCenter(i: number) {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    x: col * (CELL_U + GAP_U) + CELL_U / 2,
    y: row * (CELL_U + GAP_U) + CELL_U / 2,
  };
}

function lineCoords(line: WinLine): { x1: number; y1: number; x2: number; y2: number } {
  const a = cellCenter(line[0]);
  const c = cellCenter(line[2]);
  const dx = c.x - a.x;
  const dy = c.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const pad = 18;
  const ux = (dx / len) * pad;
  const uy = (dy / len) * pad;
  return { x1: a.x - ux, y1: a.y - uy, x2: c.x + ux, y2: c.y + uy };
}

export function TicTacToeGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null));
  const [mode, setMode] = useState<Mode>("cpu");
  const [level, setLevel] = useState<CpuLevel>("hard");
  const [xIsNext, setXIsNext] = useState(true);

  const result = useMemo(() => winnerOf(board), [board]);
  const winLine = useMemo(() => winningLine(board), [board]);
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
      if (afterHuman) {
        setXIsNext((v) => !v);
        return;
      }
      setXIsNext((v) => !v);

      if (mode === "cpu" && turn === "X") {
        window.setTimeout(() => {
          setBoard((cur) => {
            if (winnerOf(cur)) return cur;
            const move = bestCpuMove(cur, level);
            if (move < 0) return cur;
            const copy = cur.slice() as Cell[];
            copy[move] = "O";
            return copy;
          });
          setXIsNext(true);
        }, 420);
      }
    },
    [board, level, mode, result, turn, xIsNext],
  );

  let statusText: string;
  if (result === "draw") statusText = es ? "Empate" : "Draw";
  else if (result) statusText = es ? `Gana ${result}` : `${result} wins`;
  else if (mode === "cpu" && !xIsNext) statusText = es ? "CPU piensa…" : "CPU thinking…";
  else statusText = es ? `Turno de ${turn}` : `${turn}'s turn`;

  const line = winLine ? lineCoords(winLine) : null;
  const lineColor = result === "X" ? "#7dd3fc" : result === "O" ? "#fda4af" : "#fde68a";
  const strokeLen =
    line != null ? Math.hypot(line.x2 - line.x1, line.y2 - line.y1) + 4 : 280;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4">
      <style>{`
        @keyframes ttt-pop {
          from { transform: scale(0.4); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes ttt-draw {
          from { stroke-dashoffset: var(--ttt-len); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ttt-glow {
          0%, 100% { filter: drop-shadow(0 0 4px currentColor); }
          50% { filter: drop-shadow(0 0 12px currentColor); }
        }
        .ttt-mark { display: inline-block; animation: ttt-pop 0.28s cubic-bezier(0.34, 1.4, 0.64, 1) both; }
        .ttt-win-cell { box-shadow: inset 0 0 0 2px rgba(253, 224, 71, 0.7); background: rgba(253, 224, 71, 0.12) !important; }
        .ttt-win-line {
          stroke-dasharray: var(--ttt-len);
          stroke-dashoffset: var(--ttt-len);
          animation: ttt-draw 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards,
                     ttt-glow 1.2s ease-in-out 0.6s infinite;
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <GameSecondaryButton
          active={mode === "cpu"}
          onClick={() => {
            setMode("cpu");
            reset();
          }}
        >
          {es ? "Vs CPU" : "Vs CPU"}
        </GameSecondaryButton>
        <GameSecondaryButton
          active={mode === "pvp"}
          onClick={() => {
            setMode("pvp");
            reset();
          }}
        >
          {es ? "2 jugadores" : "2 players"}
        </GameSecondaryButton>
        {mode === "cpu" && (
          <>
            <GameSecondaryButton active={level === "easy"} onClick={() => setLevel("easy")}>
              {es ? "Fácil" : "Easy"}
            </GameSecondaryButton>
            <GameSecondaryButton active={level === "hard"} onClick={() => setLevel("hard")}>
              {es ? "Difícil" : "Hard"}
            </GameSecondaryButton>
          </>
        )}
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
      </div>

      <p className="text-sm font-bold text-emerald-300/90">{statusText}</p>

      <div className="relative inline-block">
        <div className="grid grid-cols-3 gap-2" role="grid" aria-label={es ? "Tres en raya" : "Tic-tac-toe"}>
          {board.map((cell, i) => {
            const isWin = winLine?.includes(i) ?? false;
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                aria-label={cell ? cell : es ? `Casilla ${i + 1}` : `Cell ${i + 1}`}
                disabled={Boolean(result || cell || (mode === "cpu" && !xIsNext))}
                onClick={() => playAt(i)}
                className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl font-black text-white transition duration-200 hover:bg-white/10 active:scale-95 disabled:cursor-default sm:h-24 sm:w-24 ${
                  isWin ? "ttt-win-cell" : ""
                }`}
              >
                {cell === "X" && <span className="ttt-mark text-sky-300">X</span>}
                {cell === "O" && <span className="ttt-mark text-rose-300">O</span>}
              </button>
            );
          })}
        </div>

        {line && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${BOARD_U} ${BOARD_U}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={lineColor}
              strokeWidth={10}
              strokeLinecap="round"
              className="ttt-win-line"
              style={{ ["--ttt-len" as string]: strokeLen }}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
