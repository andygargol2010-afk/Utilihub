import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 520;
const H = 280;
const HIST = 160;

type State = { plants: number; herb: number; pred: number };

export function EcosystemSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [grow, setGrow] = useState(0.35);
  const [graze, setGraze] = useState(0.02);
  const [hunt, setHunt] = useState(0.03);
  const [death, setDeath] = useState(0.18);
  const [hud, setHud] = useState<State>({ plants: 80, herb: 40, pred: 12 });

  const state = useRef<State>({ plants: 80, herb: 40, pred: 12 });
  const history = useRef<{ p: number; h: number; r: number }[]>([]);
  const runningRef = useRef(false);
  const params = useRef({ grow, graze, hunt, death });
  runningRef.current = running;
  params.current = { grow, graze, hunt, death };

  const reset = useCallback(() => {
    state.current = { plants: 80, herb: 40, pred: 12 };
    history.current = [];
    setHud({ ...state.current });
    setRunning(false);
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const step = (dt: number) => {
      const s = state.current;
      const { grow: g, graze: gz, hunt: hn, death: d } = params.current;
      const dp = g * s.plants * (1 - s.plants / 120) - gz * s.plants * s.herb;
      const dh = gz * 0.55 * s.plants * s.herb - hn * s.herb * s.pred - 0.08 * s.herb;
      const dr = hn * 0.4 * s.herb * s.pred - d * s.pred;

      s.plants = Math.max(0.5, Math.min(140, s.plants + dp * dt));
      s.herb = Math.max(0.2, Math.min(100, s.herb + dh * dt));
      s.pred = Math.max(0.1, Math.min(60, s.pred + dr * dt));
    };

    const draw = (now: number) => {
      const dtReal = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) {
        acc += dtReal;
        while (acc > 0.04) {
          step(0.04);
          acc -= 0.04;
        }
        history.current.push({
          p: state.current.plants,
          h: state.current.herb,
          r: state.current.pred,
        });
        if (history.current.length > HIST) history.current.shift();
        setHud({ ...state.current });
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0a1f14");
      bg.addColorStop(1, "#051008");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = 16;
      const cy = 20;
      const cw = W - 32;
      const ch = H - 70;
      ctx.strokeStyle = "rgba(148,163,184,0.2)";
      ctx.strokeRect(cx, cy, cw, ch);

      const hist = history.current;
      const maxY = 140;
      const plot = (key: "p" | "h" | "r", color: string) => {
        if (hist.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        hist.forEach((pt, i) => {
          const x = cx + (i / (HIST - 1)) * cw;
          const y = cy + ch - (pt[key] / maxY) * ch;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      };
      plot("p", "rgba(52,211,153,0.9)");
      plot("h", "rgba(251,191,36,0.9)");
      plot("r", "rgba(248,113,113,0.9)");

      const s = state.current;
      const bar = (x: number, val: number, max: number, color: string, label: string) => {
        const h = (val / max) * 40;
        ctx.fillStyle = color;
        ctx.fillRect(x, H - 18 - h, 28, h);
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "10px ui-sans-serif, system-ui";
        ctx.fillText(label, x - 2, H - 6);
      };
      bar(40, s.plants, 140, "rgba(52,211,153,0.85)", es ? "Plantas" : "Plants");
      bar(120, s.herb, 100, "rgba(251,191,36,0.85)", es ? "Herbív." : "Herb.");
      bar(200, s.pred, 60, "rgba(248,113,113,0.85)", es ? "Depred." : "Pred.");

      ctx.font = "11px ui-sans-serif, system-ui";
      ctx.fillStyle = "rgba(52,211,153,0.9)";
      ctx.fillText(es ? "Productores" : "Producers", W - 120, 36);
      ctx.fillStyle = "rgba(251,191,36,0.9)";
      ctx.fillText(es ? "Herbívoros" : "Herbivores", W - 120, 52);
      ctx.fillStyle = "rgba(248,113,113,0.9)";
      ctx.fillText(es ? "Depredadores" : "Predators", W - 120, 68);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [es]);

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

      <div className="overflow-hidden rounded-2xl border border-emerald-400/15 bg-black/30">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: es ? "Plantas" : "Plants", value: hud.plants.toFixed(0), color: "text-emerald-300" },
          { label: es ? "Herbívoros" : "Herbivores", value: hud.herb.toFixed(0), color: "text-amber-300" },
          { label: es ? "Depredadores" : "Predators", value: hud.pred.toFixed(0), color: "text-rose-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{s.label}</p>
            <p className={`mt-0.5 text-lg font-bold tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-emerald-100/70">
          {es ? "Crecimiento plantas" : "Plant growth"}: {grow.toFixed(2)}
          <input
            type="range"
            min={0.1}
            max={0.7}
            step={0.01}
            value={grow}
            onChange={(e) => setGrow(Number(e.target.value))}
            className="mt-1 w-full accent-emerald-400"
          />
        </label>
        <label className="text-xs text-emerald-100/70">
          {es ? "Pastoreo" : "Grazing"}: {graze.toFixed(3)}
          <input
            type="range"
            min={0.005}
            max={0.05}
            step={0.001}
            value={graze}
            onChange={(e) => setGraze(Number(e.target.value))}
            className="mt-1 w-full accent-amber-400"
          />
        </label>
        <label className="text-xs text-emerald-100/70">
          {es ? "Caza" : "Hunting"}: {hunt.toFixed(3)}
          <input
            type="range"
            min={0.005}
            max={0.06}
            step={0.001}
            value={hunt}
            onChange={(e) => setHunt(Number(e.target.value))}
            className="mt-1 w-full accent-rose-400"
          />
        </label>
        <label className="text-xs text-emerald-100/70">
          {es ? "Mortalidad depredadores" : "Predator death"}: {death.toFixed(2)}
          <input
            type="range"
            min={0.05}
            max={0.4}
            step={0.01}
            value={death}
            onChange={(e) => setDeath(Number(e.target.value))}
            className="mt-1 w-full accent-rose-300"
          />
        </label>
      </div>

      <p className="text-center text-xs text-white/45">
        {es
          ? "Cadena trófica de 3 niveles. Subí la caza o el pastoreo y mirá si el sistema se equilibra o colapsa."
          : "3-level food chain. Raise hunting or grazing and watch balance — or collapse."}
      </p>
    </div>
  );
}
