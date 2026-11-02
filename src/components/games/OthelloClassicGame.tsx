import { useCallback, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const SIZE = 8;
type Cell = 0 | 1 | 2; // 0 empty, 1 black, 2 white
type Board = Cell[][];

const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as Cell[]);
}

function initialBoard(): Board {
  const b = emptyBoard();
  b[3]![3] = 2;
  b[3]![4] = 1;
  b[4]![3] = 1;
  b[4]![4] = 2;
  return b;
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function flipsInDir(board: Board, r: number, c: number, player: Cell, dr: number, dc: number): [number, number][] {
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

function getFlips(board: Board, r: number, c: number, player: Cell): [number, number][] {
  if (board[r]![c] !== 0) return [];
  const all: [number, number][] = [];
  for (const [dr, dc] of DIRS) {
    all.push(...flipsInDir(board, r, c, player, dr, dc));
  }
  return all;
}

function validMoves(board: Board, player: Cell): [number, number][] {
  const moves: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (getFlips(board, r, c, player).length) moves.push([r, c]);
    }
  }
  return moves;
}

function applyMove(board: Board, r: number, c: number, player: Cell): Board | null {
  const flips = getFlips(board, r, c, player);
  if (!flips.length) return null;
  const next = board.map((row) => row.slice() as Cell[]);
  next[r]![c] = player;
  for (const [fr, fc] of flips) next[fr]![fc] = player;
  return next;
}

function countDiscs(board: Board): { black: number; white: number } {
  let black = 0, white = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === 1) black++;
      else if (cell === 2) white++;
    }
  }
  return { black, white };
}

export function OthelloClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState<Cell>(1);
  const [result, setResult] = useState<"black" | "white" | "draw" | null>(null);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [history, setHistory] = useState<Board[]>([initialBoard()]);

  const moves = useMemo(() => validMoves(board, turn), [board, turn]);
  const scores = useMemo(() => countDiscs(board), [board]);

  const checkEnd = useCallback((nextBoard: Board, nextTurn: Cell) => {
    const opp = nextTurn === 1 ? 2 : 1;
    const myMoves = validMoves(nextBoard, nextTurn);
    const oppMoves = validMoves(nextBoard, opp);
    if (!myMoves.length && !oppMoves.length) {
      const { black, white } = countDiscs(nextBoard);
      if (black > white) setResult("black");
      else if (white > black) setResult("white");
      else setResult("draw");
      return true;
    }
    if (!myMoves.length) {
      // pass
      setTurn(opp);
      return false;
    }
    return false;
  }, []);

  const play = useCallback((r: number, c: number) => {
    if (result) return;
    const next = applyMove(board, r, c, turn);
    if (!next) return;
    const nextHist = [...history, next];
    setHistory(nextHist);
    setBoard(next);
    setLastMove([r, c]);
    const opp: Cell = turn === 1 ? 2 : 1;
    const ended = checkEnd(next, opp);
    if (!ended) setTurn(opp);
  }, [board, turn, result, history, checkEnd]);

  const reset = useCallback(() => {
    const init = initialBoard();
    setBoard(init);
    setTurn(1);
    setResult(null);
    setLastMove(null);
    setHistory([init]);
  }, []);

  const undo = useCallback(() => {
    if (history.length <= 1 || result) return;
    const prev = history[history.length - 2]!;
    const nextHist = history.slice(0, -1);
    setHistory(nextHist);
    setBoard(prev);
    setTurn(turn === 1 ? 2 : 1);
    setResult(null);
    setLastMove(null);
  }, [history, turn, result]);

  let status: string;
  if (result === "draw") status = es ? "Empate" : "Draw";
  else if (result === "black") status = es ? "¡Gana Negro!" : "Black wins!";
  else if (result === "white") status = es ? "¡Gana Blanco!" : "White wins!";
  else if (!moves.length) status = es ? "Sin movimientos — pasa el turno" : "No moves — pass turn";
  else status = turn === 1 ? (es ? "Turno: Negro" : "Turn: Black") : es ? "Turno: Blanco" : "Turn: White";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-1">
      <div className="flex flex-wrap justify-center gap-2">
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
        <GameSecondaryButton onClick={undo}>{es ? "Deshacer" : "Undo"}</GameSecondaryButton>
      </div>

      <div className="flex items-center gap-4 text-sm font-bold">
        <span className="flex items-center gap-1 text-slate-100">
          <span className="inline-block h-4 w-4 rounded-full bg-black ring-1 ring-white/40" />
          {scores.black}
        </span>
        <span className="text-emerald-300/90">{status}</span>
        <span className="flex items-center gap-1 text-slate-100">
          <span className="inline-block h-4 w-4 rounded-full bg-white ring-1 ring-black/40" />
          {scores.white}
        </span>
      </div>

      <div
        className="grid gap-0.5 rounded-xl p-1.5 sm:gap-1 sm:p-2"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
          background: "linear-gradient(145deg, #14532d, #052e16)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => {
            const isValid = moves.some(([mr, mc]) => mr === r && mc === c);
            const isLast = lastMove && lastMove[0] === r && lastMove[1] === c;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={Boolean(result) || !isValid}
                onClick={() => play(r, c)}
                className="relative flex aspect-square w-9 items-center justify-center rounded-sm bg-emerald-800/80 transition hover:bg-emerald-700/90 disabled:cursor-default sm:w-11"
                aria-label={es ? `Casilla ${r + 1}-${c + 1}` : `Square ${r + 1}-${c + 1}`}
              >
                {cell !== 0 && (
                  <div
                    className={`h-5/6 w-5/6 rounded-full shadow-inner ${isLast ? "ring-2 ring-amber-300" : ""}`}
                    style={{
                      background:
                        cell === 1
                          ? "radial-gradient(circle at 30% 30%, #444, #111)"
                          : "radial-gradient(circle at 30% 30%, #fff, #ccc)",
                    }}
                  />
                )}
                {isValid && !cell && (
                  <div className="h-2 w-2 rounded-full bg-amber-300/70 sm:h-2.5 sm:w-2.5" />
                )}
              </button>
            );
          }),
        )}
      </div>

      <p className="text-center text-xs text-emerald-100/60">
        {es
          ? "Negro empieza. Colocá una ficha para voltear las del rival en línea recta. El que tenga más fichas al final gana."
          : "Black starts. Place a disc to flip opponent discs in straight lines. Most discs at the end wins."}
      </p>
    </div>
  );
}
