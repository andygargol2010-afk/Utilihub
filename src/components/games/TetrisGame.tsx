import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS = 10;
const ROWS = 20;
const CELL = 22;
const PAD = 10;
const SIDE = 96;
const W = COLS * CELL + PAD * 2 + SIDE;
const H = ROWS * CELL + PAD * 2;

type Cell = number;
type Pt = { x: number; y: number };
type Piece = { kind: number; rot: number; x: number; y: number };

const SHAPES: Pt[][][] = [
  [
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
    [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
  ],
  [
    [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
  ],
  [
    [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
    [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  ],
  [
    [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  ],
  [
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  ],
  [
    [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
  ],
  [
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }],
  ],
];

const COLORS = ["#22d3ee", "#fbbf24", "#a78bfa", "#fb923c", "#60a5fa", "#4ade80", "#f87171"];

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function cellsOf(p: Piece): Pt[] {
  return SHAPES[p.kind]![p.rot]!.map((c) => ({ x: c.x + p.x, y: c.y + p.y }));
}

function collides(board: Cell[][], p: Piece): boolean {
  for (const c of cellsOf(p)) {
    if (c.x < 0 || c.x >= COLS || c.y >= ROWS) return true;
    if (c.y >= 0 && board[c.y]![c.x]) return true;
  }
  return false;
}

function merge(board: Cell[][], p: Piece): Cell[][] {
  const next = board.map((row) => row.slice());
  for (const c of cellsOf(p)) {
    if (c.y >= 0 && c.y < ROWS && c.x >= 0 && c.x < COLS) {
      next[c.y]![c.x] = p.kind + 1;
    }
  }
  return next;
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const kept = board.filter((row) => row.some((v) => !v));
  const cleared = ROWS - kept.length;
  while (kept.length < ROWS) kept.unshift(Array(COLS).fill(0));
  return { board: kept, cleared };
}

function scoreFor(lines: number, level: number) {
  const base = [0, 100, 300, 500, 800][lines] ?? 0;
  return base * (level + 1);
}

function dropInterval(level: number) {
  return Math.max(80, 800 - level * 60);
}

function bagShuffle(bag: number[]): number[] {
  const a = bag.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function spawnPiece(kind: number): Piece {
  return { kind, rot: 0, x: 3, y: -1 };
}

const SLUG = "tetris";

export function TetrisGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef(emptyBoard());
  const pieceRef = useRef<Piece | null>(null);
  const nextRef = useRef(0);
  const bagRef = useRef<number[]>([]);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [best, setBest] = useState(0);
  const [nextKind, setNextKind] = useState(0);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(0);
  const dropAcc = useRef(0);
  const lastTs = useRef(0);
  const keys = useRef({ left: false, right: false, down: false });
  const dasAcc = useRef(0);

  const pullNext = useCallback(() => {
    if (bagRef.current.length === 0) {
      bagRef.current = bagShuffle([0, 1, 2, 3, 4, 5, 6]);
    }
    return bagRef.current.pop()!;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    const ox = PAD;
    const oy = PAD;

    ctx.fillStyle = "#020617";
    ctx.fillRect(ox, oy, COLS * CELL, ROWS * CELL);

    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.lineWidth = 1;
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(ox, oy + r * CELL);
      ctx.lineTo(ox + COLS * CELL, oy + r * CELL);
      ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(ox + c * CELL, oy);
      ctx.lineTo(ox + c * CELL, oy + ROWS * CELL);
      ctx.stroke();
    }

    const paintCell = (x: number, y: number, color: string, ghost = false) => {
      if (y < 0) return;
      const px = ox + x * CELL;
      const py = oy + y * CELL;
      ctx.globalAlpha = ghost ? 0.28 : 1;
      ctx.fillStyle = color;
      ctx.fillRect(px + 1, py + 1, CELL - 2, CELL - 2);
      if (!ghost) {
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(px + 2, py + 2, CELL - 6, 3);
      }
      ctx.globalAlpha = 1;
    };

    const board = boardRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = board[r]![c]!;
        if (v) paintCell(c, r, COLORS[v - 1]!);
      }
    }

    const piece = pieceRef.current;
    if (piece) {
      let gy = piece.y;
      while (!collides(board, { ...piece, y: gy + 1 })) gy++;
      if (gy !== piece.y) {
        for (const c of cellsOf({ ...piece, y: gy })) {
          paintCell(c.x, c.y, COLORS[piece.kind]!, true);
        }
      }
      for (const c of cellsOf(piece)) {
        paintCell(c.x, c.y, COLORS[piece.kind]!);
      }
    }

    const sx = ox + COLS * CELL + 12;
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.fillRect(sx, oy, SIDE - 16, 90);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 11px system-ui,sans-serif";
    ctx.fillText(es ? "Siguiente" : "Next", sx + 8, oy + 16);

    const nk = nextRef.current;
    const shape = SHAPES[nk]![0]!;
    const color = COLORS[nk]!;
    for (const c of shape) {
      const px = sx + 10 + c.x * 14;
      const py = oy + 28 + c.y * 14;
      ctx.fillStyle = color;
      ctx.fillRect(px, py, 12, 12);
    }

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "600 12px system-ui,sans-serif";
    ctx.fillText(`${es ? "Nivel" : "Level"} ${levelRef.current}`, sx + 8, oy + 120);
    ctx.fillText(`${es ? "Líneas" : "Lines"} ${linesRef.current}`, sx + 8, oy + 140);
  }, [es]);

  const lockPiece = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;
    let board = merge(boardRef.current, piece);
    const { board: clearedBoard, cleared } = clearLines(board);
    boardRef.current = clearedBoard;
    if (cleared) {
      linesRef.current += cleared;
      levelRef.current = Math.floor(linesRef.current / 10);
      scoreRef.current += scoreFor(cleared, levelRef.current);
      setLines(linesRef.current);
      setLevel(levelRef.current);
      setScore(scoreRef.current);
      setBest(writeBestScore(SLUG, scoreRef.current));
    }
    const kind = nextRef.current;
    nextRef.current = pullNext();
    setNextKind(nextRef.current);
    const next = spawnPiece(kind);
    if (collides(boardRef.current, next)) {
      pieceRef.current = null;
      setGameOver(true);
      setRunning(false);
      setBest(writeBestScore(SLUG, scoreRef.current));
      return;
    }
    pieceRef.current = next;
  }, [pullNext]);

  const tryMove = useCallback((dx: number, dy: number, dRot = 0) => {
    const piece = pieceRef.current;
    if (!piece) return false;
    const next: Piece = {
      kind: piece.kind,
      rot: (piece.rot + dRot + 4) % 4,
      x: piece.x + dx,
      y: piece.y + dy,
    };
    if (!collides(boardRef.current, next)) {
      pieceRef.current = next;
      return true;
    }
    if (dRot !== 0) {
      for (const kick of [-1, 1, -2, 2]) {
        const kicked = { ...next, x: piece.x + kick };
        if (!collides(boardRef.current, kicked)) {
          pieceRef.current = kicked;
          return true;
        }
      }
    }
    return false;
  }, []);

  const hardDrop = useCallback(() => {
    const piece = pieceRef.current;
    if (!piece) return;
    let dist = 0;
    while (tryMove(0, 1)) dist++;
    scoreRef.current += dist * 2;
    setScore(scoreRef.current);
    lockPiece();
  }, [lockPiece, tryMove]);

  const start = useCallback(() => {
    boardRef.current = emptyBoard();
    bagRef.current = [];
    const first = pullNext();
    nextRef.current = pullNext();
    pieceRef.current = spawnPiece(first);
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 0;
    dropAcc.current = 0;
    lastTs.current = 0;
    setScore(0);
    setLines(0);
    setLevel(0);
    setNextKind(nextRef.current);
    setGameOver(false);
    setPaused(false);
    setRunning(true);
    setBest(readBestScore(SLUG));
  }, [pullNext]);

  useEffect(() => {
    if (!running || paused || gameOver) return;
    let raf = 0;
    const tick = (ts: number) => {
      if (!lastTs.current) lastTs.current = ts;
      const dt = ts - lastTs.current;
      lastTs.current = ts;

      if (keys.current.left || keys.current.right) {
        dasAcc.current += dt;
        if (dasAcc.current > 140) {
          tryMove(keys.current.left ? -1 : 1, 0);
          dasAcc.current = 100;
        }
      } else {
        dasAcc.current = 0;
      }

      const interval = keys.current.down ? 40 : dropInterval(levelRef.current);
      dropAcc.current += dt;
      if (dropAcc.current >= interval) {
        dropAcc.current = 0;
        if (!tryMove(0, 1)) {
          lockPiece();
        } else if (keys.current.down) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, gameOver, draw, tryMove, lockPiece]);

  useEffect(() => {
    draw();
  }, [draw, running, paused, gameOver, score, nextKind]);

  useEffect(() => {
    setBest(readBestScore(SLUG));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowdown", "arrowup", " ", "w", "a", "s", "d", "x", "z"].includes(k)) {
        e.preventDefault();
      }
      if (k === " " || k === "p") {
        if (running && !gameOver) setPaused((p) => !p);
        return;
      }
      if (gameOver || paused || !running) return;
      if (k === "arrowleft" || k === "a") {
        tryMove(-1, 0);
        keys.current.left = true;
        dasAcc.current = 0;
      } else if (k === "arrowright" || k === "d") {
        tryMove(1, 0);
        keys.current.right = true;
        dasAcc.current = 0;
      } else if (k === "arrowdown" || k === "s") {
        keys.current.down = true;
      } else if (k === "arrowup" || k === "w" || k === "x") {
        tryMove(0, 0, 1);
      } else if (k === "z") {
        tryMove(0, 0, -1);
      } else if (k === "enter") {
        hardDrop();
      }
      draw();
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") keys.current.left = false;
      if (k === "arrowright" || k === "d") keys.current.right = false;
      if (k === "arrowdown" || k === "s") keys.current.down = false;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, [running, paused, gameOver, tryMove, hardDrop, draw]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm text-white/80">
        <span className="font-bold tabular-nums">
          {es ? "Puntos" : "Score"} {score}
        </span>
        <span className="tabular-nums text-white/60">
          {es ? "Mejor" : "Best"} {best}
        </span>
        <span className="tabular-nums text-white/60">
          {es ? "Nivel" : "Lv"} {level} · {lines} {es ? "líneas" : "lines"}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lift">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block max-w-full touch-none bg-slate-950"
          style={{ width: "100%", height: "auto" }}
        />
        {(paused || gameOver || !running) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/75 px-4 text-center backdrop-blur-[2px]">
            <p className="text-lg font-black text-white">
              {gameOver ? "Game over" : paused ? (es ? "Pausa" : "Paused") : "Tetris"}
            </p>
            {gameOver && (
              <p className="text-sm text-white/70">
                {es ? "Puntos" : "Score"}: {score}
              </p>
            )}
            <GamePrimaryButton
              onClick={() => {
                if (paused && running && !gameOver) setPaused(false);
                else start();
              }}
            >
              {gameOver || !running ? (es ? "Jugar" : "Play") : es ? "Continuar" : "Continue"}
            </GamePrimaryButton>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {running && !gameOver && (
          <GameSecondaryButton onClick={() => setPaused((p) => !p)} active={paused}>
            {paused ? (es ? "Continuar" : "Continue") : es ? "Pausa" : "Pause"}
          </GameSecondaryButton>
        )}
        <GameSecondaryButton onClick={start}>{es ? "Reiniciar" : "Restart"}</GameSecondaryButton>
      </div>

      <div className="grid w-full max-w-xs grid-cols-4 gap-2 sm:hidden">
        <button
          type="button"
          aria-label={es ? "Izquierda" : "Left"}
          onPointerDown={(e) => {
            e.preventDefault();
            tryMove(-1, 0);
            draw();
          }}
          className="flex h-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/30"
        >
          ◀
        </button>
        <button
          type="button"
          aria-label={es ? "Rotar" : "Rotate"}
          onPointerDown={(e) => {
            e.preventDefault();
            tryMove(0, 0, 1);
            draw();
          }}
          className="flex h-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/30"
        >
          ↻
        </button>
        <button
          type="button"
          aria-label={es ? "Derecha" : "Right"}
          onPointerDown={(e) => {
            e.preventDefault();
            tryMove(1, 0);
            draw();
          }}
          className="flex h-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/30"
        >
          ▶
        </button>
        <button
          type="button"
          aria-label={es ? "Caída rápida" : "Hard drop"}
          onPointerDown={(e) => {
            e.preventDefault();
            hardDrop();
            draw();
          }}
          className="flex h-12 items-center justify-center rounded-xl bg-emerald-500/80 text-sm font-bold text-emerald-950 active:bg-emerald-400"
        >
          ⬇
        </button>
        <button
          type="button"
          aria-label={es ? "Bajar" : "Soft drop"}
          onPointerDown={(e) => {
            e.preventDefault();
            keys.current.down = true;
          }}
          onPointerUp={() => {
            keys.current.down = false;
          }}
          onPointerLeave={() => {
            keys.current.down = false;
          }}
          className="col-span-4 flex h-11 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white active:bg-white/30"
        >
          {es ? "Mantener · bajar" : "Hold · soft drop"}
        </button>
      </div>

      <p className="text-center text-[11px] text-white/50">
        {es
          ? "←→ / AD mover · ↑ W rotar · ↓ S bajar · Enter drop · Espacio pausa"
          : "←→ / AD move · ↑ W rotate · ↓ S soft drop · Enter hard drop · Space pause"}
      </p>
    </div>
  );
}
