import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

type Diff = "easy" | "medium" | "hard";
const CONFIG: Record<Diff, { rows: number; cols: number; mines: number; labelEn: string; labelEs: string }> = {
  easy: { rows: 9, cols: 9, mines: 10, labelEn: "Easy 9×9", labelEs: "Fácil 9×9" },
  medium: { rows: 16, cols: 16, mines: 40, labelEn: "Medium 16×16", labelEs: "Medio 16×16" },
  hard: { rows: 16, cols: 30, mines: 99, labelEn: "Hard 16×30", labelEs: "Difícil 16×30" },
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

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function placeMines(board: Cell[][], mines: number, safeR: number, safeC: number, seed?: number): Cell[][] {
  const rows = board.length;
  const cols = board[0]!.length;
  const next = board.map((row) => row.map((c) => ({ ...c })));
  const rand = seed != null ? mulberry32(seed) : Math.random;
  let placed = 0;
  let guard = 0;
  while (placed < mines && guard < 8000) {
    guard++;
    const r = Math.floor(rand() * rows);
    const c = Math.floor(rand() * cols);
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

export function MinesweeperClassicGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const [diff, setDiff] = useState<Diff>("easy");
  const cfg = CONFIG[diff];
  const [board, setBoard] = useState(() => makeEmpty(cfg.rows, cfg.cols));
  const [started, setStarted] = useState(false);
  const [dead, setDead] = useState(false);
  const [won, setWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const longPressRef = useRef<{ r: number; c: number; t: number } | null>(null);
  const longFiredRef = useRef(false);
  const boardRef = useRef(board);
  const secondsRef = useRef(seconds);
  const diffRef = useRef(diff);
  boardRef.current = board;
  secondsRef.current = seconds;
  diffRef.current = diff;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("diff") as Diff | null;
    if (d && CONFIG[d]) {
      setDiff(d);
      setBoard(makeEmpty(CONFIG[d].rows, CONFIG[d].cols));
    }
    const s = params.get("seed");
    if (s) {
      const n = parseInt(s, 10);
      if (!Number.isNaN(n)) setSeed(n);
    }
  }, []);

  useEffect(() => {
    setBest(readBestLow(`minesweeper-classic_${diff}`));
  }, [diff]);

  useEffect(() => {
    if (!started || dead || won) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [started, dead, won]);

  const flags = useMemo(() => board.flat().filter((c) => c.flag).length, [board]);
  const minesLeft = cfg.mines - flags;

  const updateUrl = useCallback((d: Diff, s: number | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set("diff", d);
    if (s != null) url.searchParams.set("seed", String(s));
    else url.searchParams.delete("seed");
    window.history.replaceState(null, "", url);
  }, []);

  const reset = useCallback(
    (d: Diff = diff) => {
      const c = CONFIG[d];
      setDiff(d);
      setBoard(makeEmpty(c.rows, c.cols));
      setStarted(false);
      setDead(false);
      setWon(false);
      setSeconds(0);
      setSeed(null);
      updateUrl(d, null);
    },
    [diff, updateUrl],
  );

  const practiceSame = useCallback(() => {
    if (seed == null) return;
    const c = CONFIG[diff];
    setBoard(makeEmpty(c.rows, c.cols));
    setStarted(false);
    setDead(false);
    setWon(false);
    setSeconds(0);
  }, [diff, seed]);

  const checkWin = (b: Cell[][]) => {
    const ok = b.every((row) => row.every((cell) => cell.mine || cell.open));
    if (ok) {
      setWon(true);
      setBest(writeBestLow(`minesweeper-classic_${diffRef.current}`, secondsRef.current));
    }
  };

  const openAt = (r: number, c: number) => {
    if (dead || won) return;
    let cur = boardRef.current;
    let currentSeed = seed;
    if (!started) {
      if (currentSeed == null) {
        currentSeed = Math.floor(Math.random() * 1e9);
        setSeed(currentSeed);
        updateUrl(diff, currentSeed);
      }
      cur = placeMines(cur, cfg.mines, r, c, currentSeed);
      setStarted(true);
    }
    const cell = cur[r]![c]!;
    if (cell.open || cell.flag) return;
    if (cell.mine) {
      const revealed = cur.map((row) => row.map((x) => (x.mine ? { ...x, open: true } : { ...x })));
      setBoard(revealed);
      boardRef.current = revealed;
      setDead(true);
      return;
    }
    const next = floodOpen(cur, r, c);
    setBoard(next);
    boardRef.current = next;
    checkWin(next);
  };

  const chordAt = (r: number, c: number) => {
    if (dead || won || !started) return;
    const boardNow = boardRef.current;
    const cell = boardNow[r]![c]!;
    if (!cell.open || cell.n === 0) return;
    const nb = neighbors(r, c, cfg.rows, cfg.cols);
    const flagCount = nb.filter(([rr, cc]) => boardNow[rr]![cc]!.flag).length;
    if (flagCount !== cell.n) return;
    let cur = boardNow.map((row) => row.map((x) => ({ ...x })));
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
    boardRef.current = cur;
    if (hitMine) setDead(true);
    else checkWin(cur);
  };

  const flagAt = (r: number, c: number, e?: ReactMouseEvent | ReactTouchEvent) => {
    e?.preventDefault();
    if (dead || won) return;
    setBoard((b) => {
      const next = b.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r]![c]!;
      if (cell.open) return b;
      cell.flag = !cell.flag;
      boardRef.current = next;
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
    const cell = boardRef.current[r]?.[c];
    if (cell?.open && cell.n > 0) chordAt(r, c);
    else openAt(r, c);
  };

  const onPointerCancel = () => {
    const lp = longPressRef.current;
    if (lp) window.clearTimeout(lp.t);
    longPressRef.current = null;
  };

  const shareUrl = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* silent */
    }
  }, []);

  const exportPng = useCallback(() => {
    const rows = board.length;
    const cols = board[0]?.length || 0;
    if (!rows || !cols) return;
    const cellSize = Math.min(28, Math.floor(520 / Math.max(cols, 9)));
    const pad = 20;
    const headerH = 56;
    const footerH = 28;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(360, cols * cellSize + pad * 2);
    canvas.height = rows * cellSize + pad * 2 + headerH + footerH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(0, 0, canvas.width, 5);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Buscaminas Clásico · UtiliHub" : "Minesweeper Classic · UtiliHub", canvas.width / 2, 30);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui, sans-serif";
    const stats = `${es ? "Dificultad" : "Diff"}: ${diff} · ${seconds}s · ${minesLeft} ${es ? "minas" : "mines"}`;
    ctx.fillText(stats, canvas.width / 2, 48);
    const ox = (canvas.width - cols * cellSize) / 2;
    const oy = pad + headerH;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = board[r]![c]!;
        const x = ox + c * cellSize;
        const y = oy + r * cellSize;
        ctx.fillStyle = cell.open ? "#1e293b" : "#475569";
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        if (cell.open && cell.mine) {
          ctx.font = `${Math.floor(cellSize * 0.7)}px system-ui";
          ctx.fillText("💣", x + cellSize / 2, y + cellSize / 2 + cellSize * 0.25);
        } else if (cell.flag) {
          ctx.font = `${Math.floor(cellSize * 0.7)}px system-ui";
          ctx.fillText("🚩", x + cellSize / 2, y + cellSize / 2 + cellSize * 0.25);
        } else if (cell.open && cell.n > 0) {
          const colors = ["", "#38bdf8", "#34d399", "#fb7185", "#a78bfa", "#fbbf24", "#22d3ee", "#f472b6", "#ffffff"];
          ctx.fillStyle = colors[cell.n] || "#fff";
          ctx.font = `bold ${Math.floor(cellSize * 0.55)}px system-ui";
          ctx.fillText(String(cell.n), x + cellSize / 2, y + cellSize / 2 + cellSize * 0.2);
        }
      }
    }
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText("utilihub.app", canvas.width / 2, canvas.height - 10);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-minesweeper-classic-${diff}-${seed ?? "board"}.png`;
    a.click();
  }, [board, diff, seconds, es, seed, minesLeft]);

  return (
    <div className="mx-auto flex max-w-full flex-col items-center gap-3 px-1">
      <style>{`
        @keyframes mines-open {
          from { transform: scale(0.75); opacity: 0.4; }
          to { transform: scale(1); opacity: 1; }
        }
        .mines-open { animation: mines-open 0.16s cubic-bezier(0.34,1.4,0.64,1); }
        .mines-raised {
          background: linear-gradient(145deg, #64748b, #475569);
          box-shadow: inset 1px 1px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.25);
        }
        .mines-raised:hover { filter: brightness(1.1); }
        .mines-flag { background: linear-gradient(145deg, #64748b, #334155); }
        .mines-board {
          background: linear-gradient(160deg, #1e293b, #0f172a);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.35);
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold text-emerald-100/90 sm:gap-2 sm:text-sm">
        <GameSecondaryButton active={diff === "easy"} onClick={() => reset("easy")}>
          {CONFIG.easy[es ? "labelEs" : "labelEn"]}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "medium"} onClick={() => reset("medium")}>
          {CONFIG.medium[es ? "labelEs" : "labelEn"]}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "hard"} onClick={() => reset("hard")}>
          {CONFIG.hard[es ? "labelEs" : "labelEn"]}
        </GameSecondaryButton>
        <span>💣 {minesLeft}</span>
        <span className="tabular-nums">⏱ {seconds}s</span>
        {best != null && (
          <span>
            {es ? "Mejor" : "Best"}: {best}s
          </span>
        )}
        <GamePrimaryButton onClick={() => reset()}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
        {seed != null && (
          <GameSecondaryButton onClick={practiceSame}>
            {es ? "Misma" : "Same"}
          </GameSecondaryButton>
        )}
        <GameSecondaryButton onClick={exportPng}>{es ? "PNG" : "PNG"}</GameSecondaryButton>
        <GameSecondaryButton onClick={shareUrl}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Compartir" : "Share"}
        </GameSecondaryButton>
      </div>
      {(dead || won) && (
        <p className={`text-sm font-bold ${won ? "text-emerald-300" : "text-rose-300"}`} aria-live="polite">
          {won ? (es ? "¡Tablero limpio!" : "Board cleared!") : es ? "Boom — mina" : "Boom — mine"}
        </p>
      )}
      <div
        className="mines-board grid w-full max-w-full gap-px overflow-x-auto rounded-xl p-1 select-none touch-manipulation sm:gap-0.5 sm:p-2"
        style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(18px, 1fr))` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const show = cell.open;
            let label = "";
            let cls = "mines-raised text-transparent";
            if (show) {
              if (cell.mine) {
                label = "💣";
                cls = "bg-gradient-to-br from-rose-500 to-rose-800 text-white";
              } else if (cell.n) {
                label = String(cell.n);
                const colors = ["", "text-sky-300", "text-emerald-300", "text-rose-300", "text-violet-300", "text-amber-300", "text-cyan-300", "text-pink-300", "text-white"];
                cls = `bg-slate-900/90 ${colors[cell.n]}`;
              } else {
                cls = "bg-slate-900/80 text-transparent";
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
                className={`flex aspect-square items-center justify-center rounded-[2px] text-[9px] font-bold sm:text-[11px] ${cls} ${show ? "mines-open" : ""}`}
                aria-label={es ? `celda ${r + 1}-${c + 1}` : `cell ${r + 1}-${c + 1}`}
              >
                {label}
              </button>
            );
          }),
        )}
      </div>
      <p className="text-center text-[11px] text-white/50">
        {es
          ? "Toque = abrir · mantener = bandera · número abierto = acordes · Misma = practicar semilla · Compartir enlace ?diff=&seed="
          : "Tap = open · hold = flag · open number = chord · Same = practice seed · Share link with ?diff=&seed="}
      </p>
    </div>
  );
}
