import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { COLS } from "./ConnectFourClassicGame.part1";
import { emptyBoard, type Cell, type Mode, type Difficulty, winningLine, applyMoves, drop, winner, chooseCpuMove, ROWS, lowestOpenRow } from "./ConnectFourClassicGame.part2";

export function ConnectFourClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState<Cell>(1);
  const [mode, setMode] = useState<Mode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [result, setResult] = useState<Cell | "draw" | null>(null);
  const [lastDrop, setLastDrop] = useState<{ r: number; c: number } | null>(null);
  const [moves, setMoves] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState(3);
  const [animating, setAnimating] = useState(false);

  const winCells = useMemo(() => (result && result !== "draw" ? winningLine(board) : null), [board, result]);
  const winKey = useMemo(
    () => (winCells ? new Set(winCells.map((p) => `${p.r}-${p.c}`)) : null),
    [winCells],
  );

  const updateUrl = useCallback((nextMoves: number[], nextMode: Mode) => {
    const url = new URL(window.location.href);
    if (nextMoves.length) url.searchParams.set("moves", nextMoves.join(""));
    else url.searchParams.delete("moves");
    url.searchParams.set("mode", nextMode);
    window.history.replaceState(null, "", url);
  }, []);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setTurn(1);
    setResult(null);
    setLastDrop(null);
    setMoves([]);
    setHoverCol(null);
    setSelectedCol(3);
    setAnimating(false);
    updateUrl([], mode);
  }, [mode, updateUrl]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = (params.get("mode") || "pvp") as Mode;
    const validMode = m === "cpu" || m === "pvp" ? m : "pvp";
    setMode(validMode);
    const movesStr = params.get("moves") || "";
    const parsed: number[] = [];
    for (const ch of movesStr) {
      const n = parseInt(ch, 10);
      if (n >= 0 && n < COLS) parsed.push(n);
    }
    if (parsed.length) {
      const applied = applyMoves(parsed, validMode);
      setBoard(applied.board);
      setTurn(applied.turn);
      setResult(applied.result);
      setLastDrop(applied.lastDrop);
      setMoves(parsed);
    }
  }, []);

  const undo = useCallback(() => {
    if (!moves.length) return;
    let toPop = 1;
    if (mode === "cpu" && moves.length >= 2 && turn === 1 && !result) toPop = 2;
    else if (mode === "cpu" && result && moves.length >= 1) toPop = Math.min(2, moves.length);
    const nextMoves = moves.slice(0, -toPop);
    const applied = applyMoves(nextMoves, mode);
    setMoves(nextMoves);
    setBoard(applied.board);
    setTurn(applied.turn);
    setResult(applied.result);
    setLastDrop(applied.lastDrop);
    setAnimating(false);
    updateUrl(nextMoves, mode);
  }, [moves, mode, turn, result, updateUrl]);

  const playCol = useCallback(
    (col: number) => {
      if (result) return;
      if (mode === "cpu" && turn !== 1) return;
      const dropped = drop(board, col, turn);
      if (!dropped) return;
      const nextMoves = [...moves, col];
      setMoves(nextMoves);
      setBoard(dropped.board);
      setLastDrop({ r: dropped.row, c: col });
      setHoverCol(null);
      setSelectedCol(col);
      setAnimating(true);
      window.setTimeout(() => setAnimating(false), 400);
      const w = winner(dropped.board);
      if (w) {
        setResult(w);
        updateUrl(nextMoves, mode);
        return;
      }
      if (mode === "pvp") {
        setTurn(turn === 1 ? 2 : 1);
        updateUrl(nextMoves, mode);
        return;
      }
      setTurn(2);
      updateUrl(nextMoves, mode);
      window.setTimeout(() => {
        setBoard((cur) => {
          if (winner(cur)) return cur;
          const cpuCol = chooseCpuMove(cur, difficulty);
          const d2 = drop(cur, cpuCol, 2);
          if (!d2) return cur;
          const cpuMoves = [...nextMoves, cpuCol];
          setMoves(cpuMoves);
          setLastDrop({ r: d2.row, c: cpuCol });
          setAnimating(true);
          window.setTimeout(() => setAnimating(false), 400);
          const cw = winner(d2.board);
          if (cw) setResult(cw);
          else setTurn(1);
          updateUrl(cpuMoves, mode);
          return d2.board;
        });
      }, 350);
    },
    [board, mode, result, turn, moves, updateUrl, difficulty],
  );

  const shareUrl = useCallback(async () => {
    updateUrl(moves, mode);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [moves, mode, updateUrl]);

  const exportPng = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 520;
    canvas.height = 440;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a1929";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(0, 0, canvas.width, 6);
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Conecta Cuatro · UtiliHub" : "Connect Four · UtiliHub", canvas.width / 2, 40);

    const cellSize = 42;
    const gap = 6;
    const boardW = COLS * cellSize + (COLS - 1) * gap;
    const boardH = ROWS * cellSize + (ROWS - 1) * gap;
    const startX = (canvas.width - boardW) / 2;
    const startY = 70;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = startX + c * (cellSize + gap);
        const y = startY + r * (cellSize + gap);
        ctx.fillStyle = "#0c1e33";
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        const cell = board[r]![c];
        if (cell) {
          const isWin = winKey?.has(`${r}-${c}`) ?? false;
          ctx.fillStyle = cell === 1 ? "#e11d48" : "#fbbf24";
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 4, 0, Math.PI * 2);
          ctx.fill();
          if (isWin) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        }
      }
    }

    // Draw winning line
    if (winCells && winCells.length === 4) {
      const centers = winCells.map((p) => ({
        x: startX + p.c * (cellSize + gap) + cellSize / 2,
        y: startY + p.r * (cellSize + gap) + cellSize / 2,
      }));
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(centers[0]!.x, centers[0]!.y);
      for (let i = 1; i < centers.length; i++) {
        ctx.lineTo(centers[i]!.x, centers[i]!.y);
      }
      ctx.stroke();
    }

    let winnerText = "";
    if (result === "draw") winnerText = es ? "Empate" : "Draw";
    else if (result === 1) winnerText = es ? "Gana Rojo" : "Red wins";
    else if (result === 2)
      winnerText = mode === "cpu" ? (es ? "Gana la CPU" : "CPU wins") : es ? "Gana Amarillo" : "Yellow wins";
    else winnerText = es ? "Partida en curso" : "Game in progress";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(winnerText, canvas.width / 2, startY + boardH + 36);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("utilihub.app", canvas.width / 2, canvas.height - 20);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-connect-four-${result || "board"}.png`;
    a.click();
  }, [board, result, mode, winKey, winCells, es]);

  let status: string;
  const moveCount = moves.length;
  if (result === "draw") status = es ? `Empate · ${moveCount} jugadas` : `Draw · ${moveCount} moves`;
  else if (result === 1) status = es ? `¡Gana Rojo! · ${moveCount} jugadas` : `Red wins! · ${moveCount} moves`;
  else if (result === 2)
    status = mode === "cpu" ? (es ? `¡Gana la CPU! · ${moveCount} jugadas` : `CPU wins! · ${moveCount} moves`) : es ? `¡Gana Amarillo! · ${moveCount} jugadas` : `Yellow wins! · ${moveCount} moves`;
  else if (mode === "cpu" && turn === 2) status = es ? `CPU pensando… · ${moveCount} jugadas` : `CPU thinking… · ${moveCount} moves`;
  else status = turn === 1 ? (es ? `Turno: Rojo · ${moveCount} jugadas` : `Turn: Red · ${moveCount} moves`) : es ? `Turno: Amarillo · ${moveCount} jugadas` : `Turn: Yellow · ${moveCount} moves`;

  const canInteract = !result && !(mode === "cpu" && turn !== 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!canInteract) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedCol((c) => Math.max(0, c - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedCol((c) => Math.min(COLS - 1, c + 1));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playCol(selectedCol);
      } else {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= COLS) {
          e.preventDefault();
          playCol(n - 1);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canInteract, playCol, selectedCol]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-1">
      <style>{`
        @keyframes dropFall {
          from { transform: translateY(-120%); opacity: 0.6; }
          to { transform: translateY(0); opacity: 1; }
        }
        .disc-fall { animation: dropFall 0.35s ease-out; }
        @keyframes winPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .win-pulse { animation: winPulse 0.8s ease-in-out infinite; }
      `}</style>
      <div className="flex flex-wrap justify-center gap-2">
        <GameSecondaryButton
          active={mode === "pvp"}
          onClick={() => {
            setMode("pvp");
            reset();
          }}
        >
          {es ? "2 jugadores" : "2 players"}
        </GameSecondaryButton>
        <GameSecondaryButton
          active={mode === "cpu"}
          onClick={() => {
            setMode("cpu");
            reset();
          }}
        >
          Vs CPU
        </GameSecondaryButton>
        {mode === "cpu" && (
          <>
            <GameSecondaryButton active={difficulty === "easy"} onClick={() => setDifficulty("easy")}>
              {es ? "Fácil" : "Easy"}
            </GameSecondaryButton>
            <GameSecondaryButton active={difficulty === "medium"} onClick={() => setDifficulty("medium")}>
              {es ? "Medio" : "Medium"}
            </GameSecondaryButton>
            <GameSecondaryButton active={difficulty === "hard"} onClick={() => setDifficulty("hard")}>
              {es ? "Difícil" : "Hard"}
            </GameSecondaryButton>
          </>
        )}
        <GamePrimaryButton onClick={reset}>{es ? "Nueva partida" : "New game"}</GamePrimaryButton>
        <GameSecondaryButton onClick={undo} disabled={!moves.length}>
          {es ? "Deshacer" : "Undo"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir" : "Share"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={exportPng}>
          {es ? "PNG tablero" : "Board PNG"}
        </GameSecondaryButton>
      </div>

      {result && result !== "draw" && (
        <div className="text-center text-lg font-bold text-amber-300 animate-pulse" aria-live="assertive">
          {es ? "¡Cuatro en línea!" : "Four in a row!"}
        </div>
      )}

      <p
        className={`text-sm font-bold ${
          result && result !== "draw" ? "text-amber-300 text-base" : "text-emerald-300/90"
        }`}
        aria-live="polite"
      >
        {status}
      </p>

      <div
        className="rounded-2xl p-2 sm:p-3"
        style={{
          background: "linear-gradient(165deg,#1e3a5f,#0a1929)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(56,189,248,0.2)",
        }}
      >
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {Array.from({ length: COLS }, (_, c) => (
            <button
              key={`h-${c}`}
              type="button"
              disabled={!canInteract}
              onClick={() => playCol(c)}
              onMouseEnter={() => canInteract && setHoverCol(c)}
              onMouseLeave={() => setHoverCol(null)}
              onTouchStart={() => canInteract && setHoverCol(c)}
              className={`h-9 rounded-md bg-white/10 text-xs font-bold text-white/80 transition hover:bg-white/20 active:scale-95 disabled:opacity-40 sm:h-10 ${
                selectedCol === c ? "ring-2 ring-amber-400" : ""
              }`}
              aria-label={es ? `Columna ${c + 1}` : `Column ${c + 1}`}
            >
              ▼
            </button>
          ))}
        </div>

        <div className="relative mt-1.5">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {board.flatMap((row, r) =>
              row.map((cell, c) => {
                const isWin = winKey?.has(`${r}-${c}`) ?? false;
                const isLast = lastDrop && lastDrop.r === r && lastDrop.c === c;
                const previewRow = (hoverCol === c || selectedCol === c) && canInteract ? lowestOpenRow(board, c) : null;
                const showGhost = previewRow === r && cell === 0;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                      (hoverCol === c || selectedCol === c) && canInteract ? "ring-2 ring-sky-400/70" : ""
                    }`}
                    style={{ background: "#0c1e33" }}
                  >
                    {cell !== 0 && (
                      <div
                        className={`h-full w-full rounded-full shadow-inner transition-transform ${
                          isLast && animating ? "disc-fall" : isLast ? "scale-105" : ""
                        } ${isWin ? "ring-2 ring-white/90 ring-offset-1 ring-offset-slate-900 win-pulse" : ""}`}
                        style={{
                          background:
                            cell === 1
                              ? "radial-gradient(circle at 30% 28%, #fecdd3, #fb7185 40%, #e11d48 70%, #9f1239)"
                              : "radial-gradient(circle at 30% 28%, #fef3c7, #fde68a 40%, #fbbf24 70%, #d97706)",
                        }}
                      />
                    )}
                    {showGhost && (
                      <div
                        className="absolute inset-1 rounded-full opacity-40"
                        style={{
                          background:
                            turn === 1
                              ? "radial-gradient(circle at 30% 28%, #fecdd3, #e11d48)"
                              : "radial-gradient(circle at 30% 28%, #fef3c7, #fbbf24)",
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

      <p className="text-center text-xs text-emerald-100/60">
        {es
          ? "Toca una columna o teclas 1-7 para soltar. Flechas ←→ seleccionan columna + Enter/Espacio suelta. Conecta 4 en línea. Vista previa al pasar el mouse o seleccionar. Disco cae con animación. Contador de jugadas. Deshacer, compartir enlace o PNG del tablero."
          : "Tap a column or press keys 1-7 to drop. Arrow keys select column + Enter/Space drops. Connect 4 in a row. Hover or select a column for drop preview. Disc falls with animation. Move counter. Undo, share the link or download the board PNG."}
      </p>
    </div>
  );
}
