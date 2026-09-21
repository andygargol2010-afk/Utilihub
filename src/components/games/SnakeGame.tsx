import { useCallback, useEffect, useRef, useState } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

/** Google-like grid */
const COLS = 17;
const ROWS = 15;
const CELL = 22;
const PAD = 8;
const BAR = 36;
const W = COLS * CELL + PAD * 2;
const H = ROWS * CELL + PAD * 2 + BAR;
const STEP_MS = 130;
const BODY_R = CELL * 0.42;

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
  for (let n = 0; n < 500; n++) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
  return { x: 0, y: 0 };
}

function initialSnake(): Pt[] {
  const midY = Math.floor(ROWS / 2);
  const midX = Math.floor(COLS / 2) - 1;
  return [
    { x: midX, y: midY },
    { x: midX - 1, y: midY },
    { x: midX - 2, y: midY },
  ];
}

function cellPx(p: Pt) {
  return {
    x: PAD + p.x * CELL + CELL / 2,
    y: BAR + PAD + p.y * CELL + CELL / 2,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/** Build interpolated pixel path (head → tail) */
function visualPath(snake: Pt[], prev: Pt[] | null, t: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < snake.length; i++) {
    const cur = snake[i]!;
    let from = cur;
    if (prev) {
      if (i === 0 && prev[0]) from = prev[0];
      else if (i < prev.length) from = prev[i]!;
      else from = prev[prev.length - 1]!;
    }
    out.push(cellPx(lerpPt(from, cur, t)));
  }
  return out;
}

function drawChecker(ctx: CanvasRenderingContext2D) {
  const light = "#a2d149";
  const dark = "#aad751";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? light : dark;
      ctx.fillRect(PAD + c * CELL, BAR + PAD + r * CELL, CELL, CELL);
    }
  }
}

function drawApple(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y + r * 0.05, r, 0, Math.PI * 2);
  ctx.fillStyle = "#e74c3c";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.15, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + r * 0.25, y - r * 0.85, r * 0.32, r * 0.16, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#57a639";
  ctx.fill();
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y - r * 0.55);
  ctx.lineTo(x + r * 0.05, y - r * 0.95);
  ctx.stroke();
}

function drawSnake(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[], dir: Dir) {
  if (pts.length === 0) return;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = BODY_R * 2;
  ctx.strokeStyle = "#4a86f0";
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
  ctx.stroke();
  ctx.lineWidth = BODY_R * 1.15;
  ctx.strokeStyle = "#5b9af5";
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
  ctx.stroke();
  const h = pts[0]!;
  ctx.beginPath();
  ctx.arc(h.x, h.y, BODY_R * 1.02, 0, Math.PI * 2);
  ctx.fillStyle = "#4a86f0";
  ctx.fill();
  const eyeDist = BODY_R * 0.4;
  const eyeR = BODY_R * 0.32;
  let e1: Pt;
  let e2: Pt;
  if (dir === "R") {
    e1 = { x: h.x + eyeDist * 0.6, y: h.y - eyeDist };
    e2 = { x: h.x + eyeDist * 0.6, y: h.y + eyeDist };
  } else if (dir === "L") {
    e1 = { x: h.x - eyeDist * 0.6, y: h.y - eyeDist };
    e2 = { x: h.x - eyeDist * 0.6, y: h.y + eyeDist };
  } else if (dir === "U") {
    e1 = { x: h.x - eyeDist, y: h.y - eyeDist * 0.6 };
    e2 = { x: h.x + eyeDist, y: h.y - eyeDist * 0.6 };
  } else {
    e1 = { x: h.x - eyeDist, y: h.y + eyeDist * 0.6 };
    e2 = { x: h.x + eyeDist, y: h.y + eyeDist * 0.6 };
  }
  for (const e of [e1, e2]) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    let px = e.x;
    let py = e.y;
    if (dir === "R") px += eyeR * 0.25;
    if (dir === "L") px -= eyeR * 0.25;
    if (dir === "U") py -= eyeR * 0.25;
    if (dir === "D") py += eyeR * 0.25;
    ctx.beginPath();
    ctx.arc(px, py, eyeR * 0.48, 0, Math.PI * 2);
    ctx.fillStyle = "#1a237e";
    ctx.fill();
  }
}

function drawDpadHint(ctx: CanvasRenderingContext2D, es: boolean, mobile: boolean) {
  const cx = W / 2;
  const cy = BAR + (H - BAR) / 2 - 10;
  roundRect(ctx, cx - 52, cy - 52, 104, 108, 16);
  ctx.fillStyle = "rgba(30, 50, 40, 0.88)";
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("▲", cx, cy - 24);
  ctx.fillText("◀", cx - 26, cy + 4);
  ctx.fillText("▼", cx, cy + 30);
  ctx.fillText("▶", cx + 26, cy + 4);
  ctx.font = "11px system-ui";
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  const tip = mobile
    ? es
      ? "Deslizá o usá botones"
      : "Swipe or use buttons"
    : es
      ? "Usá las flechas"
      : "Use arrow keys";
  ctx.fillText(tip, cx, cy + 52);
  ctx.textAlign = "left";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function paint(
  ctx: CanvasRenderingContext2D,
  snake: Pt[],
  prev: Pt[] | null,
  food: Pt,
  dir: Dir,
  score: number,
  t: number,
  phase: "menu" | "hint" | "play" | "dead",
  best: number,
  es: boolean,
  mobile: boolean,
) {
  ctx.fillStyle = "#4a752c";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#578a34";
  ctx.fillRect(0, 0, W, BAR);
  drawApple(ctx, 20, BAR / 2, 11);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 16px system-ui,Segoe UI,sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(String(score), 36, BAR / 2 + 1);
  drawChecker(ctx);
  const fp = cellPx(food);
  drawApple(ctx, fp.x, fp.y, CELL * 0.38);
  const path = visualPath(snake, prev, phase === "play" || phase === "hint" ? t : 1);
  drawSnake(ctx, path, dir);
  if (phase === "menu" || phase === "dead") {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(PAD, BAR + PAD, COLS * CELL, ROWS * CELL);
    const cw = 200;
    const ch = phase === "dead" ? 200 : 180;
    const cx = (W - cw) / 2;
    const cy = BAR + (H - BAR - ch) / 2;
    roundRect(ctx, cx, cy, cw, ch, 16);
    ctx.fillStyle = "#5dade2";
    ctx.fill();
    drawApple(ctx, cx + 55, cy + 40, 16);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(score), cx + 55, cy + 70);
    ctx.font = "28px system-ui";
    ctx.fillText("🏆", cx + 145, cy + 48);
    ctx.font = "bold 20px system-ui";
    ctx.fillText(String(Math.max(best, score)), cx + 145, cy + 70);
    ctx.fillStyle = "#4a86f0";
    roundRect(ctx, cx + 50, cy + 95, 100, 28, 14);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 140, cy + 109, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx + 134, cy + 104, 5, 0, Math.PI * 2);
    ctx.arc(cx + 146, cy + 104, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a237e";
    ctx.beginPath();
    ctx.arc(cx + 135, cy + 104, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 147, cy + 104, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui";
    ctx.fillText(phase === "dead" ? (es ? "¡Otra vez!" : "Play again") : es ? "Listo" : "Ready", cx + cw / 2, cy + ch - 18);
    ctx.textAlign = "left";
  }
  if (phase === "hint") {
    drawDpadHint(ctx, es, mobile);
  }
}

export function SnakeGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Pt[]>(initialSnake);
  const [prev, setPrev] = useState<Pt[] | null>(null);
  const [food, setFood] = useState<Pt>(() => randomFood(initialSnake()));
  const [dir, setDir] = useState<Dir>("R");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<"menu" | "hint" | "play" | "dead">("menu");
  const [progress, setProgress] = useState(1);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dirRef = useRef<Dir>("R");
  const pendingRef = useRef<Dir>("R");
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const scoreRef = useRef(0);
  const phaseRef = useRef(phase);
  const pausedRef = useRef(false);
  const stepAtRef = useRef(0);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const hintUntilRef = useRef(0);

  useEffect(() => {
    setBest(readBestScore("snake"));
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const hardReset = useCallback(() => {
    const s = initialSnake();
    setSnake(s);
    snakeRef.current = s;
    setPrev(null);
    const f = randomFood(s);
    setFood(f);
    foodRef.current = f;
    setDir("R");
    dirRef.current = "R";
    pendingRef.current = "R";
    setScore(0);
    scoreRef.current = 0;
    setPhase("menu");
    phaseRef.current = "menu";
    setPaused(false);
    pausedRef.current = false;
    setProgress(1);
    stepAtRef.current = 0;
  }, []);

  const beginPlay = useCallback(() => {
    // Full reset — previous bug left score/snake from the last death
    const s = initialSnake();
    setSnake(s);
    snakeRef.current = s;
    setPrev(null);
    const f = randomFood(s);
    setFood(f);
    foodRef.current = f;
    setDir("R");
    dirRef.current = "R";
    pendingRef.current = "R";
    setScore(0);
    scoreRef.current = 0;
    setProgress(1);
    setPhase("hint");
    phaseRef.current = "hint";
    hintUntilRef.current = performance.now() + 1400;
    stepAtRef.current = performance.now() + 1400;
    setPaused(false);
    pausedRef.current = false;
  }, []);

  const nudge = useCallback(
    (next: Dir) => {
      if (phaseRef.current === "menu" || phaseRef.current === "dead") {
        beginPlay();
        if (!opposite("R", next)) pendingRef.current = next;
        return;
      }
      if (opposite(dirRef.current, next)) return;
      pendingRef.current = next;
      if (phaseRef.current === "hint") {
        setPhase("play");
        phaseRef.current = "play";
        stepAtRef.current = performance.now();
      }
    },
    [beginPlay],
  );

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      const ph = phaseRef.current;
      if ((ph === "play" || ph === "hint") && !pausedRef.current) {
        if (ph === "hint" && now >= hintUntilRef.current) {
          setPhase("play");
          phaseRef.current = "play";
          stepAtRef.current = now;
        }
        if (ph === "play" || (ph === "hint" && now >= hintUntilRef.current)) {
          if (!stepAtRef.current) stepAtRef.current = now;
          const elapsed = now - stepAtRef.current;
          if (elapsed >= STEP_MS) {
            stepAtRef.current += Math.floor(elapsed / STEP_MS) * STEP_MS;
            const nextDir = pendingRef.current;
            dirRef.current = nextDir;
            setDir(nextDir);
            const cur = snakeRef.current;
            const d = DELTA[nextDir];
            const head = cur[0]!;
            const nx = head.x + d.x;
            const ny = head.y + d.y;
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || cur.some((p) => p.x === nx && p.y === ny)) {
              setPhase("dead");
              phaseRef.current = "dead";
              setBest((b) => writeBestScore("snake", Math.max(b, scoreRef.current)));
              setProgress(1);
            } else {
              const nextHead = { x: nx, y: ny };
              const ate = nx === foodRef.current.x && ny === foodRef.current.y;
              const body = ate ? cur : cur.slice(0, -1);
              const nextSnake = [nextHead, ...body];
              setPrev(cur);
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
          const p = Math.min(1, Math.max(0, (now - stepAtRef.current) / STEP_MS));
          setProgress(p);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    paint(ctx, snake, prev, food, dir, score, progress, phase, best, es, isMobile);
  }, [snake, prev, food, dir, score, progress, phase, best, es, isMobile]);

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
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phaseRef.current === "menu" || phaseRef.current === "dead") beginPlay();
        else if (phaseRef.current === "play") {
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
  }, [nudge, beginPlay]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (phaseRef.current === "play" || phaseRef.current === "hint") e.preventDefault();
    const t = e.touches[0];
    if (t) touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      if (phaseRef.current === "menu" || phaseRef.current === "dead") beginPlay();
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
          {(phase === "menu" || phase === "dead") && (
            <GamePrimaryButton onClick={beginPlay}>{es ? "Jugar" : "Play"}</GamePrimaryButton>
          )}
          {(phase === "play" || phase === "hint") && (
            <GameSecondaryButton
              active={paused}
              onClick={() => {
                setPaused((p) => {
                  pausedRef.current = !p;
                  if (!p) stepAtRef.current = performance.now();
                  return !p;
                });
              }}
            >
              {paused ? (es ? "Seguir" : "Resume") : es ? "Pausa" : "Pause"}
            </GameSecondaryButton>
          )}
          <GamePrimaryButton onClick={hardReset}>{es ? "Menú" : "Menu"}</GamePrimaryButton>
        </div>
      </div>

      {paused && phase === "play" && (
        <p className="text-sm font-bold text-amber-200">{es ? "Pausa" : "Paused"}</p>
      )}

      <div
        className="touch-none overflow-hidden rounded-xl shadow-xl ring-1 ring-black/15"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => {
          if (phase === "menu" || phase === "dead") beginPlay();
        }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="block max-w-full" style={{ width: "100%", height: "auto" }} />
      </div>

      <div className="grid w-full max-w-[220px] grid-cols-3 gap-2 sm:hidden">
        <span />
        <button type="button" aria-label={es ? "Arriba" : "Up"} onPointerDown={(e) => { e.preventDefault(); nudge("U"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">▲</button>
        <span />
        <button type="button" aria-label={es ? "Izquierda" : "Left"} onPointerDown={(e) => { e.preventDefault(); nudge("L"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">◀</button>
        <button type="button" aria-label={es ? "Abajo" : "Down"} onPointerDown={(e) => { e.preventDefault(); nudge("D"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">▼</button>
        <button type="button" aria-label={es ? "Derecha" : "Right"} onPointerDown={(e) => { e.preventDefault(); nudge("R"); }} className="flex h-14 w-14 items-center justify-center justify-self-center rounded-2xl bg-white/20 text-xl font-bold text-white active:scale-95 active:bg-white/35">▶</button>
      </div>

      <p className="text-center text-[11px] text-white/50">
        {isMobile
          ? es
            ? "Deslizá en el tablero o usá los botones"
            : "Swipe on the board or use the buttons"
          : es
            ? "Flechas / WASD · espacio = pausa"
            : "Arrow keys / WASD · space = pause"}
      </p>
    </div>
  );
}
