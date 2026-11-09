import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { type Diff } from "./MinesweeperGame.part1";
import { CONFIG, makeEmpty, type Cell, placeMines, floodOpen, neighbors } from "./MinesweeperGame.part2";

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
    setBest(readBestLow(`minesweeper_${diff}`));
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
      setBest(writeBestLow(`minesweeper_${diffRef.current}`, secondsRef.current));
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
      // fallback silent
    }
  }, []);

  const exportPng = useCallback(() => {
    const rows = board.length;
    const cols = board[0]?.length || 0;
    if (!rows || !cols) return;
    const cellSize = 32;
    const pad = 24;
    const headerH = 48;
    const footerH = 32;
    const canvas = document.createElement("canvas");
    canvas.width = cols * cellSize + pad * 2;
    canvas.height = rows * cellSize + pad * 2 + headerH + footerH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // header
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Buscaminas · UtiliHub" : "Minesweeper · UtiliHub", canvas.width / 2, 28);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(`${es ? "Dificultad" : "Difficulty"}: ${diff} · ${seconds}s`, canvas.width / 2, 46);
    // board
    const ox = pad;
    const oy = pad + headerH;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = board[r]![c]!;
        const x = ox + c * cellSize;
        const y = oy + r * cellSize;
        ctx.fillStyle = cell.open ? "#1e293b" : "#475569";
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        if (cell.open && cell.mine) {
          ctx.font = "20px system-ui";
          ctx.fillText("💣", x + cellSize / 2, y + cellSize / 2 + 6);
        } else if (cell.flag) {
          ctx.font = "20px system-ui";
          ctx.fillText("🚩", x + cellSize / 2, y + cellSize / 2 + 6);
        } else if (cell.open && cell.n > 0) {
          const colors = ["", "#38bdf8", "#34d399", "#fb7185", "#a78bfa", "#fbbf24", "#22d3ee", "#f472b6", "#ffffff"];
          ctx.fillStyle = colors[cell.n] || "#fff";
          ctx.font = "bold 16px system-ui";
          ctx.fillText(String(cell.n), x + cellSize / 2, y + cellSize / 2 + 5);
        }
      }
    }
    // footer
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText("utilihub.app", canvas.width / 2, canvas.height - 12);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-minesweeper-${diff}-${seed ?? "board"}.png`;
    a.click();
  }, [board, diff, seconds, es, seed]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-2 sm:px-0">
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
        <p className={`text-sm font-bold ${won ? "text-emerald-300" : "text-rose-300"}`}>
          {won ? (es ? "¡Ganaste!" : "You cleared the board!") : es ? "Boom — mina" : "Boom — mine"}
        </p>
      )}
      <div
        className="mines-board grid w-full max-w-full gap-px rounded-xl p-1.5 select-none touch-manipulation sm:gap-0.5 sm:p-2.5"
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
                className={`flex aspect-square items-center justify-center rounded-[2px] text-[10px] font-bold transition-colors sm:rounded-sm sm:text-xs ${cls} ${show ? "mines-open" : ""}`}
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
          ? "Toque = abrir · mantener = poner bandera · número abierto abre vecinos · Misma = practicar el mismo tablero · Compartir copia el enlace con semilla"
          : "Tap = open · hold = flag · open number = chord · Same = practice same board · Share copies the seeded link"}
      </p>
    </div>
  );
}
