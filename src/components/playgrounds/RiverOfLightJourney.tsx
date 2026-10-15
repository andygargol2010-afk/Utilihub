import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Particle = {
  t: number;
  life: number;
  size: number;
  color: string;
  bloom?: boolean;
  trail: Point[];
};
type Afterglow = {
  x: number;
  y: number;
  life: number;
  size: number;
  color: string;
};

const PALETTE = ["#00f5ff", "#7cff6b", "#ffd700", "#ff2d95", "#b388ff", "#ffffff", "#ff6b35", "#4fc3f7"];

function parseWaypoints(s: string | null): Point[] {
  if (!s) return [];
  return s
    .split(";")
    .map((pair) => {
      const [xs, ys] = pair.split(",");
      return { x: Number(xs), y: Number(ys) };
    })
    .filter((p) => !isNaN(p.x) && !isNaN(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
}

function serializeWaypoints(pts: Point[]): string {
  return pts.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(";");
}

/** Catmull-Rom spline sample along normalized t ∈ [0,1]. */
function sampleCatmullRom(path: Point[], t: number): Point {
  if (path.length === 0) return { x: 0.5, y: 0.5 };
  if (path.length === 1) return path[0];
  const n = path.length - 1;
  const clamped = Math.max(0, Math.min(0.9999, t));
  const seg = Math.min(Math.floor(clamped * n), n - 1);
  const local = clamped * n - seg;
  const p0 = path[Math.max(0, seg - 1)];
  const p1 = path[seg];
  const p2 = path[Math.min(path.length - 1, seg + 1)];
  const p3 = path[Math.min(path.length - 1, seg + 2)];
  const t2 = local * local;
  const t3 = t2 * local;
  const x =
    0.5 *
    (2 * p1.x +
      (-p0.x + p2.x) * local +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
  const y =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * local +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
  return { x, y };
}

export function RiverOfLightJourney({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waypointsRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const afterglowsRef = useRef<Afterglow[]>([]);
  const dragIndexRef = useRef<number | null>(null);
  const [waypoints, setWaypoints] = useState<Point[]>([
    { x: 0.15, y: 0.5 },
    { x: 0.35, y: 0.35 },
    { x: 0.55, y: 0.65 },
    { x: 0.8, y: 0.45 },
  ]);
  const [speed, setSpeed] = useState(0.8);
  const [density, setDensity] = useState(40);
  const [afterglow, setAfterglow] = useState(1.0);
  const [coreColor, setCoreColor] = useState(PALETTE[0]);
  const [glowColor, setGlowColor] = useState(PALETTE[1]);
  const [loop, setLoop] = useState(true);
  const [exporting, setExporting] = useState(false);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const labels = {
    en: {
      speed: "Flow speed",
      density: "Density",
      afterglow: "Afterglow",
      core: "Core",
      glow: "Glow",
      loop: "Loop",
      clear: "Clear waypoints",
      demo: "Load demo",
      export: "Snapshot PNG",
      share: "Share",
      hint: "Click to place · drag waypoints · double-click to remove. Particles flow as a glowing river with trails and persistent afterglows.",
      add: "Click canvas to add waypoint · drag to move · double-click to remove",
    },
    es: {
      speed: "Velocidad flujo",
      density: "Densidad",
      afterglow: "Resplandor",
      core: "Núcleo",
      glow: "Resplandor",
      loop: "Bucle",
      clear: "Limpiar puntos",
      demo: "Cargar demo",
      export: "Captura PNG",
      share: "Compartir",
      hint: "Clic para colocar · arrastrá puntos · doble clic para quitar. Las partículas fluyen como un río brillante con estelas y resplandores persistentes.",
      add: "Clic para agregar punto · arrastrá para mover · doble clic para quitar",
    },
  }[locale];

  useEffect(() => {
    waypointsRef.current = waypoints;
  }, [waypoints]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const w = params.get("w");
      const sp = params.get("sp");
      const d = params.get("d");
      const a = params.get("a");
      const c = params.get("c");
      const g = params.get("g");
      const l = params.get("l");
      if (w) {
        const parsed = parseWaypoints(w);
        if (parsed.length >= 2) setWaypoints(parsed);
      }
      if (sp && !isNaN(Number(sp))) setSpeed(Math.max(0.2, Math.min(2.5, Number(sp))));
      if (d && !isNaN(Number(d))) setDensity(Math.max(10, Math.min(120, Number(d))));
      if (a && !isNaN(Number(a))) setAfterglow(Math.max(0.3, Math.min(2.5, Number(a))));
      if (c && PALETTE.includes(c)) setCoreColor(c);
      if (g && PALETTE.includes(g)) setGlowColor(g);
      if (l === "0") setLoop(false);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("w", serializeWaypoints(waypoints));
    params.set("sp", speed.toFixed(2));
    params.set("d", String(density));
    params.set("a", afterglow.toFixed(2));
    params.set("c", coreColor);
    params.set("g", glowColor);
    params.set("l", loop ? "1" : "0");
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [waypoints, speed, density, afterglow, coreColor, glowColor, loop]);

  const getPathPoints = useCallback((): Point[] => {
    const pts = waypointsRef.current;
    if (pts.length < 2) return pts;
    if (loop && pts.length >= 3) return [...pts, pts[0]];
    return pts;
  }, [loop]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bg.addColorStop(0, "#0a0a1a");
    bg.addColorStop(1, "#020208");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const path = getPathPoints();

    // Persistent afterglows (soft blooms left by the river)
    afterglowsRef.current.forEach((a) => {
      const alpha = Math.max(0, a.life);
      ctx.globalAlpha = alpha * 0.45 * Math.min(1.4, afterglow);
      ctx.fillStyle = a.color;
      ctx.shadowColor = a.color;
      ctx.shadowBlur = 22 * Math.min(1.3, afterglow);
      ctx.beginPath();
      ctx.arc(a.x * w, a.y * h, a.size * (1 + (1 - alpha) * 1.2), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    if (path.length < 2) {
      path.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 6, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 16;
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      return;
    }

    // Smooth river body via sampled Catmull-Rom
    const samples: Point[] = [];
    const steps = Math.max(32, path.length * 16);
    for (let i = 0; i <= steps; i++) {
      samples.push(sampleCatmullRom(path, i / steps));
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let pass = 0; pass < 3; pass++) {
      ctx.beginPath();
      ctx.moveTo(samples[0].x * w, samples[0].y * h);
      for (let i = 1; i < samples.length; i++) {
        ctx.lineTo(samples[i].x * w, samples[i].y * h);
      }
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, coreColor);
      grad.addColorStop(1, glowColor);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = pass === 0 ? 0.18 : pass === 1 ? 0.4 : 0.92;
      ctx.lineWidth = pass === 0 ? 32 : pass === 1 ? 14 : 3.5;
      ctx.shadowColor = pass === 2 ? coreColor : glowColor;
      ctx.shadowBlur = pass === 0 ? 48 : 20;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    waypointsRef.current.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, i === 0 ? 8 : 6, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#fff" : glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw particle trails then heads
    particlesRef.current.forEach((p) => {
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x * w, p.trail[0].y * h);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x * w, p.trail[i].y * h);
        }
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = p.size * 0.7;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
      }
      const pos = p.trail[p.trail.length - 1] || sampleCatmullRom(path, p.t);
      const alpha = Math.min(1, p.life);
      ctx.globalAlpha = alpha * (p.bloom ? 0.55 : 0.95);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.bloom ? 24 : 10;
      ctx.beginPath();
      ctx.arc(pos.x * w, pos.y * h, p.size * (p.bloom ? 2 : 1), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [coreColor, glowColor, getPathPoints, afterglow]);

  useEffect(() => {
    const loopFn = (now: number) => {
      const dt = Math.min(0.05, (now - timeRef.current) / 1000);
      timeRef.current = now;

      const path = getPathPoints();
      const targetCount = density;

      particlesRef.current.forEach((p) => {
        const prevT = p.t;
        p.t = (p.t + speed * dt * 0.35) % 1;
        p.life = Math.min(1, p.life + dt * 2);

        // Organic offset
        const noise = Math.sin(now * 0.002 + p.t * 12) * 0.008;
        const base = sampleCatmullRom(path, p.t);
        const offsetPos = {
          x: Math.max(0, Math.min(1, base.x + noise)),
          y: Math.max(0, Math.min(1, base.y + Math.cos(now * 0.0015 + p.t * 9) * 0.006)),
        };
        p.trail.push(offsetPos);
        if (p.trail.length > 8) p.trail.shift();

        // Deposit afterglow along the path
        if (path.length >= 2 && Math.random() < 0.12 * speed * afterglow) {
          const pos = sampleCatmullRom(path, prevT);
          afterglowsRef.current.push({
            x: pos.x + (Math.random() - 0.5) * 0.012,
            y: pos.y + (Math.random() - 0.5) * 0.012,
            life: (0.85 + Math.random() * 0.4) * Math.min(1.6, afterglow),
            size: 2 + Math.random() * 4,
            color: Math.random() > 0.5 ? coreColor : glowColor,
          });
        }
      });

      // Fade afterglows
      afterglowsRef.current = afterglowsRef.current
        .map((a) => ({ ...a, life: a.life - dt * 0.22 / Math.max(0.6, afterglow) }))
        .filter((a) => a.life > 0.02);
      if (afterglowsRef.current.length > 420) {
        afterglowsRef.current = afterglowsRef.current.slice(-420);
      }

      while (particlesRef.current.length < targetCount && path.length >= 2) {
        particlesRef.current.push({
          t: Math.random(),
          life: 0,
          size: 1.5 + Math.random() * 2.5,
          color: Math.random() > 0.4 ? coreColor : glowColor,
          bloom: Math.random() > 0.65,
          trail: [],
        });
      }
      if (particlesRef.current.length > targetCount) {
        particlesRef.current.length = targetCount;
      }

      redraw();
      animRef.current = requestAnimationFrame(loopFn);
    };
    timeRef.current = performance.now();
    animRef.current = requestAnimationFrame(loopFn);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw, speed, density, afterglow, coreColor, glowColor, getPathPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 24, 800));
      canvas.width = sizePx;
      canvas.height = Math.round(sizePx * 0.62);
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
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  };

  const hitWaypoint = (p: Point): number => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const thresh = 14 / Math.min(canvas.width, canvas.height);
    return waypointsRef.current.findIndex((wp) => Math.hypot(wp.x - p.x, wp.y - p.y) < thresh);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const p = getPos(e);
    const hit = hitWaypoint(p);
    if (hit >= 0) {
      dragIndexRef.current = hit;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      return;
    }
    if (waypoints.length >= 16) return;
    setWaypoints((prev) => [...prev, p]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragIndexRef.current === null) return;
    e.preventDefault();
    const p = getPos(e);
    const idx = dragIndexRef.current;
    setWaypoints((prev) => prev.map((wp, i) => (i === idx ? p : wp)));
  };

  const onPointerUp = () => {
    dragIndexRef.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const p = {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
    const hit = hitWaypoint(p);
    if (hit >= 0 && waypoints.length > 2) {
      setWaypoints((prev) => prev.filter((_, i) => i !== hit));
    }
  };

  const clear = () => {
    setWaypoints([]);
    afterglowsRef.current = [];
    particlesRef.current = [];
  };

  const loadDemo = () => {
    setWaypoints([
      { x: 0.12, y: 0.55 },
      { x: 0.28, y: 0.32 },
      { x: 0.48, y: 0.68 },
      { x: 0.68, y: 0.38 },
      { x: 0.85, y: 0.58 },
    ]);
    afterglowsRef.current = [];
    particlesRef.current = [];
  };

  const exportPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `river-of-light-utilihub-${Date.now()}.png`;
      a.click();
    } finally {
      setTimeout(() => setExporting(false), 400);
    }
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], "river-of-light.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "River of Light · UtiliHub",
          text: labels.hint,
          url: window.location.href,
        });
      } else {
        await exportPng();
      }
    } catch {
      exportPng();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <label className="flex items-center gap-2">
          {labels.speed}
          <input
            type="range"
            min={0.2}
            max={2.5}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-primary"
          />
          <span className="w-8 text-right">{speed.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2">
          {labels.density}
          <input
            type="range"
            min={10}
            max={120}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-24 accent-primary"
          />
          <span className="w-8 text-right">{density}</span>
        </label>
        <label className="flex items-center gap-2">
          {labels.afterglow}
          <input
            type="range"
            min={0.3}
            max={2.5}
            step={0.1}
            value={afterglow}
            onChange={(e) => setAfterglow(Number(e.target.value))}
            className="w-24 accent-primary"
          />
          <span className="w-8 text-right">{afterglow.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="accent-primary" />
          {labels.loop}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.core}</span>
          {PALETTE.map((c) => (
            <button
              key={`core-${c}`}
              type="button"
              onClick={() => setCoreColor(c)}
              className={`h-7 w-7 rounded-full border-2 transition ${coreColor === c ? "border-white scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.glow}</span>
          {PALETTE.map((c) => (
            <button
              key={`glow-${c}`}
              type="button"
              onClick={() => setGlowColor(c)}
              className={`h-7 w-7 rounded-full border-2 transition ${glowColor === c ? "border-white scale-110" : "border-transparent"}`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clear}
          className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
        >
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={loadDemo}
          className="min-h-[44px] rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
        >
          {labels.demo}
        </button>
        <button
          type="button"
          onClick={exportPng}
          disabled={exporting}
          className="min-h-[44px] rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
        >
          {exporting ? "…" : labels.export}
        </button>
        <button
          type="button"
          onClick={share}
          className="min-h-[44px] rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          {labels.share}
        </button>
      </div>

      <div className="relative mx-auto max-w-[800px] overflow-hidden rounded-2xl border border-slate-700/40 bg-black shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none text-[10px] sm:text-xs text-white/55 px-2 text-center">
          {waypoints.length < 2 ? labels.add : labels.hint}
        </p>
      </div>
    </div>
  );
}
