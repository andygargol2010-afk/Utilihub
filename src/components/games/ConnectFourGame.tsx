import { useCallback, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS = 7;
const ROWS = 6;
type Cell = 0 | 1 | 2;
type Mode = "cpu" | "pvp";
type Pos = { r: number; c: number };

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0) as Cell[]);
}

function drop(board: Cell[][], col: number, player: Cell): { board: Cell[][]; row: number } | null {
  if (board[0]![col]) return null;
  const next = board.map((r) => r.slice() as Cell[]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!next[r]![col]) {
      next[r]![col] = player;
      return { board: next, row: r };
    }
  }
  return null;
}

/** First winning line of 4 cells, or null. */
function winningLine(board: Cell[][]): Pos[] | null {
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = board[r]![c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        const cells: Pos[] = [{ r, c }];
        let ok = true;
        for (let k = 1; k < 4; k++) {
          const rr = r + dr * k;
          const cc = c + dc * k;
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || board[rr]![cc] !== p) {
            ok = false;
            break;
          }
          cells.push({ r: rr, c: cc });
        }
        if (ok) return cells;
      }
    }
  }
  return null;
}

function winner(board: Cell[][]): Cell | "draw" | null {
  const line = winningLine(board);
  if (line) return board[line[0]!.r]![line[0]!.c] as Cell;
  if (board[0]!.every(Boolean)) return "draw";
  return null;
}

function evaluate(board: Cell[][], player: Cell): number {
  let score = 0;
  const center = board.map((r) => r[3]!);
  score += center.filter((c) => c === player).length * 6;
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ] as const;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of dirs) {
        let count = 0;
        let empty = 0;
        let opp = 0;
        for (let k = 0; k < 4; k++) {
          const rr = r + dr * k;
          const cc = c + dc * k;
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) {
            count = -99;
            break;
          }
          const v = board[rr]![cc]!;
          if (v === player) count++;
          else if (v === 0) empty++;
          else opp++;
        }
        if (count < 0) continue;
        if (count === 4) score += 100000;
        else if (count === 3 && empty === 1) score += 50;
        else if (count === 2 && empty === 2) score += 8;
        if (opp === 3 && empty === 1) score -= 40;
      }
    }
  }
  return score;
}

function minimax(
  board: Cell[][],
  depth: number,
  maximizing: boolean,
  alpha: number,
  beta: number,
): { score: number; col: number } {
  const w = winner(board);
  if (w === 2) return { score: 1000000 + depth, col: -1 };
  if (w === 1) return { score: -1000000 - depth, col: -1 };
  if (w === "draw") return { score: 0, col: -1 };
  if (depth === 0) return { score: evaluate(board, 2), col: -1 };

  const order = [3, 2, 4, 1, 5, 0, 6];
  let bestCol = order.find((c) => !board[0]![c]) ?? 0;

  if (maximizing) {
    let value = -Infinity;
    for (const c of order) {
      const dropped = drop(board, c, 2);
      if (!dropped) continue;
      const { score } = minimax(dropped.board, depth - 1, false, alpha, beta);
      if (score > value) {
        value = score;
        bestCol = c;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { score: value, col: bestCol };
  }

  let value = Infinity;
  for (const c of order) {
    const dropped = drop(board, c, 1);
    if (!dropped) continue;
    const { score } = minimax(dropped.board, depth - 1, true, alpha, beta);
    if (score < value) {
      value = score;
      bestCol = c;
    }
    beta = Math.min(beta, value);
    if (alpha >= beta) break;
  }
  return { score: value, col: bestCol };
}

const CELL_U = 100;
const GAP_U = 12;
const BOARD_W = COLS * CELL_U + (COLS - 1) * GAP_U;
const BOARD_H = ROWS * CELL_U + (ROWS - 1) * GAP_U;

function discCenter(r: number, c: number) {
  return {
    x: c * (CELL_U + GAP_U) + CELL_U / 2,
    y: r * (CELL_U + GAP_U) + CELL_U / 2,
  };
}

function lineCoords(cells: Pos[]) {
  const a = discCenter(cells[0]!.r, cells[0]!.c);
  const b = discCenter(cells[cells.length - 1]!.r, cells[cells.length - 1]!.c);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const pad = 28;
  const ux = (dx / len) * pad;
  const uy = (dy / len) * pad;
  return { x1: a.x - ux, y1: a.y - uy, x2: b.x + ux, y2: b.y + uy, len: len + pad * 2 };
}

export function ConnectFourGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState<Cell>(1);
  const [mode, setMode] = useState<Mode>("cpu");
  const [result, setResult] = useState<Cell | "draw" | null>(null);
  const [lastDrop, setLastDrop] = useState<{ r: number; c: number; n: number } | null>(null);
  const [dropN, setDropN] = useState(0);

  const winCells = useMemo(() => (result && result !== "draw" ? winningLine(board) : null), [board, result]);
  const winKey = useMemo(
    () => (winCells ? new Set(winCells.map((p) => `${p.r}-${p.c}`)) : null),
    [winCells],
  );

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setTurn(1);
    setResult(null);
    setLastDrop(null);
  }, []);

  const applyDrop = useCallback(
    (col: number, player: Cell) => {
      setBoard((cur) => {
        const dropped = drop(cur, col, player);
        if (!dropped) return cur;
        const n = dropN + 1;
        setDropN(n);
        setLastDrop({ r: dropped.row, c: col, n });
        const w = winner(dropped.board);
        if (w) setResult(w);
        return dropped.board;
      });
    },
    [dropN],
  );

  const playCol = useCallback(
    (col: number) => {
      if (result) return;
      if (mode === "cpu" && turn !== 1) return;
      const preview = drop(board, col, turn);
      if (!preview) return;
      applyDrop(col, turn);
      const w = winner(preview.board);
      if (w) return;

      if (mode === "pvp") {
        setTurn(turn === 1 ? 2 : 1);
        return;
      }
      setTurn(2);
      window.setTimeout(() => {
        setBoard((cur) => {
          if (winner(cur)) return cur;
          const { col: cpuCol } = minimax(cur, 4, true, -Infinity, Infinity);
          const dropped = drop(cur, cpuCol, 2);
          if (!dropped) return cur;
          const n = dropN + 2;
          setDropN(n);
          setLastDrop({ r: dropped.row, c: cpuCol, n });
          const cw = winner(dropped.board);
          if (cw) setResult(cw);
          else setTurn(1);
          return dropped.board;
        });
      }, 420);
    },
    [board, mode, result, turn, applyDrop, dropN],
  );

  let status: string;
  if (result === "draw") status = es ? "Empate" : "Draw";
  else if (result === 1) status = es ? "¡Gana Rojo!" : "Red wins!";
  else if (result === 2)
    status = mode === "cpu" ? (es ? "¡Gana la CPU!" : "CPU wins!") : es ? "¡Gana Amarillo!" : "Yellow wins!";
  else if (mode === "cpu" && turn === 2) status = es ? "CPU pensando…" : "CPU thinking…";
  else status = turn === 1 ? (es ? "Turno: Rojo" : "Turn: Red") : es ? "Turno: Amarillo" : "Turn: Yellow";

  const line = winCells ? lineCoords(winCells) : null;
  const lineColor = result === 1 ? "#fb7185" : result === 2 ? "#fbbf24" : "#fde68a";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <style>{`
        @keyframes c4-drop {
          0% { transform: translateY(calc(var(--drop-from) * -1)); opacity: 0.85; }
          70% { transform: translateY(4px); }
          85% { transform: translateY(-2px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes c4-win-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 6px rgba(255,255,255,0.12); }
        }
        @keyframes c4-draw {
          from { stroke-dashoffset: var(--c4-len); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes c4-glow {
          0%, 100% { filter: drop-shadow(0 0 3px currentColor); }
          50% { filter: drop-shadow(0 0 10px currentColor); }
        }
        .c4-piece-drop {
          animation: c4-drop 0.38s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
        .c4-win-piece {
          animation: c4-win-pulse 0.9s ease-in-out infinite;
          z-index: 2;
        }
        .c4-dim {
          opacity: 0.45;
          transition: opacity 0.35s ease;
        }
        .c4-win-line {
          stroke-dasharray: var(--c4-len);
          stroke-dashoffset: var(--c4-len);
          animation: c4-draw 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.12s forwards,
                     c4-glow 1.2s ease-in-out 0.7s infinite;
        }
        .c4-status-win {
          animation: c4-win-pulse 1s ease-in-out 2;
        }
      `}</style>

      <div className="flex flex-wrap justify-center gap-2">
        <GameSecondaryButton
          active={mode === "cpu"}
          onClick={() => {
            setMode("cpu");
            reset();
          }}
        >
          Vs CPU
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
        <GamePrimaryButton onClick={reset}>{es ? "Nueva" : "New"}</GamePrimaryButton>
      </div>

      <p
        className={`text-sm font-bold ${
          result && result !== "draw" ? "c4-status-win text-amber-300 text-base" : "text-emerald-300/90"
        }`}
      >
        {status}
      </p>

      <div
        className="c4-frame rounded-2xl p-2 sm:p-3"
        style={{
          background: "linear-gradient(160deg,#1e3a5f,#0c1e33)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: COLS }, (_, c) => (
            <button
              key={`h-${c}`}
              type="button"
              disabled={Boolean(result) || (mode === "cpu" && turn !== 1)}
              onClick={() => playCol(c)}
              className="h-8 rounded-md bg-white/10 text-xs font-bold text-white/70 transition hover:bg-white/20 active:scale-95 disabled:opacity-40"
              aria-label={es ? `Columna ${c + 1}` : `Column ${c + 1}`}
            >
              ▼
            </button>
          ))}
        </div>

        <div className="relative mt-1.5">
          <div className="grid grid-cols-7 gap-1.5">
            {board.flatMap((row, r) =>
              row.map((cell, c) => {
                const isLast = lastDrop && lastDrop.r === r && lastDrop.c === c;
                const isWin = winKey?.has(`${r}-${c}`) ?? false;
                const dropFrom = `${(r + 1) * 48}px`;
                const dimOthers = Boolean(winKey) && !isWin && cell !== 0;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="relative flex h-10 w-10 items-center justify-center overflow-visible rounded-full sm:h-11 sm:w-11"
                    style={{ background: "#0c1e33" }}
                  >
                    {cell !== 0 && (
                      <div
                        key={isLast ? `d-${lastDrop!.n}` : `s-${r}-${c}`}
                        className={`h-full w-full rounded-full shadow-inner ${isLast ? "c4-piece-drop" : ""} ${
                          isWin ? "c4-win-piece" : ""
                        } ${dimOthers ? "c4-dim" : ""}`}
                        style={{
                          background: isWin
                            ? cell === 1
                              ? "radial-gradient(circle at 30% 28%, #fecdd3, #fb7185 40%, #e11d48 70%, #9f1239)"
                              : "radial-gradient(circle at 30% 28%, #fef3c7, #fde68a 40%, #fbbf24 70%, #d97706)"
                            : cell === 1
                              ? "radial-gradient(circle at 30% 28%, #fb7185, #e11d48 55%, #9f1239)"
                              : "radial-gradient(circle at 30% 28%, #fde68a, #fbbf24 55%, #d97706)",
                          ["--drop-from" as string]: dropFrom,
                          outline: isWin ? "2px solid rgba(255,255,255,0.85)" : undefined,
                          outlineOffset: isWin ? "1px" : undefined,
                        }}
                      />
                    )}
                  </div>
                );
              }),
            )}
          </div>

          {line && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={lineColor}
                strokeWidth={14}
                strokeLinecap="round"
                className="c4-win-line"
                style={{ ["--c4-len" as string]: line.len }}
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
