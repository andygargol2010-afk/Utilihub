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
  const [i0, setI0] = useState(10);
  const [lockdown, setLockdown] = useState(false);
  const [vaxCampaign, setVaxCampaign] = useState(false);
  const [hud, setHud] = useState<SIR>({ s: N - 10, i: 10, r: 0 });

  const state = useRef<SIR>({ s: N - 10, i: 10, r: 0 });
  const history = useRef<{ s: number; i: number; r: number }[]>([]);
  const runningRef = useRef(false);
  const params = useRef({ beta, gamma, lockdown, vaxCampaign });
  const tRef = useRef(0);
  runningRef.current = running;
  params.current = { beta, gamma, lockdown, vaxCampaign };

  const effectiveBeta = lockdown ? beta * 0.35 : beta;
  const R0 = gamma > 0 ? effectiveBeta / gamma : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const b = Number(qs.get("b"));
    const g = Number(qs.get("g"));
    const ii = Number(qs.get("i0"));
    if (b > 0) setBeta(Math.min(0.8, Math.max(0.05, b)));
    if (g > 0) setGamma(Math.min(0.4, Math.max(0.02, g)));
    if (ii > 0) setI0(Math.min(200, Math.max(1, ii)));
    if (qs.get("lock") === "1") setLockdown(true);
    if (qs.get("vax") === "1") setVaxCampaign(true);
  }, []);

  const syncUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams();
    p.set("b", beta.toFixed(2));
    p.set("g", gamma.toFixed(2));
    p.set("i0", String(i0));
    if (lockdown) p.set("lock", "1");
    if (vaxCampaign) p.set("vax", "1");
    const next = `${window.location.pathname}?${p.toString()}`;
    window.history.replaceState(null, "", next);
  }, [beta, gamma, i0, lockdown, vaxCampaign]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const reset = useCallback(() => {
    const initI = i0;
    state.current = { s: N - initI, i: initI, r: 0 };
    history.current = [];
    tRef.current = 0;
    setHud({ ...state.current });
    setRunning(false);
  }, [i0]);

  useEffect(() => {
    reset();
  }, [i0, reset]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const step = (dt: number) => {
      const st = state.current;
      const { beta: b, gamma: g, lockdown: lk, vaxCampaign: vx } = params.current;
      const effB = lk ? b * 0.35 : b;
      const infection = (effB * st.s * st.i) / N;
      const recovery = g * st.i;
      const vaxRate = vx ? 0.08 * st.s : 0;
      st.s = Math.max(0, st.s - infection * dt - vaxRate * dt);
      st.i = Math.max(0, st.i + infection * dt - recovery * dt);
      st.r = Math.max(0, Math.min(N, st.r + recovery * dt + vaxRate * dt));
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
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0a1018");
      bg.addColorStop(1, "#05080e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = 24, cy = 20, cw = W - 48, ch = H - 70;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      roundRect(ctx, cx, cy, cw, ch, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(148,163,184,0.2)";
      ctx.stroke();

      const hist = history.current;
      const plot = (key: "s" | "i" | "r", stroke: string, fill: string) => {
        if (hist.length < 2) return;
        ctx.beginPath();
        hist.forEach((pt, idx) => {
          const x = cx + 10 + (idx / (HIST - 1)) * (cw - 20);
          const y = cy + ch - 10 - (pt[key] / N) * (ch - 20);
          if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
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
          if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      };
      plot("s", "#38bdf8", "rgba(56,189,248,0.25)");
      plot("i", "#fb7185", "rgba(251,113,133,0.25)");
      plot("r", "#34d399", "rgba(52,211,153,0.25)");

      const barY = H - 42;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
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
  }, [es]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H + 40;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#05080e";
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "bold 14px ui-sans-serif, system-ui";
    ctx.fillText(es ? "Simulador SIR · UtiliHub" : "SIR Simulator · UtiliHub", 16, H + 24);
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`β=${beta.toFixed(2)} γ=${gamma.toFixed(2)} R₀=${R0.toFixed(2)}`, 16, H + 38);
    const url = off.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = es ? "simulador-sir-utilihub.png" : "sir-simulator-utilihub.png";
    a.click();
  };

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
        <SimSecondaryButton theme="lab" onClick={downloadPng}>
          {es ? "PNG marca" : "Branded PNG"}
        </SimSecondaryButton>
      </div>

      <div className="overflow-hidden rounded-2xl border border-rose-400/35 bg-black/50">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "S", value: hud.s.toFixed(0), color: "text-sky-300" },
          { label: "I", value: hud.i.toFixed(0), color: "text-rose-300" },
          { label: "R", value: hud.r.toFixed(0), color: "text-emerald-300" },
          { label: "R₀", value: R0.toFixed(2), color: peakRisk ? "text-amber-300" : "text-emerald-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-rose-400/20 bg-black/40 px-2 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{s.label}</p>
            <p className={`mt-0.5 text-lg font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-sky-100/70">
          β ({es ? "transmisión" : "transmission"}): {beta.toFixed(2)}
          <input type="range" min={0.05} max={0.8} step={0.01} value={beta} onChange={(e) => setBeta(Number(e.target.value))} className="mt-1 w-full accent-rose-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          γ ({es ? "recuperación" : "recovery"}): {gamma.toFixed(2)}
          <input type="range" min={0.02} max={0.4} step={0.01} value={gamma} onChange={(e) => setGamma(Number(e.target.value))} className="mt-1 w-full accent-emerald-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Infectados iniciales" : "Initial infected"}: {i0}
          <input type="range" min={1} max={100} step={1} value={i0} onChange={(e) => setI0(Number(e.target.value))} className="mt-1 w-full accent-amber-400" />
        </label>
        <div className="flex flex-col gap-2 text-xs text-sky-100/70">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={lockdown} onChange={(e) => setLockdown(e.target.checked)} className="accent-rose-400" />
            {es ? "Cuarentena (↓β)" : "Lockdown (↓β)"}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={vaxCampaign} onChange={(e) => setVaxCampaign(e.target.checked)} className="accent-sky-400" />
            {es ? "Campaña vacunación" : "Vaccination campaign"}
          </label>
        </div>
      </div>

      <p className="text-center text-xs text-white/55">
        {peakRisk
          ? es ? "R₀ > 1 → brote posible. Activá cuarentena o vacunación para aplanar." : "R₀ > 1 → outbreak possible. Enable lockdown or vaccination to flatten."
          : es ? "R₀ ≤ 1 → la epidemia tiende a extinguirse." : "R₀ ≤ 1 → the epidemic tends to die out."}
      </p>
      <p className="text-center text-xs text-white/40">
        {es ? "Modelo SIR clásico. Intervenciones discretas modifican tasas en vivo." : "Classic SIR model. Discrete interventions modify rates live."}
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
