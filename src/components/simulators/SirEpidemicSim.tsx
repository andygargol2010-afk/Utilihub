import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 560;
const H = 300;
const HIST = 220;
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

  const state = useRef<SIR>({ s: 990, i: 10, r: 0 });
  const history = useRef<{ s: number; i: number; r: number }[]>([]);
  const runningRef = useRef(false);
  const params = useRef({ beta, gamma, vax });
  const tRef = useRef(0);
  const sparks = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);
  runningRef.current = running;
  params.current = { beta, gamma, vax };

  const R0 = gamma > 0 ? beta / gamma : 0;

  const reset = useCallback(() => {
    state.current = { s: 990, i: 10, r: 0 };
    history.current = [];
    tRef.current = 0;
    sparks.current = [];
    setHud({ ...state.current });
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
        if (state.current.i > 30 && Math.random() < 0.25) {
          sparks.current.push({
            x: 40 + Math.random() * (W - 80),
            y: 40 + Math.random() * (H - 100),
            vx: (Math.random() - 0.5) * 40,
            vy: (Math.random() - 0.5) * 40,
            life: 1,
          });
        }
      }

      for (const sp of sparks.current) {
        sp.x += sp.vx * dtReal;
        sp.y += sp.vy * dtReal;
        sp.life -= dtReal * 1.2;
      }
      sparks.current = sparks.current.filter((s) => s.life > 0);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0a1018");
      bg.addColorStop(0.5, "#0c1420");
      bg.addColorStop(1, "#05080e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(248,113,113,0.04)";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 40, H / 2);
      ctx.lineTo(W / 2 + 40, H / 2);
      ctx.moveTo(W / 2, H / 2 - 40);
      ctx.lineTo(W / 2, H / 2 + 40);
      ctx.stroke();

      if (R0 > 1) {
        const pulse = 0.06 + 0.04 * Math.sin(now / 400);
        const g = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, 220);
        g.addColorStop(0, `rgba(248,113,113,${pulse})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      const cx = 24;
      const cy = 20;
      const cw = W - 48;
      const ch = H - 70;
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      roundRect(ctx, cx, cy, cw, ch, 14);
      ctx.fill();
      ctx.strokeStyle = "rgba(148,163,184,0.15)";
      ctx.stroke();

      ctx.strokeStyle = "rgba(148,163,184,0.05)";
      for (let i = 1; i < 5; i++) {
        const y = cy + (ch * i) / 5;
        ctx.beginPath();
        ctx.moveTo(cx + 6, y);
        ctx.lineTo(cx + cw - 6, y);
        ctx.stroke();
      }

      const hist = history.current;
      const plot = (key: "s" | "i" | "r", stroke: string, fill: string, width = 2.5) => {
        if (hist.length < 2) return;
        ctx.beginPath();
        hist.forEach((pt, idx) => {
          const x = cx + 10 + (idx / (HIST - 1)) * (cw - 20);
          const y = cy + ch - 10 - (pt[key] / N) * (ch - 20);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        const lx = cx + 10 + ((hist.length - 1) / (HIST - 1)) * (cw - 20);
        ctx.lineTo(lx, cy + ch - 10);
        ctx.lineTo(cx + 10, cy + ch - 10);
        ctx.closePath();
        const gr = ctx.createLinearGradient(0, cy, 0, cy + ch);
        gr.addColorStop(0, fill);
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.fill();
        ctx.beginPath();
        hist.forEach((pt, idx) => {
          const x = cx + 10 + (idx / (HIST - 1)) * (cw - 20);
          const y = cy + ch - 10 - (pt[key] / N) * (ch - 20);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.stroke();
      };
      plot("s", "rgba(56,189,248,0.95)", "rgba(56,189,248,0.2)");
      plot("r", "rgba(52,211,153,0.95)", "rgba(52,211,153,0.18)");
      plot("i", "rgba(248,113,113,1)", "rgba(248,113,113,0.32)", 3);

      for (const sp of sparks.current) {
        ctx.fillStyle = `rgba(248,113,113,${sp.life * 0.8})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2 + sp.life * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(251,191,36,${sp.life * 0.35})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 6 + sp.life * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      const barY = H - 36;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      roundRect(ctx, 16, barY, W - 32, 28, 10);
      ctx.fill();

      const legend = [
        { c: "#38bdf8", t: es ? "Susceptibles" : "Susceptible" },
        { c: "#fb7185", t: es ? "Infectados" : "Infected" },
        { c: "#34d399", t: es ? "Recuperados" : "Recovered" },
      ];
      legend.forEach((L, i) => {
        const x = 28 + i * 120;
        ctx.fillStyle = L.c;
        ctx.beginPath();
        ctx.arc(x, barY + 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "11px ui-sans-serif, system-ui";
        ctx.fillText(L.t, x + 10, barY + 18);
      });
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(`${es ? "Día" : "Day"} ${Math.floor(tRef.current)}`, W - 70, barY + 18);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [es, R0]);

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

      <div className="overflow-hidden rounded-2xl border border-rose-400/20 bg-black/40 shadow-[0_0_40px_-12px_rgba(248,113,113,0.3)]">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "S", value: hud.s.toFixed(0), color: "text-sky-300" },
          { label: "I", value: hud.i.toFixed(0), color: "text-rose-300" },
          { label: "R", value: hud.r.toFixed(0), color: "text-emerald-300" },
          { label: "R₀", value: R0.toFixed(2), color: peakRisk ? "text-amber-300" : "text-emerald-300" },
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
          <input type="range" min={0.05} max={0.8} step={0.01} value={beta} onChange={(e) => setBeta(Number(e.target.value))} className="mt-1 w-full accent-rose-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          γ ({es ? "recuperación" : "recovery"}): {gamma.toFixed(2)}
          <input type="range" min={0.02} max={0.4} step={0.01} value={gamma} onChange={(e) => setGamma(Number(e.target.value))} className="mt-1 w-full accent-emerald-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Vacunación" : "Vaccination"}: {vax.toFixed(3)}
          <input type="range" min={0} max={0.15} step={0.005} value={vax} onChange={(e) => setVax(Number(e.target.value))} className="mt-1 w-full accent-sky-400" />
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

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
