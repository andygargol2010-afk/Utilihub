import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const GRID = 160;
const SCALE = 3; // canvas pixel size
const W = GRID * SCALE;
const H = GRID * SCALE;

type Preset = {
  id: string;
  en: string;
  es: string;
  f: number;
  k: number;
  du: number;
  dv: number;
};

const PRESETS: Preset[] = [
  { id: "spots", en: "Spots", es: "Manchas", f: 0.03, k: 0.062, du: 0.16, dv: 0.08 },
  { id: "stripes", en: "Stripes", es: "Rayas", f: 0.022, k: 0.051, du: 0.16, dv: 0.08 },
  { id: "maze", en: "Maze", es: "Laberinto", f: 0.029, k: 0.057, du: 0.16, dv: 0.08 },
  { id: "worms", en: "Worms", es: "Gusanos", f: 0.058, k: 0.065, du: 0.16, dv: 0.08 },
  { id: "coral", en: "Coral", es: "Coral", f: 0.0545, k: 0.062, du: 0.16, dv: 0.08 },
  { id: "mitosis", en: "Mitosis", es: "Mitosis", f: 0.0367, k: 0.0649, du: 0.16, dv: 0.08 },
];

type BrushMode = "seed" | "clear" | "noise";
type ColorMap = "heat" | "ocean" | "mono" | "plasma" | "viridis" | "magma";

function idx(x: number, y: number) {
  return y * GRID + x;
}

function makeGrid(): { u: Float32Array; v: Float32Array } {
  const u = new Float32Array(GRID * GRID);
  const v = new Float32Array(GRID * GRID);
  u.fill(1);
  v.fill(0);
  // seed a few spots
  for (let i = 0; i < 8; i++) {
    const cx = Math.floor(GRID * (0.3 + Math.random() * 0.4));
    const cy = Math.floor(GRID * (0.3 + Math.random() * 0.4));
    const r = 3 + Math.floor(Math.random() * 4);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          const x = (cx + dx + GRID) % GRID;
          const y = (cy + dy + GRID) % GRID;
          const i = idx(x, y);
          u[i] = 0.5;
          v[i] = 0.25;
        }
      }
    }
  }
  return { u, v };
}

function parseHash(): Partial<{ f: number; k: number; du: number; dv: number }> {
  if (typeof window === "undefined") return {};
  const hash = window.location.hash.slice(1);
  if (!hash) return {};
  const params = new URLSearchParams(hash);
  const out: Partial<{ f: number; k: number; du: number; dv: number }> = {};
  const f = params.get("f");
  const k = params.get("k");
  const du = params.get("du");
  const dv = params.get("dv");
  if (f) out.f = Number(f);
  if (k) out.k = Number(k);
  if (du) out.du = Number(du);
  if (dv) out.dv = Number(dv);
  return out;
}

export function ReactionDiffusionLab({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initial = typeof window !== "undefined" ? parseHash() : {};
  const [running, setRunning] = useState(true);
  const [f, setF] = useState(initial.f ?? 0.03);
  const [k, setK] = useState(initial.k ?? 0.062);
  const [du, setDu] = useState(initial.du ?? 0.16);
  const [dv, setDv] = useState(initial.dv ?? 0.08);
  const [colorMap, setColorMap] = useState<ColorMap>("heat");
  const [brush, setBrush] = useState(true);
  const [brushRadius, setBrushRadius] = useState(5);
  const [brushMode, setBrushMode] = useState<BrushMode>("seed");
  const [stepsPerFrame, setStepsPerFrame] = useState(4);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  const grids = useRef(makeGrid());
  const runningRef = useRef(true);
  const paramsRef = useRef({ f: 0.03, k: 0.062, du: 0.16, dv: 0.08, color: "heat" as ColorMap, steps: 4 });
  const painting = useRef(false);
  const stepOnce = useRef(false);

  runningRef.current = running;
  paramsRef.current = { f, k, du, dv, color: colorMap, steps: stepsPerFrame };

  const reset = useCallback(() => {
    grids.current = makeGrid();
    setRunning(true);
  }, []);

  const clearActivator = useCallback(() => {
    grids.current.v.fill(0);
    grids.current.u.fill(1);
  }, []);

  const applyPreset = useCallback((p: Preset) => {
    setF(p.f);
    setK(p.k);
    setDu(p.du);
    setDv(p.dv);
  }, []);

  const randomizeParams = useCallback(() => {
    // Explore interesting Gray-Scott space
    setF(0.01 + Math.random() * 0.06);
    setK(0.04 + Math.random() * 0.035);
    setDu(0.08 + Math.random() * 0.18);
    setDv(0.03 + Math.random() * 0.1);
  }, []);

  const randomSeed = useCallback(() => {
    const { u, v } = grids.current;
    u.fill(1);
    v.fill(0);
    const count = 4 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const cx = Math.floor(Math.random() * GRID);
      const cy = Math.floor(Math.random() * GRID);
      const r = 2 + Math.floor(Math.random() * 6);
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy <= r * r) {
            const x = (cx + dx + GRID) % GRID;
            const y = (cy + dy + GRID) % GRID;
            const ii = idx(x, y);
            u[ii] = 0.5;
            v[ii] = 0.25;
          }
        }
      }
    }
  }, []);

  const copyShareLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.hash = `f=${f.toFixed(4)}&k=${k.toFixed(4)}&du=${du.toFixed(3)}&dv=${dv.toFixed(3)}`;
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }, [f, k, du, dv]);

  const seedAt = useCallback((gx: number, gy: number, radius: number, mode: BrushMode) => {
    const { u, v } = grids.current;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          const x = (gx + dx + GRID) % GRID;
          const y = (gy + dy + GRID) % GRID;
          const i = idx(x, y);
          if (mode === "seed") {
            u[i] = 0.5;
            v[i] = 0.25;
          } else if (mode === "clear") {
            u[i] = 1;
            v[i] = 0;
          } else {
            // noise
            v[i] = Math.min(1, v[i] + Math.random() * 0.3);
            u[i] = Math.max(0, u[i] - Math.random() * 0.15);
          }
        }
      }
    }
  }, []);

  const exportPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `reaction-diffusion-${Date.now()}.png`;
    a.click();
  }, []);

  const requestStep = useCallback(() => {
    stepOnce.current = true;
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { alpha: false });
      if (!ctx) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const p = paramsRef.current;
      const { u, v } = grids.current;
      const nu = new Float32Array(u);
      const nv = new Float32Array(v);

      const doStep = runningRef.current || stepOnce.current;
      if (doStep) {
        const steps = stepOnce.current ? 1 : Math.max(1, Math.min(8, p.steps));
        stepOnce.current = false;
        for (let step = 0; step < steps; step++) {
          for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
              const i = idx(x, y);
              const ul = u[idx((x - 1 + GRID) % GRID, y)];
              const ur = u[idx((x + 1) % GRID, y)];
              const uu = u[idx(x, (y - 1 + GRID) % GRID)];
              const ud = u[idx(x, (y + 1) % GRID)];
              const vl = v[idx((x - 1 + GRID) % GRID, y)];
              const vr = v[idx((x + 1) % GRID, y)];
              const vu = v[idx(x, (y - 1 + GRID) % GRID)];
              const vd = v[idx(x, (y + 1) % GRID)];

              const lapU = ul + ur + uu + ud - 4 * u[i];
              const lapV = vl + vr + vu + vd - 4 * v[i];

              const uvv = u[i] * v[i] * v[i];
              nu[i] = u[i] + p.du * lapU - uvv + p.f * (1 - u[i]);
              nv[i] = v[i] + p.dv * lapV + uvv - (p.f + p.k) * v[i];

              nu[i] = Math.max(0, Math.min(1, nu[i]));
              nv[i] = Math.max(0, Math.min(1, nv[i]));
            }
          }
          u.set(nu);
          v.set(nv);
        }
      }

      // render
      const img = ctx.createImageData(W, H);
      const data = img.data;
      for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
          const i = idx(x, y);
          const val = v[i]; // visualize activator
          let r = 0, g = 0, b = 0;
          if (p.color === "heat") {
            r = Math.min(255, val * 400);
            g = Math.min(255, val * 180);
            b = Math.min(255, (1 - val) * 80);
          } else if (p.color === "ocean") {
            r = Math.min(255, val * 60);
            g = Math.min(255, 40 + val * 180);
            b = Math.min(255, 80 + val * 160);
          } else if (p.color === "plasma") {
            r = Math.min(255, val * 220 + 20);
            g = Math.min(255, Math.max(0, (val - 0.3) * 300));
            b = Math.min(255, (1 - val) * 200);
          } else if (p.color === "viridis") {
            r = Math.min(255, 68 + val * 180);
            g = Math.min(255, 1 + val * 200);
            b = Math.min(255, 84 + (1 - val) * 100);
          } else if (p.color === "magma") {
            r = Math.min(255, val * 250);
            g = Math.min(255, Math.max(0, (val - 0.4) * 220));
            b = Math.min(255, (1 - val) * 140 + 20);
          } else {
            const gray = Math.min(255, val * 255);
            r = g = b = gray;
          }
          for (let sy = 0; sy < SCALE; sy++) {
            for (let sx = 0; sx < SCALE; sx++) {
              const px = (y * SCALE + sy) * W + (x * SCALE + sx);
              const di = px * 4;
              data[di] = r;
              data[di + 1] = g;
              data[di + 2] = b;
              data[di + 3] = 255;
            }
          }
        }
      }
      ctx.putImageData(img, 0, 0);

      if (!runningRef.current) {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "white";
        ctx.font = "bold 18px ui-sans-serif,system-ui,sans-serif";
        ctx.fillText(es ? "Pausado" : "Paused", W / 2 - 36, H / 2);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [es]);

  const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!brush) return;
    painting.current = true;
    paint(e);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!painting.current || !brush) return;
    paint(e);
  };
  const onPointerUp = () => {
    painting.current = false;
  };
  const paint = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const gx = Math.floor(((e.clientX - rect.left) / rect.width) * GRID);
    const gy = Math.floor(((e.clientY - rect.top) / rect.height) * GRID);
    seedAt(gx, gy, brushRadius, brushMode);
  };

  const colorMaps: ColorMap[] = ["heat", "ocean", "mono", "plasma", "viridis", "magma"];

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
      <div className="w-full rounded-2xl border border-teal-400/25 bg-teal-950/40 p-3 backdrop-blur-sm">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300/85">
          {es ? "Lab reacción-difusión — Gray-Scott" : "Reaction-diffusion lab — Gray-Scott"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
            {running ? (es ? "Pausa" : "Pause") : es ? "Seguir" : "Resume"}
          </SimPrimaryButton>
          <SimSecondaryButton theme="lab" onClick={requestStep}>
            {es ? "Paso" : "Step"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={reset}>
            {es ? "Reiniciar" : "Reset"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={clearActivator}>
            {es ? "Limpiar V" : "Clear V"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" active={brush} onClick={() => setBrush((b) => !b)}>
            {es ? (brush ? "Pincel ✓" : "Pincel") : brush ? "Brush ✓" : "Brush"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={exportPng}>
            PNG
          </SimSecondaryButton>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {PRESETS.map((pr) => (
            <button
              key={pr.id}
              type="button"
              onClick={() => applyPreset(pr)}
              className="rounded-lg border border-teal-400/30 bg-teal-900/40 px-2 py-0.5 text-[10px] font-semibold text-teal-100/90 hover:bg-teal-800/50"
            >
              {es ? pr.es : pr.en}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <SimSecondaryButton theme="lab" onClick={randomizeParams}>
            {es ? "Params aleatorios" : "Random params"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={randomSeed}>
            {es ? "Semilla aleatoria" : "Random seed"}
          </SimSecondaryButton>
          <SimSecondaryButton theme="lab" onClick={copyShareLink}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar enlace" : "Copy link"}
          </SimSecondaryButton>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {(["seed", "clear", "noise"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setBrushMode(m)}
              className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                brushMode === m ? "bg-teal-500 text-teal-950" : "bg-teal-900/50 text-teal-100"
              }`}
            >
              {m === "seed" ? (es ? "Sembrar" : "Seed") : m === "clear" ? (es ? "Borrar" : "Clear") : es ? "Ruido" : "Noise"}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="w-full max-w-md cursor-crosshair rounded-xl border border-teal-400/20 bg-black touch-none"
        style={{ aspectRatio: "1 / 1" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />

      <div className="grid w-full max-w-md gap-2 text-xs text-teal-100/85">
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Alimentación (F)" : "Feed (F)"}</span>
            <span className="tabular-nums text-teal-300">{f.toFixed(4)}</span>
          </span>
          <input type="range" min={0.01} max={0.08} step={0.001} value={f} onChange={(e) => setF(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Muerte (k)" : "Kill (k)"}</span>
            <span className="tabular-nums text-teal-300">{k.toFixed(4)}</span>
          </span>
          <input type="range" min={0.04} max={0.08} step={0.001} value={k} onChange={(e) => setK(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>Du</span>
            <span className="tabular-nums text-teal-300">{du.toFixed(3)}</span>
          </span>
          <input type="range" min={0.05} max={0.3} step={0.005} value={du} onChange={(e) => setDu(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>Dv</span>
            <span className="tabular-nums text-teal-300">{dv.toFixed(3)}</span>
          </span>
          <input type="range" min={0.02} max={0.15} step={0.005} value={dv} onChange={(e) => setDv(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Radio pincel" : "Brush radius"}</span>
            <span className="tabular-nums text-teal-300">{brushRadius}</span>
          </span>
          <input type="range" min={2} max={12} step={1} value={brushRadius} onChange={(e) => setBrushRadius(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="flex justify-between font-semibold">
            <span>{es ? "Velocidad (pasos)" : "Speed (steps)"}</span>
            <span className="tabular-nums text-teal-300">{stepsPerFrame}</span>
          </span>
          <input type="range" min={1} max={8} step={1} value={stepsPerFrame} onChange={(e) => setStepsPerFrame(Number(e.target.value))} className="h-2 w-full cursor-pointer accent-teal-400" />
        </label>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="font-semibold">{es ? "Mapa de color" : "Color map"}</span>
          {colorMaps.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColorMap(c)}
              className={`rounded px-2 py-0.5 text-[10px] font-bold ${colorMap === c ? "bg-teal-500 text-teal-950" : "bg-teal-900/50 text-teal-100"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowInfo((s) => !s)}
          className="mt-1 text-center text-[10px] font-semibold text-teal-300 underline-offset-2 hover:underline"
        >
          {showInfo ? (es ? "Ocultar explicación" : "Hide explanation") : es ? "¿Qué significan F, k, Du, Dv?" : "What do F, k, Du, Dv mean?"}
        </button>
        {showInfo && (
          <div className="rounded-lg border border-teal-400/20 bg-teal-950/30 p-2 text-[11px] leading-snug text-teal-100/80">
            {es ? (
              <>
                <p><strong>F</strong> (alimentación): tasa a la que se añade sustrato. Valores bajos → patrones más densos.</p>
                <p><strong>k</strong> (muerte): tasa de eliminación del activador. Controla el tamaño y estabilidad de las estructuras.</p>
                <p><strong>Du / Dv</strong>: coeficientes de difusión. Mayor Du respecto a Dv favorece manchas; menor favorece rayas y laberintos.</p>
                <p>Pinta con el pincel para sembrar, borrar o añadir ruido y observa cómo emergen patrones orgánicos. Usa params aleatorios para explorar.</p>
              </>
            ) : (
              <>
                <p><strong>F</strong> (feed): rate at which substrate is added. Lower values tend to produce denser patterns.</p>
                <p><strong>k</strong> (kill): rate of activator removal. Controls structure size and stability.</p>
                <p><strong>Du / Dv</strong>: diffusion coefficients. Higher Du relative to Dv favors spots; lower favors stripes and mazes.</p>
                <p>Paint with the brush to seed, clear, or add noise and watch organic patterns emerge. Use random params to explore.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
