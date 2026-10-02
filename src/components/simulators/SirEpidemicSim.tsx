import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 520;
const H = 280;
const HIST = 200;
const N = 1000;

type SIR = { s: number; i: number; r: number };

export function SirEpidemicSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [beta, setBeta] = useState(0.35);
  const [gamma, setGamma] = useState(0.12);
  const [vax, setVax] = useState(0);
  const [hud, setHud] = useState<SIR>({ s: 990, i: 10, r: 0 });
  const [day, setDay] = useState(0);

  const state = useRef<SIR>({ s: 990, i: 10, r: 0 });
  const history = useRef<{ s: number; i: number; r: number }[]>([]);
  const runningRef = useRef(false);
  const params = useRef({ beta, gamma, vax });
  const tRef = useRef(0);
  runningRef.current = running;
  params.current = { beta, gamma, vax };

  const R0 = gamma > 0 ? beta / gamma : 0;

  const reset = useCallback(() => {
    state.current = { s: 990, i: 10, r: 0 };
    history.current = [];
    tRef.current = 0;
    setHud({ ...state.current });
    setDay(0);
    setRunning(false);
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const step = (dt: number) => {
      const st = state.current;
      const { beta: b, gamma: g, vax: v } = params.current;
      const infection = (b * st.s * st.i) / N;
      const recovery = g * st.i;
      const vaccinated = v * st.s;

      st.s = Math.max(0, st.s - infection * dt - vaccinated * dt);
      st.i = Math.max(0, st.i + infection * dt - recovery * dt);
      st.r = Math.max(0, Math.min(N, st.r + recovery * dt + vaccinated * dt));
      const sum = st.s + st.i + st.r;
      if (sum > 0) {
        const k = N / sum;
        st.s *= k;
        st.i *= k;
        st.r *= k;
      }
      tRef.current += dt;
    };

    const draw = (now: number) => {
      const dtReal = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) {
        acc += dtReal;
        while (acc > 0.05) {
          step(0.05);
          acc -= 0.05;
        }
        history.current.push({ s: state.current.s, i: state.current.i, r: state.current.r });
        if (history.current.length > HIST) history.current.shift();
        setHud({ ...state.current });
        setDay(Math.floor(tRef.current));
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0c1520");
      bg.addColorStop(1, "#060a10");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = 16;
      const cy = 16;
      const cw = W - 32;
      const ch = H - 56;
      ctx.strokeStyle = "rgba(148,163,184,0.2)";
      ctx.strokeRect(cx, cy, cw, ch);

      const hist = history.current;
      const plot = (key: "s" | "i" | "r", color: string) => {
        if (hist.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        hist.forEach((pt, idx) => {
          const x = cx + (idx / (HIST - 1)) * cw;
          const y = cy + ch - (pt[key] / N) * ch;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      };
      plot("s", "rgba(56,189,248,0.9)");
      plot("i", "rgba(248,113,113,0.95)");
      plot("r", "rgba(52,211,153,0.9)");

      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillStyle = "rgba(56,189,248,0.95)";
      ctx.fillText(es ? "Susceptibles" : "Susceptible", 24, H - 28);
      ctx.fillStyle = "rgba(248,113,113,0.95)";
      ctx.fillText(es ? "Infectados" : "Infected", 140, H - 28);
      ctx.fillStyle = "rgba(52,211,153,0.95)";
      ctx.fillText(es ? "Recuperados" : "Recovered", 250, H - 28);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(`${es ? "Día" : "Day"} ${Math.floor(tRef.current)}`, W - 70, H - 28);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [es]);

  const peakRisk = R0 > 1;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
          {running ? (es ? "Pausa" : "Pause") : es ? "Simular" : "Run"}
        </SimPrimaryButton>
        <SimSecondaryButton theme="lab" onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </SimSecondaryButton>
      </div>

      <div className="overflow-hidden rounded-2xl border border-sky-400/15 bg-black/30">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "S", value: hud.s.toFixed(0), color: "text-sky-300" },
          { label: "I", value: hud.i.toFixed(0), color: "text-rose-300" },
          { label: "R", value: hud.r.toFixed(0), color: "text-emerald-300" },
          {
            label: "R₀",
            value: R0.toFixed(2),
            color: peakRisk ? "text-amber-300" : "text-emerald-300",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{s.label}</p>
            <p className={`mt-0.5 text-lg font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-sky-100/70">
          β ({es ? "transmisión" : "transmission"}): {beta.toFixed(2)}
          <input
            type="range"
            min={0.05}
            max={0.8}
            step={0.01}
            value={beta}
            onChange={(e) => setBeta(Number(e.target.value))}
            className="mt-1 w-full accent-rose-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          γ ({es ? "recuperación" : "recovery"}): {gamma.toFixed(2)}
          <input
            type="range"
            min={0.02}
            max={0.4}
            step={0.01}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            className="mt-1 w-full accent-emerald-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Vacunación" : "Vaccination"}: {vax.toFixed(3)}
          <input
            type="range"
            min={0}
            max={0.15}
            step={0.005}
            value={vax}
            onChange={(e) => setVax(Number(e.target.value))}
            className="mt-1 w-full accent-sky-400"
          />
        </label>
      </div>

      <p className="text-center text-xs text-white/55">
        {peakRisk
          ? es
            ? "R₀ > 1 → brote posible. Subí γ o vacunación para aplanar la curva."
            : "R₀ > 1 → outbreak possible. Raise γ or vaccination to flatten the curve."
          : es
            ? "R₀ ≤ 1 → la epidemia tiende a extinguirse."
            : "R₀ ≤ 1 → the epidemic tends to die out."}
      </p>

      <p className="text-center text-xs text-white/40">
        {es
          ? "Modelo SIR clásico · dS/dt = −βSI/N · dI/dt = βSI/N − γI · dR/dt = γI"
          : "Classic SIR · dS/dt = −βSI/N · dI/dt = βSI/N − γI · dR/dt = γI"}
      </p>
    </div>
  );
}
