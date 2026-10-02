import { useEffect, useMemo, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton } from "./SimShell";

const W = 520;
const H = 320;

/** Linear demand Q = a - b P ; supply Q = c + d (P - tax) */
export function MarketSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [demandA, setDemandA] = useState(100);
  const [demandB, setDemandB] = useState(2);
  const [supplyC, setSupplyC] = useState(10);
  const [supplyD, setSupplyD] = useState(1.5);
  const [tax, setTax] = useState(0);

  const eq = useMemo(() => {
    const b = demandB;
    const d = supplyD;
    const a = demandA;
    const c = supplyC;
    const denom = b + d;
    const P = denom > 0 ? (a - c + d * tax) / denom : 0;
    const Q = a - b * P;
    const valid = P > 0 && Q > 0 && Number.isFinite(P);
    const Pmax = b > 0 ? a / b : 0;
    const Pmin = d > 0 ? c / d + tax : 0;
    const cs = valid && Pmax > P ? 0.5 * (Pmax - P) * Q : 0;
    const ps = valid && P > Pmin ? 0.5 * (P - Pmin) * Q : 0;
    const revenue = valid ? P * Q : 0;
    const taxRev = valid ? tax * Q : 0;
    return { P, Q, valid, cs, ps, revenue, taxRev, Pmax, Pmin };
  }, [demandA, demandB, supplyC, supplyD, tax]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0c1520");
    bg.addColorStop(1, "#060a10");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const padL = 48;
    const padR = 24;
    const padT = 24;
    const padB = 40;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const maxP = Math.max(eq.Pmax || 50, eq.P * 1.4, 20);
    const maxQ = Math.max(demandA, eq.Q * 1.3, 40);

    const xOf = (q: number) => padL + (q / maxQ) * plotW;
    const yOf = (p: number) => padT + plotH - (p / maxP) * plotH;

    ctx.strokeStyle = "rgba(148,163,184,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();
    ctx.fillStyle = "rgba(148,163,184,0.7)";
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillText(es ? "Cantidad Q" : "Quantity Q", padL + plotW / 2 - 30, H - 12);
    ctx.save();
    ctx.translate(14, padT + plotH / 2 + 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(es ? "Precio P" : "Price P", 0, 0);
    ctx.restore();

    ctx.strokeStyle = "rgba(56,189,248,0.95)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const q = (i / 40) * maxQ;
      const p = demandB > 0 ? (demandA - q) / demandB : 0;
      if (p < 0) continue;
      const x = xOf(q);
      const y = yOf(Math.min(p, maxP));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(251,191,36,0.95)";
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= 40; i++) {
      const q = (i / 40) * maxQ;
      const p = supplyD > 0 ? (q - supplyC) / supplyD + tax : 0;
      if (p < 0) continue;
      const x = xOf(q);
      const y = yOf(Math.min(p, maxP));
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (eq.valid) {
      const xe = xOf(eq.Q);
      const ye = yOf(eq.P);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath();
      ctx.moveTo(padL, ye);
      ctx.lineTo(xe, ye);
      ctx.lineTo(xe, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(56,189,248,0.12)";
      ctx.beginPath();
      ctx.moveTo(xOf(0), yOf(Math.min(eq.Pmax, maxP)));
      ctx.lineTo(xe, ye);
      ctx.lineTo(xOf(0), ye);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(251,191,36,0.12)";
      ctx.beginPath();
      ctx.moveTo(xOf(0), ye);
      ctx.lineTo(xe, ye);
      ctx.lineTo(xOf(0), yOf(Math.max(0, Math.min(eq.Pmin, maxP))));
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.arc(xe, ye, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.fillText(`P*=${eq.P.toFixed(1)}  Q*=${eq.Q.toFixed(1)}`, xe + 10, ye - 8);
    }

    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(56,189,248,0.95)";
    ctx.fillText(es ? "Demanda" : "Demand", padL + 8, padT + 14);
    ctx.fillStyle = "rgba(251,191,36,0.95)";
    ctx.fillText(es ? "Oferta" : "Supply", padL + 90, padT + 14);
  }, [demandA, demandB, supplyC, supplyD, tax, eq, es]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-sky-400/15 bg-black/30">
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
          <input
            type="range"
            min={40}
            max={160}
            value={demandA}
            onChange={(e) => setDemandA(Number(e.target.value))}
            className="mt-1 w-full accent-sky-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Pendiente demanda b" : "Demand slope b"}: {demandB.toFixed(1)}
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={demandB}
            onChange={(e) => setDemandB(Number(e.target.value))}
            className="mt-1 w-full accent-sky-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Oferta (intercepto c)" : "Supply intercept c"}: {supplyC}
          <input
            type="range"
            min={0}
            max={40}
            value={supplyC}
            onChange={(e) => setSupplyC(Number(e.target.value))}
            className="mt-1 w-full accent-amber-400"
          />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Pendiente oferta d" : "Supply slope d"}: {supplyD.toFixed(1)}
          <input
            type="range"
            min={0.3}
            max={4}
            step={0.1}
            value={supplyD}
            onChange={(e) => setSupplyD(Number(e.target.value))}
            className="mt-1 w-full accent-amber-400"
          />
        </label>
        <label className="text-xs text-sky-100/70 sm:col-span-2">
          {es ? "Impuesto unitario" : "Per-unit tax"}: {tax.toFixed(1)}
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="mt-1 w-full accent-rose-400"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase text-sky-200/70">
            {es ? "Excedente consumidor" : "Consumer surplus"}
          </p>
          <p className="text-sm font-bold text-sky-200">{eq.cs.toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase text-amber-200/70">
            {es ? "Excedente productor" : "Producer surplus"}
          </p>
          <p className="text-sm font-bold text-amber-200">{eq.ps.toFixed(1)}</p>
        </div>
      </div>

      <p className="text-center text-xs text-white/45">
        {es
          ? "Qd = a − bP · Qs = c + d(P − t) · Equilibrio donde oferta = demanda"
          : "Qd = a − bP · Qs = c + d(P − t) · Equilibrium where supply = demand"}
      </p>

      <div className="flex justify-center">
        <SimPrimaryButton
          theme="lab"
          onClick={() => {
            setDemandA(100);
            setDemandB(2);
            setSupplyC(10);
            setSupplyD(1.5);
            setTax(0);
          }}
        >
          {es ? "Restablecer" : "Reset"}
        </SimPrimaryButton>
      </div>
    </div>
  );
}
