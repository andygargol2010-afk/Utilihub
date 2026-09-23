import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 420;
const H = 340;
const PIVOT_X = W / 2;
const PIVOT_Y = 42;
const TRAIL_MAX = 120;
const PX_PER_M = 220;
const DT = 1 / 60;

function lengthMeters(ui: number) {
  return (90 + ui * 140) / PX_PER_M;
}

function gAccel(ui: number) {
  return 3 + ui * 11;
}

function theoryPeriod(L: number, g: number) {
  if (g <= 0 || L <= 0) return 0;
  return 2 * Math.PI * Math.sqrt(L / g);
}

export function PendulumSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [running, setRunning] = useState(false);
  const [length, setLength] = useState(0.72);
  const [damping, setDamping] = useState(0.06);
  const [gFactor, setGFactor] = useState(0.68);
  const [trails, setTrails] = useState(true);
  const [hud, setHud] = useState({
    angle: 45,
    omega: 0,
    period: 0,
    theory: 0,
    ke: 0,
    pe: 0,
    eTot: 1,
  });

  const state = useRef({
    theta: Math.PI / 4,
    omega: 0,
    trail: [] as { x: number; y: number; a: number }[],
    lastCross: 0,
    periodAcc: 0,
    prevTheta: Math.PI / 4,
  });
  const runningRef = useRef(false);
  const lengthRef = useRef(0.72);
  const dampRef = useRef(0.06);
  const gRef = useRef(0.68);
  const trailsRef = useRef(true);
  const dragging = useRef(false);
  const dragHist = useRef<{ t: number; th: number }[]>([]);
  const hudTick = useRef(0);

  runningRef.current = running;
  lengthRef.current = length;
  dampRef.current = damping;
  gRef.current = gFactor;
  trailsRef.current = trails;

  const rodPx = () => 90 + lengthRef.current * 140;

  const applyAngle = useCallback((deg: number) => {
    const th = (deg * Math.PI) / 180;
    state.current.theta = th;
    state.current.omega = 0;
    state.current.trail = [];
    state.current.lastCross = 0;
    state.current.periodAcc = 0;
    state.current.prevTheta = th;
    setHud((h) => ({ ...h, angle: deg, omega: 0, period: 0 }));
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    applyAngle(45);
  }, [applyAngle]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const stepPhysics = (dt: number) => {
      const Lpx = rodPx();
      const L = Lpx / PX_PER_M;
      const g = gAccel(gRef.current);
      const c = dampRef.current * 0.55;
      const s = state.current;

      const alpha = -(g / L) * Math.sin(s.theta) - c * s.omega;
      s.omega += alpha * dt;
      s.prevTheta = s.theta;
      s.theta += s.omega * dt;

      if (s.prevTheta < 0 && s.theta >= 0 && s.omega > 0) {
        const now = performance.now();
        if (s.lastCross > 0) {
          const p = now - s.lastCross;
          if (p > 250 && p < 10000) {
            s.periodAcc = s.periodAcc ? s.periodAcc * 0.65 + p * 0.35 : p;
          }
        }
        s.lastCross = now;
      }
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
      acc += dtFrame;

      if (runningRef.current && !dragging.current) {
        while (acc >= DT) {
          stepPhysics(DT);
          acc -= DT;
        }
      } else {
        acc = 0;
      }

      const Lpx = rodPx();
      const L = Lpx / PX_PER_M;
      const g = gAccel(gRef.current);
      const s = state.current;
      const bx = PIVOT_X + Math.sin(s.theta) * Lpx;
      const by = PIVOT_Y + Math.cos(s.theta) * Lpx;

      const pe = g * L * (1 - Math.cos(s.theta));
      const ke = 0.5 * L * L * s.omega * s.omega;
      const eTot = Math.max(pe + ke, 1e-6);
      const theory = theoryPeriod(L, g);

      if (trailsRef.current && runningRef.current && !dragging.current) {
        s.trail.push({ x: bx, y: by, a: 1 });
        if (s.trail.length > TRAIL_MAX) s.trail.shift();
        for (const p of s.trail) p.a *= 0.985;
      } else if (!trailsRef.current && s.trail.length) {
        s.trail.length = 0;
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#1e160c");
      bg.addColorStop(0.55, "#120c06");
      bg.addColorStop(1, "#080502");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(90,60,20,0.35)";
      ctx.fillRect(PIVOT_X - 28, 8, 56, 28);
      ctx.strokeStyle = "rgba(251,191,36,0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(PIVOT_X - 28, 8, 56, 28);

      ctx.strokeStyle = "rgba(180,120,40,0.05)";
      for (let y = 0; y < H; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.ellipse(bx, H - 18, 22 + Math.abs(Math.sin(s.theta)) * 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = "rgba(251,191,36,0.18)";
      ctx.lineWidth = 1;
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.lineTo(PIVOT_X, PIVOT_Y + Lpx + 20);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.strokeStyle = "rgba(251,191,36,0.2)";
      ctx.lineWidth = 1.5;
      ctx.arc(PIVOT_X, PIVOT_Y, Lpx, Math.PI * 0.12, Math.PI * 0.88);
      ctx.stroke();
      for (const mark of [-60, -45, -30, 0, 30, 45, 60]) {
        const rad = (mark * Math.PI) / 180;
        const x0 = PIVOT_X + Math.sin(rad) * (Lpx - 8);
        const y0 = PIVOT_Y + Math.cos(rad) * (Lpx - 8);
        const x1 = PIVOT_X + Math.sin(rad) * (Lpx + 4);
        const y1 = PIVOT_Y + Math.cos(rad) * (Lpx + 4);
        ctx.beginPath();
        ctx.strokeStyle = mark === 0 ? "rgba(251,191,36,0.45)" : "rgba(251,191,36,0.22)";
        ctx.lineWidth = mark === 0 ? 1.5 : 1;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      if (s.trail.length > 1) {
        for (let i = 1; i < s.trail.length; i++) {
          const a = s.trail[i]!;
          const b = s.trail[i - 1]!;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(251,191,36,${0.15 + a.a * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.arc(PIVOT_X, PIVOT_Y, Math.min(48, Lpx * 0.35), Math.PI / 2, Math.PI / 2 - s.theta, s.theta > 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(251,191,36,0.08)";
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "#b8860b";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,230,150,0.55)";
      ctx.lineWidth = 1.2;
      ctx.moveTo(PIVOT_X, PIVOT_Y);
      ctx.lineTo(bx, by);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = "#6b4e12";
      ctx.arc(PIVOT_X, PIVOT_Y, 11, 0, Math.PI * 2);
      ctx.fill();
      const piv = ctx.createRadialGradient(PIVOT_X - 3, PIVOT_Y - 3, 1, PIVOT_X, PIVOT_Y, 11);
      piv.addColorStop(0, "#f5d76e");
      piv.addColorStop(0.6, "#c9a227");
      piv.addColorStop(1, "#5c4010");
      ctx.beginPath();
      ctx.fillStyle = piv;
      ctx.arc(PIVOT_X, PIVOT_Y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(251,191,36,0.55)";
      ctx.lineWidth = 1.5;
      ctx.arc(PIVOT_X, PIVOT_Y, 13, 0, Math.PI * 2);
      ctx.stroke();

      const bobR = 15;
      const glow = ctx.createRadialGradient(bx, by, bobR * 0.3, bx, by, bobR + 10);
      glow.addColorStop(0, "rgba(251,191,36,0.25)");
      glow.addColorStop(1, "rgba(251,191,36,0)");
      ctx.beginPath();
      ctx.fillStyle = glow;
      ctx.arc(bx, by, bobR + 10, 0, Math.PI * 2);
      ctx.fill();

      const bob = ctx.createRadialGradient(bx - 4, by - 4, 2, bx, by, bobR + 2);
      bob.addColorStop(0, "#fff8e0");
      bob.addColorStop(0.35, "#e8b923");
      bob.addColorStop(0.75, "#a67c00");
      bob.addColorStop(1, "rgba(80,45,5,0.3)");
      ctx.beginPath();
      ctx.fillStyle = bob;
      ctx.arc(bx, by, bobR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.arc(bx - 5, by - 5, 3.5, 0, Math.PI * 2);
      ctx.fill();

      const barX = W - 22;
      const barY = 50;
      const barH = 100;
      const keH = (ke / eTot) * barH;
      const peH = (pe / eTot) * barH;
      ctx.fillStyle = "rgba(30,20,8,0.7)";
      ctx.fillRect(barX - 8, barY - 4, 18, barH + 8);
      ctx.fillStyle = "rgba(56,189,248,0.85)";
      ctx.fillRect(barX - 4, barY + barH - keH, 10, keH);
      ctx.fillStyle = "rgba(251,146,60,0.85)";
      ctx.fillRect(barX - 4, barY + barH - keH - peH, 10, peH);
      ctx.fillStyle = "rgba(251,191,36,0.5)";
      ctx.font = "9px system-ui,sans-serif";
      ctx.fillText("E", barX - 3, barY - 8);

      const deg = (s.theta * 180) / Math.PI;
      const drawPanel = (x: number, y: number, w: number, label: string) => {
        ctx.fillStyle = "rgba(30,20,8,0.88)";
        ctx.fillRect(x, y, w, 22);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 11px system-ui,sans-serif";
        ctx.fillText(label, x + 8, y + 15);
      };
      drawPanel(10, H - 56, 130, `${es ? "Ángulo" : "Angle"} ${deg.toFixed(1)}°`);
      if (s.periodAcc > 0) {
        drawPanel(W - 140, H - 56, 130, `T ${es ? "med" : "meas"} ${(s.periodAcc / 1000).toFixed(2)}s`);
      }
      drawPanel(10, H - 30, 160, `T ${es ? "teoría" : "theory"} ${theory.toFixed(2)}s`);

      if (!runningRef.current && !dragging.current) {
        ctx.fillStyle = "rgba(8,5,2,0.45)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,240,200,0.95)";
        ctx.font = "bold 15px system-ui,sans-serif";
        const msg = es ? "Pausado — arrastrá o dale a Seguir" : "Paused — drag or hit Resume";
        ctx.fillText(msg, W / 2 - (es ? 110 : 100), H / 2);
      }

      hudTick.current++;
      if (hudTick.current % 6 === 0) {
        setHud({
          angle: Math.round(deg * 10) / 10,
          omega: Math.round(s.omega * 100) / 100,
          period: s.periodAcc > 0 ? Math.round(s.periodAcc) : 0,
          theory: Math.round(theory * 100) / 100,
          ke: ke / eTot,
          pe: pe / eTot,
          eTot,
        });
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
    th = Math.max(-Math.PI * 0.9, Math.min(Math.PI * 0.9, th));
    state.current.theta = th;
    state.current.omega = 0;
    state.current.trail = [];
    state.current.lastCross = 0;
    state.current.periodAcc = 0;
    dragHist.current.push({ t: performance.now(), th });
    if (dragHist.current.length > 8) dragHist.current.shift();
    setHud((h) => ({
      ...h,
      angle: Math.round((th * 180) / Math.PI),
      omega: 0,
      period: 0,
    }));
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const hist = dragHist.current;
    if (hist.length >= 2) {
      const a = hist[0]!;
      const b = hist[hist.length - 1]!;
      const dt = (b.t - a.t) / 1000;
      if (dt > 0.02 && dt < 0.4) {
        const dth = b.th - a.th;
        state.current.omega = Math.max(-8, Math.min(8, (dth / dt) * 0.35));
      }
    }
    dragHist.current = [];
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
          <SimSecondaryButton theme="clockwork" active={trails} onClick={() => setTrails((t) => !t)}>
            {es ? (trails ? "Estela ✓" : "Estela") : trails ? "Trail ✓" : "Trail"}
          </SimSecondaryButton>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {[15, 30, 45, 60, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => applyAngle(d)}
              className="rounded-full border border-amber-500/30 bg-black/25 px-2.5 py-1 text-[11px] font-bold text-amber-100/90 hover:border-amber-400/50 hover:bg-amber-900/40"
            >
              {d}°
            </button>
          ))}
        </div>
      </div>

      <div className="grid w-full max-w-sm gap-3 text-xs text-amber-100/85">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Longitud" : "Length"}</span>
            <span className="tabular-nums text-amber-300">{lengthMeters(length).toFixed(2)} m</span>
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
            <span className="tabular-nums text-amber-300">{gAccel(gFactor).toFixed(1)} m/s²</span>
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

      <div className="grid w-full max-w-sm grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-xl border border-amber-500/20 bg-black/30 px-2 py-2">
          <p className="font-bold text-amber-200/70">{es ? "Ángulo" : "Angle"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-100">{hud.angle}°</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-black/30 px-2 py-2">
          <p className="font-bold text-amber-200/70">{es ? "T medido" : "T measured"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-100">
            {hud.period ? `${(hud.period / 1000).toFixed(2)}s` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-black/30 px-2 py-2">
          <p className="font-bold text-amber-200/70">{es ? "T teoría" : "T theory"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-100">{hud.theory}s</p>
        </div>
      </div>

      <div className="flex w-full max-w-sm items-center gap-2 text-[10px] text-amber-200/60">
        <span className="inline-block h-2 w-3 rounded-sm bg-sky-400/80" />
        {es ? "Cinética" : "Kinetic"}
        <span className="ml-2 inline-block h-2 w-3 rounded-sm bg-orange-400/80" />
        {es ? "Potencial" : "Potential"}
        <span className="ml-auto tabular-nums">
          KE {(hud.ke * 100).toFixed(0)}% · PE {(hud.pe * 100).toFixed(0)}%
        </span>
      </div>

      <p className="text-center text-[12px] leading-relaxed text-amber-200/75">
        {es
          ? "Arrastrá la masa (podés darle impulso al soltar). Probá 15° vs 60° y compará T medido con la teoría."
          : "Drag the bob (flick on release adds spin). Try 15° vs 60° and compare measured T with theory."}
      </p>

      <div className="relative w-full max-w-[420px]">
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
            dragHist.current = [];
            e.currentTarget.setPointerCapture(e.pointerId);
            setRunning(false);
            pointerToAngle(e);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            pointerToAngle(e);
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="img"
          aria-label={es ? "Simulador de péndulo simple" : "Simple pendulum simulator"}
          className="relative w-full touch-none rounded-2xl border border-amber-500/30 bg-[#080502] shadow-[inset_0_0_40px_rgba(180,100,20,0.15)]"
          style={{ maxWidth: W, height: "auto", cursor: "grab" }}
        />
      </div>

      <p className="text-center text-[11px] text-amber-200/40">
        {es
          ? "θ″ = −(g/L) sin θ − c θ′ · T₀ = 2π√(L/g) (ángulo pequeño)."
          : "θ″ = −(g/L) sin θ − c θ′ · T₀ = 2π√(L/g) (small angle)."}
      </p>
    </div>
  );
}
