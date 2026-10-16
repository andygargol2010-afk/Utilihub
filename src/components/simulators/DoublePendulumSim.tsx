import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 480;
const H = 380;
const PIVOT_X = W / 2;
const PIVOT_Y = 48;
const TRAIL_MAX = 240;
const PX_PER_M = 140;
const DT = 1 / 90;
const TWIN_DELTA = 0.0015;

const PRESETS = {
  classic: { th1: Math.PI / 2, th2: 0, labelEn: "Classic", labelEs: "Clásico" },
  butterfly: { th1: Math.PI * 0.85, th2: Math.PI * 0.35, labelEn: "Butterfly", labelEs: "Mariposa" },
  low: { th1: Math.PI * 0.35, th2: Math.PI * 0.15, labelEn: "Low energy", labelEs: "Baja energía" },
} as const;

export function DoublePendulumSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [running, setRunning] = useState(true);
  const [l1, setL1] = useState(0.65);
  const [l2, setL2] = useState(0.55);
  const [m1, setM1] = useState(1);
  const [m2, setM2] = useState(1);
  const [damping, setDamping] = useState(0.02);
  const [g, setG] = useState(9.8);
  const [speed, setSpeed] = useState(1);
  const [trails, setTrails] = useState(true);
  const [showTwin, setShowTwin] = useState(true);
  const [hud, setHud] = useState({ th1: 90, th2: 0, w1: 0, w2: 0, E: 0 });

  const state = useRef({
    th1: Math.PI / 2,
    w1: 0,
    th2: 0,
    w2: 0,
    trail: [] as { x: number; y: number; a: number; s: number }[],
  });
  const twin = useRef({
    th1: Math.PI / 2 + TWIN_DELTA,
    w1: 0,
    th2: 0,
    w2: 0,
    trail: [] as { x: number; y: number; a: number; s: number }[],
  });
  const runningRef = useRef(true);
  const paramsRef = useRef({ l1: 0.65, l2: 0.55, m1: 1, m2: 1, damp: 0.02, g: 9.8, speed: 1 });
  const trailsRef = useRef(true);
  const twinRef = useRef(true);
  const dragging = useRef<0 | 1 | 2>(0);
  const hudTick = useRef(0);

  runningRef.current = running;
  paramsRef.current = { l1, l2, m1, m2, damp: damping, g, speed };
  trailsRef.current = trails;
  twinRef.current = showTwin;

  const syncTwin = useCallback(() => {
    const s = state.current;
    twin.current.th1 = s.th1 + TWIN_DELTA;
    twin.current.th2 = s.th2;
    twin.current.w1 = 0;
    twin.current.w2 = 0;
    twin.current.trail = [];
  }, []);

  const reset = useCallback(() => {
    state.current.th1 = Math.PI / 2;
    state.current.w1 = 0;
    state.current.th2 = 0;
    state.current.w2 = 0;
    state.current.trail = [];
    syncTwin();
    setHud({ th1: 90, th2: 0, w1: 0, w2: 0, E: 0 });
    setRunning(true);
  }, [syncTwin]);

  const applyPreset = useCallback((key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    state.current.th1 = p.th1;
    state.current.th2 = p.th2;
    state.current.w1 = 0;
    state.current.w2 = 0;
    state.current.trail = [];
    syncTwin();
    setRunning(true);
  }, [syncTwin]);

  const perturb = useCallback(() => {
    state.current.th1 += (Math.random() - 0.5) * 0.08;
    state.current.th2 += (Math.random() - 0.5) * 0.08;
    syncTwin();
  }, [syncTwin]);

  const savePng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = es ? "pendulo-doble-caos.png" : "double-pendulum-chaos.png";
    a.click();
  }, [es]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const step = (s: typeof state.current, dt: number) => {
      const p = paramsRef.current;
      const L1 = p.l1;
      const L2 = p.l2;
      const M1 = p.m1;
      const M2 = p.m2;
      const G = p.g;
      const c = p.damp * 0.8;

      const dth = s.th1 - s.th2;
      const den1 = (M1 + M2) * L1 - M2 * L1 * Math.cos(dth) * Math.cos(dth);
      const den2 = (L2 / L1) * den1;

      const num1 =
        -M2 * L1 * s.w1 * s.w1 * Math.sin(dth) * Math.cos(dth) +
        M2 * G * Math.sin(s.th2) * Math.cos(dth) +
        M2 * L2 * s.w2 * s.w2 * Math.sin(dth) -
        (M1 + M2) * G * Math.sin(s.th1);
      const num2 =
        -M2 * L2 * s.w2 * s.w2 * Math.sin(dth) * Math.cos(dth) +
        (M1 + M2) * G * Math.sin(s.th1) * Math.cos(dth) -
        (M1 + M2) * L1 * s.w1 * s.w1 * Math.sin(dth) -
        (M1 + M2) * G * Math.sin(s.th2);

      const a1 = num1 / den1 - c * s.w1;
      const a2 = num2 / den2 - c * s.w2;

      s.w1 += a1 * dt;
      s.w2 += a2 * dt;
      s.th1 += s.w1 * dt;
      s.th2 += s.w2 * dt;
    };

    const energy = () => {
      const p = paramsRef.current;
      const s = state.current;
      const L1 = p.l1;
      const L2 = p.l2;
      const M1 = p.m1;
      const M2 = p.m2;
      const G = p.g;
      const c1 = Math.cos(s.th1);
      const c2 = Math.cos(s.th2);
      const s1 = Math.sin(s.th1);
      const s2 = Math.sin(s.th2);
      const v1sq = (L1 * s.w1) ** 2;
      const v2sq =
        v1sq +
        (L2 * s.w2) ** 2 +
        2 * L1 * L2 * s.w1 * s.w2 * (c1 * c2 + s1 * s2);
      const KE = 0.5 * M1 * v1sq + 0.5 * M2 * v2sq;
      const PE = -M1 * G * L1 * c1 - M2 * G * (L1 * c1 + L2 * c2);
      return KE + PE;
    };

    const tipSpeed = (s: typeof state.current) => {
      const p = paramsRef.current;
      const L1 = p.l1;
      const L2 = p.l2;
      const c1 = Math.cos(s.th1);
      const c2 = Math.cos(s.th2);
      const s1 = Math.sin(s.th1);
      const s2 = Math.sin(s.th2);
      const vx = L1 * s.w1 * c1 + L2 * s.w2 * c2;
      const vy = -L1 * s.w1 * s1 - L2 * s.w2 * s2;
      return Math.hypot(vx, vy);
    };

    const drawPendulum = (ctx: CanvasRenderingContext2D, s: typeof state.current, alpha = 1, isTwin = false) => {
      const p = paramsRef.current;
      const L1px = p.l1 * PX_PER_M;
      const L2px = p.l2 * PX_PER_M;
      const x1 = PIVOT_X + Math.sin(s.th1) * L1px;
      const y1 = PIVOT_Y + Math.cos(s.th1) * L1px;
      const x2 = x1 + Math.sin(s.th2) * L2px;
      const y2 = y1 + Math.cos(s.th2) * L2px;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.strokeStyle = isTwin ? "#a78bfa" : "#94a3b8";
      ctx.lineWidth = isTwin ? 2.2 : 3.5;
      ctx.lineCap = "round";
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = isTwin ? "#c4b5fd" : "#38bdf8";
      ctx.arc(x1, y1, (isTwin ? 8 : 11) + p.m1 * 1.5, 0, Math.PI * 2);
      ctx.fill();

      if (!isTwin) {
        const glow = ctx.createRadialGradient(x2, y2, 4, x2, y2, 26);
        glow.addColorStop(0, "rgba(251,191,36,0.55)");
        glow.addColorStop(1, "rgba(251,191,36,0)");
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(x2, y2, 26, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.fillStyle = isTwin ? "#ddd6fe" : "#fbbf24";
      ctx.arc(x2, y2, (isTwin ? 7 : 10) + p.m2 * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const dtFrame = Math.min(0.05, (now - last) / 1000);
      last = now;
      const scaled = dtFrame * paramsRef.current.speed;
      acc += scaled;

      if (runningRef.current && dragging.current === 0) {
        while (acc >= DT) {
          step(state.current, DT);
          if (twinRef.current) step(twin.current, DT);
          acc -= DT;
        }
      } else acc = 0;

      const p = paramsRef.current;
      const s = state.current;
      const L1px = p.l1 * PX_PER_M;
      const L2px = p.l2 * PX_PER_M;

      const x1 = PIVOT_X + Math.sin(s.th1) * L1px;
      const y1 = PIVOT_Y + Math.cos(s.th1) * L1px;
      const x2 = x1 + Math.sin(s.th2) * L2px;
      const y2 = y1 + Math.cos(s.th2) * L2px;

      const spd = tipSpeed(s);

      if (trailsRef.current && runningRef.current && dragging.current === 0) {
        s.trail.push({ x: x2, y: y2, a: 1, s: spd });
        if (s.trail.length > TRAIL_MAX) s.trail.shift();
        for (const pt of s.trail) pt.a *= 0.985;

        if (twinRef.current) {
          const t = twin.current;
          const tx1 = PIVOT_X + Math.sin(t.th1) * L1px;
          const ty1 = PIVOT_Y + Math.cos(t.th1) * L1px;
          const tx2 = tx1 + Math.sin(t.th2) * L2px;
          const ty2 = ty1 + Math.cos(t.th2) * L2px;
          const tspd = tipSpeed(t);
          t.trail.push({ x: tx2, y: ty2, a: 1, s: tspd });
          if (t.trail.length > TRAIL_MAX) t.trail.shift();
          for (const pt of t.trail) pt.a *= 0.985;
        }
      } else if (!trailsRef.current) {
        s.trail.length = 0;
        twin.current.trail.length = 0;
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0b1220");
      bg.addColorStop(1, "#05070c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(30,40,60,0.55)";
      ctx.fillRect(PIVOT_X - 36, 10, 72, 26);
      ctx.strokeStyle = "rgba(125,211,252,0.35)";
      ctx.strokeRect(PIVOT_X - 36, 10, 72, 26);

      // Twin trail first (behind)
      if (twinRef.current && twin.current.trail.length > 1) {
        for (let i = 1; i < twin.current.trail.length; i++) {
          const a = twin.current.trail[i]!;
          const b = twin.current.trail[i - 1]!;
          const alpha = 0.04 + a.a * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(270, 70%, 70%, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
      }

      if (s.trail.length > 1) {
        for (let i = 1; i < s.trail.length; i++) {
          const a = s.trail[i]!;
          const b = s.trail[i - 1]!;
          const hue = 190 + Math.min(80, a.s * 12);
          const alpha = 0.06 + a.a * 0.75;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${hue}, 85%, 62%, ${alpha})`;
          ctx.lineWidth = 1.6 + Math.min(1.4, a.s * 0.15);
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
      }

      if (twinRef.current) drawPendulum(ctx, twin.current, 0.55, true);
      drawPendulum(ctx, s, 1, false);

      ctx.beginPath();
      ctx.fillStyle = "#e2e8f0";
      ctx.arc(PIVOT_X, PIVOT_Y, 8, 0, Math.PI * 2);
      ctx.fill();

      hudTick.current++;
      if (hudTick.current % 8 === 0) {
        setHud({
          th1: Math.round((s.th1 * 180) / Math.PI),
          th2: Math.round((s.th2 * 180) / Math.PI),
          w1: s.w1,
          w2: s.w2,
          E: energy(),
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pointerToAngles = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const p = paramsRef.current;
    const L1px = p.l1 * PX_PER_M;

    const s = state.current;
    if (dragging.current === 1) {
      const dx = x - PIVOT_X;
      const dy = y - PIVOT_Y;
      s.th1 = Math.atan2(dx, dy);
      s.w1 = 0;
    } else if (dragging.current === 2) {
      const x1 = PIVOT_X + Math.sin(s.th1) * L1px;
      const y1 = PIVOT_Y + Math.cos(s.th1) * L1px;
      const dx = x - x1;
      const dy = y - y1;
      s.th2 = Math.atan2(dx, dy);
      s.w2 = 0;
    }
    syncTwin();
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-sky-500/25 bg-sky-950/40 p-3 backdrop-blur-sm">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300/85">
          {es ? "Lab de caos — péndulo doble" : "Chaos lab — double pendulum"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
            {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
          </SimPrimaryButton>
          <SimSecondaryButton theme="lab" onClick={reset}>
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={perturb}>
            {es ? "Perturbar" : "Perturb"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={trails} onClick={() => setTrails((t) => !t)}>
            {es ? (trails ? "Estela ✓" : "Estela") : trails ? "Trail ✓" : "Trail"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={showTwin} onClick={() => setShowTwin((t) => !t)}>
            {es ? (showTwin ? "Gemelo ✓" : "Gemelo") : showTwin ? "Twin ✓" : "Twin"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={savePng}>
            PNG
          </SimSecondaryButton>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((k) => (
            <SimSecondaryButton key={k} theme="lab" onClick={() => applyPreset(k)}>
              {es ? PRESETS[k].labelEs : PRESETS[k].labelEn}
            </SimSecondaryButton>
          ))}
        </div>
      </div>

      <div className="grid w-full max-w-md gap-2 text-xs text-sky-100/85">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "L1 (superior)" : "L1 (upper)"}</span>
            <span className="tabular-nums text-sky-300">{l1.toFixed(2)} m</span>
          </span>
          <input type="range" min={30} max={90} value={Math.round(l1 * 100)} onChange={(e) => setL1(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-sky-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "L2 (inferior)" : "L2 (lower)"}</span>
            <span className="tabular-nums text-sky-300">{l2.toFixed(2)} m</span>
          </span>
          <input type="range" min={25} max={80} value={Math.round(l2 * 100)} onChange={(e) => setL2(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-sky-400" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">m1</span>
            <input type="range" min={50} max={200} value={Math.round(m1 * 100)} onChange={(e) => setM1(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-sky-400" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">m2</span>
            <input type="range" min={50} max={200} value={Math.round(m2 * 100)} onChange={(e) => setM2(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-sky-400" />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Amortiguación" : "Damping"}</span>
            <span className="tabular-nums text-sky-300">{Math.round(damping * 100)}%</span>
          </span>
          <input type="range" min={0} max={40} value={Math.round(damping * 100)} onChange={(e) => setDamping(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-sky-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>g</span>
            <span className="tabular-nums text-sky-300">{g.toFixed(1)} m/s²</span>
          </span>
          <input type="range" min={20} max={200} value={Math.round(g * 10)} onChange={(e) => setG(Number(e.target.value) / 10)} className="h-2 w-full cursor-pointer accent-sky-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Velocidad" : "Speed"}</span>
            <span className="tabular-nums text-sky-300">{speed.toFixed(2)}×</span>
          </span>
          <input type="range" min={25} max={200} value={Math.round(speed * 100)} onChange={(e) => setSpeed(Number(e.target.value) / 100)} className="h-2 w-full cursor-pointer accent-sky-400" />
        </label>
      </div>

      <div className="grid w-full max-w-md grid-cols-5 gap-1.5 text-center text-[10px]">
        <div className="rounded-xl border border-sky-500/20 bg-black/30 px-1 py-2">
          <p className="font-bold text-sky-200/70">θ1</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-sky-100">{hud.th1}°</p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-black/30 px-1 py-2">
          <p className="font-bold text-sky-200/70">θ2</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-sky-100">{hud.th2}°</p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-black/30 px-1 py-2">
          <p className="font-bold text-sky-200/70">ω1</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-sky-100">{hud.w1.toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-black/30 px-1 py-2">
          <p className="font-bold text-sky-200/70">ω2</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-sky-100">{hud.w2.toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-black/30 px-1 py-2">
          <p className="font-bold text-sky-200/70">E</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-sky-100">{hud.E.toFixed(2)}</p>
        </div>
      </div>

      <p className="text-center text-[12px] leading-relaxed text-sky-200/75">
        {es
          ? "Arrastrá cualquiera de las masas para fijar ángulos. Presets para condiciones clásicas de caos. El gemelo (violeta) parte con Δθ₁ ≈ 0.0015 rad y diverge rápido."
          : "Drag either bob to set angles. Presets for classic chaos conditions. The twin (violet) starts with Δθ₁ ≈ 0.0015 rad and diverges rapidly."}
      </p>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * W;
          const y = ((e.clientY - rect.top) / rect.height) * H;
          const p = paramsRef.current;
          const L1px = p.l1 * PX_PER_M;
          const x1 = PIVOT_X + Math.sin(state.current.th1) * L1px;
          const y1 = PIVOT_Y + Math.cos(state.current.th1) * L1px;
          const d1 = Math.hypot(x - x1, y - y1);
          const d2 = Math.hypot(
            x - (x1 + Math.sin(state.current.th2) * p.l2 * PX_PER_M),
            y - (y1 + Math.cos(state.current.th2) * p.l2 * PX_PER_M),
          );
          dragging.current = d2 < d1 + 20 ? 2 : 1;
          e.currentTarget.setPointerCapture(e.pointerId);
          setRunning(false);
          pointerToAngles(e);
        }}
        onPointerMove={(e) => {
          if (dragging.current) pointerToAngles(e);
        }}
        onPointerUp={() => {
          dragging.current = 0;
        }}
        onPointerCancel={() => {
          dragging.current = 0;
        }}
        role="img"
        aria-label={es ? "Simulador de péndulo doble caótico" : "Chaotic double pendulum simulator"}
        className="relative w-full max-w-[480px] touch-none rounded-2xl border border-sky-500/30 bg-[#05070c] shadow-[inset_0_0_40px_rgba(14,165,233,0.12)]"
        style={{ height: "auto", cursor: "grab", aspectRatio: `${W}/${H}` }}
      />

      <p className="text-center text-[11px] text-sky-200/40">
        {es
          ? "Sistema clásico no lineal. El gemelo muestra dependencia sensible: diferencias iniciales minúsculas divergen rápidamente. Energía se conserva sin amortiguación."
          : "Classic nonlinear system. The twin shows sensitive dependence: tiny initial differences diverge rapidly. Energy is conserved without damping."}
      </p>
    </div>
  );
}
