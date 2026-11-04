import { useCallback, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { type Cell } from "./TicTacToeGame.part1";
import { type Mode, type CpuLevel, winnerOf, winningLine, bestCpuMove, lineCoords, MarkX, MarkO, BOARD_U } from "./TicTacToeGame.part2";

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
        @keyframes ttt-line-draw {
          from { stroke-dashoffset: var(--ttt-len); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ttt-glow {
          0%, 100% { filter: drop-shadow(0 0 4px currentColor); }
          50% { filter: drop-shadow(0 0 12px currentColor); }
        }
        @keyframes ttt-mark-draw {
          to { stroke-dashoffset: 0; }
        }
        .ttt-mark { display: inline-flex; width: 100%; height: 100%; align-items: center; justify-content: center; animation: ttt-pop 0.28s cubic-bezier(0.34, 1.4, 0.64, 1) both; }
        .ttt-stroke {
          stroke-dasharray: 140;
          stroke-dashoffset: 140;
          animation: ttt-mark-draw 0.35s ease forwards;
        }
        .ttt-win-cell {
          background: linear-gradient(145deg, rgba(52,211,153,0.28), rgba(16,185,129,0.12)) !important;
          box-shadow: 0 0 0 1px rgba(52,211,153,0.5), 0 0 22px rgba(16,185,129,0.28);
        }
        .ttt-win-line {
          stroke-dasharray: var(--ttt-len);
          stroke-dashoffset: var(--ttt-len);
          animation: ttt-line-draw 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards,
                     ttt-glow 1.2s ease-in-out 0.6s infinite;
        }
        .ttt-board-frame {
          padding: 0.75rem;
          border-radius: 1.25rem;
          background: radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.12), transparent 60%),
            linear-gradient(160deg, #12201a, #0a1210);
          border: 1px solid rgba(52, 211, 153, 0.2);
          box-shadow: 0 18px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .ttt-cell {
          background: linear-gradient(145deg, rgba(30,41,36,0.95), rgba(15,23,20,0.98));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 10px rgba(0,0,0,0.25);
        }
        .ttt-cell:hover:not(:disabled) {
          background: linear-gradient(145deg, rgba(52,211,153,0.18), rgba(15,23,20,0.98));
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
            <GameSecondaryButton active={level === "medium"} onClick={() => setLevel("medium")}>
              {es ? "Medio" : "Med"}
            </GameSecondaryButton>
            <GameSecondaryButton active={level === "hard"} onClick={() => setLevel("hard")}>
              {es ? "Difícil" : "Hard"}
            </GameSecondaryButton>
          </>
        )}
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
      </div>

      <p className="text-sm font-bold text-emerald-300/90">{statusText}</p>

      <div className="ttt-board-frame inline-block">
        <div className="relative">
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
                  className={`ttt-cell flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 text-4xl font-black text-white transition duration-200 active:scale-95 disabled:cursor-default sm:h-24 sm:w-24 ${
                    isWin ? "ttt-win-cell" : ""
                  }`}
                >
                  {cell === "X" && <span className="ttt-mark text-sky-300"><MarkX /></span>}
                  {cell === "O" && <span className="ttt-mark text-rose-300"><MarkO /></span>}
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
    </div>
  );
}
