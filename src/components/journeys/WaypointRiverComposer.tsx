import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Particle = {
  t: number;
  speed: number;
  size: number;
  stage: number;
  path: number; // -1 main, >=0 branch index
};
type Branch = { fromIndex: number; points: Point[] };

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

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

export function WaypointRiverComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "waypoint-river-composer", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waypointsRef = useRef<Point[]>([]);
  const branchesRef = useRef<Branch[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const [waypoints, setWaypoints] = useState<Point[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isBranching, setIsBranching] = useState(false);
  const [speed, setSpeed] = useState(0.9);
  const [density, setDensity] = useState(60);
  const [smoothing, setSmoothing] = useState(0.65);
  const [theme, setTheme] = useState<Theme>("dawn");
  const animRef = useRef<number>(0);
  const dragIndex = useRef<number | null>(null);

  const labels = {
    en: {
      speed: "Flow speed",
      density: "Particle density",
      theme: "Color theme",
      smoothing: "Path smoothing",
      clear: "Clear",
      undo: "Undo",
      demo: "Load demo",
      branch: "Start branch",
      finishBranch: "Finish branch",
      hint: "Tap to place main path, drag markers. Start branch for side rivers — some particles divert. Smooth flow with stage gradients.",
    },
    es: {
      speed: "Velocidad",
      density: "Densidad",
      theme: "Tema de color",
      smoothing: "Suavizado",
      clear: "Limpiar",
      undo: "Deshacer",
      demo: "Cargar demo",
      branch: "Iniciar rama",
      finishBranch: "Terminar rama",
      hint: "Tocá para el camino principal, arrastrá marcadores. Iniciá rama para ríos laterales — algunas partículas se desvían. Flujo suavizado con degradados.",
    },
  }[locale];

  const th = THEMES[theme];

  const sampleSmoothPath = useCallback((pts: Point[], t: number): Point | null => {
    if (pts.length < 2) return pts[0] || null;
    if (smoothing < 0.05 || pts.length < 3) {
      const total = pts.reduce((acc, p, i) => i === 0 ? 0 : acc + Math.hypot(p.x - pts[i-1].x, p.y - pts[i-1].y), 0);
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
    }
    const segments = pts.length - 1;
    const segT = t * segments;
    const i = Math.min(Math.floor(segT), segments - 1);
    const u = segT - i;
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[Math.min(pts.length - 1, i + 1)];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const sm = Math.min(1, smoothing);
    const linear = {
      x: p1.x + (p2.x - p1.x) * u,
      y: p1.y + (p2.y - p1.y) * u,
    };
    const cr = catmullRom(p0, p1, p2, p3, u);
    return {
      x: linear.x * (1 - sm) + cr.x * sm,
      y: linear.y * (1 - sm) + cr.y * sm,
    };
  }, [smoothing]);

  const sampleMain = useCallback((t: number) => sampleSmoothPath(waypointsRef.current, t), [sampleSmoothPath]);

  const sampleBranch = useCallback((branch: Branch, t: number) => {
    const from = waypointsRef.current[branch.fromIndex];
    if (!from) return null;
    const pts = [from, ...branch.points];
    return sampleSmoothPath(pts, t);
  }, [sampleSmoothPath]);

  const spawn = useCallback(() => {
    const n = Math.max(12, Math.min(100, density));
    const br = branchesRef.current;
    particlesRef.current = Array.from({ length: n }, (_, i) => {
      const useBranch = br.length > 0 && Math.random() < 0.35;
      const path = useBranch ? Math.floor(Math.random() * br.length) : -1;
      return {
        t: i / n,
        speed: 0.0012 * speed * (0.6 + Math.random() * 0.8),
        size: 1.8 + Math.random() * 2.8,
        stage: i / n,
        path,
      };
    });
  }, [density, speed]);

  useEffect(() => {
    spawn();
  }, [spawn, waypoints.length, branches.length]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = th.bg;
    ctx.fillRect(0, 0, w, h);

    const drawPath = (pts: Point[], alpha = 0.35, width = 16, isBranch = false) => {
      if (pts.length < 2) return;
      ctx.beginPath();
      const samples = Math.max(30, pts.length * 10);
      for (let s = 0; s <= samples; s++) {
        const t = s / samples;
        const p = sampleSmoothPath(pts, t);
        if (!p) continue;
        const px = p.x * w;
        const py = p.y * h;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, th.start);
      grad.addColorStop(1, th.end);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.shadowColor = th.end;
      ctx.shadowBlur = isBranch ? 8 : 18;
      ctx.stroke();
      ctx.globalAlpha = isBranch ? 0.7 : 0.9;
      ctx.lineWidth = isBranch ? 2.5 : 4;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    const pts = waypointsRef.current;
    if (pts.length >= 2) drawPath(pts);

    branchesRef.current.forEach((br) => {
      const from = pts[br.fromIndex];
      if (!from || br.points.length === 0) return;
      drawPath([from, ...br.points], 0.22, 10, true);
    });

    // Main waypoints
    pts.forEach((p, i) => {
      const px = p.x * w;
      const py = p.y * h;
      const stageT = pts.length > 1 ? i / (pts.length - 1) : 0;
      const c = lerpColor(th.start, th.end, stageT);
      ctx.beginPath();
      ctx.arc(px, py, dragIndex.current === i ? 11 : 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = c;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
      ctx.fillStyle = "#ffffffcc";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(i + 1), px, py - 16);
    });

    // Branch points (smaller)
    branchesRef.current.forEach((br) => {
      br.points.forEach((p) => {
        const px = p.x * w;
        const py = p.y * h;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffffaa";
        ctx.shadowColor = th.end;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    });

    particlesRef.current.forEach((p) => {
      let pos: Point | null = null;
      if (p.path < 0) {
        pos = sampleMain(p.t);
      } else {
        const br = branchesRef.current[p.path];
        if (br) pos = sampleBranch(br, p.t);
      }
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
  }, [th, sampleSmoothPath, sampleMain, sampleBranch]);

  useEffect(() => {
    const loop = () => {
      if (waypointsRef.current.length >= 2 || branchesRef.current.some(b => b.points.length > 0)) {
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

  const hitWaypoint = (p: Point): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const w = canvas.width;
    const h = canvas.height;
    const pts = waypointsRef.current;
    for (let i = pts.length - 1; i >= 0; i--) {
      const dx = (p.x - pts[i].x) * w;
      const dy = (p.y - pts[i].y) * h;
      if (dx * dx + dy * dy < 18 * 18) return i;
    }
    return null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const p = getPos(e);
    const hit = hitWaypoint(p);
    if (hit !== null && !isBranching) {
      dragIndex.current = hit;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      return;
    }
    if (isBranching) {
      const last = branchesRef.current[branchesRef.current.length - 1];
      if (last) {
        last.points.push(p);
        branchesRef.current = [...branchesRef.current];
        setBranches([...branchesRef.current]);
      }
      return;
    }
    const next = [...waypointsRef.current, p];
    waypointsRef.current = next;
    setWaypoints(next);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragIndex.current === null) return;
    e.preventDefault();
    const p = getPos(e);
    const next = [...waypointsRef.current];
    next[dragIndex.current] = p;
    waypointsRef.current = next;
    setWaypoints(next);
  };

  const onPointerUp = () => {
    dragIndex.current = null;
  };

  const clear = () => {
    waypointsRef.current = [];
    branchesRef.current = [];
    setWaypoints([]);
    setBranches([]);
    particlesRef.current = [];
    dragIndex.current = null;
    setIsBranching(false);
  };

  const undo = () => {
    if (isBranching && branchesRef.current.length) {
      const last = branchesRef.current[branchesRef.current.length - 1];
      if (last.points.length) {
        last.points.pop();
        branchesRef.current = [...branchesRef.current];
        setBranches([...branchesRef.current]);
        return;
      }
    }
    const next = waypointsRef.current.slice(0, -1);
    waypointsRef.current = next;
    setWaypoints(next);
  };

  const startBranch = () => {
    if (waypointsRef.current.length === 0) return;
    const from = waypointsRef.current.length - 1;
    branchesRef.current = [...branchesRef.current, { fromIndex: from, points: [] }];
    setBranches([...branchesRef.current]);
    setIsBranching(true);
  };

  const finishBranch = () => {
    setIsBranching(false);
  };

  const loadDemo = () => {
    const demo: Point[] = [
      { x: 0.12, y: 0.72 },
      { x: 0.28, y: 0.42 },
      { x: 0.48, y: 0.58 },
      { x: 0.66, y: 0.35 },
      { x: 0.84, y: 0.62 },
    ];
    const demoBranch: Branch = {
      fromIndex: 2,
      points: [
        { x: 0.55, y: 0.78 },
        { x: 0.72, y: 0.82 },
      ],
    };
    waypointsRef.current = demo;
    branchesRef.current = [demoBranch];
    setWaypoints(demo);
    setBranches([demoBranch]);
    setTheme("neon");
    setDensity(70);
    setSpeed(1.05);
    setSmoothing(0.75);
    setIsBranching(false);
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
          {labels.smoothing}
          <input type="range" min={0} max={1} step={0.05} value={smoothing} onChange={(e) => setSmoothing(Number(e.target.value))} className="w-24 accent-primary" />
          <span className="w-8 text-right">{smoothing.toFixed(2)}</span>
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
        <button type="button" onClick={undo} disabled={waypoints.length === 0 && branches.every(b => b.points.length === 0)} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 disabled:opacity-40">
          {labels.undo}
        </button>
        <button type="button" onClick={clear} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          {labels.clear}
        </button>
        <button type="button" onClick={startBranch} disabled={waypoints.length === 0 || isBranching} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 disabled:opacity-40">
          {labels.branch}
        </button>
        <button type="button" onClick={finishBranch} disabled={!isBranching} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 disabled:opacity-40">
          {labels.finishBranch}
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
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none px-2 text-center text-[10px] text-white/60 sm:text-xs">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
