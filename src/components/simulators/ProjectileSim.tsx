import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 520;
const H = 340;
const ORIGIN_X = 48;
const ORIGIN_Y = H - 36;
const SCALE = 2.35; // px per meter
const DT = 1 / 120;
const TRAIL_MAX = 400;

type Point = { x: number; y: number };

function idealRange(v0: number, angleDeg: number, g: number) {
  const th = (angleDeg * Math.PI) / 180;
  return (v0 * v0 * Math.sin(2 * th)) / g;
}
function idealHeight(v0: number, angleDeg: number, g: number) {
  const th = (angleDeg * Math.PI) / 180;
  return (v0 * v0 * Math.sin(th) * Math.sin(th)) / (2 * g);
}
function idealTime(v0: number, angleDeg: number, g: number) {
  const th = (angleDeg * Math.PI) / 180;
  return (2 * v0 * Math.sin(th)) / g;
}

function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function worldToScreen(x: number, y: number): Point {
  return { x: ORIGIN_X + x * SCALE, y: ORIGIN_Y - y * SCALE };
}

export function ProjectileSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(28);
  const [gVal, setGVal] = useState(9.8);
  const [drag, setDrag] = useState(false);
  const [dragK, setDragK] = useState(0.08);
  const [flying, setFlying] = useState(false);
  const [hud, setHud] = useState({
    t: 0,
    range: 0,
    height: 0,
    maxH: 0,
    speedNow: 0,
  });

  const angleRef = useRef(45);
  const speedRef = useRef(28);
  const gRef = useRef(9.8);
  const dragRef = useRef(false);
  const dragKRef = useRef(0.08);
  const flyingRef = useRef(false);

  const ball = useRef({ x: 0, y: 0, vx: 0, vy: 0, t: 0, maxH: 0 });
  const trail = useRef<Point[]>([]);
  const idealPath = useRef<Point[]>([]);
  const landed = useRef(false);

  angleRef.current = angle;
  speedRef.current = speed;
  gRef.current = gVal;
  dragRef.current = drag;
  dragKRef.current = dragK;
  flyingRef.current = flying;

  const rebuildIdeal = useCallback(() => {
    const v0 = speedRef.current;
    const th = (angleRef.current * Math.PI) / 180;
    const g = gRef.current;
    const pts: Point[] = [];
    const T = idealTime(v0, angleRef.current, g);
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * T;
      const x = v0 * Math.cos(th) * t;
      const y = v0 * Math.sin(th) * t - 0.5 * g * t * t;
      if (y < -0.05) break;
      pts.push({ x, y: Math.max(0, y) });
    }
    idealPath.current = pts;
  }, []);

  const launch = useCallback(() => {
    const th = (angleRef.current * Math.PI) / 180;
    const v0 = speedRef.current;
    ball.current = {
      x: 0,
      y: 0,
      vx: v0 * Math.cos(th),
      vy: v0 * Math.sin(th),
      t: 0,
      maxH: 0,
    };
    trail.current = [{ x: 0, y: 0 }];
    landed.current = false;
    rebuildIdeal();
    setFlying(true);
    setHud({ t: 0, range: 0, height: 0, maxH: 0, speedNow: v0 });
  }, [rebuildIdeal]);

  const reset = useCallback(() => {
    setFlying(false);
    ball.current = { x: 0, y: 0, vx: 0, vy: 0, t: 0, maxH: 0 };
    trail.current = [];
    landed.current = false;
    rebuildIdeal();
    setHud({ t: 0, range: 0, height: 0, maxH: 0, speedNow: speedRef.current });
  }, [rebuildIdeal]);

  useEffect(() => {
    rebuildIdeal();
  }, [angle, speed, gVal, rebuildIdeal]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    const onResize = () => {
      if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    };
    window.addEventListener("resize", onResize);

    const tick = (now: number) => {
      if (!ctx) {
        if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
        raf = requestAnimationFrame(tick);
        return;
      }

      const dtFrame = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dtFrame;

      if (flyingRef.current && !landed.current) {
        while (acc >= DT) {
          const b = ball.current;
          const g = gRef.current;
          if (dragRef.current) {
            const sp = Math.hypot(b.vx, b.vy) || 1;
            const k = dragKRef.current;
            b.vx -= k * b.vx * sp * DT;
            b.vy -= k * b.vy * sp * DT;
          }
          b.vy -= g * DT;
          b.x += b.vx * DT;
          b.y += b.vy * DT;
          b.t += DT;
          if (b.y > b.maxH) b.maxH = b.y;

          if (trail.current.length === 0 || Math.hypot(b.x - trail.current[trail.current.length - 1]!.x, b.y - trail.current[trail.current.length - 1]!.y) > 0.35) {
            trail.current.push({ x: b.x, y: b.y });
            if (trail.current.length > TRAIL_MAX) trail.current.shift();
          }

          if (b.y <= 0 && b.t > 0.05) {
            b.y = 0;
            landed.current = true;
            setFlying(false);
            setHud({
              t: Math.round(b.t * 100) / 100,
              range: Math.round(b.x * 10) / 10,
              height: 0,
              maxH: Math.round(b.maxH * 10) / 10,
              speedNow: 0,
            });
            break;
          }
          acc -= DT;
        }
        if (!landed.current) {
          const b = ball.current;
          setHud({
            t: Math.round(b.t * 100) / 100,
            range: Math.round(b.x * 10) / 10,
            height: Math.round(Math.max(0, b.y) * 10) / 10,
            maxH: Math.round(b.maxH * 10) / 10,
            speedNow: Math.round(Math.hypot(b.vx, b.vy) * 10) / 10,
          });
        }
      } else {
        acc = 0;
      }

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#1a2744");
      sky.addColorStop(0.55, "#0f1a2e");
      sky.addColorStop(1, "#0a1220");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Ground
      ctx.fillStyle = "#1c2a1a";
      ctx.fillRect(0, ORIGIN_Y, W, H - ORIGIN_Y);
      ctx.fillStyle = "rgba(74, 222, 128, 0.25)";
      ctx.fillRect(0, ORIGIN_Y, W, 3);

      // Grid (meters)
      ctx.strokeStyle = "rgba(251, 191, 36, 0.08)";
      ctx.lineWidth = 1;
      for (let m = 0; m <= 90; m += 10) {
        const sx = ORIGIN_X + m * SCALE;
        if (sx > W) break;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, ORIGIN_Y);
        ctx.stroke();
      }
      for (let m = 0; m <= 50; m += 10) {
        const sy = ORIGIN_Y - m * SCALE;
        if (sy < 0) break;
        ctx.beginPath();
        ctx.moveTo(ORIGIN_X, sy);
        ctx.lineTo(W, sy);
        ctx.stroke();
      }

      // Axes
      ctx.strokeStyle = "rgba(251, 191, 36, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ORIGIN_X, 12);
      ctx.lineTo(ORIGIN_X, ORIGIN_Y);
      ctx.lineTo(W - 12, ORIGIN_Y);
      ctx.stroke();

      // Axis ticks labels
      ctx.fillStyle = "rgba(251, 191, 36, 0.55)";
      ctx.font = "10px ui-sans-serif,system-ui,sans-serif";
      for (let m = 10; m <= 80; m += 20) {
        const sx = ORIGIN_X + m * SCALE;
        if (sx > W - 20) break;
        ctx.fillText(`${m}m`, sx - 8, ORIGIN_Y + 14);
      }

      // Ideal parabola (ghost)
      const ideal = idealPath.current;
      if (ideal.length > 1) {
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
        ctx.lineWidth = 1.5;
        const p0 = worldToScreen(ideal[0]!.x, ideal[0]!.y);
        ctx.moveTo(p0.x, p0.y);
        for (let i = 1; i < ideal.length; i++) {
          const p = worldToScreen(ideal[i]!.x, ideal[i]!.y);
          ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Aim guide (when not flying)
      if (!flyingRef.current) {
        const th = (angleRef.current * Math.PI) / 180;
        const len = 55;
        const tip = worldToScreen(Math.cos(th) * (len / SCALE), Math.sin(th) * (len / SCALE));
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.7)";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.moveTo(ORIGIN_X, ORIGIN_Y);
        ctx.lineTo(tip.x, tip.y);
        ctx.stroke();
        // angle arc
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.arc(ORIGIN_X, ORIGIN_Y, 28, -th, 0);
        ctx.stroke();
      }

      // Actual trail
      const tr = trail.current;
      if (tr.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251, 146, 60, 0.85)";
        ctx.lineWidth = 2.2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const s0 = worldToScreen(tr[0]!.x, tr[0]!.y);
        ctx.moveTo(s0.x, s0.y);
        for (let i = 1; i < tr.length; i++) {
          const s = worldToScreen(tr[i]!.x, tr[i]!.y);
          ctx.lineTo(s.x, s.y);
        }
        ctx.stroke();
      }

      // Ball
      const b = ball.current;
      const show = flyingRef.current || (landed.current && tr.length > 0);
      if (show || !flyingRef.current) {
        const pos = flyingRef.current || landed.current
          ? worldToScreen(b.x, Math.max(0, b.y))
          : { x: ORIGIN_X, y: ORIGIN_Y };
        const glow = ctx.createRadialGradient(pos.x, pos.y, 2, pos.x, pos.y, 16);
        glow.addColorStop(0, "rgba(251, 191, 36, 0.5)");
        glow.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(pos.x, pos.y, 16, 0, Math.PI * 2);
        ctx.fill();

        const ballG = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 1, pos.x, pos.y, 9);
        ballG.addColorStop(0, "#fff8e7");
        ballG.addColorStop(0.4, "#fbbf24");
        ballG.addColorStop(1, "#b45309");
        ctx.beginPath();
        ctx.fillStyle = ballG;
        ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cannon base
      ctx.fillStyle = "#3f2e14";
      ctx.beginPath();
      ctx.ellipse(ORIGIN_X, ORIGIN_Y + 4, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#78521f";
      ctx.fillRect(ORIGIN_X - 10, ORIGIN_Y - 8, 20, 10);

      // Frame
      ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, W - 4, H - 4);

      // Legend
      ctx.font = "10px ui-sans-serif,system-ui,sans-serif";
      ctx.fillStyle = "rgba(148,163,184,0.8)";
      ctx.fillText(es ? "— — ideal (sin arrastre)" : "— — ideal (no drag)", W - 150, 22);
      ctx.fillStyle = "rgba(251,146,60,0.9)";
      ctx.fillText(es ? "—— trayectoria" : "—— path", W - 150, 36);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [es]);

  const theoryR = idealRange(speed, angle, gVal);
  const theoryH = idealHeight(speed, angle, gVal);
  const theoryT = idealTime(speed, angle, gVal);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-amber-500/25 bg-amber-950/45 p-3.5 shadow-inner backdrop-blur-sm">
        <p className="mb-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/85">
          {es ? "Lab de balística" : "Ballistics lab"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="clockwork" onClick={launch} disabled={flying}>
            {es ? "Lanzar" : "Launch"}
          </SimPrimaryButton>
          <SimSecondaryButton theme="clockwork" onClick={reset}>
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="clockwork" active={drag} onClick={() => setDrag((d) => !d)}>
            {es ? (drag ? "Arrastre ✓" : "Arrastre") : drag ? "Drag ✓" : "Air drag"}
          </SimSecondaryButton>
        </div>
      </div>

      <div className="grid w-full max-w-md gap-3 text-xs text-amber-100/90">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Ángulo" : "Angle"}</span>
            <span className="tabular-nums text-amber-300">{angle}°</span>
          </span>
          <input
            type="range"
            min={5}
            max={85}
            value={angle}
            disabled={flying}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-800 via-amber-700 to-amber-400 accent-amber-400 disabled:opacity-50"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Velocidad inicial" : "Launch speed"}</span>
            <span className="tabular-nums text-amber-300">{speed} m/s</span>
          </span>
          <input
            type="range"
            min={8}
            max={55}
            value={speed}
            disabled={flying}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-800 via-amber-700 to-amber-400 accent-amber-400 disabled:opacity-50"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>g</span>
            <span className="tabular-nums text-amber-300">{gVal.toFixed(1)} m/s²</span>
          </span>
          <input
            type="range"
            min={20}
            max={200}
            value={Math.round(gVal * 10)}
            disabled={flying}
            onChange={(e) => setGVal(Number(e.target.value) / 10)}
            className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-800 via-amber-700 to-amber-400 accent-amber-400 disabled:opacity-50"
          />
        </label>
        {drag && (
          <label className="flex flex-col gap-1">
            <span className="flex justify-between font-semibold">
              <span>{es ? "Coef. arrastre" : "Drag coeff."}</span>
              <span className="tabular-nums text-amber-300">{dragK.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={2}
              max={25}
              value={Math.round(dragK * 100)}
              disabled={flying}
              onChange={(e) => setDragK(Number(e.target.value) / 100)}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-stone-800 via-amber-700 to-amber-400 accent-amber-400 disabled:opacity-50"
            />
          </label>
        )}
      </div>

      <div className="grid w-full max-w-md grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-xl border border-amber-500/25 bg-black/40 px-2 py-2.5">
          <p className="font-bold text-amber-200/70">{es ? "Alcance" : "Range"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-100">
            {hud.range > 0 || landed.current ? `${hud.range} m` : "—"}
          </p>
          <p className="mt-0.5 text-[10px] text-amber-200/45">
            {es ? "ideal" : "ideal"} {theoryR.toFixed(1)} m
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-black/40 px-2 py-2.5">
          <p className="font-bold text-amber-200/70">{es ? "Altura máx" : "Max height"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-100">
            {hud.maxH > 0 ? `${hud.maxH} m` : flying ? `${hud.height} m` : "—"}
          </p>
          <p className="mt-0.5 text-[10px] text-amber-200/45">
            {es ? "ideal" : "ideal"} {theoryH.toFixed(1)} m
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-black/40 px-2 py-2.5">
          <p className="font-bold text-amber-200/70">{es ? "Tiempo" : "Time"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-100">
            {hud.t > 0 ? `${hud.t} s` : "—"}
          </p>
          <p className="mt-0.5 text-[10px] text-amber-200/45">
            {es ? "ideal" : "ideal"} {theoryT.toFixed(2)} s
          </p>
        </div>
      </div>

      <p className="max-w-md text-center text-[12px] leading-relaxed text-amber-200/80">
        {es
          ? "Ajustá ángulo y velocidad, lanzá, y compará la curva naranja con la parábola ideal punteada. Con arrastre el alcance baja."
          : "Set angle and speed, launch, and compare the orange path with the dashed ideal parabola. Drag shortens the range."}
      </p>

      <div className="relative w-full max-w-[520px]">
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-amber-400/35 via-transparent to-orange-600/20 opacity-90"
          aria-hidden
        />
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={es ? "Simulador de movimiento de proyectil" : "Projectile motion simulator"}
          className="relative w-full rounded-2xl border border-amber-500/30 bg-[#0a1220] shadow-[inset_0_0_50px_rgba(180,100,20,0.15)]"
          style={{ width: "100%", maxWidth: W, height: "auto", aspectRatio: `${W} / ${H}` }}
        />
      </div>

      <p className="text-center text-[11px] text-amber-200/45">
        {es
          ? "x = v₀ cosθ · t ··· y = v₀ sinθ · t − ½gt² (sin arrastre)."
          : "x = v₀ cosθ · t ··· y = v₀ sinθ · t − ½gt² (no drag)."}
      </p>
    </div>
  );
}
