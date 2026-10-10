import { useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 420;
const H = 320;

export function WaveInterferenceSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(true);
  const [freq, setFreq] = useState(1.2);
  const [sep, setSep] = useState(80);
  const [phaseDiff, setPhaseDiff] = useState(0);
  const runningRef = useRef(true);
  const freqRef = useRef(1.2);
  const sepRef = useRef(80);
  const phaseDiffRef = useRef(0);
  const time = useRef(0);

  runningRef.current = running;
  freqRef.current = freq;
  sepRef.current = sep;
  phaseDiffRef.current = phaseDiff;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (runningRef.current) {
        time.current += dt * freqRef.current * 2;
      }

      const f = freqRef.current;
      const s = sepRef.current;
      const dp = (phaseDiffRef.current * Math.PI) / 180;
      const t = time.current;

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0c1a2e");
      bg.addColorStop(1, "#061018");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const x1 = cx - s / 2;
      const x2 = cx + s / 2;
      const y = cy;

      // Draw intensity field (simplified)
      const img = ctx.createImageData(W, H);
      const data = img.data;
      for (let ypx = 0; ypx < H; ypx += 2) {
        for (let xpx = 0; xpx < W; xpx += 2) {
          const d1 = Math.hypot(xpx - x1, ypx - y);
          const d2 = Math.hypot(xpx - x2, ypx - y);
          const a1 = Math.sin(t - d1 * 0.08) / (1 + d1 * 0.02);
          const a2 = Math.sin(t - d2 * 0.08 + dp) / (1 + d2 * 0.02);
          const amp = a1 + a2;
          const inten = Math.min(1, Math.abs(amp) * 1.8);
          const r = Math.floor(30 + inten * 180);
          const g = Math.floor(60 + inten * 140);
          const b = Math.floor(120 + inten * 100);
          for (let dy = 0; dy < 2 && ypx + dy < H; dy++) {
            for (let dx = 0; dx < 2 && xpx + dx < W; dx++) {
              const i = ((ypx + dy) * W + (xpx + dx)) * 4;
              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
              data[i + 3] = 255;
            }
          }
        }
      }
      ctx.putImageData(img, 0, 0);

      // Sources
      ctx.fillStyle = "#7dd3fc";
      ctx.beginPath();
      ctx.arc(x1, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x2, y, 6, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="mx-auto flex max-w-lg flex-col items-center gap-4"
      data-sim="wave-interference"
      data-sim-running={running ? "1" : "0"}
    >
      <div className="w-full rounded-2xl border border-sky-500/25 bg-sky-950/40 p-3">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200/85">
          {es ? "Dos fuentes coherentes" : "Two coherent sources"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
            {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
          </SimPrimaryButton>
          <SimSecondaryButton
            theme="lab"
            onClick={() => {
              time.current = 0;
              setRunning(true);
            }}
          >
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
        </div>
      </div>

      <div className="grid w-full max-w-sm gap-3 text-xs text-sky-50/90">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Frecuencia" : "Frequency"}</span>
            <span className="tabular-nums text-sky-300">{freq.toFixed(1)}</span>
          </span>
          <input
            type="range"
            min={0.4}
            max={3}
            step={0.1}
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-sky-400"
            aria-label={es ? "Frecuencia" : "Frequency"}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Separaci\u00f3n" : "Separation"}</span>
            <span className="tabular-nums text-sky-300">{sep} px</span>
          </span>
          <input
            type="range"
            min={30}
            max={160}
            value={sep}
            onChange={(e) => setSep(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-sky-400"
            aria-label={es ? "Separaci\u00f3n" : "Separation"}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Diferencia de fase" : "Phase difference"}</span>
            <span className="tabular-nums text-sky-300">{phaseDiff}\u00b0</span>
          </span>
          <input
            type="range"
            min={0}
            max={180}
            value={phaseDiff}
            onChange={(e) => setPhaseDiff(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-sky-400"
            aria-label={es ? "Diferencia de fase" : "Phase difference"}
          />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        role="img"
        aria-label={es ? "Interferencia de dos fuentes" : "Two-source wave interference"}
        className="w-full max-w-[420px] rounded-2xl border border-sky-500/30 bg-[#061018]"
      />

      <p className="max-w-sm text-center text-[12px] leading-relaxed text-sky-100/70">
        {es
          ? "Patr\u00f3n de interferencia constructiva y destructiva. Ajust\u00e1 frecuencia, separaci\u00f3n y fase. Las zonas claras son m\u00e1ximos."
          : "Constructive and destructive interference pattern. Tune frequency, separation and phase. Bright zones are maxima."}
      </p>
    </div>
  );
}
