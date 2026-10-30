import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS = 7;
const ROWS = 6;
type Cell = 0 | 1 | 2;
type Mode = "cpu" | "pvp";
type Difficulty = "easy" | "medium" | "hard";
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

function legalMoves(board: Cell[][]): number[] {
  return [3, 2, 4, 1, 5, 0, 6].filter((c) => !board[0]![c]);
}

function chooseCpuMove(board: Cell[][], difficulty: Difficulty): number {
  const legal = legalMoves(board);
  if (!legal.length) return 3;
  if (difficulty === "easy") return legal[Math.floor(Math.random() * legal.length)]!;

  // Prefer immediate win
  for (const c of legal) {
    const d = drop(board, c, 2);
    if (d && winner(d.board) === 2) return c;
  }
  // Block opponent win
  for (const c of legal) {
    const d = drop(board, c, 1);
    if (d && winner(d.board) === 1) return c;
  }

  if (difficulty === "medium") {
    const centerish = legal.filter((c) => c >= 2 && c <= 4);
    const pool = centerish.length ? centerish : legal;
    return pool[Math.floor(Math.random() * pool.length)]!;
  }

  // Hard: simple score + one-ply look
  let best = legal[0]!;
  let bestScore = -Infinity;
  for (const c of legal) {
    const d = drop(board, c, 2);
    if (!d) continue;
    let score = 0;
    if (winner(d.board) === 2) score = 1000;
    else {
      score += 10 - Math.abs(c - 3) * 2;
      const oppLegal = legalMoves(d.board);
      for (const oc of oppLegal) {
        const od = drop(d.board, oc, 1);
        if (od && winner(od.board) === 1) score -= 50;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

function applyMoves(moves: number[], mode: Mode): {
  board: Cell[][];
  turn: Cell;
  result: Cell | "draw" | null;
  lastDrop: { r: number; c: number } | null;
} {
  let board = emptyBoard();
  let turn: Cell = 1;
  let result: Cell | "draw" | null = null;
  let lastDrop: { r: number; c: number } | null = null;
  for (const col of moves) {
    if (result) break;
    if (col < 0 || col >= COLS) continue;
    const dropped = drop(board, col, turn);
    if (!dropped) continue;
    board = dropped.board;
    lastDrop = { r: dropped.row, c: col };
    result = winner(board);
    if (!result) turn = turn === 1 ? 2 : 1;
  }
  return { board, turn, result, lastDrop };
}

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
  }, [board, result, mode, winKey, es]);

  let status: string;
  if (result === "draw") status = es ? "Empate" : "Draw";
  else if (result === 1) status = es ? "¡Gana Rojo!" : "Red wins!";
  else if (result === 2)
    status = mode === "cpu" ? (es ? "¡Gana la CPU!" : "CPU wins!") : es ? "¡Gana Amarillo!" : "Yellow wins!";
  else if (mode === "cpu" && turn === 2) status = es ? "CPU pensando…" : "CPU thinking…";
  else status = turn === 1 ? (es ? "Turno: Rojo" : "Turn: Red") : es ? "Turno: Amarillo" : "Turn: Yellow";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-1">
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
              disabled={Boolean(result) || (mode === "cpu" && turn !== 1)}
              onClick={() => playCol(c)}
              className="h-9 rounded-md bg-white/10 text-xs font-bold text-white/80 transition hover:bg-white/20 active:scale-95 disabled:opacity-40 sm:h-10"
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
                return (
                  <div
                    key={`${r}-${c}`}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full sm:h-11 sm:w-11"
                    style={{ background: "#0c1e33" }}
                  >
                    {cell !== 0 && (
                      <div
                        className={`h-full w-full rounded-full shadow-inner transition-transform ${
                          isLast ? "scale-105" : ""
                        } ${isWin ? "ring-2 ring-white/90 ring-offset-1 ring-offset-slate-900" : ""}`}
                        style={{
                          background:
                            cell === 1
                              ? "radial-gradient(circle at 30% 28%, #fecdd3, #fb7185 40%, #e11d48 70%, #9f1239)"
                              : "radial-gradient(circle at 30% 28%, #fef3c7, #fde68a 40%, #fbbf24 70%, #d97706)",
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
          ? "Toca una columna para soltar. Conecta 4 en línea. Deshacer, compartir enlace o PNG del tablero."
          : "Tap a column to drop. Connect 4 in a row. Undo, share the link or download the board PNG."}
      </p>
    </div>
  );
}
