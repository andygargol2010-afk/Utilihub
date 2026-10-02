import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 560;
const H = 320;
const HIST = 180;

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
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; kind: 0 | 1 | 2; life: number }[]>([]);
  runningRef.current = running;
  params.current = { grow, graze, hunt, death };

  const reset = useCallback(() => {
    state.current = { plants: 80, herb: 40, pred: 12 };
    history.current = [];
    particles.current = [];
    setHud({ ...state.current });
    setRunning(false);
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let spawnAcc = 0;

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

        spawnAcc += dtReal;
        if (spawnAcc > 0.12) {
          spawnAcc = 0;
          const s = state.current;
          const nP = Math.min(8, Math.floor(s.plants / 18));
          const nH = Math.min(6, Math.floor(s.herb / 12));
          const nR = Math.min(4, Math.floor(s.pred / 8));
          for (let i = 0; i < nP; i++) {
            particles.current.push({
              x: 20 + Math.random() * (W - 40),
              y: H - 30 - Math.random() * 50,
              vx: (Math.random() - 0.5) * 12,
              vy: -8 - Math.random() * 10,
              kind: 0,
              life: 1,
            });
          }
          for (let i = 0; i < nH; i++) {
            particles.current.push({
              x: 40 + Math.random() * (W - 80),
              y: H - 55 - Math.random() * 40,
              vx: (Math.random() - 0.5) * 40,
              vy: (Math.random() - 0.5) * 8,
              kind: 1,
              life: 1,
            });
          }
          for (let i = 0; i < nR; i++) {
            particles.current.push({
              x: 60 + Math.random() * (W - 120),
              y: H - 90 - Math.random() * 50,
              vx: (Math.random() - 0.5) * 55,
              vy: (Math.random() - 0.5) * 12,
              kind: 2,
              life: 1,
            });
          }
        }
      }

      for (const p of particles.current) {
        p.x += p.vx * dtReal;
        p.y += p.vy * dtReal;
        p.life -= dtReal * 0.35;
        if (p.kind === 0) p.vy += 18 * dtReal;
      }
      particles.current = particles.current.filter((p) => p.life > 0 && p.y < H + 10);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#06140c");
      bg.addColorStop(0.45, "#0a1f12");
      bg.addColorStop(1, "#030a06");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const canopy = ctx.createRadialGradient(W * 0.5, 0, 10, W * 0.5, 40, 280);
      canopy.addColorStop(0, "rgba(52,211,153,0.12)");
      canopy.addColorStop(1, "transparent");
      ctx.fillStyle = canopy;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 7; i++) {
        const tx = 30 + i * 80 + Math.sin(now / 4000 + i) * 4;
        ctx.fillStyle = "rgba(16,40,24,0.35)";
        ctx.fillRect(tx, 0, 6 + (i % 3), H);
      }

      const cx = 20;
      const cy = 28;
      const cw = W - 40;
      const ch = H - 100;
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.strokeStyle = "rgba(52,211,153,0.18)";
      ctx.lineWidth = 1;
      roundRect(ctx, cx, cy, cw, ch, 12);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = "rgba(52,211,153,0.06)";
      for (let g = 1; g < 4; g++) {
        const gy = cy + (ch * g) / 4;
        ctx.beginPath();
        ctx.moveTo(cx + 8, gy);
        ctx.lineTo(cx + cw - 8, gy);
        ctx.stroke();
      }

      const hist = history.current;
      const maxY = 140;
      const fillPlot = (key: "p" | "h" | "r", stroke: string, fillTop: string) => {
        if (hist.length < 2) return;
        ctx.beginPath();
        hist.forEach((pt, i) => {
          const x = cx + 8 + (i / (HIST - 1)) * (cw - 16);
          const y = cy + ch - 8 - (pt[key] / maxY) * (ch - 16);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        const lastX = cx + 8 + ((hist.length - 1) / (HIST - 1)) * (cw - 16);
        ctx.lineTo(lastX, cy + ch - 8);
        ctx.lineTo(cx + 8, cy + ch - 8);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, cy, 0, cy + ch);
        grad.addColorStop(0, fillTop);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        hist.forEach((pt, i) => {
          const x = cx + 8 + (i / (HIST - 1)) * (cw - 16);
          const y = cy + ch - 8 - (pt[key] / maxY) * (ch - 16);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2.4;
        ctx.lineJoin = "round";
        ctx.stroke();
      };
      fillPlot("p", "rgba(52,211,153,0.95)", "rgba(52,211,153,0.28)");
      fillPlot("h", "rgba(251,191,36,0.95)", "rgba(251,191,36,0.22)");
      fillPlot("r", "rgba(248,113,113,0.95)", "rgba(248,113,113,0.2)");

      for (const p of particles.current) {
        const a = Math.max(0, p.life);
        if (p.kind === 0) {
          ctx.fillStyle = `rgba(74,222,128,${0.55 * a})`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, 3.5, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.kind === 1) {
          ctx.fillStyle = `rgba(251,191,36,${0.7 * a})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(251,191,36,${0.25 * a})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(248,113,113,${0.75 * a})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - 5);
          ctx.lineTo(p.x + 5, p.y + 4);
          ctx.lineTo(p.x - 5, p.y + 4);
          ctx.closePath();
          ctx.fill();
        }
      }

      const ground = ctx.createLinearGradient(0, H - 52, 0, H);
      ground.addColorStop(0, "rgba(6,40,20,0)");
      ground.addColorStop(0.3, "rgba(8,50,24,0.7)");
      ground.addColorStop(1, "#04140a");
      ctx.fillStyle = ground;
      ctx.fillRect(0, H - 52, W, 52);

      const s = state.current;
      const meter = (x: number, val: number, max: number, c1: string, c2: string, label: string) => {
        const h = Math.max(4, (val / max) * 36);
        const g = ctx.createLinearGradient(x, H - 14 - h, x, H - 14);
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(x - 2, H - 52, 32, 38);
        ctx.fillStyle = g;
        ctx.fillRect(x, H - 14 - h, 28, h);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "10px ui-sans-serif, system-ui";
        ctx.fillText(label, x - 2, H - 4);
      };
      meter(36, s.plants, 140, "#4ade80", "#166534", es ? "Plantas" : "Plants");
      meter(120, s.herb, 100, "#fbbf24", "#92400e", es ? "Herbív." : "Herb.");
      meter(204, s.pred, 60, "#fb7185", "#9f1239", es ? "Depred." : "Pred.");

      const pill = (x: number, y: number, color: string, text: string) => {
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        roundRect(ctx, x, y, 88, 18, 9);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + 10, y + 9, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "10px ui-sans-serif, system-ui";
        ctx.fillText(text, x + 18, y + 13);
      };
      pill(W - 110, 36, "#34d399", es ? "Productores" : "Producers");
      pill(W - 110, 58, "#fbbf24", es ? "Herbívoros" : "Herbivores");
      pill(W - 110, 80, "#fb7185", es ? "Depredadores" : "Predators");

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

      <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/40 shadow-[0_0_40px_-12px_rgba(52,211,153,0.35)]">
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
          <input type="range" min={0.1} max={0.7} step={0.01} value={grow} onChange={(e) => setGrow(Number(e.target.value))} className="mt-1 w-full accent-emerald-400" />
        </label>
        <label className="text-xs text-emerald-100/70">
          {es ? "Pastoreo" : "Grazing"}: {graze.toFixed(3)}
          <input type="range" min={0.005} max={0.05} step={0.001} value={graze} onChange={(e) => setGraze(Number(e.target.value))} className="mt-1 w-full accent-amber-400" />
        </label>
        <label className="text-xs text-emerald-100/70">
          {es ? "Caza" : "Hunting"}: {hunt.toFixed(3)}
          <input type="range" min={0.005} max={0.06} step={0.001} value={hunt} onChange={(e) => setHunt(Number(e.target.value))} className="mt-1 w-full accent-rose-400" />
        </label>
        <label className="text-xs text-emerald-100/70">
          {es ? "Mortalidad depredadores" : "Predator death"}: {death.toFixed(2)}
          <input type="range" min={0.05} max={0.4} step={0.01} value={death} onChange={(e) => setDeath(Number(e.target.value))} className="mt-1 w-full accent-rose-300" />
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

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
