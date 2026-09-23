import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { GameLocale } from "@/lib/games/catalog";
import { readBestScore, writeBestScore } from "@/lib/games/scores";
import { GamePrimaryButton, GameSecondaryButton } from "./GameShell";

const W = 360,
  H = 220,
  PADDLE_H = 48,
  PADDLE_W = 8,
  BALL = 8,
  WIN = 7;
type Diff = "easy" | "medium" | "hard";

/** Tuned so Easy is forgiving, Medium competitive, Hard challenging — not unfair. */
const DIFF = {
  easy: { ball: 2.3, cpuSpeed: 1.55, error: 28, reactFrom: 0.28, maxBall: 3.4 },
  medium: { ball: 2.85, cpuSpeed: 2.15, error: 14, reactFrom: 0.42, maxBall: 4.2 },
  hard: { ball: 3.5, cpuSpeed: 3.1, error: 5, reactFrom: 0.52, maxBall: 5.2 },
} as const;


type Ctx2D = CanvasRenderingContext2D & {
  roundRect?(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
};

function fillRoundRect(ctx: Ctx2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
}

export function PongGame({ locale = "en" }: { locale?: GameLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [scoreP, setScoreP] = useState(0);
  const [scoreC, setScoreC] = useState(0);
  const [best, setBest] = useState(0);
  const [diff, setDiff] = useState<Diff>("medium");
  const [message, setMessage] = useState("");
  /** When true, ball speed is not capped by DIFF.maxBall (helps Hard stay fair at high speeds). */
  const [noSpeedCap, setNoSpeedCap] = useState(false);
  const state = useRef({
    py: H / 2 - PADDLE_H / 2,
    cy: H / 2 - PADDLE_H / 2,
    bx: W / 2,
    by: H / 2,
    bvx: 2.85,
    bvy: 1.8,
    keys: { up: false, down: false },
    /** Sticky aim offset so CPU doesn't jitter every frame */
    aimOffset: 0,
    aimUntil: 0,
  });
  const diffRef = useRef(diff);
  diffRef.current = diff;
  const noSpeedCapRef = useRef(noSpeedCap);
  noSpeedCapRef.current = noSpeedCap;

  useEffect(() => {
    setBest(readBestScore("pong"));
  }, []);

  const resetBall = (toPlayer: boolean) => {
    const s = state.current;
    const d = DIFF[diffRef.current];
    s.bx = W / 2;
    s.by = H / 2;
    s.bvx = (toPlayer ? -1 : 1) * d.ball;
    // Always give a clear vertical component so it never crawls the top/bottom edge
    let vy = (Math.random() * 2 - 1) * d.ball * 0.65;
    if (Math.abs(vy) < 0.9) vy = (vy >= 0 ? 1 : -1) * 0.9;
    s.bvy = vy;
    // New random aim bias when the point starts
    s.aimOffset = (Math.random() * 2 - 1) * d.error;
    s.aimUntil = performance.now() + 400 + Math.random() * 600;
  };

  const hardReset = useCallback(() => {
    setScoreP(0);
    setScoreC(0);
    setMessage("");
    setPaused(false);
    setRunning(true);
    state.current.py = H / 2 - PADDLE_H / 2;
    state.current.cy = H / 2 - PADDLE_H / 2;
    resetBall(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        state.current.keys.up = e.type === "keydown";
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        state.current.keys.down = e.type === "keydown";
      }
      if ((e.key === " " || e.key === "p" || e.key === "P") && e.type === "keydown") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!paused && !message) {
        const s = state.current;
        const d = DIFF[diffRef.current];
        const now = performance.now();

        if (s.keys.up) s.py = Math.max(0, s.py - 4.5);
        if (s.keys.down) s.py = Math.min(H - PADDLE_H, s.py + 4.5);

        // CPU: only track aggressively when the ball is coming toward it and past react line
        const ballComingToCpu = s.bvx > 0;
        const pastReactLine = s.bx > W * d.reactFrom;
        if (ballComingToCpu && pastReactLine) {
          if (now > s.aimUntil) {
            s.aimOffset = (Math.random() * 2 - 1) * d.error;
            s.aimUntil = now + 350 + Math.random() * 700;
          }
          const target = s.by - PADDLE_H / 2 + s.aimOffset;
          if (s.cy < target - 3) s.cy = Math.min(H - PADDLE_H, s.cy + d.cpuSpeed);
          else if (s.cy > target + 3) s.cy = Math.max(0, s.cy - d.cpuSpeed);
        } else if (!ballComingToCpu) {
          // Drift toward center when ball is going away — softer on Easy
          const mid = H / 2 - PADDLE_H / 2;
          if (s.cy < mid - 2) s.cy = Math.min(mid, s.cy + d.cpuSpeed * 0.35);
          else if (s.cy > mid + 2) s.cy = Math.max(mid, s.cy - d.cpuSpeed * 0.35);
        }

        s.bx += s.bvx;
        s.by += s.bvy;

        // Walls: bounce with a minimum vertical speed so the ball never slides along the edge
        const MIN_VY = 0.85;
        if (s.by <= 0) {
          s.by = 0;
          s.bvy = Math.abs(s.bvy) < MIN_VY ? MIN_VY : Math.abs(s.bvy);
        } else if (s.by >= H - BALL) {
          s.by = H - BALL;
          s.bvy = Math.abs(s.bvy) < MIN_VY ? -MIN_VY : -Math.abs(s.bvy);
        }

        const spinFrom = (paddleY: number) => {
          const rel = (s.by + BALL / 2 - (paddleY + PADDLE_H / 2)) / (PADDLE_H / 2);
          let vy = rel * 3.2;
          if (Math.abs(vy) < MIN_VY) vy = (vy >= 0 ? 1 : -1) * MIN_VY;
          return vy;
        };

        if (
          s.bx <= 12 + PADDLE_W &&
          s.by + BALL >= s.py &&
          s.by <= s.py + PADDLE_H &&
          s.bvx < 0
        ) {
          const boosted = Math.abs(s.bvx) * 1.04;
          const next = noSpeedCapRef.current ? boosted : Math.min(d.maxBall, boosted);
          s.bvx = next;
          s.bx = 12 + PADDLE_W;
          s.bvy = spinFrom(s.py);
        }
        if (
          s.bx + BALL >= W - 12 - PADDLE_W &&
          s.by + BALL >= s.cy &&
          s.by <= s.cy + PADDLE_H &&
          s.bvx > 0
        ) {
          const boosted = Math.abs(s.bvx) * 1.04;
          const next = noSpeedCapRef.current ? boosted : Math.min(d.maxBall, boosted);
          s.bvx = -next;
          s.bx = W - 12 - PADDLE_W - BALL;
          s.bvy = spinFrom(s.cy);
        }

        if (s.bx < 0) {
          setScoreC((c) => {
            const n = c + 1;
            if (n >= WIN) setMessage(es ? "CPU gana" : "CPU wins");
            return n;
          });
          resetBall(false);
        } else if (s.bx > W) {
          setScoreP((p) => {
            const n = p + 1;
            setBest((b) => writeBestScore("pong", Math.max(b, n)));
            if (n >= WIN) setMessage(es ? "¡Ganaste!" : "You win!");
            return n;
          });
          resetBall(true);
        }
      }
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const s = state.current;
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, "#0f172a");
        bg.addColorStop(1, "#020617");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(52,211,153,0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, W - 2, H - 2);
        ctx.strokeStyle = "rgba(52,211,153,0.3)";
        ctx.setLineDash([5, 10]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(W / 2, 8);
        ctx.lineTo(W / 2, H - 8);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        const pg = ctx.createLinearGradient(12, s.py, 12 + PADDLE_W, s.py);
        pg.addColorStop(0, "#7dd3fc");
        pg.addColorStop(1, "#0284c7");
        ctx.fillStyle = pg;
        fillRoundRect(ctx as Ctx2D, 12, s.py, PADDLE_W, PADDLE_H, 4);
        ctx.shadowColor = "#fbbf24";
        const cg = ctx.createLinearGradient(W - 12 - PADDLE_W, s.cy, W - 12, s.cy);
        cg.addColorStop(0, "#fcd34d");
        cg.addColorStop(1, "#d97706");
        ctx.fillStyle = cg;
        fillRoundRect(ctx as Ctx2D, W - 12 - PADDLE_W, s.cy, PADDLE_W, PADDLE_H, 4);
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 10;
        const bx = s.bx + BALL / 2;
        const by = s.by + BALL / 2;
        const ballG = ctx.createRadialGradient(bx - 1, by - 1, 1, bx, by, BALL / 2 + 1);
        ballG.addColorStop(0, "#ffffff");
        ballG.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = ballG;
        ctx.beginPath();
        ctx.arc(bx, by, BALL / 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, message, es]);

  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * H;
    state.current.py = Math.max(0, Math.min(H - PADDLE_H, y - PADDLE_H / 2));
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-emerald-100/90">
        <span className="tabular-nums text-white">
          {scoreP} — {scoreC}
        </span>
        <span>
          {es ? "Mejor" : "Best"}: {best}
        </span>
        <GameSecondaryButton
          active={diff === "easy"}
          onClick={() => {
            setDiff("easy");
            hardReset();
          }}
        >
          {es ? "Fácil" : "Easy"}
        </GameSecondaryButton>
        <GameSecondaryButton
          active={diff === "medium"}
          onClick={() => {
            setDiff("medium");
            hardReset();
          }}
        >
          {es ? "Medio" : "Med"}
        </GameSecondaryButton>
        <GameSecondaryButton
          active={diff === "hard"}
          onClick={() => {
            setDiff("hard");
            hardReset();
          }}
        >
          {es ? "Difícil" : "Hard"}
        </GameSecondaryButton>
        <GameSecondaryButton
          active={noSpeedCap}
          onClick={() => setNoSpeedCap((v) => !v)}
          title={
            es
              ? "Sin tope de velocidad: la pelota sigue acelerando en cada rebote"
              : "No speed cap: the ball keeps accelerating on every bounce"
          }
        >
          {es ? (noSpeedCap ? "Sin límite ✓" : "Sin límite") : noSpeedCap ? "No cap ✓" : "No cap"}
        </GameSecondaryButton>
        {!running ? (
          <GamePrimaryButton onClick={hardReset}>{es ? "Jugar" : "Play"}</GamePrimaryButton>
        ) : (
          <>
            <GameSecondaryButton onClick={() => setPaused((p) => !p)} active={paused}>
              {paused ? (es ? "Seguir" : "Resume") : es ? "Pausa" : "Pause"}
            </GameSecondaryButton>
            <GamePrimaryButton onClick={hardReset}>{es ? "Reiniciar" : "Restart"}</GamePrimaryButton>
          </>
        )}
      </div>
      {message && <p className="text-sm font-bold text-emerald-300">{message}</p>}
      {noSpeedCap && (
        <p className="text-center text-[11px] font-medium text-amber-300/90">
          {es
            ? "Velocidad sin tope — la pelota acelera en cada paleta"
            : "Uncapped speed — ball accelerates on every paddle hit"}
        </p>
      )}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onPointerMove={onPointerMove}
        className="touch-none rounded-xl border border-white/10 bg-slate-950"
        style={{ width: "100%", maxWidth: W, height: "auto" }}
      />
      <p className="text-center text-[11px] text-white/50">
        {es
          ? `↑↓ / WASD o arrastrá · espacio = pausa · a ${WIN}`
          : `↑↓ / WASD or drag · space = pause · first to ${WIN}`}
      </p>
    </div>
  );
}
