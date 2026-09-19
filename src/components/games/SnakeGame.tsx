import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS = 16;
const ROWS = 16;
const CELL = 22;
const PAD = 10;
const W = COLS * CELL + PAD * 2;
const H = ROWS * CELL + PAD * 2 + 36;
const TICK_MS = 120;

type Pt = { x: number; y: number };
type Dir = "U" | "D" | "L" | "R";

const DELTA: Record<Dir, Pt> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

function opposite(a: Dir, b: Dir) {
  return (a === "U" && b === "D") || (a === "D" && b === "U") || (a === "L" && b === "R") || (a === "R" && b === "L");
}

function randomFood(snake: Pt[]): Pt {
  for (let n = 0; n < 300; n++) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
  return { x: 0, y: 0 };
}

function initialSnake(): Pt[] {
  return [
    { x: 6, y: 8 },
    { x: 5, y: 8 },
    { x: 4, y: 8 },
  ];
}

function cellCenter(p: Pt) {
  return {
    x: PAD + p.x * CELL + CELL / 2,
    y: 36 + PAD + p.y * CELL + CELL / 2,
  };
}

function drawApple(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r);
  g.addColorStop(0, "#fb7185");
  g.addColorStop(0.55, "#ef4444");
  g.addColorStop(1, "#b91c1c");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + r * 0.25, y - r * 0.85, r * 0.35, r * 0.18, -0.6, 0, Math.PI * 2);
  ctx.fillStyle = "#4ade80";
  ctx.fill();
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - r * 0.55);
  ctx.quadraticCurveTo(x + r * 0.1, y - r * 0.95, x + r * 0.05, y - r * 1.05);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x - r * 0.35, y - r * 0.25, r * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fill();
}

function drawBoard(ctx: CanvasRenderingContext2D, snake: Pt[], food: Pt, dir: Dir, score: number, alive: boolean) {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#c8e86c");
  grad.addColorStop(0.5, "#b8dc5a");
  grad.addColorStop(1, "#a8d04a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let i = -H; i < W + H; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(46, 125, 50, 0.92)";
  ctx.fillRect(0, 0, W, 36);
  drawApple(ctx, 18, 18, 11);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(String(score), 34, 19);

  ctx.fillStyle = "rgba(0,0,0,0.04)";
  ctx.fillRect(PAD, 36 + PAD, COLS * CELL, ROWS * CELL);

  const fc = cellCenter(food);
  drawApple(ctx, fc.x, fc.y, CELL * 0.42);

  for (let i = snake.length - 1; i >= 0; i--) {
    const p = snake[i]!;
    const c = cellCenter(p);
    const t = i / Math.max(1, snake.length - 1);
    const r = CELL * (0.42 - t * 0.06);
    const g = ctx.createRadialGradient(c.x - r * 0.3, c.y - r * 0.3, r * 0.1, c.x, c.y, r);
    if (i === 0) {
      g.addColorStop(0, "#7dd3fc");
      g.addColorStop(1, "#0ea5e9");
    } else {
      g.addColorStop(0, "#38bdf8");
      g.addColorStop(1, "#0284c7");
    }
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const head = snake[0];
  if (head) {
    const c = cellCenter(head);
    const eyeOff = CELL * 0.14;
    const eyeR = CELL * 0.09;
    let e1 = { x: c.x - eyeOff, y: c.y - eyeOff };
    let e2 = { x: c.x + eyeOff, y: c.y - eyeOff };
    if (dir === "L") {
      e1 = { x: c.x - eyeOff, y: c.y - eyeOff };
      e2 = { x: c.x - eyeOff, y: c.y + eyeOff };
    } else if (dir === "R") {
      e1 = { x: c.x + eyeOff, y: c.y - eyeOff };
      e2 = { x: c.x + eyeOff, y: c.y + eyeOff };
    } else if (dir === "D") {
      e1 = { x: c.x - eyeOff, y: c.y + eyeOff };
      e2 = { x: c.x + eyeOff, y: c.y + eyeOff };
    }
    for (const e of [e1, e2]) {
      ctx.beginPath();
      ctx.arc(e.x, e.y, eyeR, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(e.x + eyeR * 0.15, e.y + eyeR * 0.1, eyeR * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
    }
  }

  if (!alive) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
    ctx.fillRect(0, 36, W, H - 36);
  }
}

export function SnakeGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Pt[]>(initialSnake);
  const [food, setFood] = useState<Pt>(() => randomFood(initialSnake()));
  const [dir, setDir] = useState<Dir>("R");
  const [pendingDir, setPendingDir] = useState<Dir>("R");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [alive, setAlive] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const dirRef = useRef<Dir>("R");
  const pendingRef = useRef<Dir>("R");

  useEffect(() => {
    setBest(readBestScore("snake"));
  }, []);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);
  useEffect(() => {
    pendingRef.current = pendingDir;
  }, [pendingDir]);

  const reset = useCallback(() => {
    const s = initialSnake();
    setSnake(s);
    setFood(randomFood(s));
    setDir("R");
    setPendingDir("R");
    dirRef.current = "R";
    pendingRef.current = "R";
    setScore(0);
    setAlive(true);
    setPaused(false);
  }, []);

  const nudge = useCallback((next: Dir) => {
    setPendingDir((cur) => {
      const base = dirRef.current;
      if (opposite(base, next)) return cur;
      pendingRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "U",
        ArrowDown: "D",
        ArrowLeft: "L",
        ArrowRight: "R",
        w: "U",
        s: "D",
        a: "L",
        d: "R",
        W: "U",
        S: "D",
        A: "L",
        D: "R",
      };
      const next = map[e.key];
      if (next) {
        e.preventDefault();
        nudge(next);
      }
      if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge]);

  useEffect(() => {
    if (!alive || paused) return;
    const id = window.setInterval(() => {
      const nextDir = pendingRef.current;
      setDir(nextDir);
      dirRef.current = nextDir;
      setSnake((prev) => {
        const d = DELTA[nextDir];
        const head = prev[0]!;
        const nx = head.x + d.x;
        const ny = head.y + d.y;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || prev.some((p) => p.x === nx && p.y === ny)) {
          setAlive(false);
          setBest((b) => writeBestScore("snake", Math.max(b, score)));
          return prev;
        }
        const nextHead = { x: nx, y: ny };
        const grew = nx === food.x && ny === food.y;
        const body = grew ? prev : prev.slice(0, -1);
        if (grew) {
          setScore((s) => s + 1);
          setFood(randomFood([nextHead, ...body]));
        }
        return [nextHead, ...body];
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [alive, paused, food, score]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawBoard(ctx, snake, food, dir, score, alive);
  }, [snake, food, dir, score, alive]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (t) touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    const next: Dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : dy > 0 ? "D" : "U";
    nudge(next);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm font-semibold text-emerald-100/90">
        <span>
          {es ? "Mejor" : "Best"}: <span className="tabular-nums text-amber-300">{best}</span>
        </span>
        <div className="flex gap-2">
          <GameSecondaryButton onClick={() => setPaused((p) => !p)} active={paused}>
            {paused ? (es ? "Seguir" : "Resume") : es ? "Pausa" : "Pause"}
          </GameSecondaryButton>
          <GamePrimaryButton onClick={reset}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
        </div>
      </div>

      {!alive && (
        <p className="text-sm font-bold text-rose-300">
          {es ? `Game over · ${score} puntos` : `Game over · ${score} pts`}
        </p>
      )}

      <div
        className="touch-none overflow-hidden rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas ref={canvasRef} width={W} height={H} className="block max-w-full" style={{ width: "100%", height: "auto" }} />
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:hidden">
        <span />
        <button type="button" onClick={() => nudge("U")} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/25" aria-label="Up">
          ▲
        </button>
        <span />
        <button type="button" onClick={() => nudge("L")} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/25" aria-label="Left">
          ◀
        </button>
        <button type="button" onClick={() => nudge("D")} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/25" aria-label="Down">
          ▼
        </button>
        <button type="button" onClick={() => nudge("R")} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/25" aria-label="Right">
          ▶
        </button>
      </div>

      <p className="text-center text-[11px] text-white/50">
        {es ? "Flechas / WASD · swipe · espacio = pausa" : "Arrows / WASD · swipe · space = pause"}
      </p>
    </div>
  );
}
