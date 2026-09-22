import { useCallback, useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    setBest(readBestScore("pong"));
  }, []);

  const resetBall = (toPlayer: boolean) => {
    const s = state.current;
    const d = DIFF[diffRef.current];
    s.bx = W / 2;
    s.by = H / 2;
    s.bvx = (toPlayer ? -1 : 1) * d.ball;
    s.bvy = (Math.random() * 2 - 1) * d.ball * 0.65;
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
          const mid = H / 2 - PADDLE_H / 2;
          if (s.cy < mid - 2) s.cy = Math.min(mid, s.cy + d.cpuSpeed * 0.35);
          else if (s.cy > mid + 2) s.cy = Math.max(mid, s.cy - d.cpuSpeed * 0.35);
        }

        s.bx += s.bvx;
        s.by += s.bvy;
        if (s.by <= 0 || s.by >= H - BALL) s.bvy *= -1;

        if (
          s.bx <= 12 + PADDLE_W &&
          s.by + BALL >= s.py &&
          s.by <= s.py + PADDLE_H &&
          s.bvx < 0
        ) {
          const next = Math.min(d.maxBall, Math.abs(s.bvx) * 1.04);
          s.bvx = next;
          s.bvy = ((s.by + BALL / 2 - (s.py + PADDLE_H / 2)) / (PADDLE_H / 2)) * 3.2;
        }
        if (
          s.bx + BALL >= W - 12 - PADDLE_W &&
          s.by + BALL >= s.cy &&
          s.by <= s.cy + PADDLE_H &&
          s.bvx > 0
        ) {
          const next = Math.min(d.maxBall, Math.abs(s.bvx) * 1.04);
          s.bvx = -next;
          s.bvy = ((s.by + BALL / 2 - (s.cy + PADDLE_H / 2)) / (PADDLE_H / 2)) * 3.2;
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
        ctx.fillStyle = "#0b1220";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(52,211,153,0.25)";
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(W / 2, 0);
        ctx.lineTo(W / 2, H);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(12, s.py, PADDLE_W, PADDLE_H);
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(W - 12 - PADDLE_W, s.cy, PADDLE_W, PADDLE_H);
        ctx.fillStyle = "#fff";
        ctx.fillRect(s.bx, s.by, BALL, BALL);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, message, es]);

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
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
