import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Diff = "easy" | "medium" | "hard";
const CONFIG: Record<Diff, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 25 },
  hard: { rows: 16, cols: 16, mines: 40 },
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
  let guard = 0;
  while (placed < mines && guard < 5000) {
    guard++;
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
  const longPressRef = useRef<{ r: number; c: number; t: number } | null>(null);
  const longFiredRef = useRef(false);

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

  const chordAt = (r: number, c: number) => {
    if (dead || won || !started) return;
    const cell = board[r]![c]!;
    if (!cell.open || cell.n === 0) return;
    const nb = neighbors(r, c, cfg.rows, cfg.cols);
    const flagCount = nb.filter(([rr, cc]) => board[rr]![cc]!.flag).length;
    if (flagCount !== cell.n) return;
    let cur = board.map((row) => row.map((x) => ({ ...x })));
    let hitMine = false;
    for (const [rr, cc] of nb) {
      const n = cur[rr]![cc]!;
      if (n.open || n.flag) continue;
      if (n.mine) {
        hitMine = true;
        cur = cur.map((row) => row.map((x) => (x.mine ? { ...x, open: true } : { ...x })));
        break;
      }
      cur = floodOpen(cur, rr, cc);
    }
    setBoard(cur);
    if (hitMine) setDead(true);
    else checkWin(cur);
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

  const onPointerDown = (r: number, c: number) => {
    longFiredRef.current = false;
    longPressRef.current = {
      r,
      c,
      t: window.setTimeout(() => {
        longFiredRef.current = true;
        flagAt(r, c);
      }, 420),
    };
  };

  const onPointerUp = (r: number, c: number) => {
    const lp = longPressRef.current;
    if (lp) window.clearTimeout(lp.t);
    longPressRef.current = null;
    if (longFiredRef.current) return;
    const cell = board[r]?.[c];
    if (cell?.open && cell.n > 0) chordAt(r, c);
    else openAt(r, c);
  };

  const onPointerCancel = () => {
    const lp = longPressRef.current;
    if (lp) window.clearTimeout(lp.t);
    longPressRef.current = null;
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3">
      <style>{`
        @keyframes mines-open {
          from { transform: scale(0.7); opacity: 0.3; }
          to { transform: scale(1); opacity: 1; }
        }
        .mines-open { animation: mines-open 0.18s cubic-bezier(0.34,1.4,0.64,1); }
        .mines-raised {
          background: linear-gradient(145deg, #64748b, #475569);
          box-shadow: inset 1px 1px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.2);
        }
        .mines-raised:hover { filter: brightness(1.12); }
        .mines-flag {
          background: linear-gradient(145deg, #64748b, #334155);
          box-shadow: inset 1px 1px 0 rgba(255,255,255,0.2);
        }
        .mines-board {
          background: linear-gradient(160deg, #1e293b, #0f172a);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.35);
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-emerald-100/90">
        <GameSecondaryButton active={diff === "easy"} onClick={() => reset("easy")}>
          {es ? "Fácil" : "Easy"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "medium"} onClick={() => reset("medium")}>
          {es ? "Medio" : "Medium"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "hard"} onClick={() => reset("hard")}>
          {es ? "Difícil" : "Hard"}
        </GameSecondaryButton>
        <span>💣 {minesLeft}</span>
        <span className="tabular-nums">⏱ {seconds}s</span>
        {best != null && (
          <span>
            {es ? "Mejor" : "Best"}: {best}s
          </span>
        )}
        <GamePrimaryButton onClick={() => reset()}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
      </div>
      {(dead || won) && (
        <p className={`text-sm font-bold ${won ? "text-emerald-300" : "text-rose-300"}`}>
          {won ? (es ? "¡Ganaste!" : "You cleared the board!") : es ? "Boom — mina" : "Boom — mine"}
        </p>
      )}
      <div
        className="mines-board grid gap-0.5 rounded-xl p-2.5 select-none touch-manipulation"
        style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const show = cell.open;
            let label = "";
            let cls = "mines-raised text-transparent";
            if (show) {
              if (cell.mine) {
                label = "💣";
                cls = "bg-gradient-to-br from-rose-500 to-rose-800 text-white shadow-lg";
              } else if (cell.n) {
                label = String(cell.n);
                const colors = ["", "text-sky-300", "text-emerald-300", "text-rose-300", "text-violet-300", "text-amber-300", "text-cyan-300", "text-pink-300", "text-white"];
                cls = `bg-slate-900/90 ${colors[cell.n]} shadow-inner`;
              } else {
                cls = "bg-slate-900/80 text-transparent shadow-inner";
              }
            } else if (cell.flag) {
              label = "🚩";
              cls = "mines-flag";
            }
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onContextMenu={(e) => flagAt(r, c, e)}
                onPointerDown={() => onPointerDown(r, c)}
                onPointerUp={() => onPointerUp(r, c)}
                onPointerLeave={onPointerCancel}
                onPointerCancel={onPointerCancel}
                className={`flex h-7 w-7 items-center justify-center rounded-sm text-xs font-bold transition-colors sm:h-8 sm:w-8 ${cls} ${show ? "mines-open" : ""}`}
              >
                {label}
              </button>
            );
          }),
        )}
      </div>
      <p className="text-center text-[11px] text-white/50">
        {es
          ? "Toque = abrir · mantener = bandera · número abierto = acorde"
          : "Tap = open · hold = flag · open number = chord"}
      </p>
    </div>
  );
}
