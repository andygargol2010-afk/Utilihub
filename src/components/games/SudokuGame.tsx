import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Diff = "easy" | "medium" | "hard";
type Board = number[][];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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

function solve(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]![c] !== 0) continue;
      for (const n of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (!isValid(board, r, c, n)) continue;
        board[r]![c] = n;
        if (solve(board)) return true;
        board[r]![c] = 0;
      }
      return false;
    }
  }
  return true;
}

function generate(diff: Diff): { puzzle: Board; solution: Board } {
  const solution: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(solution);
  const puzzle = solution.map((row) => row.slice());
  const holes = diff === "easy" ? 36 : diff === "medium" ? 46 : 54;
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i));
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

export function SudokuGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [diff, setDiff] = useState<Diff>("easy");
  const [{ puzzle, solution }, setGame] = useState(() => generate("easy"));
  const [grid, setGrid] = useState<Board>(() => puzzle.map((r) => r.slice()));
  const [fixed, setFixed] = useState(() => puzzle.map((row) => row.map((n) => n !== 0)));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState<number | null>(() => readBestLow("sudoku_easy"));
  const [msg, setMsg] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running || won) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running, won]);

  const selectedVal = selected ? grid[selected[0]]![selected[1]]! : 0;

  const conflictMap = useMemo(() => {
    const m = new Set<string>();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (hasConflict(grid, r, c)) m.add(`${r}-${c}`);
      }
    }
    return m;
  }, [grid]);

  const newGame = useCallback((d: Diff) => {
    const g = generate(d);
    setDiff(d);
    setGame(g);
    setGrid(g.puzzle.map((r) => r.slice()));
    setFixed(g.puzzle.map((row) => row.map((n) => n !== 0)));
    setSelected(null);
    setSeconds(0);
    setRunning(true);
    setWon(false);
    setMsg("");
    setBest(readBestLow(`sudoku_${d}`));
    setTick((t) => t + 1);
  }, []);

  const put = (n: number) => {
    if (!selected || won) return;
    const [r, c] = selected;
    if (fixed[r]![c]) return;
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[r]![c] = n;
      const complete = next.every((row, ri) => row.every((v, ci) => v === solution[ri]![ci]));
      if (complete) {
        setWon(true);
        setRunning(false);
        setBest(writeBestLow(`sudoku_${diff}`, seconds + 1));
        setMsg(es ? "¡Sudoku resuelto!" : "Sudoku solved!");
      }
      return next;
    });
  };

  const check = () => {
    let errors = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = grid[r]![c]!;
        if (v !== 0 && v !== solution[r]![c]) errors++;
      }
    }
    setMsg(
      errors === 0
        ? es
          ? "Sin errores (aún puede faltar completar)."
          : "No mistakes so far."
        : es
          ? `${errors} casilla(s) incorrecta(s)`
          : `${errors} incorrect cell(s)`,
    );
  };

  const hint = () => {
    if (won) return;
    const empties: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r]![c] === 0) empties.push([r, c]);
      }
    }
    if (!empties.length) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)]!;
    setGrid((g) => {
      const next = g.map((row) => row.slice());
      next[r]![c] = solution[r]![c]!;
      return next;
    });
    setSelected([r, c]);
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
      <style>{`
        @keyframes sudoku-pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .sudoku-num { display: inline-block; animation: sudoku-pop 0.18s ease-out; }
      `}</style>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-emerald-100/90">
        <GameSecondaryButton active={diff === "easy"} onClick={() => newGame("easy")}>
          {es ? "Fácil" : "Easy"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "medium"} onClick={() => newGame("medium")}>
          {es ? "Medio" : "Med"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "hard"} onClick={() => newGame("hard")}>
          {es ? "Difícil" : "Hard"}
        </GameSecondaryButton>
        <span className="tabular-nums">⏱ {seconds}s</span>
        {best != null && (
          <span>
            {es ? "Mejor" : "Best"}: {best}s
          </span>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <GamePrimaryButton onClick={() => newGame(diff)}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
        <GameSecondaryButton onClick={check}>{es ? "Comprobar" : "Check"}</GameSecondaryButton>
        <GameSecondaryButton onClick={hint}>{es ? "Pista" : "Hint"}</GameSecondaryButton>
      </div>
      {msg && (
        <p className={`text-sm font-bold ${won ? "text-amber-300" : "text-emerald-300"}`}>{msg}</p>
      )}
      <div className="grid grid-cols-9 gap-0.5 rounded-xl bg-emerald-950/50 p-1.5" key={tick}>
        {grid.map((row, r) =>
          row.map((v, c) => {
            const isFixed = fixed[r]![c];
            const sel = selected?.[0] === r && selected?.[1] === c;
            const inLine =
              selected &&
              (selected[0] === r ||
                selected[1] === c ||
                (Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
                  Math.floor(selected[1] / 3) === Math.floor(c / 3)));
            const sameNum = selectedVal > 0 && v === selectedVal;
            const conflict = conflictMap.has(`${r}-${c}`);
            const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
            const border =
              (c % 3 === 2 && c !== 8 ? "border-r-2 border-r-emerald-500/40 " : "") +
              (r % 3 === 2 && r !== 8 ? "border-b-2 border-b-emerald-500/40 " : "");
            let bg = box % 2 === 0 ? "bg-white/10" : "bg-white/5";
            if (inLine) bg = "bg-emerald-500/15";
            if (sameNum) bg = "bg-sky-500/25";
            if (sel) bg = "bg-emerald-500/45";
            if (conflict) bg = "bg-rose-500/35";
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => setSelected([r, c])}
                className={`flex h-8 w-8 items-center justify-center text-sm font-bold sm:h-9 sm:w-9 ${border} ${bg} ${
                  conflict ? "text-rose-200" : isFixed ? "text-emerald-200" : "text-amber-200"
                }`}
              >
                {v ? (
                  <span className="sudoku-num" key={`${r}-${c}-${v}`}>
                    {v}
                  </span>
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
            className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-1 text-sm font-bold text-white hover:bg-white/20 ${
              selectedVal === n && n !== 0 ? "bg-emerald-500/40 ring-1 ring-emerald-300/50" : "bg-white/10"
            }`}
          >
            {n === 0 ? (es ? "Borrar" : "Clear") : n}
          </button>
        ))}
      </div>
    </div>
  );
}
