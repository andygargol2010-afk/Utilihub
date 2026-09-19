import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const COLS = 15;
const ROWS = 15;
const CELL = 24;
const PAD = 12;
const BAR = 40;
const W = COLS * CELL + PAD * 2;
const H = ROWS * CELL + PAD * 2 + BAR;
const STEP_MS = 140;

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
  for (let n = 0; n < 400; n++) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
  return { x: 0, y: 0 };
}

function initialSnake(): Pt[] {
  return [
    { x: 5, y: 7 },
    { x: 4, y: 7 },
    { x: 3, y: 7 },
  ];
}

function gridToPx(p: Pt) {
  return {
    x: PAD + p.x * CELL + CELL / 2,
    y: BAR + PAD + p.y * CELL + CELL / 2,
  };
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function drawApple(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.15, x, y, r);
  g.addColorStop(0, "#ff8a9a");
  g.addColorStop(0.5, "#ef4444");
  g.addColorStop(1, "#b91c1c");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + r * 0.3, y - r * 0.9, r * 0.38, r * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#4ade80";
  ctx.fill();
  ctx.strokeStyle = "#7c2d12";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - r * 0.5);
  ctx.quadraticCurveTo(x + r * 0.15, y - r, x + r * 0.05, y - r * 1.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.25, r * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fill();
}

function drawSnakeBody(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  dir: Dir,
) {
  if (points.length === 0) return;
  const radius = CELL * 0.38;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = radius * 2;

  ctx.strokeStyle = "#0284c7";
  ctx.beginPath();
  ctx.moveTo(points[0]!.x, points[0]!.y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y);
  }
  ctx.stroke();

  ctx.lineWidth = radius * 1.35;
  ctx.strokeStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(points[0]!.x, points[0]!.y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y);
  }
  ctx.stroke();

  const head = points[0]!;
  const hg = ctx.createRadialGradient(head.x - radius * 0.3, head.y - radius * 0.3, 2, head.x, head.y, radius);
  hg.addColorStop(0, "#7dd3fc");
  hg.addColorStop(1, "#0ea5e9");
  ctx.beginPath();
  ctx.arc(head.x, head.y, radius * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = hg;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const eyeOff = radius * 0.38;
  const eyeR = radius * 0.28;
  let e1 = { x: head.x - eyeOff, y: head.y - eyeOff };
  let e2 = { x: head.x + eyeOff, y: head.y - eyeOff };
  if (dir === "L") {
    e1 = { x: head.x - eyeOff, y: head.y - eyeOff };
    e2 = { x: head.x - eyeOff, y: head.y + eyeOff };
  } else if (dir === "R") {
    e1 = { x: head.x + eyeOff, y: head.y - eyeOff };
    e2 = { x: head.x + eyeOff, y: head.y + eyeOff };
  } else if (dir === "D") {
    e1 = { x: head.x - eyeOff, y: head.y + eyeOff };
    e2 = { x: head.x + eyeOff, y: head.y + eyeOff };
  }
  for (const e of [e1, e2]) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(e.x + eyeR * 0.2, e.y + eyeR * 0.15, eyeR * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
  }
}

function paint(
  ctx: CanvasRenderingContext2D,
  snake: Pt[],
  prevSnake: Pt[] | null,
  food: Pt,
  dir: Dir,
  score: number,
  progress: number,
  started: boolean,
  alive: boolean,
  es: boolean,
) {
  const grad = ctx.createLinearGradient(0, BAR, 0, H);
  grad.addColorStop(0, "#d4ef6a");
  grad.addColorStop(1, "#a8d03a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((r + c) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(PAD + c * CELL + CELL / 2, BAR + PAD + r * CELL + CELL / 2, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.fillStyle = "#2e7d32";
  ctx.fillRect(0, 0, W, BAR);
  drawApple(ctx, 22, BAR / 2, 12);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 18px system-ui,Segoe UI,sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(String(score), 40, BAR / 2 + 1);

  const fc = gridToPx(food);
  const pulse = 1 + Math.sin(progress * Math.PI) * 0.06;
  drawApple(ctx, fc.x, fc.y, CELL * 0.36 * pulse);

  const visual: { x: number; y: number }[] = [];
  for (let i = 0; i < snake.length; i++) {
    const cur = snake[i]!;
    const prev = prevSnake && prevSnake[i] ? prevSnake[i]! : cur;
    const lerped = lerpPt(prev, cur, progress);
    visual.push(gridToPx(lerped));
  }
  if (prevSnake && prevSnake.length && snake.length) {
    const oldHead = prevSnake[0]!;
    const newHead = snake[0]!;
    visual[0] = gridToPx(lerpPt(oldHead, newHead, progress));
  }

  drawSnakeBody(ctx, visual, dir);

  if (!started && alive) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
    ctx.fillRect(0, BAR, W, H - BAR);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(es ? "Presioná una flecha o ▶ para jugar" : "Press an arrow or ▶ to play", W / 2, BAR + (H - BAR) / 2);
    ctx.textAlign = "left";
  }

  if (!alive) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
    ctx.fillRect(0, BAR, W, H - BAR);
  }
}

export function SnakeGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Pt[]>(initialSnake);
  const [prevSnake, setPrevSnake] = useState<Pt[] | null>(null);
  const [food, setFood] = useState<Pt>(() => randomFood(initialSnake()));
  const [dir, setDir] = useState<Dir>("R");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [alive, setAlive] = useState(true);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(1);

  const dirRef = useRef<Dir>("R");
  const pendingRef = useRef<Dir>("R");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const aliveRef = useRef(alive);
  const startedRef = useRef(started);
  const pausedRef = useRef(paused);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const stepAtRef = useRef(0);

  useEffect(() => {
    setBest(readBestScore("snake"));
  }, []);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    aliveRef.current = alive;
  }, [alive]);
  useEffect(() => {
    startedRef.current = started;
  }, [started]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const reset = useCallback(() => {
    const s = initialSnake();
    setSnake(s);
    setPrevSnake(null);
    snakeRef.current = s;
    const f = randomFood(s);
    setFood(f);
    foodRef.current = f;
    setDir("R");
    pendingRef.current = "R";
    dirRef.current = "R";
    setScore(0);
    scoreRef.current = 0;
    setAlive(true);
    aliveRef.current = true;
    setStarted(false);
    startedRef.current = false;
    setPaused(false);
    pausedRef.current = false;
    setProgress(1);
    stepAtRef.current = 0;
  }, []);

  const nudge = useCallback((next: Dir) => {
    if (!startedRef.current && aliveRef.current) {
      setStarted(true);
      startedRef.current = true;
      setPaused(false);
      pausedRef.current = false;
      stepAtRef.current = performance.now();
    }
    if (opposite(dirRef.current, next)) return;
    pendingRef.current = next;
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      if (startedRef.current && aliveRef.current && !pausedRef.current) {
        if (!stepAtRef.current) stepAtRef.current = now;
        const elapsed = now - stepAtRef.current;
        if (elapsed >= STEP_MS) {
          const steps = Math.floor(elapsed / STEP_MS);
          stepAtRef.current += steps * STEP_MS;
          const nextDir = pendingRef.current;
          dirRef.current = nextDir;
          setDir(nextDir);

          const cur = snakeRef.current;
          const d = DELTA[nextDir];
          const head = cur[0]!;
          const nx = head.x + d.x;
          const ny = head.y + d.y;
          if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || cur.some((p) => p.x === nx && p.y === ny)) {
            setAlive(false);
            aliveRef.current = false;
            setBest((b) => writeBestScore("snake", Math.max(b, scoreRef.current)));
            setProgress(1);
          } else {
            const nextHead = { x: nx, y: ny };
            const ate = nx === foodRef.current.x && ny === foodRef.current.y;
            const body = ate ? cur : cur.slice(0, -1);
            const nextSnake = [nextHead, ...body];
            setPrevSnake(cur);
            setSnake(nextSnake);
            snakeRef.current = nextSnake;
            if (ate) {
              const ns = scoreRef.current + 1;
              scoreRef.current = ns;
              setScore(ns);
              const f = randomFood(nextSnake);
              foodRef.current = f;
              setFood(f);
            }
          }
        }
        const p = Math.min(1, (now - stepAtRef.current) / STEP_MS);
        setProgress(p);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    paint(ctx, snake, prevSnake, food, dir, score, progress, started, alive, es);
  }, [snake, prevSnake, food, dir, score, progress, started, alive, es]);

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
        if (!startedRef.current) {
          nudge(dirRef.current);
        } else if (aliveRef.current) {
          setPaused((p) => {
            pausedRef.current = !p;
            if (!p) stepAtRef.current = performance.now();
            return !p;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge]);

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
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      if (!started) nudge("R");
      return;
    }
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
          {!started && alive ? (
            <GamePrimaryButton
              onClick={() => {
                nudge("R");
              }}
            >
              {es ? "Jugar" : "Play"}
            </GamePrimaryButton>
          ) : (
            <GameSecondaryButton
              onClick={() => {
                if (!alive) return;
                setPaused((p) => {
                  pausedRef.current = !p;
                  if (!p) stepAtRef.current = performance.now();
                  return !p;
                });
              }}
              active={paused}
            >
              {paused ? (es ? "Seguir" : "Resume") : es ? "Pausa" : "Pause"}
            </GameSecondaryButton>
          )}
          <GamePrimaryButton onClick={reset}>{es ? "Nuevo" : "New"}</GamePrimaryButton>
        </div>
      </div>

      {!alive && (
        <p className="text-sm font-bold text-rose-300">
          {es ? `Game over · ${score} puntos` : `Game over · ${score} pts`}
        </p>
      )}
      {paused && started && alive && (
        <p className="text-sm font-bold text-amber-200">{es ? "Pausa" : "Paused"}</p>
      )}

      <div
        className="touch-none overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block max-w-full"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:hidden">
        <span />
        <button type="button" onClick={() => nudge("U")} className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/30" aria-label="Up">
          ▲
        </button>
        <span />
        <button type="button" onClick={() => nudge("L")} className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/30" aria-label="Left">
          ◀
        </button>
        <button type="button" onClick={() => nudge("D")} className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/30" aria-label="Down">
          ▼
        </button>
        <button type="button" onClick={() => nudge("R")} className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white active:bg-white/30" aria-label="Right">
          ▶
        </button>
      </div>

      <p className="text-center text-[11px] text-white/50">
        {es
          ? "No arranca hasta que toques una flecha · espacio = pausa"
          : "Won't start until you press a key · space = pause"}
      </p>
    </div>
  );
}
