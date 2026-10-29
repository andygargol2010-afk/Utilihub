import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 640;
const H = 420;
const ITERS = 200;

export function LogisticChaosLab({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [r, setR] = useState(3.2);
  const [x0, setX0] = useState(0.5);
  const [iters, setIters] = useState(100);
  const [showCobweb, setShowCobweb] = useState(true);
  const [running, setRunning] = useState(false);

  const series = useRef<number[]>([]);
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

  useEffect(() => {
    computeSeries();
  }, [r, x0, iters, computeSeries]);

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
      const tsX = 16, tsY = 16, tsW = W - 32, tsH = 160;
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
        const cwX = 16, cwY = 190, cwW = W - 32, cwH = 200;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        roundRect(ctx, cwX, cwY, cwW, cwH, 10);
        ctx.fill();
        ctx.strokeStyle = "rgba(148,163,184,0.25)";
        ctx.stroke();

        // Diagonal y=x
        ctx.beginPath();
        ctx.moveTo(cwX + 10, cwY + cwH - 10);
        ctx.lineTo(cwX + cwW - 10, cwY + 10);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Parabola y = r x (1-x)
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

        // Cobweb lines (simplified)
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

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [es, r, showCobweb]);

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
    ctx.fillText(`r=${r.toFixed(3)} x0=${x0.toFixed(3)} n=${iters}`, 16, H + 36);
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
      </div>

      <div className="overflow-hidden rounded-2xl border border-teal-400/35 bg-black/50">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" style={{ aspectRatio: `${W}/${H}` }} />
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
          ? `Mapa logístico clásico x → r·x·(1−x). Ajustá r para ver convergencia, ciclos o caos. El cobweb muestra la iteración gráfica.`
          : `Classic logistic map x → r·x·(1−x). Adjust r to see convergence, cycles or chaos. Cobweb shows graphical iteration.`}
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
