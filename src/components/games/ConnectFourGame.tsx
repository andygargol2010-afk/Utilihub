import { useCallback, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS = 7;
const ROWS = 6;
type Cell = 0 | 1 | 2;
type Mode = "cpu" | "pvp";

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

function winner(board: Cell[][]): Cell | "draw" | null {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]] as const;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = board[r]![c];
      if (!p) continue;
      for (const [dr, dc] of dirs) {
        let ok = true;
        for (let k = 1; k < 4; k++) {
          const rr = r + dr * k;
          const cc = c + dc * k;
          if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS || board[rr]![cc] !== p) {
            ok = false;
            break;
          }
        }
        if (ok) return p;
      }
    }
  }
  if (board[0]!.every(Boolean)) return "draw";
  return null;
}

function evaluate(board: Cell[][], player: Cell): number {
  let score = 0;
  const center = board.map((r) => r[3]!);
  score += center.filter((c) => c === player).length * 6;
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]] as const;
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

function minimax(board: Cell[][], depth: number, maximizing: boolean, alpha: number, beta: number): { score: number; col: number } {
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

export function ConnectFourGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState<Cell>(1);
  const [mode, setMode] = useState<Mode>("cpu");
  const [result, setResult] = useState<Cell | "draw" | null>(null);
  const [lastDrop, setLastDrop] = useState<{ r: number; c: number; n: number } | null>(null);
  const [dropN, setDropN] = useState(0);

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
  else if (result === 1) status = es ? "Gana Rojo" : "Red wins";
  else if (result === 2) status = mode === "cpu" ? (es ? "Gana la CPU" : "CPU wins") : es ? "Gana Amarillo" : "Yellow wins";
  else if (mode === "cpu" && turn === 2) status = es ? "CPU pensando…" : "CPU thinking…";
  else status = turn === 1 ? (es ? "Turno: Rojo" : "Turn: Red") : es ? "Turno: Amarillo" : "Turn: Yellow";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <style>{`
        @keyframes c4-drop {
          0% { transform: translateY(calc(var(--drop-from) * -1)); opacity: 0.85; }
          70% { transform: translateY(4px); }
          85% { transform: translateY(-2px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        .c4-piece-drop {
          animation: c4-drop 0.38s cubic-bezier(0.22, 0.9, 0.35, 1) both;
        }
      `}</style>

      <div className="flex flex-wrap justify-center gap-2">
        <GameSecondaryButton active={mode === "cpu"} onClick={() => { setMode("cpu"); reset(); }}>
          Vs CPU
        </GameSecondaryButton>
        <GameSecondaryButton active={mode === "pvp"} onClick={() => { setMode("pvp"); reset(); }}>
          {es ? "2 jugadores" : "2 players"}
        </GameSecondaryButton>
        <GamePrimaryButton onClick={reset}>{es ? "Nueva" : "New"}</GamePrimaryButton>
      </div>
      <p className="text-sm font-bold text-emerald-300/90">{status}</p>

      <div className="rounded-2xl bg-[#1e3a5f] p-2 shadow-lg sm:p-3">
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
          {board.flatMap((row, r) =>
            row.map((cell, c) => {
              const isLast = lastDrop && lastDrop.r === r && lastDrop.c === c;
              const dropFrom = `${(r + 1) * 48}px`;
              return (
                <div
                  key={`${r}-${c}`}
                  className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full sm:h-11 sm:w-11"
                  style={{ background: "#0c1e33" }}
                >
                  {cell !== 0 && (
                    <div
                      key={isLast ? `d-${lastDrop!.n}` : `s-${r}-${c}`}
                      className={`h-full w-full rounded-full shadow-inner ${isLast ? "c4-piece-drop" : ""}`}
                      style={{
                        background:
                          cell === 1
                            ? "radial-gradient(circle at 30% 28%, #fb7185, #e11d48 55%, #9f1239)"
                            : "radial-gradient(circle at 30% 28%, #fde68a, #fbbf24 55%, #d97706)",
                        ["--drop-from" as string]: dropFrom,
                      }}
                    />
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
