import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Particle = {
  t: number;
  speed: number;
  size: number;
  stage: number;
  path: number;
  trail: Point[];
};
type Branch = { fromIndex: number; points: Point[] };

type Theme = "dawn" | "neon" | "forest" | "ocean";

const THEMES: Record<Theme, { start: string; end: string; bg: string }> = {
  dawn: { start: "#3b82f6", end: "#f59e0b", bg: "#0c1222" },
  neon: { start: "#00f5ff", end: "#ff2d95", bg: "#050014" },
  forest: { start: "#16a34a", end: "#eab308", bg: "#0a1a0f" },
  ocean: { start: "#1e40af", end: "#06b6d4", bg: "#021a24" },
};

const TRAIL_LEN = 12;

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

function encodePoints(pts: Point[]): string {
  return pts.map(p => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(";");
}

function decodePoints(s: string): Point[] {
  if (!s) return [];
  return s.split(";").map(pair => {
    const [x, y] = pair.split(",").map(Number);
    return { x: isNaN(x) ? 0.5 : Math.max(0.03, Math.min(0.97, x)), y: isNaN(y) ? 0.5 : Math.max(0.03, Math.min(0.97, y)) };
  }).filter(p => !isNaN(p.x) && !isNaN(p.y));
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
  const [reverse, setReverse] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pathWidth, setPathWidth] = useState(16);
  const [bloom, setBloom] = useState(18);
  const [gravity, setGravity] = useState(0);
  const animRef = useRef<number>(0);
  const dragIndex = useRef<number | null>(null);
  const pausedRef = useRef(false);

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
      share: "Save PNG",
      reverse: "Reverse flow",
      pause: "Pause",
      width: "River width",
      bloom: "Bloom",
      gravity: "Gravity",
      random: "Randomize",
      hint: "Tap to place main path, drag markers. Start branch for side rivers. Adjust width, bloom, gravity. Randomize. Space to pause. Save PNG to share.",
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
      share: "Guardar PNG",
      reverse: "Flujo inverso",
      pause: "Pausa",
      width: "Ancho del rio",
      bloom: "Bloom",
      gravity: "Gravedad",
      random: "Aleatorizar",
      hint: "Toca para el camino principal, arrastra marcadores. Inicia rama para rios laterales. Ajusta ancho, bloom, gravedad. Aleatoriza. Espacio para pausar. Guarda PNG para compartir.",
    },
  }[locale];

  const th = THEMES[theme];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wp = params.get("wp");
    if (wp) {
      const pts = decodePoints(wp);
      if (pts.length >= 2) {
        waypointsRef.current = pts;
        setWaypoints(pts);
      }
    }
    const sp = params.get("sp");
    if (sp) setSpeed(Math.max(0.3, Math.min(2.2, Number(sp) || 0.9)));
    const de = params.get("de");
    if (de) setDensity(Math.max(20, Math.min(90, Number(de) || 60)));
    const sm = params.get("sm");
    if (sm) setSmoothing(Math.max(0, Math.min(1, Number(sm) || 0.65)));
    const thm = params.get("th") as Theme;
    if (thm && THEMES[thm]) setTheme(thm);
    const rev = params.get("rev");
    if (rev === "1") setReverse(true);
    const wi = params.get("wi");
    if (wi) setPathWidth(Math.max(6, Math.min(40, Number(wi) || 16)));
    const bl = params.get("bl");
    if (bl) setBloom(Math.max(0, Math.min(40, Number(bl) || 18)));
    const gr = params.get("gr");
    if (gr) setGravity(Math.max(-0.5, Math.min(0.5, Number(gr) || 0)));
  }, []);

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
        trail: [],
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

    const drawPath = (pts: Point[], alpha = 0.35, width = pathWidth, isBranch = false) => {
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
      ctx.lineWidth = isBranch ? width * 0.65 : width;
      ctx.shadowColor = th.end;
      ctx.shadowBlur = isBranch ? bloom * 0.5 : bloom;
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
      drawPath([from, ...br.points], 0.22, pathWidth * 0.65, true);
    });

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

      const gOff = gravity * 0.015 * Math.sin(p.t * Math.PI * 2);
      pos = { x: pos.x, y: Math.max(0.02, Math.min(0.98, pos.y + gOff)) };

      if (p.trail.length >= 2) {
        for (let ti = 0; ti < p.trail.length - 1; ti++) {
          const a = p.trail[ti];
          const b = p.trail[ti + 1];
          const fade = (ti + 1) / p.trail.length;
          const c = lerpColor(th.start, th.end, p.t);
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.strokeStyle = c;
          ctx.globalAlpha = 0.08 + fade * 0.42;
          ctx.lineWidth = p.size * (0.35 + fade * 1.1);
          ctx.lineCap = "round";
          ctx.shadowColor = c;
          ctx.shadowBlur = 8 * fade;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      const px = pos.x * w;
      const py = pos.y * h;
      const c = lerpColor(th.start, th.end, p.t);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = c;
      ctx.shadowColor = c;
      ctx.shadowBlur = 22 + bloom * 0.4;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [th, sampleSmoothPath, sampleMain, sampleBranch, pathWidth, bloom, gravity]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const loop = () => {
      if (!pausedRef.current && (waypointsRef.current.length >= 2 || branchesRef.current.some(b => b.points.length > 0))) {
        particlesRef.current = particlesRef.current.map((p) => {
          const dir = reverse ? -1 : 1;
          let nt = p.t + p.speed * dir;
          if (nt > 1) nt = 0;
          if (nt < 0) nt = 1;
          let pos: Point | null = null;
          if (p.path < 0) {
            pos = sampleMain(nt);
          } else {
            const br = branchesRef.current[p.path];
            if (br) pos = sampleBranch(br, nt);
          }
          const trail = pos
            ? [...p.trail, pos].slice(-TRAIL_LEN)
            : p.trail;
          if (nt < p.t) {
            return { ...p, t: nt, trail: pos ? [pos] : [] };
          }
          return { ...p, t: nt, trail };
        });
      }
      redraw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw, sampleMain, sampleBranch, reverse]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPaused(p => !p);
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        randomize();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    setPathWidth(20);
    setBloom(22);
    setIsBranching(false);
  };

  const randomize = useCallback(() => {
    const n = 4 + Math.floor(Math.random() * 4);
    const pts: Point[] = [];
    let x = 0.1;
    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.max(0.08, Math.min(0.92, x)),
        y: 0.25 + Math.random() * 0.5,
      });
      x += 0.7 / n + (Math.random() - 0.5) * 0.08;
    }
    waypointsRef.current = pts;
    setWaypoints(pts);
    setBranches([]);
    branchesRef.current = [];
    setTheme(["dawn", "neon", "forest", "ocean"][Math.floor(Math.random() * 4)] as Theme);
    setSpeed(0.6 + Math.random() * 1.2);
    setDensity(40 + Math.floor(Math.random() * 40));
    setSmoothing(0.4 + Math.random() * 0.5);
    setPathWidth(10 + Math.floor(Math.random() * 20));
    setBloom(8 + Math.floor(Math.random() * 24));
    setGravity((Math.random() - 0.5) * 0.3);
    setIsBranching(false);
    trackEvent("playground_randomize", { id: "waypoint-river-composer", locale });
  }, [locale]);

  const updateUrl = useCallback(() => {
    if (typeof window === "undefined" || waypointsRef.current.length < 2) return;
    const params = new URLSearchParams();
    params.set("wp", encodePoints(waypointsRef.current));
    params.set("sp", speed.toFixed(1));
    params.set("de", String(density));
    params.set("sm", smoothing.toFixed(2));
    params.set("th", theme);
    if (reverse) params.set("rev", "1");
    params.set("wi", String(pathWidth));
    params.set("bl", String(bloom));
    params.set("gr", gravity.toFixed(2));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [speed, density, smoothing, theme, reverse, pathWidth, bloom, gravity]);

  const savePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height + 48;
    const tctx = temp.getContext("2d");
    if (!tctx) return;
    tctx.fillStyle = th.bg;
    tctx.fillRect(0, 0, temp.width, temp.height);
    tctx.drawImage(canvas, 0, 0);
    tctx.fillStyle = "#ffffffcc";
    tctx.font = "bold 14px sans-serif";
    tctx.textAlign = "left";
    const title = locale === "es" ? "Rio de Waypoints" : "Waypoint River";
    tctx.fillText(`${title} · ${waypoints.length} pts · ${theme}`, 12, canvas.height + 22);
    tctx.font = "12px sans-serif";
    tctx.fillText("utilihub.com", 12, canvas.height + 40);
    const url = temp.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = locale === "es" ? "rio-waypoints.png" : "waypoint-river.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    trackEvent("playground_share", { id: "waypoint-river-composer", type: "png", locale, waypoints: waypoints.length });
    updateUrl();
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
          {labels.width}
          <input type="range" min={6} max={40} step={1} value={pathWidth} onChange={(e) => setPathWidth(Number(e.target.value))} className="w-24 accent-primary" />
          <span className="w-8 text-right">{pathWidth}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.bloom}
          <input type="range" min={0} max={40} step={1} value={bloom} onChange={(e) => setBloom(Number(e.target.value))} className="w-24 accent-primary" />
          <span className="w-8 text-right">{bloom}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.gravity}
          <input type="range" min={-0.5} max={0.5} step={0.05} value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="w-24 accent-primary" />
          <span className="w-8 text-right">{gravity.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.reverse}
          <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} className="accent-primary" />
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
        <button type="button" onClick={() => setPaused(p => !p)} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          {paused ? (locale === "es" ? "Reanudar" : "Resume") : labels.pause}
        </button>
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
        <button type="button" onClick={randomize} className="min-h-[44px] rounded-full bg-primary/80 px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          {labels.random}
        </button>
        <button type="button" onClick={savePng} disabled={waypoints.length < 2} className="min-h-[44px] rounded-full bg-primary/90 px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40">
          {labels.share}
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
