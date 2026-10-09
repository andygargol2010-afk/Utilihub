import { useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const W = 420;
const H = 280;
const STRING_Y = 140;
const LENGTH_M = 1.2;

export function StandingWaveSim({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(true);
  const [harmonic, setHarmonic] = useState(2);
  const [amplitude, setAmplitude] = useState(42);
  const [tension, setTension] = useState(60);
  const runningRef = useRef(true);
  const harmonicRef = useRef(2);
  const amplitudeRef = useRef(42);
  const tensionRef = useRef(60);
  const phase = useRef(0);

  runningRef.current = running;
  harmonicRef.current = harmonic;
  amplitudeRef.current = amplitude;
  tensionRef.current = tension;

  const speed = 18 + tension * 0.55;
  const wavelength = LENGTH_M / harmonic;
  const nodes = harmonic + 1;
  const lambdaLabel = `${wavelength.toFixed(2)} m`;

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
        const v = 18 + tensionRef.current * 0.55;
        phase.current += dt * v * 0.35;
      }

      const n = harmonicRef.current;
      const amp = amplitudeRef.current;
      const envelope = Math.cos(phase.current);

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#042f2e");
      bg.addColorStop(1, "#021716");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(45,212,191,0.12)";
      ctx.lineWidth = 1;
      for (let x = 24; x <= W - 24; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 24);
        ctx.lineTo(x, H - 24);
        ctx.stroke();
      }

      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = "rgba(153,246,228,0.35)";
      ctx.beginPath();
      ctx.moveTo(28, STRING_Y);
      ctx.lineTo(W - 28, STRING_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.strokeStyle = "rgba(94,234,212,0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const x = 28 + t * (W - 56);
        const y = STRING_Y - Math.sin(Math.PI * n * t) * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const x = 28 + t * (W - 56);
        const y = STRING_Y + Math.sin(Math.PI * n * t) * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#5eead4";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      for (let i = 0; i <= 120; i++) {
        const t = i / 120;
        const x = 28 + t * (W - 56);
        const y = STRING_Y - Math.sin(Math.PI * n * t) * amp * envelope;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (let k = 0; k <= n; k++) {
        const x = 28 + (k / n) * (W - 56);
        ctx.beginPath();
        ctx.fillStyle = "#134e4a";
        ctx.arc(x, STRING_Y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#99f6e4";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="mx-auto flex max-w-lg flex-col items-center gap-4"
      data-sim="standing-wave"
      data-sim-nodes={nodes}
      data-sim-antinodes={harmonic}
      data-sim-lambda={lambdaLabel}
      data-sim-running={running ? "1" : "0"}
    >
      <div className="w-full rounded-2xl border border-teal-500/25 bg-teal-950/40 p-3">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200/85">
          {es ? "Cuerda fija en ambos extremos" : "String fixed at both ends"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
            {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
          </SimPrimaryButton>
          <SimSecondaryButton
            theme="lab"
            onClick={() => {
              phase.current = 0;
              setRunning(true);
            }}
          >
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
        </div>
      </div>

      <div className="grid w-full max-w-sm gap-3 text-xs text-teal-50/90">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Armónico" : "Harmonic"}</span>
            <span className="tabular-nums text-teal-300">n = {harmonic}</span>
          </span>
          <input
            type="range"
            min={1}
            max={6}
            value={harmonic}
            onChange={(e) => setHarmonic(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-teal-400"
            aria-label={es ? "Armónico" : "Harmonic"}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Amplitud" : "Amplitude"}</span>
            <span className="tabular-nums text-teal-300">{amplitude} px</span>
          </span>
          <input
            type="range"
            min={8}
            max={70}
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-teal-400"
            aria-label={es ? "Amplitud" : "Amplitude"}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Tensión (velocidad de fase)" : "Tension (phase speed)"}</span>
            <span className="tabular-nums text-teal-300">{speed.toFixed(0)}</span>
          </span>
          <input
            type="range"
            min={10}
            max={100}
            value={tension}
            onChange={(e) => setTension(Number(e.target.value))}
            className="h-2.5 w-full cursor-pointer accent-teal-400"
            aria-label={es ? "Tensión" : "Tension"}
          />
        </label>
      </div>

      <div className="grid w-full max-w-sm grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-xl border border-teal-500/20 bg-black/30 px-2 py-2">
          <p className="font-bold text-teal-200/70">{es ? "Nodos" : "Nodes"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-teal-50" data-sim-nodes={nodes}>
            {nodes}
          </p>
        </div>
        <div className="rounded-xl border border-teal-500/20 bg-black/30 px-2 py-2">
          <p className="font-bold text-teal-200/70">λ</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-teal-50" data-sim-lambda={lambdaLabel}>
            {lambdaLabel}
          </p>
        </div>
        <div className="rounded-xl border border-teal-500/20 bg-black/30 px-2 py-2">
          <p className="font-bold text-teal-200/70">{es ? "Vientres" : "Antinodes"}</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-teal-50" data-sim-antinodes={harmonic}>
            {harmonic}
          </p>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        role="img"
        aria-label={es ? "Onda estacionaria en una cuerda" : "Standing wave on a string"}
        className="w-full max-w-[420px] rounded-2xl border border-teal-500/30 bg-[#021716]"
      />

      <p className="max-w-sm text-center text-[12px] leading-relaxed text-teal-100/70">
        {es
          ? "\u03bb = L/n con L = 1,2 m. Los nodos no se mueven; la tensi\u00f3n solo cambia la rapidez del ciclo. Pausa no altera los n\u00fameros."
          : "\u03bb = L/n with L = 1.2 m. Nodes stay put; tension only changes how fast the cycle runs. Pause does not change the numbers."}
      </p>
    </div>
  );
}
