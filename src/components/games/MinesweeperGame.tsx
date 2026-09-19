import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Diff = "easy" | "medium";
const CONFIG: Record<Diff, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 25 },
};

type Cell = {
  mine: boolean;
  open: boolean;
  flag: boolean;
  n: number;
};

function neighbors(r: number, c: number, rows: number, cols: number) {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push([rr, cc]);
    }
  }
  return out;
}

function makeEmpty(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, open: false, flag: false, n: 0 })),
  );
}

function placeMines(board: Cell[][], mines: number, safeR: number, safeC: number): Cell[][] {
  const rows = board.length;
  const cols = board[0]!.length;
  const next = board.map((row) => row.map((c) => ({ ...c })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if ((r === safeR && c === safeC) || next[r]![c]!.mine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    next[r]![c]!.mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (next[r]![c]!.mine) continue;
      next[r]![c]!.n = neighbors(r, c, rows, cols).filter(([rr, cc]) => next[rr]![cc]!.mine).length;
    }
  }
  return next;
}

function floodOpen(board: Cell[][], r: number, c: number): Cell[][] {
  const rows = board.length;
  const cols = board[0]!.length;
  const next = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const cell = next[cr]![cc]!;
    if (cell.open || cell.flag) continue;
    cell.open = true;
    if (cell.mine || cell.n > 0) continue;
    for (const [nr, nc] of neighbors(cr, cc, rows, cols)) {
      if (!next[nr]![nc]!.open && !next[nr]![nc]!.flag) stack.push([nr, nc]);
    }
  }
  return next;
}

export function MinesweeperGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [diff, setDiff] = useState<Diff>("easy");
  const cfg = CONFIG[diff];
  const [board, setBoard] = useState(() => makeEmpty(cfg.rows, cfg.cols));
  const [started, setStarted] = useState(false);
  const [dead, setDead] = useState(false);
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    setBest(readBestLow(`minesweeper_${diff}`));
  }, [diff]);

  useEffect(() => {
    if (!started || dead || won) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [started, dead, won]);

  const flags = useMemo(() => board.flat().filter((c) => c.flag).length, [board]);
  const minesLeft = cfg.mines - flags;

  const reset = useCallback(
    (d: Diff = diff) => {
      const c = CONFIG[d];
      setDiff(d);
      setBoard(makeEmpty(c.rows, c.cols));
      setStarted(false);
      setDead(false);
      setWon(false);
      setSeconds(0);
    },
    [diff],
  );

  const checkWin = (b: Cell[][]) => {
    const ok = b.every((row) => row.every((cell) => cell.mine || cell.open));
    if (ok) {
      setWon(true);
      setBest(writeBestLow(`minesweeper_${diff}`, seconds + 1));
    }
  };

  const openAt = (r: number, c: number) => {
    if (dead || won) return;
    let cur = board;
    if (!started) {
      cur = placeMines(board, cfg.mines, r, c);
      setStarted(true);
    }
    const cell = cur[r]![c]!;
    if (cell.open || cell.flag) return;
    if (cell.mine) {
      const revealed = cur.map((row) => row.map((x) => (x.mine ? { ...x, open: true } : { ...x })));
      setBoard(revealed);
      setDead(true);
      return;
    }
    const next = floodOpen(cur, r, c);
    setBoard(next);
    checkWin(next);
  };

  const flagAt = (r: number, c: number, e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault();
    if (dead || won) return;
    setBoard((b) => {
      const next = b.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r]![c]!;
      if (cell.open) return b;
      cell.flag = !cell.flag;
      return next;
    });
  };

  return (
    <div className="mx-auto flex flex-col items-center gap-3">
      <style>{`
        @keyframes mines-reveal {
          0% { transform: scale(0.85); filter: brightness(1.4); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        .mines-open { animation: mines-reveal 0.15s ease-out; }
      `}</style>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-emerald-100/90">
        <GameSecondaryButton active={diff === "easy"} onClick={() => reset("easy")}>{es ? "Fácil" : "Easy"}</GameSecondaryButton>
        <GameSecondaryButton active={diff === "medium"} onClick={() => reset("medium")}>{es ? "Medio" : "Medium"}</GameSecondaryButton>
        <span>💣 {minesLeft}</span>
        <span className="tabular-nums">⏱ {seconds}s</span>
        {best != null && <span>{es ? "Mejor" : "Best"}: {best}s</span>}
        <GamePrimaryButton onClick={() => reset()}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
      </div>
      {(dead || won) && (
        <p className={`text-sm font-bold ${won ? "text-emerald-300" : "text-rose-300"}`}>
          {won ? (es ? "¡Ganaste!" : "You cleared the board!") : es ? "Boom — mina" : "Boom — mine"}
        </p>
      )}
      <div
        className="grid gap-0.5 rounded-xl bg-black/30 p-2"
        style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const show = cell.open;
            let label = "";
            let cls = "bg-slate-600 text-transparent hover:bg-slate-500";
            if (show) {
              if (cell.mine) {
                label = "💣";
                cls = "bg-rose-700 text-white";
              } else if (cell.n) {
                label = String(cell.n);
                const colors = ["", "text-sky-300", "text-emerald-300", "text-rose-300", "text-violet-300", "text-amber-300", "text-cyan-300", "text-pink-300", "text-white"];
                cls = `bg-slate-800 ${colors[cell.n]}`;
              } else {
                cls = "bg-slate-800 text-transparent";
              }
            } else if (cell.flag) {
              label = "🚩";
              cls = "bg-slate-600";
            }
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => openAt(r, c)}
                onContextMenu={(e) => flagAt(r, c, e)}
                onDoubleClick={() => flagAt(r, c)}
                className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs font-bold transition-colors sm:h-8 sm:w-8 ${cls} ${show ? "mines-open" : ""}`}
              >
                {label}
              </button>
            );
          }),
        )}
      </div>
      <p className="text-center text-[11px] text-white/50">
        {es ? "Clic = abrir · clic derecho / doble clic = bandera" : "Click = open · right-click / double-click = flag"}
      </p>
    </div>
  );
}
