// Part 2 of 3 — split from TicTacToeGame.tsx on 2026-11-04. Edit here; TicTacToeGame.tsx re-exports.
import { type Cell } from "./TicTacToeGame.part1";

export type Mode = "cpu" | "pvp";
export type CpuLevel = "easy" | "medium" | "hard";

export const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export type WinLine = readonly [number, number, number];

export function winnerOf(board: Cell[]): Cell | "draw" | null {
  for (const [a, b, c] of WINS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

export function winningLine(board: Cell[]): WinLine | null {
  for (const line of WINS) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

export function emptyIndices(board: Cell[]) {
  return board.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
}

export function minimax(board: Cell[], isMax: boolean, ai: "O", human: "X"): number {
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

export function bestCpuMove(board: Cell[], level: CpuLevel): number {
  const moves = emptyIndices(board);
  if (!moves.length) return -1;
  if (level === "easy") return moves[Math.floor(Math.random() * moves.length)]!;
  if (level === "medium" && Math.random() < 0.3) {
    return moves[Math.floor(Math.random() * moves.length)]!;
  }
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

export const CELL_U = 100;
export const GAP_U = 10;
export const BOARD_U = 3 * CELL_U + 2 * GAP_U;

export function cellCenter(i: number) {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    x: col * (CELL_U + GAP_U) + CELL_U / 2,
    y: row * (CELL_U + GAP_U) + CELL_U / 2,
  };
}

export function lineCoords(line: WinLine): { x1: number; y1: number; x2: number; y2: number } {
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

export function MarkX() {
  return (
    <svg viewBox="0 0 100 100" className="h-[58%] w-[58%] drop-shadow-[0_2px_6px_rgba(56,189,248,0.45)]" aria-hidden>
      <path
        d="M22 22 L78 78 M78 22 L22 78"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        className="ttt-stroke"
      />
    </svg>
  );
}

export function MarkO() {
  return (
    <svg viewBox="0 0 100 100" className="h-[62%] w-[62%] drop-shadow-[0_2px_6px_rgba(251,113,133,0.45)]" aria-hidden>
      <circle
        cx="50"
        cy="50"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        className="ttt-stroke"
      />
    </svg>
  );
}
