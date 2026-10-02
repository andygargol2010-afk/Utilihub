import { useEffect, useMemo, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton } from "./SimShell";

const W = 560;
const H = 340;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function MarketSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [demandA, setDemandA] = useState(100);
  const [demandB, setDemandB] = useState(2);
  const [supplyC, setSupplyC] = useState(10);
  const [supplyD, setSupplyD] = useState(1.5);
  const [tax, setTax] = useState(0);

  const eq = useMemo(() => {
    const denom = demandB + supplyD;
    const P = denom > 0 ? (demandA - supplyC + supplyD * tax) / denom : 0;
    const Q = demandA - demandB * P;
    const valid = P > 0 && Q > 0 && Number.isFinite(P);
    const Pmax = demandB > 0 ? demandA / demandB : 0;
    const Pmin = supplyD > 0 ? supplyC / supplyD + tax : 0;
    const cs = valid && Pmax > P ? 0.5 * (Pmax - P) * Q : 0;
    const ps = valid && P > Pmin ? 0.5 * (P - Pmin) * Q : 0;
    return { P, Q, valid, cs, ps, revenue: valid ? P * Q : 0, taxRev: valid ? tax * Q : 0, Pmax, Pmin };
  }, [demandA, demandB, supplyC, supplyD, tax]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0a1220");
    bg.addColorStop(0.5, "#0c1528");
    bg.addColorStop(1, "#060a12");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(16,24,40,0.9)";
    ctx.fillRect(0, 0, W, 28);
    ctx.fillStyle = "rgba(56,189,248,0.9)";
    ctx.font = "bold 11px ui-monospace, monospace";
    ctx.fillText(es ? "MERCADO · OFERTA / DEMANDA" : "MARKET · SUPPLY / DEMAND", 14, 18);
    if (eq.valid) {
      ctx.fillStyle = "rgba(251,191,36,0.9)";
      ctx.fillText(`P* ${eq.P.toFixed(2)}`, W - 160, 18);
      ctx.fillStyle = "rgba(52,211,153,0.9)";
      ctx.fillText(`Q* ${eq.Q.toFixed(1)}`, W - 80, 18);
    }

    const padL = 52, padR = 28, padT = 44, padB = 44;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    roundRect(ctx, padL - 8, padT - 8, plotW + 16, plotH + 16, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.stroke();

    const maxP = Math.max(eq.Pmax || 50, eq.P * 1.4, 20);
    const maxQ = Math.max(demandA, eq.Q * 1.3, 40);
    const xOf = (q: number) => padL + (q / maxQ) * plotW;
    const yOf = (p: number) => padT + plotH - (p / maxP) * plotH;

    ctx.strokeStyle = "rgba(100,140,200,0.07)";
    for (let i = 1; i < 6; i++) {
      const y = padT + (plotH * i) / 6;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
      const x = padL + (plotW * i) / 6;
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
    }

    ctx.strokeStyle = "rgba(148,163,184,0.5)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();
    ctx.fillStyle = "rgba(148,163,184,0.65)";
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillText(es ? "Cantidad Q →" : "Quantity Q →", padL + plotW / 2 - 36, H - 14);

    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const q = (i / 50) * maxQ;
      const p = demandB > 0 ? (demandA - q) / demandB : 0;
      if (p < 0) continue;
      const x = xOf(q), y = yOf(Math.min(p, maxP));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineTo(xOf(0), yOf(0));
    ctx.closePath();
    const dFill = ctx.createLinearGradient(0, padT, 0, padT + plotH);
    dFill.addColorStop(0, "rgba(56,189,248,0.18)");
    dFill.addColorStop(1, "rgba(56,189,248,0.02)");
    ctx.fillStyle = dFill;
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i <= 50; i++) {
      const q = (i / 50) * maxQ;
      const p = demandB > 0 ? (demandA - q) / demandB : 0;
      if (p < 0) continue;
      const x = xOf(q), y = yOf(Math.min(p, maxP));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(56,189,248,0.5)";
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= 50; i++) {
      const q = (i / 50) * maxQ;
      const p = supplyD > 0 ? (q - supplyC) / supplyD + tax : 0;
      if (p < 0) continue;
      const x = xOf(q), y = yOf(Math.min(p, maxP));
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 3;
    ctx.shadowColor = "rgba(251,191,36,0.45)";
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (eq.valid) {
      const xe = xOf(eq.Q), ye = yOf(eq.P);
      ctx.fillStyle = "rgba(56,189,248,0.2)";
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(Math.min(eq.Pmax, maxP)));
      ctx.lineTo(xe, ye);
      ctx.lineTo(xOf(0), ye);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(251,191,36,0.18)";
      ctx.beginPath();
      ctx.moveTo(xOf(0), ye);
      ctx.lineTo(xe, ye);
      ctx.lineTo(xOf(0), yOf(Math.max(0, Math.min(eq.Pmin, maxP))));
      ctx.closePath();
      ctx.fill();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(244,114,182,0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(padL, ye);
      ctx.lineTo(xe, ye);
      ctx.lineTo(xe, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(244,114,182,0.25)";
      ctx.beginPath();
      ctx.arc(xe, ye, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.arc(xe, ye, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(xe, ye, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      roundRect(ctx, xe + 12, ye - 28, 108, 24, 6);
      ctx.fill();
      ctx.fillStyle = "#f9a8d4";
      ctx.font = "bold 11px ui-monospace, monospace";
      ctx.fillText(`P* ${eq.P.toFixed(1)}  Q* ${eq.Q.toFixed(0)}`, xe + 18, ye - 12);
    }

    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(es ? "━━ Demanda" : "━━ Demand", padL + 6, padT + 16);
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(es ? "━━ Oferta" : "━━ Supply", padL + 100, padT + 16);
  }, [demandA, demandB, supplyC, supplyD, tax, eq, es]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-sky-400/20 bg-black/40 shadow-[0_0_40px_-12px_rgba(56,189,248,0.3)]">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: es ? "Precio *" : "Price *", value: eq.valid ? eq.P.toFixed(2) : "—" },
          { label: es ? "Cantidad *" : "Qty *", value: eq.valid ? eq.Q.toFixed(1) : "—" },
          { label: es ? "Ingresos" : "Revenue", value: eq.valid ? eq.revenue.toFixed(0) : "—" },
          { label: es ? "Impuesto" : "Tax rev.", value: tax > 0 ? eq.taxRev.toFixed(0) : "0" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{s.label}</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-sky-100/70">
          {es ? "Demanda (intercepto a)" : "Demand intercept a"}: {demandA}
          <input type="range" min={40} max={160} value={demandA} onChange={(e) => setDemandA(Number(e.target.value))} className="mt-1 w-full accent-sky-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Pendiente demanda b" : "Demand slope b"}: {demandB.toFixed(1)}
          <input type="range" min={0.5} max={5} step={0.1} value={demandB} onChange={(e) => setDemandB(Number(e.target.value))} className="mt-1 w-full accent-sky-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Oferta (intercepto c)" : "Supply intercept c"}: {supplyC}
          <input type="range" min={0} max={40} value={supplyC} onChange={(e) => setSupplyC(Number(e.target.value))} className="mt-1 w-full accent-amber-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Pendiente oferta d" : "Supply slope d"}: {supplyD.toFixed(1)}
          <input type="range" min={0.3} max={4} step={0.1} value={supplyD} onChange={(e) => setSupplyD(Number(e.target.value))} className="mt-1 w-full accent-amber-400" />
        </label>
        <label className="text-xs text-sky-100/70 sm:col-span-2">
          {es ? "Impuesto unitario" : "Per-unit tax"}: {tax.toFixed(1)}
          <input type="range" min={0} max={20} step={0.5} value={tax} onChange={(e) => setTax(Number(e.target.value))} className="mt-1 w-full accent-rose-400" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase text-sky-200/70">{es ? "Excedente consumidor" : "Consumer surplus"}</p>
          <p className="text-sm font-bold text-sky-200">{eq.cs.toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase text-amber-200/70">{es ? "Excedente productor" : "Producer surplus"}</p>
          <p className="text-sm font-bold text-amber-200">{eq.ps.toFixed(1)}</p>
        </div>
      </div>
      <p className="text-center text-xs text-white/45">
        {es ? "Qd = a − bP · Qs = c + d(P − t) · Equilibrio donde oferta = demanda" : "Qd = a − bP · Qs = c + d(P − t) · Equilibrium where supply = demand"}
      </p>
      <div className="flex justify-center">
        <SimPrimaryButton theme="lab" onClick={() => { setDemandA(100); setDemandB(2); setSupplyC(10); setSupplyD(1.5); setTax(0); }}>
          {es ? "Restablecer" : "Reset"}
        </SimPrimaryButton>
      </div>
    </div>
  );
}
