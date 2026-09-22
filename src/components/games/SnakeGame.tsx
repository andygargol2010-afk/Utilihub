import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
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
/** Step duration — a bit longer + eased lerp reads as continuous glide */
const STEP_MS = 145;
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

/** Smoothstep — accelerates/decelerates so motion feels less robotic */
function ease(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function lerpPt(a: Pt, b: Pt, t: number): Pt {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/**
 * Interpolated pixel path (head → tail).
 * Each segment glides from its previous cell toward the current one.
 * Extra mid-points on turns keep the body continuous around corners.
 */
function visualPath(snake: Pt[], prev: Pt[] | null, t: number): { x: number; y: number }[] {
  const u = ease(t);
  const centers: { x: number; y: number }[] = [];
  for (let i = 0; i < snake.length; i++) {
    const cur = snake[i]!;
    let from = cur;
    if (prev) {
      if (i === 0 && prev[0]) from = prev[0];
      else if (i < prev.length) from = prev[i]!;
      else from = prev[prev.length - 1]!;
    }
    centers.push(cellPx(lerpPt(from, cur, u)));
  }
  if (centers.length < 2) return centers;

  // Insert corner fillets so sharp 90° turns don't look angular
  const out: { x: number; y: number }[] = [centers[0]!];
  for (let i = 1; i < centers.length - 1; i++) {
    const a = centers[i - 1]!;
    const b = centers[i]!;
    const c = centers[i + 1]!;
    const dx1 = b.x - a.x;
    const dy1 = b.y - a.y;
    const dx2 = c.x - b.x;
    const dy2 = c.y - b.y;
    const turn = Math.abs(dx1 * dy2 - dy1 * dx2) > 0.01;
    if (turn) {
      const pull = 0.35;
      out.push({ x: lerp(a.x, b.x, 1 - pull), y: lerp(a.y, b.y, 1 - pull) });
      out.push(b);
      out.push({ x: lerp(b.x, c.x, pull), y: lerp(b.y, c.y, pull) });
    } else {
      out.push(b);
    }
  }
  out.push(centers[centers.length - 1]!);
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

function strokeSnakePath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
  if (pts.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(pts[0]!.x, pts[0]!.y);
  if (pts.length === 1) return;
  if (pts.length === 2) {
    ctx.lineTo(pts[1]!.x, pts[1]!.y);
    return;
  }
  // Midpoint chain: each corner becomes a smooth quadratic control point
  for (let i = 1; i < pts.length - 1; i++) {
    const midX = (pts[i]!.x + pts[i + 1]!.x) / 2;
    const midY = (pts[i]!.y + pts[i + 1]!.y) / 2;
    ctx.quadraticCurveTo(pts[i]!.x, pts[i]!.y, midX, midY);
  }
  const last = pts[pts.length - 1]!;
  ctx.lineTo(last.x, last.y);
}

function drawSnake(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[], dir: Dir) {
  if (pts.length === 0) return;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // Soft shadow under body
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  ctx.lineWidth = BODY_R * 2;
  ctx.strokeStyle = "#4a86f0";
  strokeSnakePath(ctx, pts);
  ctx.stroke();
  ctx.restore();
  // Lighter highlight stroke
  ctx.lineWidth = BODY_R * 1.15;
  ctx.strokeStyle = "#5b9af5";
  strokeSnakePath(ctx, pts);
  ctx.stroke();
  const h = pts[0]!;
  ctx.beginPath();
  ctx.arc(h.x, h.y, BODY_R * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = "#4a86f0";
  ctx.fill();
  // subtle head highlight
  ctx.beginPath();
  ctx.arc(h.x - BODY_R * 0.15, h.y - BODY_R * 0.2, BODY_R * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
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
  ctx.fillText(mobile ? (es ? "Deslizá" : "Swipe") : (es ? "Flechas" : "Arrows"), cx, cy + 48);
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
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<"menu" | "hint" | "play" | "dead">("menu");
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dirRef = useRef<Dir>("R");
  const pendingRef = useRef<Dir>("R");
  const snakeRef = useRef<Pt[]>(initialSnake());
  const prevRef = useRef<Pt[] | null>(null);
  const foodRef = useRef<Pt>(randomFood(initialSnake()));
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const phaseRef = useRef<"menu" | "hint" | "play" | "dead">("menu");
  const pausedRef = useRef(false);
  const stepAtRef = useRef(0);
  const progressRef = useRef(1);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const hintUntilRef = useRef(0);
  const mobileRef = useRef(false);
  const esRef = useRef(es);
  esRef.current = es;

  useEffect(() => {
    const b = readBestScore("snake");
    setBest(b);
    bestRef.current = b;
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const sync = () => {
      setIsMobile(mq.matches);
      mobileRef.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const hardReset = useCallback(() => {
    const s = initialSnake();
    snakeRef.current = s;
    prevRef.current = null;
    const f = randomFood(s);
    foodRef.current = f;
    dirRef.current = "R";
    pendingRef.current = "R";
    setScore(0);
    scoreRef.current = 0;
    setPhase("menu");
    phaseRef.current = "menu";
    setPaused(false);
    pausedRef.current = false;
    progressRef.current = 1;
    stepAtRef.current = 0;
  }, []);

  const beginPlay = useCallback(() => {
    const s = initialSnake();
    snakeRef.current = s;
    prevRef.current = null;
    const f = randomFood(s);
    foodRef.current = f;
    dirRef.current = "R";
    pendingRef.current = "R";
    setScore(0);
    scoreRef.current = 0;
    progressRef.current = 1;
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

  // Paint + logic in one RAF loop — no setState per frame (was the main jank source)
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
        const active = phaseRef.current === "play" || now >= hintUntilRef.current;
        if (active) {
          if (!stepAtRef.current) stepAtRef.current = now;
          // Catch up at most one step per frame so motion never teleports
          if (now - stepAtRef.current >= STEP_MS) {
            stepAtRef.current += STEP_MS;
            // If we're more than 2 steps behind (tab background), resync
            if (now - stepAtRef.current > STEP_MS * 2) stepAtRef.current = now;
            const nextDir = pendingRef.current;
            dirRef.current = nextDir;
            const cur = snakeRef.current;
            const d = DELTA[nextDir];
            const head = cur[0]!;
            const nx = head.x + d.x;
            const ny = head.y + d.y;
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || cur.some((p) => p.x === nx && p.y === ny)) {
              setPhase("dead");
              phaseRef.current = "dead";
              const nb = writeBestScore("snake", Math.max(bestRef.current, scoreRef.current));
              bestRef.current = nb;
              setBest(nb);
              progressRef.current = 1;
            } else {
              const nextHead = { x: nx, y: ny };
              const ate = nx === foodRef.current.x && ny === foodRef.current.y;
              const body = ate ? cur : cur.slice(0, -1);
              const nextSnake = [nextHead, ...body];
              prevRef.current = cur;
              snakeRef.current = nextSnake;
              if (ate) {
                const ns = scoreRef.current + 1;
                scoreRef.current = ns;
                setScore(ns);
                foodRef.current = randomFood(nextSnake);
              }
            }
          }
          progressRef.current = Math.min(1, Math.max(0, (now - stepAtRef.current) / STEP_MS));
        }
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        paint(
          ctx,
          snakeRef.current,
          prevRef.current,
          foodRef.current,
          dirRef.current,
          scoreRef.current,
          progressRef.current,
          phaseRef.current,
          bestRef.current,
          esRef.current,
          mobileRef.current,
        );
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
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
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phaseRef.current === "menu" || phaseRef.current === "dead") beginPlay();
        else if (phaseRef.current === "play") {
          setPaused((p) => {
            // p === true → currently paused, about to resume
            if (p) stepAtRef.current = performance.now() - progressRef.current * STEP_MS;
            pausedRef.current = !p;
            return !p;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nudge, beginPlay]);

  const onTouchStart = (e: ReactTouchEvent) => {
    if (phaseRef.current === "play" || phaseRef.current === "hint") e.preventDefault();
    const t = e.touches[0];
    if (t) touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
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
                  if (p) stepAtRef.current = performance.now() - progressRef.current * STEP_MS;
                  pausedRef.current = !p;
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
