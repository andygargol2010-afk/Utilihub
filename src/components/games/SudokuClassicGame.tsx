import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { type Diff } from "./SudokuClassicGame.part1";
import { generate, type Board, type Notes, emptyNotes, type Snapshot, hasConflict, cloneNotes, autoFillNotes, formatTime, sameBox } from "./SudokuClassicGame.part2";

export function SudokuClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [diff, setDiff] = useState<Diff>("easy");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [{ puzzle, solution }, setGame] = useState(() => generate("easy", seed));
  const [grid, setGrid] = useState<Board>(() => puzzle.map((r) => r.slice()));
  const [fixed, setFixed] = useState(() => puzzle.map((row) => row.map((n) => n !== 0)));
  const [notes, setNotes] = useState<Notes>(emptyNotes);
  const [pencilMode, setPencilMode] = useState(false);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [won, setWon] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [startMs, setStartMs] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const conflictMap = useMemo(() => {
    const m = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (hasConflict(grid, r, c)) m.add(`${r}-${c}`);
      }
    }
    return m;
  }, [grid]);

  const remaining = useMemo(() => {
    const counts = Array(10).fill(0);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = grid[r]![c];
        if (v) counts[v]!++;
      }
    }
    return [0, ...counts.slice(1).map((n) => 9 - n)];
  }, [grid]);

  const updateUrl = useCallback((nextSeed: number, nextDiff: Diff) => {
    const url = new URL(window.location.href);
    url.searchParams.set("seed", String(nextSeed));
    url.searchParams.set("diff", nextDiff);
    window.history.replaceState(null, "", url);
  }, []);

  const newGame = useCallback(
    (d: Diff, s?: number) => {
      const nextSeed = s ?? Math.floor(Math.random() * 1e9);
      const g = generate(d, nextSeed);
      setDiff(d);
      setSeed(nextSeed);
      setGame(g);
      setGrid(g.puzzle.map((r) => r.slice()));
      setFixed(g.puzzle.map((row) => row.map((n) => n !== 0)));
      setNotes(emptyNotes());
      setSelected(null);
      setWon(false);
      setPencilMode(false);
      setHistory([]);
      setHintsLeft(3);
      setStartMs(null);
      setElapsed(0);
      setTimerRunning(false);
      updateUrl(nextSeed, d);
    },
    [updateUrl],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = (params.get("diff") || "easy") as Diff;
    const validDiff = d === "easy" || d === "medium" || d === "hard" ? d : "easy";
    const s = parseInt(params.get("seed") || "", 10);
    if (!isNaN(s) && s > 0) {
      newGame(validDiff, s);
    } else {
      newGame(validDiff);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!timerRunning || startMs === null) return;
    const id = window.setInterval(() => {
      setElapsed(Date.now() - startMs);
    }, 250);
    return () => window.clearInterval(id);
  }, [timerRunning, startMs]);

  const pushHistory = useCallback(() => {
    setHistory((h) => [
      ...h.slice(-20),
      { grid: grid.map((r) => r.slice()), notes: cloneNotes(notes) },
    ]);
  }, [grid, notes]);

  const clearRelatedNotes = (boardNotes: Notes, r: number, c: number, n: number): Notes => {
    const next = cloneNotes(boardNotes);
    for (let i = 0; i < 9; i++) {
      next[r]![i]!.delete(n);
      next[i]![c]!.delete(n);
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        next[br + i]![bc + j]!.delete(n);
      }
    }
    next[r]![c] = new Set();
    return next;
  };

  const put = (n: number) => {
    if (!selected || won) return;
    const [r, c] = selected;
    if (fixed[r]![c]) return;

    if (pencilMode && n > 0) {
      setNotes((prev) => {
        const next = cloneNotes(prev);
        const cellNotes = next[r]![c]!;
        if (cellNotes.has(n)) cellNotes.delete(n);
        else cellNotes.add(n);
        return next;
      });
      return;
    }

    if (n > 0 && startMs === null) {
      setStartMs(Date.now());
      setTimerRunning(true);
    }

    pushHistory();
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[r]![c] = n;
      const complete = next.every((row, ri) =>
        row.every((v, ci) => v !== 0 && v === solution[ri]![ci]),
      );
      const hasAnyConflict = next.some((row, ri) => row.some((_, ci) => hasConflict(next, ri, ci)));
      if (complete && !hasAnyConflict) {
        setWon(true);
        setTimerRunning(false);
      }
      return next;
    });
    if (n > 0) {
      setNotes((prev) => clearRelatedNotes(prev, r, c, n));
    } else {
      setNotes((prev) => {
        const next = cloneNotes(prev);
        next[r]![c] = new Set();
        return next;
      });
    }
  };

  const undo = () => {
    if (history.length === 0 || won) return;
    const prev = history[history.length - 1]!;
    setHistory((h) => h.slice(0, -1));
    setGrid(prev.grid.map((r) => r.slice()));
    setNotes(cloneNotes(prev.notes));
    setWon(false);
  };

  const autoNotes = () => {
    if (won) return;
    pushHistory();
    setNotes(autoFillNotes(grid));
    setPencilMode(true);
  };

  const togglePause = () => {
    if (won || startMs === null) return;
    setTimerRunning((r) => !r);
  };

  const giveHint = () => {
    if (hintsLeft <= 0 || won) return;
    let r = selected?.[0] ?? 0;
    let c = selected?.[1] ?? 0;
    if (fixed[r]?.[c] || grid[r]![c] !== 0) {
      outer: for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (!fixed[i]![j] && grid[i]![j] === 0) {
            r = i;
            c = j;
            break outer;
          }
        }
      }
    }
    if (fixed[r]![c] || grid[r]![c] !== 0) return;
    const correct = solution[r]![c]!;
    if (startMs === null) {
      setStartMs(Date.now());
      setTimerRunning(true);
    }
    pushHistory();
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[r]![c] = correct;
      const complete = next.every((row, ri) =>
        row.every((v, ci) => v !== 0 && v === solution[ri]![ci]),
      );
      const hasAnyConflict = next.some((row, ri) => row.some((_, ci) => hasConflict(next, ri, ci)));
      if (complete && !hasAnyConflict) {
        setWon(true);
        setTimerRunning(false);
      }
      return next;
    });
    setNotes((prev) => clearRelatedNotes(prev, r, c, correct));
    setSelected([r, c]);
    setHintsLeft((h) => h - 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won) return;
      const key = e.key;
      if ((e.ctrlKey || e.metaKey) && (key === "z" || key === "Z")) {
        undo();
        e.preventDefault();
        return;
      }
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (key === "u" || key === "U") {
          undo();
          e.preventDefault();
          return;
        }
        if (key === "p" || key === "P" || key === "n" || key === "N") {
          setPencilMode((m) => !m);
          e.preventDefault();
          return;
        }
        if (key === "h" || key === "H") {
          giveHint();
          e.preventDefault();
          return;
        }
      }
      if (key >= "1" && key <= "9") {
        put(parseInt(key, 10));
        e.preventDefault();
        return;
      }
      if (key === "0" || key === "Backspace" || key === "Delete") {
        put(0);
        e.preventDefault();
        return;
      }
      if (!selected) return;
      let [r, c] = selected;
      if (key === "ArrowUp" || key === "w" || key === "W") r = Math.max(0, r - 1);
      else if (key === "ArrowDown" || key === "s" || key === "S") r = Math.min(8, r + 1);
      else if (key === "ArrowLeft" || key === "a" || key === "A") c = Math.max(0, c - 1);
      else if (key === "ArrowRight" || key === "d" || key === "D") c = Math.min(8, c + 1);
      else return;
      setSelected([r, c]);
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, won, pencilMode, grid, notes, fixed, solution, startMs, history, hintsLeft]); // put/undo/hint depend on these

  const shareUrl = useCallback(async () => {
    updateUrl(seed, diff);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, [seed, diff, updateUrl]);

  const exportPng = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 540;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0a1929";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#34d399";
    ctx.fillRect(0, 0, canvas.width, 6);
    ctx.fillStyle = "#34d399";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Sudoku Clásico · UtiliHub" : "Sudoku Classic · UtiliHub", canvas.width / 2, 40);

    const cell = 42;
    const gap = 2;
    const startX = (canvas.width - 9 * cell - 8 * gap) / 2;
    const startY = 70;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const x = startX + c * (cell + gap);
        const y = startY + r * (cell + gap);
        const isFixed = fixed[r]![c];
        const conflict = conflictMap.has(`${r}-${c}`);
        ctx.fillStyle = conflict ? "#fecaca" : isFixed ? "#1e3a5f" : "#0f2744";
        ctx.fillRect(x, y, cell, cell);
        const v = grid[r]![c];
        if (v) {
          ctx.fillStyle = conflict ? "#b91c1c" : isFixed ? "#e2e8f0" : "#fbbf24";
          ctx.font = "bold 22px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(v), x + cell / 2, y + cell / 2);
        } else {
          const cellNotes = notes[r]![c]!;
          if (cellNotes.size) {
            ctx.fillStyle = "#94a3b8";
            ctx.font = "9px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const sorted = Array.from(cellNotes).sort((a, b) => a - b);
            sorted.forEach((num, i) => {
              const nx = x + ((i % 3) + 0.5) * (cell / 3);
              const ny = y + (Math.floor(i / 3) + 0.5) * (cell / 3);
              ctx.fillText(String(num), nx, ny);
            });
          }
        }
      }
    }

    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 3;
    for (let i = 0; i <= 3; i++) {
      const pos = startY + i * 3 * (cell + gap) - gap / 2;
      ctx.beginPath();
      ctx.moveTo(startX - 2, pos);
      ctx.lineTo(startX + 9 * cell + 8 * gap + 2, pos);
      ctx.stroke();
      const posX = startX + i * 3 * (cell + gap) - gap / 2;
      ctx.beginPath();
      ctx.moveTo(posX, startY - 2);
      ctx.lineTo(posX, startY + 9 * cell + 8 * gap + 2);
      ctx.stroke();
    }

    ctx.fillStyle = won ? "#fbbf24" : "#94a3b8";
    ctx.font = "bold 16px system-ui, sans-serif";
    const timeStr = formatTime(elapsed);
    ctx.fillText(
      (won ? (es ? "¡Resuelto!" : "Solved!") : es ? "En progreso" : "In progress") + " · " + timeStr,
      canvas.width / 2,
      startY + 9 * cell + 40,
    );
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText("utilihub.app", canvas.width / 2, canvas.height - 20);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-sudoku-${diff}-${seed}.png`;
    a.click();
  }, [grid, fixed, conflictMap, notes, won, diff, seed, es, elapsed]);

  const status = won
    ? es
      ? "¡Sudoku resuelto! 🎉"
      : "Sudoku solved! 🎉"
    : es
      ? "Completá la grilla sin conflictos"
      : "Fill the grid with no conflicts";

  const bestKey = `utilihub-sudoku-best-${diff}`;
  const [bestMs, setBestMs] = useState<number | null>(null);
  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem(bestKey) || "", 10);
      setBestMs(Number.isFinite(v) && v > 0 ? v : null);
    } catch {
      setBestMs(null);
    }
  }, [bestKey]);
  useEffect(() => {
    if (!won || elapsed <= 0) return;
    try {
      const prev = parseInt(localStorage.getItem(bestKey) || "", 10);
      if (!Number.isFinite(prev) || prev <= 0 || elapsed < prev) {
        localStorage.setItem(bestKey, String(elapsed));
        setBestMs(elapsed);
      }
    } catch {
      /* storage unavailable */
    }
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  const selNum = selected ? grid[selected[0]]![selected[1]] : 0;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-1">
      <div className="flex flex-wrap justify-center gap-2">
        <GameSecondaryButton active={diff === "easy"} onClick={() => newGame("easy")}>
          {es ? "Fácil" : "Easy"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "medium"} onClick={() => newGame("medium")}>
          {es ? "Medio" : "Medium"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "hard"} onClick={() => newGame("hard")}>
          {es ? "Difícil" : "Hard"}
        </GameSecondaryButton>
        <GamePrimaryButton onClick={() => newGame(diff)}>
          {es ? "Nueva partida" : "New game"}
        </GamePrimaryButton>
        <GameSecondaryButton active={pencilMode} onClick={() => setPencilMode((p) => !p)}>
          {es ? "Lápiz" : "Pencil"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={undo} disabled={history.length === 0}>
          {es ? "Deshacer" : "Undo"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={giveHint} disabled={hintsLeft <= 0}>
          {es ? `Pista (${hintsLeft})` : `Hint (${hintsLeft})`}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={autoNotes}>
          {es ? "Auto notas" : "Auto notes"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={togglePause} disabled={startMs === null || won}>
          {timerRunning ? (es ? "Pausar" : "Pause") : (es ? "Reanudar" : "Resume")}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir" : "Share"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={exportPng}>
          {es ? "PNG tablero" : "Board PNG"}
        </GameSecondaryButton>
      </div>

      <p
        className={`text-sm font-bold ${won ? "text-amber-300 text-base animate-pulse" : "text-emerald-300/90"}`}
        aria-live="polite"
      >
        {status} · {formatTime(elapsed)}
        {bestMs !== null && (es ? ` · Mejor: ${formatTime(bestMs)}` : ` · Best: ${formatTime(bestMs)}`)}
      </p>

      <div
        className="grid grid-cols-9 gap-px rounded-xl p-1 sm:gap-0.5"
        style={{
          background: "linear-gradient(165deg,#1e3a5f,#0a1929)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,211,153,0.2)",
        }}
      >
        {grid.map((row, r) =>
          row.map((v, c) => {
            const isFixed = fixed[r]![c];
            const sel = selected?.[0] === r && selected?.[1] === c;
            const conflict = conflictMap.has(`${r}-${c}`);
            const isPeer =
              selected &&
              !sel &&
              (r === selected[0] || c === selected[1] || sameBox(r, c, selected[0], selected[1]));
            const sameNum = selNum > 0 && v === selNum && !sel;
            const boxBorder =
              (c % 3 === 2 && c !== 8 ? "border-r-2 border-r-emerald-400/60 " : "") +
              (r % 3 === 2 && r !== 8 ? "border-b-2 border-b-emerald-400/60 " : "");
            const cellNotes = notes[r]![c]!;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => setSelected([r, c])}
                className={`relative flex h-8 w-8 items-center justify-center text-sm font-bold transition sm:h-10 sm:w-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${boxBorder} ${
                  conflict
                    ? "bg-rose-500/40 text-rose-100"
                    : sel
                      ? "bg-emerald-500/50 text-white"
                      : sameNum
                        ? "bg-amber-500/30 text-amber-100"
                        : isPeer
                          ? "bg-emerald-500/15 text-emerald-100"
                          : isFixed
                            ? "bg-slate-800/80 text-emerald-100"
                            : "bg-slate-900/60 text-amber-200"
                }`}
                aria-label={es ? `Celda ${r + 1},${c + 1}` : `Cell ${r + 1},${c + 1}`}
              >
                {v ? (
                  v
                ) : cellNotes.size > 0 ? (
                  <div className="grid h-full w-full grid-cols-3 grid-rows-3 text-[6px] leading-none text-slate-400 sm:text-[7px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <span key={num} className="flex items-center justify-center">
                        {cellNotes.has(num) ? num : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </button>
            );
          }),
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => put(n)}
            className="relative flex h-11 min-w-11 flex-col items-center justify-center rounded-xl bg-white/10 text-base font-bold text-white transition hover:bg-white/20 active:scale-95"
          >
            {n === 0 ? (es ? "Borrar" : "Clear") : n}
            {n > 0 && remaining[n]! > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-slate-900">
                {remaining[n]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-emerald-100/60">
        {es
          ? "Elegí dificultad, rellená números (teclado o botones). Modo lápiz para marcas. Al colocar un número se limpian las marcas relacionadas. Resaltado de fila/columna/caja y números iguales. Deshacer y 3 pistas. Auto notas rellena posibles. Contadores restantes en el teclado. Pausar temporizador. Flechas para mover. Conflictos en rojo. Atajos: U/Ctrl+Z deshacer, P lápiz, H pista. Compartí enlace o PNG."
          : "Pick difficulty, place numbers (keyboard or buttons). Pencil mode for marks. Placing a number clears related marks. Row/col/box and same-number highlights. Undo and 3 hints. Auto notes fills possibles. Remaining counts on the pad. Pause timer. Arrows to move. Conflicts in red. Shortcuts: U/Ctrl+Z undo, P pencil, H hint. Share link or PNG."}
      </p>
    </div>
  );
}
