import { useEffect, useMemo, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

type Topology = "series" | "parallel";
const W = 540;
const H = 320;

function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
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

export function DcCircuitSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [topology, setTopology] = useState<Topology>("series");
  const [V, setV] = useState(12);
  const [R1, setR1] = useState(100);
  const [R2, setR2] = useState(220);
  const [led, setLed] = useState(false);
  const anim = useRef(0);

  const math = useMemo(() => {
    const ledDrop = led ? 2 : 0;
    const Veff = Math.max(0, V - ledDrop);
    const Req = topology === "series" ? R1 + R2 : R1 > 0 && R2 > 0 ? (R1 * R2) / (R1 + R2) : Infinity;
    const I = Req > 0 && Number.isFinite(Req) ? Veff / Req : 0;
    let I1 = I, I2 = I, V1 = 0, V2 = 0;
    if (topology === "series") { V1 = I * R1; V2 = I * R2; }
    else { V1 = Veff; V2 = Veff; I1 = R1 > 0 ? Veff / R1 : 0; I2 = R2 > 0 ? Veff / R2 : 0; }
    return { Req, I, I1, I2, V1, V2, P: Veff * (topology === "series" ? I : I1 + I2), Veff, ledDrop };
  }, [V, R1, R2, topology, led]);

  useEffect(() => {
    let raf = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null;
    const onResize = () => { if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null; };
    window.addEventListener("resize", onResize);

    const draw = () => {
      anim.current += 0.05 + Math.min(0.15, math.I * 10);
      if (!ctx) { if (canvasRef.current) ctx = setupCanvas(canvasRef.current) ?? null; raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0a1f14"); bg.addColorStop(1, "#061208");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(52,211,153,0.06)";
      for (let x = 12; x < W; x += 16) for (let y = 12; y < H; y += 16) { ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill(); }

      const left = 56, right = W - 56, top = 64, bot = H - 56, midY = (top + bot) / 2, midX = (left + right) / 2;

      const copper = (x1: number, y1: number, x2: number, y2: number) => {
        ctx!.save();
        ctx!.shadowColor = "rgba(52,211,153,0.4)"; ctx!.shadowBlur = 8;
        ctx!.strokeStyle = "rgba(16,185,129,0.9)"; ctx!.lineWidth = 3.5; ctx!.lineCap = "round";
        ctx!.beginPath(); ctx!.moveTo(x1, y1); ctx!.lineTo(x2, y2); ctx!.stroke();
        ctx!.shadowBlur = 0; ctx!.strokeStyle = "rgba(167,243,208,0.4)"; ctx!.lineWidth = 1.2; ctx!.stroke();
        ctx!.restore();
      };
      copper(left, top, left, bot); copper(left, top, midX - 36, top); copper(left, bot, midX - 36, bot);

      const by = midY;
      ctx.fillStyle = "rgba(15,23,42,0.95)"; ctx.strokeStyle = "rgba(52,211,153,0.55)"; ctx.lineWidth = 2;
      roundRect(ctx, left - 22, by - 36, 44, 72, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#34d399"; ctx.fillRect(left - 14, by - 22, 28, 5); ctx.fillRect(left - 18, by - 8, 36, 8);
      ctx.fillStyle = "#6ee7b7"; ctx.fillRect(left - 14, by + 8, 28, 5); ctx.fillRect(left - 18, by + 20, 36, 8);
      ctx.fillStyle = "#a7f3d0"; ctx.font = "bold 11px ui-sans-serif, system-ui"; ctx.fillText(`${V}V`, left - 12, by - 42);

      if (led) {
        const lx = left + 72; const pulse = 0.5 + 0.5 * Math.sin(anim.current * 3);
        ctx.save(); ctx.shadowColor = `rgba(251,191,36,${0.45 + pulse * 0.5})`; ctx.shadowBlur = 18 + pulse * 12;
        ctx.fillStyle = `rgba(251,191,36,${0.55 + pulse * 0.4})`;
        ctx.beginPath(); ctx.moveTo(lx - 12, top - 10); ctx.lineTo(lx + 14, top); ctx.lineTo(lx - 12, top + 10); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx + 16, top - 12); ctx.lineTo(lx + 16, top + 12); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#fde68a"; ctx.font = "10px ui-sans-serif, system-ui"; ctx.fillText("LED", lx - 10, top - 16);
      }

      const drawR = (x: number, y: number, label: string, ohms: number) => {
        ctx!.save();
        ctx!.fillStyle = "rgba(30,41,59,0.95)"; ctx!.strokeStyle = "rgba(56,189,248,0.55)"; ctx!.lineWidth = 2;
        roundRect(ctx!, x - 34, y - 12, 68, 24, 4); ctx!.fill(); ctx!.stroke();
        ["#f59e0b", "#22c55e", "#3b82f6", "#a855f7"].forEach((c, i) => { ctx!.fillStyle = c; ctx!.fillRect(x - 22 + i * 12, y - 10, 5, 20); });
        ctx!.fillStyle = "rgba(125,211,252,0.95)"; ctx!.font = "bold 11px ui-sans-serif, system-ui";
        ctx!.fillText(`${label} ${ohms}Ω`, x - 28, y - 18);
        ctx!.restore();
      };

      if (topology === "series") {
        copper(midX - 36, top, right, top); copper(right, top, right, bot); copper(midX - 36, bot, right, bot);
        drawR(midX + 50, top, "R1", R1); drawR(midX + 50, bot, "R2", R2);
      } else {
        copper(midX - 36, top, midX - 36, bot); copper(midX - 36, top, right, top); copper(midX - 36, bot, right, bot); copper(right, top, right, bot);
        drawR(midX + 55, top, "R1", R1); drawR(midX + 55, bot, "R2", R2);
      }

      const flow = Math.min(1.4, math.I * 18);
      if (flow > 0.02) {
        for (let i = 0; i < 14; i++) {
          const p = (anim.current * 0.12 * flow + i / 14) % 1;
          let x = left, y = top;
          if (topology === "series") {
            const perim = (right - left) * 2 + (bot - top) * 2; const d = p * perim;
            if (d < right - left) { x = left + d; y = top; }
            else if (d < right - left + (bot - top)) { x = right; y = top + (d - (right - left)); }
            else if (d < (right - left) * 2 + (bot - top)) { x = right - (d - (right - left) - (bot - top)); y = bot; }
            else { x = left; y = bot - (d - (right - left) * 2 - (bot - top)); }
          } else {
            y = i % 2 === 0 ? top : bot;
            x = left + ((p * (right - left) * 2) % (right - left));
            if (p > 0.5) x = right - ((p - 0.5) * 2 * (right - left));
          }
          ctx.save(); ctx.shadowColor = "rgba(52,211,153,0.95)"; ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(110,231,183,${0.5 + 0.4 * Math.sin(i + anim.current)})`;
          ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      }

      ctx.fillStyle = "rgba(15,23,42,0.8)"; ctx.strokeStyle = "rgba(52,211,153,0.3)";
      roundRect(ctx, W - 140, 12, 128, 40, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#6ee7b7"; ctx.font = "bold 12px ui-monospace, monospace";
      const iLabel = topology === "series" ? `${(math.I * 1000).toFixed(1)} mA` : `Σ ${((math.I1 + math.I2) * 1000).toFixed(1)} mA`;
      ctx.fillText(iLabel, W - 128, 30);
      ctx.fillStyle = "rgba(148,163,184,0.8)"; ctx.font = "10px ui-sans-serif, system-ui";
      ctx.fillText(topology === "series" ? (es ? "Serie" : "Series") : (es ? "Paralelo" : "Parallel"), W - 128, 44);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [V, R1, R2, topology, led, math, es]);

  const fmt = (n: number, d = 2) => (!Number.isFinite(n) ? "—" : Math.abs(n) >= 100 ? n.toFixed(1) : n.toFixed(d));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <SimSecondaryButton theme="lab" active={topology === "series"} onClick={() => setTopology("series")}>{es ? "Serie" : "Series"}</SimSecondaryButton>
        <SimSecondaryButton theme="lab" active={topology === "parallel"} onClick={() => setTopology("parallel")}>{es ? "Paralelo" : "Parallel"}</SimSecondaryButton>
        <SimSecondaryButton theme="lab" active={led} onClick={() => setLed((v) => !v)}>LED {led ? "ON" : "OFF"}</SimSecondaryButton>
      </div>
      <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-black/40 shadow-[0_0_40px_-12px_rgba(16,185,129,0.3)]">
        <canvas ref={canvasRef} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-emerald-100/70">{es ? "Batería (V)" : "Battery (V)"}: {V}
          <input type="range" min={1} max={24} step={0.5} value={V} onChange={(e) => setV(Number(e.target.value))} className="mt-1 w-full accent-emerald-400" />
        </label>
        <label className="text-xs text-emerald-100/70">R1 (Ω): {R1}
          <input type="range" min={10} max={1000} step={10} value={R1} onChange={(e) => setR1(Number(e.target.value))} className="mt-1 w-full accent-sky-400" />
        </label>
        <label className="text-xs text-emerald-100/70">R2 (Ω): {R2}
          <input type="range" min={10} max={1000} step={10} value={R2} onChange={(e) => setR2(Number(e.target.value))} className="mt-1 w-full accent-sky-400" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Req", value: `${fmt(math.Req, 1)} Ω` },
          { label: es ? "Corriente" : "Current", value: topology === "series" ? `${fmt(math.I * 1000, 1)} mA` : `I1 ${fmt(math.I1 * 1000, 1)} · I2 ${fmt(math.I2 * 1000, 1)}` },
          { label: es ? "Caídas" : "Drops", value: `V1 ${fmt(math.V1)} · V2 ${fmt(math.V2)}` },
          { label: es ? "Potencia" : "Power", value: `${fmt(math.P * 1000, 1)} mW` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-emerald-400/15 bg-black/35 px-2 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/55">{s.label}</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <SimPrimaryButton theme="lab" onClick={() => { setTopology("series"); setV(12); setR1(100); setR2(220); setLed(false); }}>
          {es ? "Restablecer" : "Reset"}
        </SimPrimaryButton>
      </div>
    </div>
  );
}
