import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 400;
const H = 320;
const PIVOT_X = W / 2;
const PIVOT_Y = 36;
const TRAIL_MAX = 100;

export function PendulumSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(true);
  const [length, setLength] = useState(0.72);
  const [damping, setDamping] = useState(0.08);
  const [gFactor, setGFactor] = useState(0.55);
  const [periodMs, setPeriodMs] = useState(0);
  const [angleDeg, setAngleDeg] = useState(45);

  const state = useRef({
    theta: Math.PI / 4,
    omega: 0,
    trail: [] as { x: number; y: number }[],
    lastCross: 0,
    periodAcc: 0,
  });
  const runningRef = useRef(true);
  const lengthRef = useRef(0.72);
  const dampRef = useRef(0.08);
  const gRef = useRef(0.55);
  const dragging = useRef(false);
  runningRef.current = running;
  lengthRef.current = length;
  dampRef.current = damping;
  gRef.current = gFactor;

  const rodPx = () => 90 + lengthRef.current * 140;

  const reset = useCallback(() => {
    state.current.theta = Math.PI / 4;
    state.current.omega = 0;
    state.current.trail = [];
    state.current.lastCross = 0;
    state.current.periodAcc = 0;
    setAngleDeg(45);
    setPeriodMs(0);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const L = rodPx();
      const g = 0.12 + gRef.current * 0.55;
      const damp = dampRef.current * 0.04;
      const s = state.current;

      if (runningRef.current && !dragging.current) {
        const alpha = -(g / (L * 0.012)) * Math.sin(s.theta) - damp * s.omega;
        s.omega += alpha;
        s.omega *= 0.9992;
        s.theta += s.omega;

        if (s.omega > 0 && s.theta > 0 && s.theta - s.omega < 0) {
          const now = performance.now();
          if (s.lastCross > 0) {
            const p = now - s.lastCross;
            if (p > 200 && p < 8000) {
              s.periodAcc = s.periodAcc ? s.periodAcc * 0.7 + p * 0.3 : p;
            }
          }
          s.lastCross = now;
        }
      }

      const bx = PIVOT_X + Math.sin(s.theta) * L;
      const by = PIVOT_Y + Math.cos(s.theta) * L;

      if (runningRef.current && !dragging.current) {
        s.trail.push({ x: bx, y: by });
        if (s.trail.length > TRAIL_MAX) s.trail.shift();
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#1c140a");
      bg.addColorStop(1, "#0a0704");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(180,120,40,0.06)";
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 14) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = "rgba(251,191,36,0.12)";
      ctx.lineWidth = 1.5;
      ctx.arc(PIVOT_X, PIVOT_Y, L, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();

      if (s.trail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251,191,36,0.35)";
        ctx.lineWidth = 1.5;
        ctx.moveTo(s.trail[0]!.x, s.trail[0]!.y);
        for (let i = 1; i < s.trail.length; i++) {
          ctx.lineTo(s.trail[i]!.x, s.trail[i]!.y);
        }
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = "#c9a227";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,230,150,0.5)";
      ctx.lineWidth = 1;
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.lineTo(bx, by);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "#8b6914";
      ctx.arc(PIVOT_X, PIVOT_Y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#f5d76e";
      ctx.arc(PIVOT_X - 2, PIVOT_Y - 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(251,191,36,0.5)";
      ctx.lineWidth = 1.5;
      ctx.arc(PIVOT_X, PIVOT_Y, 12, 0, Math.PI * 2);
      ctx.stroke();

      const bobR = 14;
      const bob = ctx.createRadialGradient(bx - 3, by - 3, 2, bx, by, bobR + 4);
      bob.addColorStop(0, "#fff8e0");
      bob.addColorStop(0.4, "#e8b923");
      bob.addColorStop(1, "rgba(120,70,10,0.2)");
      ctx.beginPath();
      ctx.fillStyle = bob;
      ctx.arc(bx, by, bobR + 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.arc(bx - 4, by - 4, 4, 0, Math.PI * 2);
      ctx.fill();

      const deg = (s.theta * 180) / Math.PI;
      ctx.fillStyle = "rgba(40,28,10,0.85)";
      ctx.fillRect(10, H - 34, 150, 24);
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 11px system-ui,sans-serif";
      ctx.fillText(`${es ? "Ángulo" : "Angle"} ${deg.toFixed(1)}°`, 18, H - 17);

      if (s.periodAcc > 0) {
        ctx.fillStyle = "rgba(40,28,10,0.85)";
        ctx.fillRect(W - 130, H - 34, 120, 24);
        ctx.fillStyle = "#fbbf24";
        ctx.fillText(`T ≈ ${(s.periodAcc / 1000).toFixed(2)} s`, W - 120, H - 17);
      }

      if (!runningRef.current && !dragging.current) {
        ctx.fillStyle = "rgba(8,5,2,0.4)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,240,200,0.9)";
        ctx.font = "bold 14px system-ui,sans-serif";
        ctx.fillText(es ? "Pausado" : "Paused", W / 2 - 28, H / 2);
      }

      if (Math.random() < 0.05) {
        setAngleDeg(Math.round(deg * 10) / 10);
        if (s.periodAcc > 0) setPeriodMs(Math.round(s.periodAcc));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [es]);

  const pointerToAngle = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const dx = x - PIVOT_X;
    const dy = y - PIVOT_Y;
    let th = Math.atan2(dx, dy);
    th = Math.max(-Math.PI * 0.85, Math.min(Math.PI * 0.85, th));
    state.current.theta = th;
    state.current.omega = 0;
    state.current.trail = [];
    setAngleDeg(Math.round((th * 180) / Math.PI));
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-amber-500/25 bg-amber-950/40 p-3 backdrop-blur-sm">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/85">
          {es ? "Banco de relojería" : "Clockwork bench"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="clockwork" onClick={() => setRunning((r) => !r)}>
            {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
          </SimPrimaryButton>
          <SimSecondaryButton theme="clockwork" onClick={reset}>
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
        </div>
      </div>

      <div className="grid w-full max-w-sm gap-3 text-xs text-amber-100/85">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Longitud" : "Length"}</span>
            <span className="tabular-nums text-amber-300">{Math.round(length * 100)}%</span>
          </span>
          <input
            type="range"
            min={25}
            max={100}
            value={Math.round(length * 100)}
            onChange={(e) => setLength(Number(e.target.value) / 100)}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-800 via-amber-700 to-amber-400 accent-amber-400"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Amortiguación" : "Damping"}</span>
            <span className="tabular-nums text-amber-300">{Math.round(damping * 100)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(damping * 100)}
            onChange={(e) => setDamping(Number(e.target.value) / 100)}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-800 via-amber-700 to-amber-400 accent-amber-400"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>g</span>
            <span className="tabular-nums text-amber-300">{Math.round(gFactor * 100)}%</span>
          </span>
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round(gFactor * 100)}
            onChange={(e) => setGFactor(Number(e.target.value) / 100)}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-800 via-amber-700 to-amber-400 accent-amber-400"
          />
        </label>
      </div>

      <p className="text-center text-[12px] leading-relaxed text-amber-200/75">
        {es
          ? `Arrastrá la masa · ángulo ${angleDeg}°${periodMs ? ` · T ≈ ${(periodMs / 1000).toFixed(2)} s` : ""}`
          : `Drag the bob · angle ${angleDeg}°${periodMs ? ` · T ≈ ${(periodMs / 1000).toFixed(2)} s` : ""}`}
      </p>

      <div className="relative w-full max-w-[400px]">
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-amber-400/35 via-transparent to-orange-600/20 opacity-80"
          aria-hidden
        />
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            pointerToAngle(e);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            pointerToAngle(e);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          role="img"
          aria-label={es ? "Simulador de péndulo simple" : "Simple pendulum simulator"}
          className="relative w-full touch-none rounded-2xl border border-amber-500/30 bg-[#080502] shadow-[inset_0_0_40px_rgba(180,100,20,0.15)]"
          style={{ maxWidth: W, height: "auto", cursor: "grab" }}
        />
      </div>

      <p className="text-center text-[11px] text-amber-200/40">
        {es
          ? "Péndulo simple · θ″ = −(g/L) sin θ · modelo didáctico."
          : "Simple pendulum · θ″ = −(g/L) sin θ · teaching model."}
      </p>
    </div>
  );
}
