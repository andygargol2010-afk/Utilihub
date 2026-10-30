import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Diff = "easy" | "medium" | "hard";
type Board = number[][];
type Notes = Set<number>[][];
type Snapshot = { grid: Board; notes: Notes };

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function isValid(board: Board, r: number, c: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[r]![i] === n || board[i]![c] === n) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[br + i]![bc + j] === n) return false;
    }
  }
  return true;
}

function solve(board: Board, rng: () => number): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]![c] !== 0) continue;
      for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng)) {
        if (!isValid(board, r, c, n)) continue;
        board[r]![c] = n;
        if (solve(board, rng)) return true;
        board[r]![c] = 0;
      }
      return false;
    }
  }
  return true;
}

function generate(diff: Diff, seed: number): { puzzle: Board; solution: Board } {
  const rng = mulberry32(seed);
  const solution: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solution, rng);
  const puzzle = solution.map((row) => row.slice());
  const holes = diff === "easy" ? 36 : diff === "medium" ? 46 : 54;
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i), rng);
  let removed = 0;
  for (const idx of cells) {
    if (removed >= holes) break;
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    if (puzzle[r]![c] === 0) continue;
    puzzle[r]![c] = 0;
    removed++;
  }
  return { puzzle, solution };
}

function hasConflict(board: Board, r: number, c: number): boolean {
  const n = board[r]![c]!;
  if (!n) return false;
  for (let i = 0; i < 9; i++) {
    if (i !== c && board[r]![i] === n) return true;
    if (i !== r && board[i]![c] === n) return true;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rr = br + i;
      const cc = bc + j;
      if ((rr !== r || cc !== c) && board[rr]![cc] === n) return true;
    }
  }
  return false;
}

function emptyNotes(): Notes {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>()));
}

function cloneNotes(n: Notes): Notes {
  return n.map((row) => row.map((s) => new Set(s)));
}

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

  const conflictMap = useMemo(() => {
    const m = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (hasConflict(grid, r, c)) m.add(`${r}-${c}`);
      }
    }
    return m;
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

  const pushHistory = useCallback(() => {
    setHistory((h) => [
      ...h.slice(-20),
      { grid: grid.map((r) => r.slice()), notes: cloneNotes(notes) },
    ]);
  }, [grid, notes]);

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
      }
      return next;
    });
    if (n === 0) {
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

  const giveHint = () => {
    if (hintsLeft <= 0 || won) return;
    let r = selected?.[0] ?? 0;
    let c = selected?.[1] ?? 0;
    if (fixed[r]?.[c] || grid[r]![c] !== 0) {
      // find first empty non-fixed
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
    pushHistory();
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[r]![c] = correct;
      const complete = next.every((row, ri) =>
        row.every((v, ci) => v !== 0 && v === solution[ri]![ci]),
      );
      const hasAnyConflict = next.some((row, ri) => row.some((_, ci) => hasConflict(next, ri, ci)));
      if (complete && !hasAnyConflict) setWon(true);
      return next;
    });
    setNotes((prev) => {
      const next = cloneNotes(prev);
      next[r]![c] = new Set();
      return next;
    });
    setSelected([r, c]);
    setHintsLeft((h) => h - 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (won) return;
      const key = e.key;
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
  }, [selected, won, pencilMode, grid, notes, fixed, solution]); // put depends on these

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
    ctx.fillText(
      won ? (es ? "¡Resuelto!" : "Solved!") : es ? "En progreso" : "In progress",
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
  }, [grid, fixed, conflictMap, notes, won, diff, seed, es]);

  const status = won
    ? es
      ? "¡Sudoku resuelto!"
      : "Sudoku solved!"
    : es
      ? "Completá la grilla sin conflictos"
      : "Fill the grid with no conflicts";

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
        <GameSecondaryButton onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir" : "Share"}
        </GameSecondaryButton>
        <GameSecondaryButton onClick={exportPng}>
          {es ? "PNG tablero" : "Board PNG"}
        </GameSecondaryButton>
      </div>

      <p
        className={`text-sm font-bold ${won ? "text-amber-300 text-base" : "text-emerald-300/90"}`}
        aria-live="polite"
      >
        {status}
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
            const boxBorder =
              (c % 3 === 2 && c !== 8 ? "border-r-2 border-r-emerald-400/60 " : "") +
              (r % 3 === 2 && r !== 8 ? "border-b-2 border-b-emerald-400/60 " : "");
            const cellNotes = notes[r]![c]!;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => setSelected([r, c])}
                className={`relative flex h-8 w-8 items-center justify-center text-sm font-bold transition sm:h-10 sm:w-10 ${boxBorder} ${
                  conflict
                    ? "bg-rose-500/40 text-rose-100"
                    : sel
                      ? "bg-emerald-500/50 text-white"
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
            className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-white/10 text-base font-bold text-white transition hover:bg-white/20 active:scale-95"
          >
            {n === 0 ? (es ? "Borrar" : "Clear") : n}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-emerald-100/60">
        {es
          ? "Elegí dificultad, rellená números (teclado o botones). Modo lápiz para marcas. Deshacer y 3 pistas. Flechas para mover. Conflictos en rojo. Compartí enlace o PNG."
          : "Pick difficulty, place numbers (keyboard or buttons). Pencil mode for marks. Undo and 3 hints. Arrows to move. Conflicts in red. Share link or PNG."}
      </p>
    </div>
  );
}
