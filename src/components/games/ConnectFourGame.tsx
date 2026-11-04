import { useCallback, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { COLS } from "./ConnectFourGame.part1";
import { emptyBoard, type Cell, type Mode, type CpuLevel, winningLine, drop, winner, cpuMove, lineCoords, BOARD_W, BOARD_H } from "./ConnectFourGame.part2";

export function ConnectFourGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState<Cell>(1);
  const [mode, setMode] = useState<Mode>("cpu");
  const [level, setLevel] = useState<CpuLevel>("medium");
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
          const cpuCol = cpuMove(cur, level);
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
    [board, mode, result, turn, applyDrop, dropN, level],
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
        {mode === "cpu" && (
          <>
            <GameSecondaryButton active={level === "easy"} onClick={() => { setLevel("easy"); reset(); }}>
              {es ? "Fácil" : "Easy"}
            </GameSecondaryButton>
            <GameSecondaryButton active={level === "medium"} onClick={() => { setLevel("medium"); reset(); }}>
              {es ? "Medio" : "Med"}
            </GameSecondaryButton>
            <GameSecondaryButton active={level === "hard"} onClick={() => { setLevel("hard"); reset(); }}>
              {es ? "Difícil" : "Hard"}
            </GameSecondaryButton>
          </>
        )}
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
          background: "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.18), transparent 55%), linear-gradient(165deg,#1e3a5f,#0a1929)",
          boxShadow: "0 18px 44px rgba(0,0,0,0.5), 0 0 0 1px rgba(56,189,248,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
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
