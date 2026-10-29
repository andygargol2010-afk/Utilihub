import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 640;
const H = 560;
const BIF_R_MIN = 0;
const BIF_R_MAX = 4;
const BIF_STEPS = 400;
const BIF_TRANSIENT = 80;
const BIF_PLOT = 20;

const BIFURCATION_POINTS = [
  { r: 3.0, label: "P2" },
  { r: 3.449, label: "P4" },
  { r: 3.544, label: "P8" },
  { r: 3.57, label: "Feigenbaum" },
];

function classifyAttractor(pts: number[]): { type: string; typeEs: string; period: number } {
  if (pts.length < 10) return { type: "computing…", typeEs: "calculando…", period: 0 };
  const last = pts.slice(-40);
  const rounded = last.map((v) => Math.round(v * 1000) / 1000);
  const unique = [...new Set(rounded)].sort((a, b) => a - b);
  const n = unique.length;
  if (n <= 1) return { type: "Fixed point", typeEs: "Punto fijo", period: 1 };
  if (n === 2) return { type: "Period-2 cycle", typeEs: "Ciclo periodo-2", period: 2 };
  if (n === 4) return { type: "Period-4 cycle", typeEs: "Ciclo periodo-4", period: 4 };
  if (n === 8) return { type: "Period-8 cycle", typeEs: "Ciclo periodo-8", period: 8 };
  if (n <= 16) return { type: `Period-${n} cycle`, typeEs: `Ciclo periodo-${n}`, period: n };
  return { type: "Chaos / dense attractor", typeEs: "Caos / atractor denso", period: n };
}

export function LogisticChaosLab({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [r, setR] = useState(3.2);
  const [x0, setX0] = useState(0.5);
  const [iters, setIters] = useState(100);
  const [showCobweb, setShowCobweb] = useState(true);
  const [showBif, setShowBif] = useState(true);
  const [running, setRunning] = useState(false);

  const series = useRef<number[]>([]);
  const bifPoints = useRef<{ r: number; xs: number[] }[]>([]);
  const params = useRef({ r, x0, iters });
  params.current = { r, x0, iters };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const rr = Number(qs.get("r"));
    const xx = Number(qs.get("x0"));
    const ii = Number(qs.get("n"));
    if (rr > 0) setR(Math.min(4, Math.max(0, rr)));
    if (xx > 0 && xx < 1) setX0(xx);
    if (ii > 0) setIters(Math.min(300, Math.max(20, ii)));
  }, []);

  const syncUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams();
    p.set("r", r.toFixed(3));
    p.set("x0", x0.toFixed(3));
    p.set("n", String(iters));
    const next = `${window.location.pathname}?${p.toString()}`;
    window.history.replaceState(null, "", next);
  }, [r, x0, iters]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const computeSeries = useCallback(() => {
    const { r: rr, x0: xx, iters: nn } = params.current;
    const pts: number[] = [xx];
    let x = xx;
    for (let i = 0; i < nn; i++) {
      x = rr * x * (1 - x);
      pts.push(x);
    }
    series.current = pts;
    return pts;
  }, []);

  const computeBif = useCallback(() => {
    const pts: { r: number; xs: number[] }[] = [];
    for (let i = 0; i <= BIF_STEPS; i++) {
      const rr = BIF_R_MIN + (i / BIF_STEPS) * (BIF_R_MAX - BIF_R_MIN);
      let x = 0.5;
      for (let t = 0; t < BIF_TRANSIENT; t++) x = rr * x * (1 - x);
      const xs: number[] = [];
      for (let p = 0; p < BIF_PLOT; p++) {
        x = rr * x * (1 - x);
        xs.push(x);
      }
      pts.push({ r: rr, xs });
    }
    bifPoints.current = pts;
  }, []);

  useEffect(() => {
    computeSeries();
  }, [r, x0, iters, computeSeries]);

  useEffect(() => {
    computeBif();
  }, [computeBif]);

  const attractor = useMemo(() => classifyAttractor(series.current), [r, x0, iters]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const pts = series.current;
      ctx.fillStyle = "#05080e";
      ctx.fillRect(0, 0, W, H);

      // Time series panel
      const tsX = 16, tsY = 16, tsW = W - 32, tsH = 140;
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      roundRect(ctx, tsX, tsY, tsW, tsH, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(148,163,184,0.25)";
      ctx.stroke();

      if (pts.length > 1) {
        ctx.beginPath();
        pts.forEach((v, i) => {
          const x = tsX + 10 + (i / (pts.length - 1)) * (tsW - 20);
          const y = tsY + tsH - 10 - v * (tsH - 20);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.fillText(es ? "Serie temporal" : "Time series", tsX + 8, tsY + 16);

      // Cobweb panel
      if (showCobweb) {
        const cwX = 16, cwY = 168, cwW = W - 32, cwH = 160;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        roundRect(ctx, cwX, cwY, cwW, cwH, 10);
        ctx.fill();
        ctx.strokeStyle = "rgba(148,163,184,0.25)";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cwX + 10, cwY + cwH - 10);
        ctx.lineTo(cwX + cwW - 10, cwY + 10);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const xx = i / 100;
          const yy = r * xx * (1 - xx);
          const px = cwX + 10 + xx * (cwW - 20);
          const py = cwY + cwH - 10 - yy * (cwH - 20);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#fb7185";
        ctx.lineWidth = 2;
        ctx.stroke();

        if (pts.length > 1) {
          ctx.beginPath();
          let px = pts[0];
          ctx.moveTo(cwX + 10 + px * (cwW - 20), cwY + cwH - 10);
          for (let i = 0; i < Math.min(pts.length - 1, 30); i++) {
            const next = pts[i + 1];
            const xCur = cwX + 10 + px * (cwW - 20);
            const yNext = cwY + cwH - 10 - next * (cwH - 20);
            ctx.lineTo(xCur, yNext);
            ctx.lineTo(cwX + 10 + next * (cwW - 20), yNext);
            px = next;
          }
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "12px ui-sans-serif, system-ui";
        ctx.fillText(es ? "Diagrama cobweb" : "Cobweb plot", cwX + 8, cwY + 16);
      }

      // Bifurcation diagram
      if (showBif && bifPoints.current.length) {
        const bfX = 16, bfY = 340, bfW = W - 32, bfH = 190;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        roundRect(ctx, bfX, bfY, bfW, bfH, 10);
        ctx.fill();
        ctx.strokeStyle = "rgba(148,163,184,0.25)";
        ctx.stroke();

        const bif = bifPoints.current;
        for (const p of bif) {
          const px = bfX + 10 + ((p.r - BIF_R_MIN) / (BIF_R_MAX - BIF_R_MIN)) * (bfW - 20);
          for (const v of p.xs) {
            const py = bfY + bfH - 10 - v * (bfH - 20);
            ctx.fillStyle = "rgba(251,191,36,0.55)";
            ctx.fillRect(px, py, 1.2, 1.2);
          }
        }

        // Current r marker
        const curX = bfX + 10 + ((r - BIF_R_MIN) / (BIF_R_MAX - BIF_R_MIN)) * (bfW - 20);
        ctx.beginPath();
        ctx.moveTo(curX, bfY + 8);
        ctx.lineTo(curX, bfY + bfH - 8);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Period-doubling markers
        ctx.font = "9px ui-sans-serif, system-ui";
        for (const bp of BIFURCATION_POINTS) {
          const mx = bfX + 10 + ((bp.r - BIF_R_MIN) / (BIF_R_MAX - BIF_R_MIN)) * (bfW - 20);
          ctx.beginPath();
          ctx.moveTo(mx, bfY + 12);
          ctx.lineTo(mx, bfY + bfH - 8);
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = "rgba(255,255,255,0.65)";
          ctx.fillText(bp.label, mx + 2, bfY + 22);
        }

        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "12px ui-sans-serif, system-ui";
        ctx.fillText(es ? "Diagrama de bifurcación" : "Bifurcation diagram", bfX + 8, bfY + 16);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [es, r, showCobweb, showBif]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H + 36;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#05080e";
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "bold 14px ui-sans-serif, system-ui";
    ctx.fillText(es ? "Lab Caos Logístico · UtiliHub" : "Logistic Chaos Lab · UtiliHub", 16, H + 22);
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`r=${r.toFixed(3)} x0=${x0.toFixed(3)} n=${iters} · ${attractor.type}`, 16, H + 36);
    const url = off.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = es ? "laboratorio-caos-logistico.png" : "logistic-chaos-lab.png";
    a.click();
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <SimPrimaryButton theme="lab" onClick={() => setRunning((v) => !v)}>
          {running ? (es ? "Pausa" : "Pause") : es ? "Iterar" : "Iterate"}
        </SimPrimaryButton>
        <SimSecondaryButton theme="lab" onClick={downloadPng}>
          {es ? "PNG marca" : "Branded PNG"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={() => setShowCobweb((v) => !v)} active={showCobweb}>
          {es ? "Cobweb" : "Cobweb"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={() => setShowBif((v) => !v)} active={showBif}>
          {es ? "Bifurcación" : "Bifurcation"}
        </SimSecondaryButton>
      </div>

      <div className="overflow-hidden rounded-2xl border border-teal-400/35 bg-black/50">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-sm text-sky-100/90">
        {es ? "Atractor" : "Attractor"}: <span className="font-semibold text-amber-300">{es ? attractor.typeEs : attractor.type}</span>
        {attractor.period > 1 && attractor.period <= 16 ? ` (${es ? "periodo" : "period"} ${attractor.period})` : ""}
        {" · "}r = {r.toFixed(3)}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-sky-100/70">
          r ({es ? "parámetro" : "parameter"}): {r.toFixed(3)}
          <input type="range" min={0} max={4} step={0.001} value={r} onChange={(e) => setR(Number(e.target.value))} className="mt-1 w-full accent-teal-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          x0 ({es ? "inicial" : "initial"}): {x0.toFixed(3)}
          <input type="range" min={0.01} max={0.99} step={0.001} value={x0} onChange={(e) => setX0(Number(e.target.value))} className="mt-1 w-full accent-sky-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Iteraciones" : "Iterations"}: {iters}
          <input type="range" min={20} max={200} step={1} value={iters} onChange={(e) => setIters(Number(e.target.value))} className="mt-1 w-full accent-amber-400" />
        </label>
      </div>

      <p className="text-center text-xs text-white/55">
        {es
          ? `Mapa logístico clásico x → r·x·(1−x). Ajustá r para ver convergencia, ciclos o caos. El diagrama de bifurcación muestra la cascada de duplicación de periodo y el punto de Feigenbaum (~3.57).`
          : `Classic logistic map x → r·x·(1−x). Adjust r to see convergence, cycles or chaos. The bifurcation diagram shows the period-doubling cascade and Feigenbaum point (~3.57).`}
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
