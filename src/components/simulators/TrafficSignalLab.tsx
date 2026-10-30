import { useCallback, useEffect, useRef, useState } from "react";
import type { SimLocale } from "@/lib/simulators/catalog";
import { SimPrimaryButton, SimSecondaryButton } from "./SimShell";

const SIZE = 11;
const CELL = 28;
const W = SIZE * CELL;
const H = SIZE * CELL;
const CENTER = 5;

type Dir = "N" | "S" | "E" | "W";
type Car = { id: number; dir: Dir; pos: number; waiting: boolean; waitTime: number };

export function TrafficSignalLab({ locale = "en" }: { locale?: SimLocale }) {
  const es = locale === "es";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [greenNs, setGreenNs] = useState(8);
  const [greenEw, setGreenEw] = useState(8);
  const [throughput, setThroughput] = useState(0);
  const [queues, setQueues] = useState({ N: 0, S: 0, E: 0, W: 0 });
  const [avgWait, setAvgWait] = useState(0);
  const [copied, setCopied] = useState(false);

  const carsRef = useRef<Car[]>([]);
  const nextId = useRef(1);
  const phaseRef = useRef(0); // 0 = NS green, 1 = EW green
  const phaseTimer = useRef(0);
  const runningRef = useRef(false);
  const params = useRef({ greenNs, greenEw });
  const throughputRef = useRef(0);
  runningRef.current = running;
  params.current = { greenNs, greenEw };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    const ns = Number(qs.get("ns"));
    const ew = Number(qs.get("ew"));
    if (ns >= 3 && ns <= 20) setGreenNs(ns);
    if (ew >= 3 && ew <= 20) setGreenEw(ew);
  }, []);

  const syncUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams();
    p.set("ns", String(greenNs));
    p.set("ew", String(greenEw));
    const next = `${window.location.pathname}?${p.toString()}`;
    window.history.replaceState(null, "", next);
  }, [greenNs, greenEw]);

  useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const reset = useCallback(() => {
    carsRef.current = [];
    nextId.current = 1;
    phaseRef.current = 0;
    phaseTimer.current = 0;
    throughputRef.current = 0;
    setThroughput(0);
    setQueues({ N: 0, S: 0, E: 0, W: 0 });
    setAvgWait(0);
    setRunning(false);
  }, []);

  const applyPreset = (ns: number, ew: number) => {
    setGreenNs(ns);
    setGreenEw(ew);
  };

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const totalQueue = queues.N + queues.S + queues.E + queues.W;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const spawn = () => {
      if (Math.random() > 0.35) return;
      const dirs: Dir[] = ["N", "S", "E", "W"];
      const dir = dirs[Math.floor(Math.random() * 4)];
      carsRef.current.push({ id: nextId.current++, dir, pos: 0, waiting: false, waitTime: 0 });
    };

    const step = (dt: number) => {
      phaseTimer.current += dt;
      const { greenNs: gNs, greenEw: gEw } = params.current;
      if (phaseTimer.current >= (phaseRef.current === 0 ? gNs : gEw)) {
        phaseRef.current = phaseRef.current === 0 ? 1 : 0;
        phaseTimer.current = 0;
      }

      spawn();

      const nsGreen = phaseRef.current === 0;
      const cars = carsRef.current;
      const occupied = new Set<string>();

      cars.sort((a, b) => b.pos - a.pos);

      for (const car of cars) {
        const isNs = car.dir === "N" || car.dir === "S";
        const green = isNs ? nsGreen : !nsGreen;
        const key = `${car.dir}-${car.pos}`;
        const nextKey = `${car.dir}-${car.pos + 1}`;

        if (!green) {
          car.waiting = true;
          car.waitTime += dt;
          occupied.add(key);
          continue;
        }

        if (occupied.has(nextKey) || car.pos >= 10) {
          car.waiting = true;
          car.waitTime += dt;
          occupied.add(key);
          continue;
        }

        car.waiting = false;
        car.pos += 1;
        if (car.pos > 10) {
          throughputRef.current += 1;
          continue;
        }
        occupied.add(`${car.dir}-${car.pos}`);
      }

      carsRef.current = cars.filter((c) => c.pos <= 10);

      const q = { N: 0, S: 0, E: 0, W: 0 };
      let totalWait = 0;
      let count = 0;
      for (const c of carsRef.current) {
        if (c.waiting) q[c.dir] += 1;
        totalWait += c.waitTime;
        count += 1;
      }
      setQueues(q);
      setThroughput(throughputRef.current);
      setAvgWait(count ? totalWait / count : 0);
    };

    const draw = (now: number) => {
      const dt = Math.min(0.12, (now - last) / 1000);
      last = now;
      if (runningRef.current) step(dt);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // Roads
      ctx.fillStyle = "#334155";
      ctx.fillRect(CENTER * CELL, 0, CELL, H);
      ctx.fillRect(0, CENTER * CELL, W, CELL);

      // Intersection center
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(CENTER * CELL, CENTER * CELL, CELL, CELL);

      // Signals
      const nsGreen = phaseRef.current === 0;
      ctx.fillStyle = nsGreen ? "#22c55e" : "#ef4444";
      ctx.fillRect(CENTER * CELL + 4, 4, CELL - 8, 12);
      ctx.fillStyle = !nsGreen ? "#22c55e" : "#ef4444";
      ctx.fillRect(4, CENTER * CELL + 4, 12, CELL - 8);

      // Cars
      for (const car of carsRef.current) {
        let x = 0, y = 0;
        if (car.dir === "N") {
          x = CENTER * CELL;
          y = (10 - car.pos) * CELL;
        } else if (car.dir === "S") {
          x = CENTER * CELL;
          y = car.pos * CELL;
        } else if (car.dir === "E") {
          x = car.pos * CELL;
          y = CENTER * CELL;
        } else {
          x = (10 - car.pos) * CELL;
          y = CENTER * CELL;
        }
        ctx.fillStyle = car.waiting ? "#f97316" : "#3b82f6";
        ctx.fillRect(x + 4, y + 4, CELL - 8, CELL - 8);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H + 48;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(canvas, 0, 0);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 14px ui-sans-serif, system-ui";
    ctx.fillText(es ? "Lab Semáforos · utilihub.app" : "Traffic Signal Lab · utilihub.app", 12, H + 20);
    ctx.font = "11px ui-sans-serif, system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    const qStr = `N:${queues.N} S:${queues.S} E:${queues.E} W:${queues.W}`;
    ctx.fillText(
      `${es ? "Colas" : "Queues"} ${qStr} · ${es ? "Espera media" : "Avg wait"} ${avgWait.toFixed(1)}s · NS:${greenNs} EW:${greenEw}`,
      12,
      H + 38
    );
    const url = off.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = es ? "laboratorio-semaforos.png" : "traffic-signal-lab.png";
    a.click();
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <SimPrimaryButton theme="lab" onClick={() => setRunning((r) => !r)}>
          {running ? (es ? "Pausa" : "Pause") : es ? "Simular" : "Run"}
        </SimPrimaryButton>
        <SimSecondaryButton theme="lab" onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={downloadPng}>
          {es ? "PNG marca" : "Branded PNG"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={copyLink}>
          {copied ? (es ? "¡Copiado!" : "Copied!") : es ? "Copiar enlace" : "Copy link"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={() => applyPreset(8, 8)}>
          {es ? "Equilibrado" : "Balanced"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={() => applyPreset(15, 5)}>
          {es ? "Hora pico N-S" : "Rush NS"}
        </SimSecondaryButton>
        <SimSecondaryButton theme="lab" onClick={() => applyPreset(5, 15)}>
          {es ? "Hora pico E-O" : "Rush EW"}
        </SimSecondaryButton>
      </div>

      <div className="overflow-hidden rounded-2xl border border-sky-400/35 bg-black/50">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full touch-manipulation" style={{ aspectRatio: `${W}/${H}` }} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-sky-400/20 bg-black/40 px-2 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{es ? "Flujo" : "Throughput"}</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-emerald-300">{throughput}</p>
        </div>
        <div className="rounded-xl border border-sky-400/20 bg-black/40 px-2 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{es ? "Espera media" : "Avg wait"}</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-sky-300">{avgWait.toFixed(1)}s</p>
        </div>
        <div className="rounded-xl border border-sky-400/20 bg-black/40 px-2 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{es ? "Cola total" : "Total queue"}</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-amber-300">{totalQueue}</p>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {(["N", "S", "E", "W"] as const).map((d) => (
            <div key={d} className="rounded-xl border border-sky-400/20 bg-black/40 px-1 py-2 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">Q {d}</p>
              <p className="mt-0.5 text-base font-bold tabular-nums text-amber-300">{queues[d]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-sky-100/70">
          {es ? "Verde N-S (s)" : "NS green (s)"}: {greenNs}
          <input type="range" min={3} max={20} step={1} value={greenNs} onChange={(e) => setGreenNs(Number(e.target.value))} className="mt-1 h-8 w-full accent-emerald-400" />
        </label>
        <label className="text-xs text-sky-100/70">
          {es ? "Verde E-O (s)" : "EW green (s)"}: {greenEw}
          <input type="range" min={3} max={20} step={1} value={greenEw} onChange={(e) => setGreenEw(Number(e.target.value))} className="mt-1 h-8 w-full accent-sky-400" />
        </label>
      </div>

      <p className="text-center text-xs text-white/55">
        {es
          ? "Ajustá los tiempos verdes N-S y E-O o usá presets. Los coches avanzan solo con verde y se encolan con rojo. Minimizá la espera media y maximizá el flujo. Copiá el enlace o descargá PNG de la escena."
          : "Adjust NS and EW green times or use presets. Cars move only on green and queue on red. Minimize average wait and maximize throughput. Copy the link or download a branded PNG of the scene."}
      </p>
    </div>
  );
}
