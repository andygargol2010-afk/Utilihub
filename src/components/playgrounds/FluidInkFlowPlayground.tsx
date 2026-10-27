import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Pause, Play, Shuffle, Trash2 } from "lucide-react";

type Point = { x: number; y: number; color: string };
type Stroke = { id: string; points: Point[] };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
};

type Props = { locale: "en" | "es" };

const STORAGE_KEY = "utilihub-fluid-ink-flow-v1";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function blendHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

function encodeStrokes(strokes: Stroke[]): string {
  try {
    const slim = strokes.map((s) => ({
      id: s.id,
      points: s.points.map((p) => [Math.round(p.x), Math.round(p.y), p.color]),
    }));
    return btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
  } catch {
    return "";
  }
}

function decodeStrokes(raw: string): Stroke[] {
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const slim = JSON.parse(json) as { id: string; points: [number, number, string][] }[];
    return slim.map((s) => ({
      id: s.id,
      points: s.points.map(([x, y, color]) => ({ x, y, color })),
    }));
  } catch {
    return [];
  }
}

export function FluidInkFlowPlayground({ locale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const isDrawing = useRef(false);
  const currentStroke = useRef<Stroke | null>(null);
  const raf = useRef<number>(0);
  const paused = useRef(false);

  const [viscosity, setViscosity] = useState(0.92);
  const [density, setDensity] = useState(3);
  const [gravity, setGravity] = useState(0.08);
  const [tension, setTension] = useState(0.15);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const es = locale === "es";
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dfe6e9", "#fd79a8", "#a29bfe"];

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = Math.max(420, rect.width * 0.65) * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${Math.max(420, rect.width * 0.65)}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  const getPos = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0, clientY = 0;
    if ("touches" in e && e.touches.length) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const emitParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < density; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        color,
        life: 1,
        maxLife: 180 + Math.random() * 120,
      });
    }
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e.nativeEvent);
    if (!pos) return;
    isDrawing.current = true;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const stroke: Stroke = { id: crypto.randomUUID(), points: [{ ...pos, color }] };
    currentStroke.current = stroke;
    strokesRef.current.push(stroke);
    emitParticles(pos.x, pos.y, color);
    setStrokeCount(strokesRef.current.length);
  };

  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !currentStroke.current) return;
    e.preventDefault();
    const pos = getPos(e.nativeEvent);
    if (!pos) return;
    const last = currentStroke.current.points[currentStroke.current.points.length - 1];
    const dx = pos.x - last.x;
    const dy = pos.y - last.y;
    if (dx * dx + dy * dy < 4) return;
    currentStroke.current.points.push({ ...pos, color: last.color });
    emitParticles(pos.x, pos.y, last.color);
  };

  const updateUrl = () => {
    try {
      const encoded = encodeStrokes(strokesRef.current);
      if (!encoded) return;
      const url = new URL(window.location.href);
      url.searchParams.set("ink", encoded);
      window.history.replaceState(null, "", url.toString());
    } catch {}
  };

  const endDraw = () => {
    isDrawing.current = false;
    currentStroke.current = null;
    saveState();
  };

  const saveState = () => {
    try {
      const data = strokesRef.current.map((s) => ({ id: s.id, points: s.points }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      updateUrl();
    } catch {}
  };

  const loadFromUrl = (): boolean => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ink = params.get("ink");
      if (!ink) return false;
      const strokes = decodeStrokes(ink);
      if (strokes.length === 0) return false;
      strokesRef.current = strokes;
      setStrokeCount(strokes.length);
      strokes.forEach((s) => s.points.forEach((p) => emitParticles(p.x, p.y, p.color)));
      return true;
    } catch {
      return false;
    }
  };

  const loadState = () => {
    if (loadFromUrl()) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Stroke[];
        strokesRef.current = data;
        setStrokeCount(data.length);
        data.forEach((s) => s.points.forEach((p) => emitParticles(p.x, p.y, p.color)));
      }
    } catch {}
  };

  useEffect(() => { loadState(); }, []);

  const step = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused.current) {
      raf.current = requestAnimationFrame(step);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.fillStyle = "rgba(10, 12, 20, 0.12)";
    ctx.fillRect(0, 0, w, h);

    const parts = particlesRef.current;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += gravity;
      p.vx *= viscosity;
      p.vy *= viscosity;
      let fx = 0, fy = 0, count = 0;
      let mixR = 0, mixG = 0, mixB = 0, mixN = 0;
      for (let j = 0; j < parts.length; j++) {
        if (i === j) continue;
        const o = parts[j];
        const dx = o.x - p.x;
        const dy = o.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 28 && dist > 0) {
          const f = tension / dist;
          fx += dx * f;
          fy += dy * f;
          count++;
          if (o.color !== p.color && dist < 18) {
            const [r, g, b] = hexToRgb(o.color);
            mixR += r; mixG += g; mixB += b; mixN++;
          }
        }
      }
      if (count) {
        p.vx += fx * 0.02;
        p.vy += fy * 0.02;
      }
      if (mixN > 0) {
        const [pr, pg, pb] = hexToRgb(p.color);
        const mr = mixR / mixN, mg = mixG / mixN, mb = mixB / mixN;
        p.color = rgbToHex(pr * 0.7 + mr * 0.3, pg * 0.7 + mg * 0.3, pb * 0.7 + mb * 0.3);
      }
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
        parts.splice(i, 1);
        continue;
      }
      const alpha = Math.max(0.15, p.life / p.maxLife);
      ctx.beginPath();
      ctx.fillStyle = p.color + Math.floor(alpha * 180).toString(16).padStart(2, "0");
      ctx.arc(p.x, p.y, 2.2 + (1 - alpha) * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    strokesRef.current.forEach((s) => {
      if (s.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = s.points[0].color + "40";
      ctx.lineWidth = 1.5;
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let k = 1; k < s.points.length; k++) ctx.lineTo(s.points[k].x, s.points[k].y);
      ctx.stroke();
    });

    raf.current = requestAnimationFrame(step);
  }, [viscosity, density, gravity, tension]);

  useEffect(() => {
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [step]);

  const clear = () => {
    strokesRef.current = [];
    particlesRef.current = [];
    setStrokeCount(0);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    localStorage.removeItem(STORAGE_KEY);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("ink");
      window.history.replaceState(null, "", url.toString());
    } catch {}
  };

  const randomize = () => {
    clear();
    const w = containerRef.current?.clientWidth || 600;
    const h = Math.max(420, w * 0.65);
    for (let s = 0; s < 3 + Math.floor(Math.random() * 3); s++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const stroke: Stroke = { id: crypto.randomUUID(), points: [] };
      let x = Math.random() * w * 0.7 + w * 0.15;
      let y = Math.random() * h * 0.6 + h * 0.2;
      for (let i = 0; i < 18 + Math.random() * 22; i++) {
        x += (Math.random() - 0.5) * 28;
        y += (Math.random() - 0.5) * 22;
        stroke.points.push({ x, y, color });
        emitParticles(x, y, color);
      }
      strokesRef.current.push(stroke);
    }
    setStrokeCount(strokesRef.current.length);
    saveState();
  };

  const togglePause = () => {
    paused.current = !paused.current;
    setIsPaused(paused.current);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, h - 48, w, 48);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.fillText(`Fluid Ink Flow · utilihub.com · ${strokeCount} strokes`, 16, h - 20);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `fluid-ink-flow-${Date.now()}.png`;
    a.click();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); togglePause(); }
      if (e.key === "c" || e.key === "C") clear();
      if (e.key === "r" || e.key === "R") randomize();
      if (e.key === "s" || e.key === "S") downloadPng();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [strokeCount]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#0a0c14]"
        style={{ minHeight: 420 }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={moveDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={moveDraw}
          onTouchEnd={endDraw}
        />
        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white/90">
          {strokeCount} {es ? "trazos" : "strokes"}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-semibold">
          {es ? "Viscosidad" : "Viscosity"}
          <input type="range" min="0.75" max="0.99" step="0.01" value={viscosity} onChange={(e) => setViscosity(Number(e.target.value))} className="accent-cyan-500" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          {es ? "Densidad" : "Density"}
          <input type="range" min="1" max="8" step="1" value={density} onChange={(e) => setDensity(Number(e.target.value))} className="accent-cyan-500" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          {es ? "Gravedad" : "Gravity"}
          <input type="range" min="0" max="0.4" step="0.01" value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="accent-cyan-500" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          {es ? "Tensión superficial" : "Surface tension"}
          <input type="range" min="0" max="0.5" step="0.01" value={tension} onChange={(e) => setTension(Number(e.target.value))} className="accent-cyan-500" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={togglePause} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-accent">
          {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
          {isPaused ? (es ? "Reanudar" : "Resume") : (es ? "Pausa" : "Pause")}
        </button>
        <button type="button" onClick={randomize} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-accent">
          <Shuffle className="size-4" /> {es ? "Aleatorio" : "Randomize"}
        </button>
        <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-accent">
          <Trash2 className="size-4" /> {es ? "Limpiar" : "Clear"}
        </button>
        <button type="button" onClick={downloadPng} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">
          <Download className="size-4" /> PNG
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Atajos: Espacio pausa · C limpiar · R aleatorio · S PNG. Dibujá libremente; la tinta fluye y se mezcla. La URL se actualiza con el deep-link."
          : "Shortcuts: Space pause · C clear · R randomize · S PNG. Draw freehand; ink flows and mixes. URL updates with the deep-link."}
      </p>
    </div>
  );
}
