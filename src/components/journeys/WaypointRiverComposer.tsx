import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Particle = {
  t: number;
  speed: number;
  size: number;
  stage: number;
};

type Theme = "dawn" | "neon" | "forest" | "ocean";

const THEMES: Record<Theme, { start: string; end: string; bg: string }> = {
  dawn: { start: "#3b82f6", end: "#f59e0b", bg: "#0c1222" },
  neon: { start: "#00f5ff", end: "#ff2d95", bg: "#050014" },
  forest: { start: "#16a34a", end: "#eab308", bg: "#0a1a0f" },
  ocean: { start: "#1e40af", end: "#06b6d4", bg: "#021a24" },
};

function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

export function WaypointRiverComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "waypoint-river-composer", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waypointsRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const [waypoints, setWaypoints] = useState<Point[]>([]);
  const [speed, setSpeed] = useState(0.9);
  const [density, setDensity] = useState(60);
  const [theme, setTheme] = useState<Theme>("dawn");
  const animRef = useRef<number>(0);

  const labels = {
    en: {
      speed: "Flow speed",
      density: "Particle density",
      theme: "Color theme",
      clear: "Clear",
      undo: "Undo",
      demo: "Load demo",
      hint: "Tap or click to place sequential waypoints. Particles flow along the journey with stage-based color gradients.",
    },
    es: {
      speed: "Velocidad",
      density: "Densidad",
      theme: "Tema de color",
      clear: "Limpiar",
      undo: "Deshacer",
      demo: "Cargar demo",
      hint: "Tocá o hacé clic para colocar waypoints secuenciales. Las partículas fluyen por el viaje con degradados de color por etapa.",
    },
  }[locale];

  const th = THEMES[theme];

  const getPathLength = useCallback(() => {
    const pts = waypointsRef.current;
    if (pts.length < 2) return 0;
    let len = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      len += Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    }
    return len;
  }, []);

  const pointAt = useCallback((t: number): Point | null => {
    const pts = waypointsRef.current;
    if (pts.length < 2) return null;
    const total = getPathLength();
    if (total <= 0) return pts[0];
    let target = Math.max(0, Math.min(1, t)) * total;
    let acc = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const seg = Math.hypot(b.x - a.x, b.y - a.y);
      if (acc + seg >= target) {
        const u = (target - acc) / (seg || 1);
        return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
      }
      acc += seg;
    }
    return pts[pts.length - 1];
  }, [getPathLength]);

  const spawn = useCallback(() => {
    const n = Math.max(12, Math.min(100, density));
    particlesRef.current = Array.from({ length: n }, (_, i) => ({
      t: i / n,
      speed: 0.0012 * speed * (0.6 + Math.random() * 0.8),
      size: 1.8 + Math.random() * 2.8,
      stage: i / n,
    }));
  }, [density, speed]);

  useEffect(() => {
    spawn();
  }, [spawn, waypoints.length]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, w, h);

    const pts = waypointsRef.current;
    if (pts.length >= 2) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 0; i < pts.length - 1; i++) {
        const t0 = i / (pts.length - 1);
        const t1 = (i + 1) / (pts.length - 1);
        const c0 = lerpColor(th.start, th.end, t0);
        const c1 = lerpColor(th.start, th.end, t1);
        const grad = ctx.createLinearGradient(pts[i].x * w, pts[i].y * h, pts[i + 1].x * w, pts[i + 1].y * h);
        grad.addColorStop(0, c0);
        grad.addColorStop(1, c1);
        ctx.beginPath();
        ctx.moveTo(pts[i].x * w, pts[i].y * h);
        ctx.lineTo(pts[i + 1].x * w, pts[i + 1].y * h);
        ctx.strokeStyle = grad;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 14;
        ctx.shadowColor = c1;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    pts.forEach((p, i) => {
      const px = p.x * w;
      const py = p.y * h;
      const stageT = pts.length > 1 ? i / (pts.length - 1) : 0;
      const c = lerpColor(th.start, th.end, stageT);
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = c;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
      ctx.fillStyle = "#ffffffcc";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(i + 1), px, py - 14);
    });

    particlesRef.current.forEach((p) => {
      const pos = pointAt(p.t);
      if (!pos) return;
      const px = pos.x * w;
      const py = pos.y * h;
      const c = lerpColor(th.start, th.end, p.t);
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = c;
      ctx.shadowColor = c;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [th, pointAt]);

  useEffect(() => {
    const loop = () => {
      if (waypointsRef.current.length >= 2) {
        particlesRef.current = particlesRef.current.map((p) => {
          let nt = p.t + p.speed;
          if (nt > 1) nt = 0;
          return { ...p, t: nt };
        });
      }
      redraw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 32, 720));
      canvas.width = sizePx;
      canvas.height = Math.round(sizePx * 0.58);
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw]);

  const getPos = (e: React.PointerEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0.03, Math.min(0.97, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0.03, Math.min(0.97, (e.clientY - rect.top) / rect.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const p = getPos(e);
    const next = [...waypointsRef.current, p];
    waypointsRef.current = next;
    setWaypoints(next);
  };

  const clear = () => {
    waypointsRef.current = [];
    setWaypoints([]);
    particlesRef.current = [];
  };

  const undo = () => {
    const next = waypointsRef.current.slice(0, -1);
    waypointsRef.current = next;
    setWaypoints(next);
  };

  const loadDemo = () => {
    const demo: Point[] = [
      { x: 0.12, y: 0.72 },
      { x: 0.28, y: 0.42 },
      { x: 0.48, y: 0.58 },
      { x: 0.66, y: 0.35 },
      { x: 0.84, y: 0.62 },
    ];
    waypointsRef.current = demo;
    setWaypoints(demo);
    setTheme("neon");
    setDensity(70);
    setSpeed(1.05);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.speed}
          <input type="range" min={0.3} max={2.2} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-24 accent-primary" />
          <span className="w-8 text-right">{speed.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.density}
          <input type="range" min={20} max={90} step={5} value={density} onChange={(e) => setDensity(Number(e.target.value))} className="w-24 accent-primary" />
          <span className="w-8 text-right">{density}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.theme}
          <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)} className="rounded border bg-background px-2 py-1 text-xs">
            <option value="dawn">Dawn</option>
            <option value="neon">Neon</option>
            <option value="forest">Forest</option>
            <option value="ocean">Ocean</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={undo} disabled={waypoints.length === 0} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 disabled:opacity-40">
          {labels.undo}
        </button>
        <button type="button" onClick={clear} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          {labels.clear}
        </button>
        <button type="button" onClick={loadDemo} className="min-h-[44px] rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          {labels.demo}
        </button>
      </div>

      <div className="relative mx-auto max-w-[720px] overflow-hidden rounded-2xl border border-border/60 bg-black shadow-lg">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none px-2 text-center text-[10px] text-white/60 sm:text-xs">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
