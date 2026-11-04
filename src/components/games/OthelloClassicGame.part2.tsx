// Part 2 of 3 — split from OthelloClassicGame.tsx on 2026-11-04. Edit here; OthelloClassicGame.tsx re-exports.
import { SIZE } from "./OthelloClassicGame.part1";

export type Cell = 0 | 1 | 2; // 0 empty, 1 black, 2 white
export type Board = Cell[][];

export const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as Cell[]);
}

export function initialBoard(): Board {
  const b = emptyBoard();
  b[3]![3] = 2;
  b[3]![4] = 1;
  b[4]![3] = 1;
  b[4]![4] = 2;
  return b;
}

export function inBounds(r: number, c: number) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

export function flipsInDir(board: Board, r: number, c: number, player: Cell, dr: number, dc: number): [number, number][] {
  const opp: Cell = player === 1 ? 2 : 1;
  const flips: [number, number][] = [];
  let rr = r + dr;
  let cc = c + dc;
  while (inBounds(rr, cc) && board[rr]![cc] === opp) {
    flips.push([rr, cc]);
    rr += dr;
    cc += dc;
  }
  if (inBounds(rr, cc) && board[rr]![cc] === player && flips.length) return flips;
  return [];
}

export function getFlips(board: Board, r: number, c: number, player: Cell): [number, number][] {
  if (board[r]![c] !== 0) return [];
  const all: [number, number][] = [];
  for (const [dr, dc] of DIRS) {
    all.push(...flipsInDir(board, r, c, player, dr, dc));
  }
  return all;
}

export function validMoves(board: Board, player: Cell): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (getFlips(board, r, c, player).length) moves.push([r, c]);
    }
  }
  return moves;
}

export function applyMove(board: Board, r: number, c: number, player: Cell): Board | null {
  const flips = getFlips(board, r, c, player);
  if (!flips.length) return null;
  const next = board.map((row) => row.slice() as Cell[]);
  next[r]![c] = player;
  for (const [fr, fc] of flips) next[fr]![fc] = player;
  return next;
}

export function countDiscs(board: Board): { black: number; white: number } {
  let black = 0, white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) black++;
      else if (cell === 2) white++;
    }
  }
  return { black, white };
}

export function serializeBoard(board: Board, turn: Cell): string {
  const cells = board.flat().join("");
  return `${cells}|${turn}`;
}

export function deserializeBoard(s: string): { board: Board; turn: Cell } | null {
  const parts = s.split("|");
  if (parts.length !== 2 || parts[0].length !== 64) return null;
  const cells = parts[0].split("").map((c) => {
    const n = parseInt(c, 10);
    return (n === 1 || n === 2 ? n : 0) as Cell;
  });
  if (cells.length !== 64) return null;
  const board: Board = [];
  for (let r = 0; r < SIZE; r++) {
    board.push(cells.slice(r * SIZE, (r + 1) * SIZE) as Cell[]);
  }
  const turn = parts[1] === "2" ? 2 : 1;
  return { board, turn };
}

export function updateUrl(board: Board, turn: Cell) {
  const url = new URL(window.location.href);
  url.searchParams.set("b", serializeBoard(board, turn));
  window.history.replaceState(null, "", url);
}

export function downloadBrandedPng(board: Board, scores: { black: number; white: number }, result: string | null, es: boolean) {
  const canvas = document.createElement("canvas");
  const cell = 48;
  const pad = 24;
  const header = 60;
  const footer = 40;
  const w = SIZE * cell + pad * 2;
  const h = header + SIZE * cell + footer + pad;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // background
  ctx.fillStyle = "#052e16";
  ctx.fillRect(0, 0, w, h);

  // header
  ctx.fillStyle = "#ecfdf5";
  ctx.font = "bold 22px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("UtiliHub — Othello Classic", w / 2, 36);

  // scores
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillStyle = "#f8fafc";
  const scoreText = result
    ? (es ? (result === "draw" ? "Empate" : result === "black" ? "Gana Negro" : "Gana Blanco") : (result === "draw" ? "Draw" : result === "black" ? "Black wins" : "White wins"))
    : `${scores.black} – ${scores.white}`;
  ctx.fillText(scoreText, w / 2, header - 8);

  // board
  const ox = pad;
  const oy = header;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const x = ox + c * cell;
      const y = oy + r * cell;
      ctx.fillStyle = "#166534";
      ctx.fillRect(x, y, cell - 1, cell - 1);
      const cellVal = board[r]![c];
      if (cellVal !== 0) {
        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, cell * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = cellVal === 1 ? "#111" : "#f1f5f9";
        ctx.fill();
        ctx.strokeStyle = cellVal === 1 ? "#444" : "#ccc";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // footer
  ctx.fillStyle = "#6ee7b7";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText(es ? "utilihub-ten.vercel.app" : "utilihub-ten.vercel.app", w / 2, h - 16);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "utilihub-othello.png";
    a.click();
    URL.revokeObjectURL(a.href);
  }, "image/png");
}

export function aiBestMove(board: Board, player: Cell): [number, number] | null {
  const moves = validMoves(board, player);
  if (!moves.length) return null;
  let best = moves[0]!;
  let bestFlips = getFlips(board, best[0], best[1], player).length;
  for (const [r, c] of moves) {
    const f = getFlips(board, r, c, player).length;
    if (f > bestFlips) {
      bestFlips = f;
      best = [r, c];
    }
  }
  return best;
}
