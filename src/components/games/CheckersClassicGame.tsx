import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Piece = 0 | 1 | 2 | 3 | 4; // 0 empty, 1 red man, 2 red king, 3 black man, 4 black king
type Board = Piece[][];
type Pos = [number, number];
type Move = { from: Pos; to: Pos; captures: Pos[] };

const SIZE = 8;

function isRed(p: Piece) { return p === 1 || p === 2; }
function isBlack(p: Piece) { return p === 3 || p === 4; }
function isKing(p: Piece) { return p === 2 || p === 4; }
function owner(p: Piece): "red" | "black" | null {
  if (isRed(p)) return "red";
  if (isBlack(p)) return "black";
  return null;
}

function initialBoard(): Board {
  const b: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as Piece[]);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < SIZE; c++) {
      if ((r + c) % 2 === 1) b[r]![c] = 3; // black men on top
    }
  }
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < SIZE; c++) {
      if ((r + c) % 2 === 1) b[r]![c] = 1; // red men on bottom
    }
  }
  return b;
}

function inBounds(r: number, c: number) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE; }

function getDirections(p: Piece): [number, number][] {
  if (p === 1) return [[-1, -1], [-1, 1]]; // red man up
  if (p === 3) return [[1, -1], [1, 1]]; // black man down
  return [[-1, -1], [-1, 1], [1, -1], [1, 1]]; // kings
}

function findMoves(board: Board, player: "red" | "black", forceCapture = true): Move[] {
  const moves: Move[] = [];
  const captures: Move[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = board[r]![c]!;
      if (owner(p) !== player) continue;
      const dirs = getDirections(p);
      for (const [dr, dc] of dirs) {
        // quiet move
        const nr = r + dr, nc = c + dc;
        if (inBounds(nr, nc) && board[nr]![nc] === 0) {
          moves.push({ from: [r, c], to: [nr, nc], captures: [] });
        }
        // jump
        const jr = r + 2 * dr, jc = c + 2 * dc;
        if (inBounds(jr, jc) && board[jr]![jc] === 0) {
          const midR = r + dr, midC = c + dc;
          const mid = board[midR]![midC]!;
          if (mid !== 0 && owner(mid) !== player) {
            captures.push({ from: [r, c], to: [jr, jc], captures: [[midR, midC]] });
          }
        }
      }
    }
  }
  // multi-jump continuation (simple, one extra for now; full chain later)
  const multi: Move[] = [];
  for (const cap of captures) {
    const temp = applyMove(board, cap);
    const cont = findSingleJumpsFrom(temp, cap.to[0], cap.to[1], player);
    if (cont.length) {
      for (const extra of cont) {
        multi.push({
          from: cap.from,
          to: extra.to,
          captures: [...cap.captures, ...extra.captures],
        });
      }
    }
  }
  const allCaps = [...captures, ...multi];
  if (forceCapture && allCaps.length) return allCaps;
  return [...moves, ...allCaps];
}

function findSingleJumpsFrom(board: Board, r: number, c: number, player: "red" | "black"): Move[] {
  const p = board[r]![c]!;
  if (owner(p) !== player) return [];
  const dirs = getDirections(p);
  const jumps: Move[] = [];
  for (const [dr, dc] of dirs) {
    const jr = r + 2 * dr, jc = c + 2 * dc;
    if (inBounds(jr, jc) && board[jr]![jc] === 0) {
      const midR = r + dr, midC = c + dc;
      const mid = board[midR]![midC]!;
      if (mid !== 0 && owner(mid) !== player) {
        jumps.push({ from: [r, c], to: [jr, jc], captures: [[midR, midC]] });
      }
    }
  }
  return jumps;
}

function applyMove(board: Board, move: Move): Board {
  const next = board.map((row) => [...row]) as Board;
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;
  let piece = next[fr]![fc]!;
  next[fr]![fc] = 0;
  for (const [cr, cc] of move.captures) next[cr]![cc] = 0;
  // promote
  if (piece === 1 && tr === 0) piece = 2;
  if (piece === 3 && tr === 7) piece = 4;
  next[tr]![tc] = piece;
  return next;
}

function hasPieces(board: Board, player: "red" | "black") {
  for (const row of board) for (const p of row) if (owner(p) === player) return true;
  return false;
}

function aiMove(board: Board, player: "red" | "black"): Move | null {
  const moves = findMoves(board, player);
  if (!moves.length) return null;
  const caps = moves.filter((m) => m.captures.length);
  const pool = caps.length ? caps : moves;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function CheckersClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState<"red" | "black">("red");
  const [userSide, setUserSide] = useState<"red" | "black">("red");
  const [vsAi, setVsAi] = useState(true);
  const [selected, setSelected] = useState<Pos | null>(null);
  const [result, setResult] = useState<"red" | "black" | "draw" | null>(null);
  const [lastMove, setLastMove] = useState<Pos | null>(null);

  const moves = useMemo(() => findMoves(board, turn), [board, turn]);
  const selectable = useMemo(() => {
    const s = new Set<string>();
    for (const m of moves) s.add(`${m.from[0]},${m.from[1]}`);
    return s;
  }, [moves]);

  const possible = useMemo(() => {
    if (!selected) return [];
    return moves.filter((m) => m.from[0] === selected[0] && m.from[1] === selected[1]);
  }, [moves, selected]);

  const checkEnd = useCallback((next: Board, nextTurn: "red" | "black") => {
    if (!hasPieces(next, "red") || !hasPieces(next, "black")) {
      setResult(!hasPieces(next, "red") ? "black" : "red");
      return true;
    }
    const nextMoves = findMoves(next, nextTurn);
    if (!nextMoves.length) {
      setResult(nextTurn === "red" ? "black" : "red");
      return true;
    }
    return false;
  }, []);

  const doMove = useCallback((move: Move) => {
    if (result) return;
    const next = applyMove(board, move);
    setBoard(next);
    setLastMove(move.to);
    setSelected(null);
    const opp: "red" | "black" = turn === "red" ? "black" : "red";
    const ended = checkEnd(next, opp);
    if (!ended) setTurn(opp);
  }, [board, turn, result, checkEnd]);

  const onSquare = useCallback((r: number, c: number) => {
    if (result) return;
    if (vsAi && turn !== userSide) return;
    const p = board[r]![c]!;
    if (owner(p) === turn && selectable.has(`${r},${c}`)) {
      setSelected([r, c]);
      return;
    }
    if (selected) {
      const m = possible.find((mv) => mv.to[0] === r && mv.to[1] === c);
      if (m) doMove(m);
    }
  }, [board, turn, result, vsAi, userSide, selectable, selected, possible, doMove]);

  useEffect(() => {
    if (!vsAi || result || turn === userSide) return;
    const t = window.setTimeout(() => {
      const m = aiMove(board, turn);
      if (m) doMove(m);
      else checkEnd(board, turn === "red" ? "black" : "red");
    }, 600);
    return () => window.clearTimeout(t);
  }, [vsAi, turn, userSide, board, result, doMove, checkEnd]);

  const reset = useCallback(() => {
    setBoard(initialBoard());
    setTurn("red");
    setResult(null);
    setSelected(null);
    setLastMove(null);
  }, []);

  const setSide = (side: "red" | "black") => {
    setUserSide(side);
    reset();
  };

  let status = "";
  if (result === "draw") status = es ? "Empate" : "Draw";
  else if (result === "red") status = es ? "¡Gana Rojo!" : "Red wins!";
  else if (result === "black") status = es ? "¡Gana Negro!" : "Black wins!";
  else status = turn === "red" ? (es ? "Turno: Rojo" : "Turn: Red") : es ? "Turno: Negro" : "Turn: Black";
  if (vsAi && turn !== userSide && !result) status += es ? " (IA)" : " (AI)";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-1">
      <div className="flex flex-wrap justify-center gap-2">
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
        <GameSecondaryButton onClick={() => setSide("red")} active={userSide === "red"}>
          {es ? "Jugar Rojo" : "Play Red"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={() => setSide("black")} active={userSide === "black"}>
          {es ? "Jugar Negro" : "Play Black"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={() => setVsAi((v) => !v)} active={vsAi}>
          {vsAi ? (es ? "Vs IA" : "Vs AI") : es ? "Vs Humano" : "Vs Human"}
        </GameSecondaryButton>
      </div>

      <div className="text-sm font-bold text-emerald-300/90">{status}</div>

      <div
        className="grid gap-0.5 rounded-xl p-1.5 sm:gap-1 sm:p-2"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
          background: "linear-gradient(145deg, #1c1917, #0c0a09)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          maxWidth: "min(100%, 28rem)",
        }}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => {
            const isDark = (r + c) % 2 === 1;
            const isSel = selected && selected[0] === r && selected[1] === c;
            const isTarget = possible.some((m) => m.to[0] === r && m.to[1] === c);
            const isLast = lastMove && lastMove[0] === r && lastMove[1] === c;
            const canSelect = selectable.has(`${r},${c}`);
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={!isDark || Boolean(result) || (vsAi && turn !== userSide)}
                onClick={() => onSquare(r, c)}
                className={`relative flex aspect-square w-8 items-center justify-center sm:w-10 ${isDark ? "bg-amber-900/90" : "bg-amber-100/20"} ${isSel ? "ring-2 ring-amber-400" : ""} ${isTarget ? "ring-2 ring-emerald-400" : ""}`}
                aria-label={es ? `Casilla ${r + 1}-${c + 1}` : `Square ${r + 1}-${c + 1}`}
              >
                {cell !== 0 && (
                  <div
                    className={`flex h-5/6 w-5/6 items-center justify-center rounded-full shadow-inner text-xs font-bold ${isLast ? "ring-2 ring-amber-300" : ""}`}
                    style={{
                      background: isRed(cell)
                        ? "radial-gradient(circle at 30% 30%, #f87171, #b91c1c)"
                        : "radial-gradient(circle at 30% 30%, #475569, #0f172a)",
                      color: isRed(cell) ? "#fff" : "#f8fafc",
                    }}
                  >
                    {isKing(cell) ? "♔" : ""}
                  </div>
                )}
                {isTarget && cell === 0 && <div className="h-2 w-2 rounded-full bg-emerald-300/80" />}
                {canSelect && !isSel && cell !== 0 && <div className="absolute inset-0 rounded-full ring-1 ring-amber-200/40" />}
              </button>
            );
          }),
        )}
      </div>

      <p className="text-center text-xs text-emerald-100/60">
        {es
          ? "Las rojas empiezan abajo. Mové en diagonal, capturá saltando. Al llegar al extremo te convertís en rey. Las capturas son preferentes."
          : "Red starts at the bottom. Move diagonally, capture by jumping. Reach the far side to become a king. Captures are preferred."}
      </p>
    </div>
  );
}
