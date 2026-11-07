import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestLow, writeBestLow } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";
import { type Diff } from "./MinesweeperClassicGame.part1";
import { CONFIG, makeEmpty, type Cell, type FlagState, placeMines, floodOpen, neighbors } from "./MinesweeperClassicGame.part2";

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
  const [flagMode, setFlagMode] = useState(false);
  const [focus, setFocus] = useState<[number, number] | null>([0, 0]);
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
      setFocus([0, 0]);
    }
    const s = params.get("seed");
    if (s) {
      const n = parseInt(s, 10);
      if (!Number.isNaN(n)) setSeed(n);
    }
  }, []);

  useEffect(() => {
    setBest(readBestLow(`minesweeper_classic_${diff}`));
  }, [diff]);

  useEffect(() => {
    if (!started || dead || won) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [started, dead, won]);

  const flags = useMemo(() => board.flat().filter((c) => c.flag === 1).length, [board]);
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
      setFocus([0, 0]);
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
    setFocus([0, 0]);
  }, [diff, seed]);

  const checkWin = (b: Cell[][]) => {
    const ok = b.every((row) => row.every((cell) => cell.mine || cell.open));
    if (ok) {
      setWon(true);
      setBest(writeBestLow(`minesweeper_classic_${diffRef.current}`, secondsRef.current));
      const flagged = b.map((row) =>
        row.map((cell) => (cell.mine && cell.flag !== 1 ? { ...cell, flag: 1 as FlagState } : cell)),
      );
      setBoard(flagged);
      boardRef.current = flagged;
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
    if (cell.open || cell.flag === 1) return;
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
    const flagCount = nb.filter(([rr, cc]) => boardNow[rr]![cc]!.flag === 1).length;
    if (flagCount !== cell.n) return;
    let cur = boardNow.map((row) => row.map((x) => ({ ...x })));
    let hitMine = false;
    for (const [rr, cc] of nb) {
      const n = cur[rr]![cc]!;
      if (n.open || n.flag === 1) continue;
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

  const cycleFlag = (r: number, c: number) => {
    if (dead || won) return;
    setBoard((b) => {
      const next = b.map((row) => row.map((cell) => ({ ...cell })));
      const cell = next[r]![c]!;
      if (cell.open) return b;
      cell.flag = ((cell.flag + 1) % 3) as FlagState;
      boardRef.current = next;
      return next;
    });
  };

  const onPointerDown = (r: number, c: number) => {
    setFocus([r, c]);
    longFiredRef.current = false;
    longPressRef.current = {
      r,
      c,
      t: window.setTimeout(() => {
        longFiredRef.current = true;
        cycleFlag(r, c);
      }, 420),
    };
  };

  const onPointerUp = (r: number, c: number) => {
    const lp = longPressRef.current;
    if (lp) window.clearTimeout(lp.t);
    longPressRef.current = null;
    if (longFiredRef.current) return;
    const cell = boardRef.current[r]?.[c];
    if (flagMode && !cell?.open) {
      cycleFlag(r, c);
      return;
    }
    if (cell?.open && cell.n > 0) chordAt(r, c);
    else openAt(r, c);
  };

  const onPointerCancel = () => {
    const lp = longPressRef.current;
    if (lp) window.clearTimeout(lp.t);
    longPressRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (dead || won || !focus) return;
      const [r, c] = focus;
      let nr = r, nc = c;
      if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
      else if (e.key === "ArrowDown") nr = Math.min(cfg.rows - 1, r + 1);
      else if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
      else if (e.key === "ArrowRight") nc = Math.min(cfg.cols - 1, c + 1);
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const cell = boardRef.current[r]?.[c];
        if (flagMode && !cell?.open) cycleFlag(r, c);
        else if (cell?.open && cell.n > 0) chordAt(r, c);
        else openAt(r, c);
        return;
      } else if (e.key === "f" || e.key === "F") {
        cycleFlag(r, c);
        return;
      } else return;
      if (nr !== r || nc !== c) {
        e.preventDefault();
        setFocus([nr, nc]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focus, dead, won, flagMode, cfg.rows, cfg.cols]);

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
    const cellSize = Math.min(32, Math.floor(900 / cols));
    const pad = 24;
    const headerH = 56;
    const footerH = 32;
    const canvas = document.createElement("canvas");
    canvas.width = cols * cellSize + pad * 2;
    canvas.height = rows * cellSize + pad * 2 + headerH + footerH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    const status = dead ? "💥" : won ? "😎" : "🙂";
    ctx.fillText(
      `${es ? "Buscaminas Clásico" : "Minesweeper Classic"} ${status} · UtiliHub`,
      canvas.width / 2,
      28,
    );
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(`${es ? "Dificultad" : "Difficulty"}: ${diff} · ${seconds}s · 💣${minesLeft}`, canvas.width / 2, 48);
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
          ctx.font = `${Math.floor(cellSize * 0.6)}px system-ui`;
          ctx.fillText("💣", x + cellSize / 2, y + cellSize / 2 + 6);
        } else if (cell.flag === 1) {
          ctx.font = `${Math.floor(cellSize * 0.6)}px system-ui`;
          ctx.fillText("🚩", x + cellSize / 2, y + cellSize / 2 + 6);
        } else if (cell.flag === 2) {
          ctx.font = `${Math.floor(cellSize * 0.55)}px system-ui`;
          ctx.fillText("❓", x + cellSize / 2, y + cellSize / 2 + 5);
        } else if (cell.open && cell.n > 0) {
          const colors = ["", "#38bdf8", "#34d399", "#fb7185", "#a78bfa", "#fbbf24", "#22d3ee", "#f472b6", "#ffffff"];
          ctx.fillStyle = colors[cell.n] || "#fff";
          ctx.font = `bold ${Math.floor(cellSize * 0.5)}px system-ui`;
          ctx.fillText(String(cell.n), x + cellSize / 2, y + cellSize / 2 + 5);
        }
      }
    }
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui";
    ctx.fillText("utilihub.app", canvas.width / 2, canvas.height - 12);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `utilihub-minesweeper-classic-${diff}-${seed ?? "board"}.png`;
    a.click();
  }, [board, diff, seconds, es, seed, minesLeft, dead, won]);

  const face = dead ? "😵" : won ? "😎" : started ? "🙂" : "😀";

  return (
    <div className="mx-auto flex max-w-full flex-col items-center gap-3 px-2 sm:px-0">
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
        .mines-focus { outline: 2px solid #10b981; outline-offset: 1px; z-index: 1; }
      `}</style>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-emerald-100/90">
        <button
          type="button"
          onClick={() => reset()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xl shadow-md transition hover:scale-105"
          aria-label={es ? "Nuevo juego" : "New game"}
        >
          {face}
        </button>
        <GameSecondaryButton active={diff === "easy"} onClick={() => reset("easy")}>
          {es ? "Fácil 9×9" : "Easy 9×9"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "medium"} onClick={() => reset("medium")}>
          {es ? "Medio 16×16" : "Medium 16×16"}
        </GameSecondaryButton>
        <GameSecondaryButton active={diff === "hard"} onClick={() => reset("hard")}>
          {es ? "Difícil 16×30" : "Hard 16×30"}
        </GameSecondaryButton>
        <GameSecondaryButton active={flagMode} onClick={() => setFlagMode((v) => !v)}>
          {flagMode ? (es ? "Bandera ON" : "Flag ON") : es ? "Bandera OFF" : "Flag OFF"}
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
          {won ? (es ? `¡Ganaste en ${seconds}s!` : `You cleared the board in ${seconds}s!`) : es ? "Boom — mina" : "Boom — mine"}
        </p>
      )}
      <div className="w-full max-w-full overflow-x-auto">
        <div
          className="mines-board grid mx-auto gap-px rounded-xl p-1.5 select-none touch-manipulation sm:gap-0.5 sm:p-2.5"
          style={{ gridTemplateColumns: `repeat(${cfg.cols}, minmax(18px, 1fr))`, width: "max-content", maxWidth: "100%" }}
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
              } else if (cell.flag === 1) {
                label = "🚩";
                cls = "mines-flag";
              } else if (cell.flag === 2) {
                label = "❓";
                cls = "mines-flag text-amber-200";
              }
              const isFocus = focus && focus[0] === r && focus[1] === c;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    cycleFlag(r, c);
                  }}
                  onPointerDown={() => onPointerDown(r, c)}
                  onPointerUp={() => onPointerUp(r, c)}
                  onPointerLeave={onPointerCancel}
                  onPointerCancel={onPointerCancel}
                  className={`flex aspect-square items-center justify-center rounded-[2px] text-[10px] font-bold transition-colors sm:rounded-sm sm:text-xs ${cls} ${show ? "mines-open" : ""} ${isFocus ? "mines-focus" : ""}`}
                  aria-label={es ? `celda ${r + 1}-${c + 1}` : `cell ${r + 1}-${c + 1}`}
                >
                  {label}
                </button>
              );
            }),
          )}
        </div>
      </div>
      <p className="text-center text-[11px] text-white/50 max-w-md">
        {es
          ? "Toque = abrir (o ciclar bandera/❓ si modo ON) · mantener o clic derecho = ciclar bandera → ❓ → vacío · número abierto abre vecinos · cara reinicia · Misma = practicar el mismo tablero · Compartir copia el enlace con semilla. Primer clic siempre seguro. Al ganar se colocan banderas automáticamente. Teclado: flechas mueven foco, Enter/Espacio abre o bandera, F cicla bandera."
          : "Tap = open (or cycle flag/❓ if Flag ON) · hold or right-click = cycle flag → ❓ → empty · open number = chord · face resets · Same = practice same board · Share copies the seeded link. First click always safe. Flags auto-place on win. Keyboard: arrows move focus, Enter/Space open or flag, F cycles flag."}
      </p>
    </div>
  );
}
