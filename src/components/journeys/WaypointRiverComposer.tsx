import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Attractor = { x: number; y: number; strength: number };
type Particle = { t: number; trail: Point[]; hue: number };

const LABELS = {
  en: {
    place: "Place waypoint",
    drag: "Drag to move",
    clear: "Clear",
    randomize: "Randomize path",
    pause: "Pause",
    resume: "Resume",
    speed: "Speed",
    width: "Width",
    bloom: "Bloom",
    density: "Density",
    gravity: "Gravity",
    trail: "Trail",
    attractors: "Attractors",
    share: "Share PNG",
    help: "Click canvas to place waypoints. Drag existing ones to move. Particles flow with fading trails. Space = pause · R = randomize · C = clear.",
  },
  es: {
    place: "Colocar waypoint",
    drag: "Arrastrar para mover",
    clear: "Limpiar",
    randomize: "Aleatorizar camino",
    pause: "Pausar",
    resume: "Reanudar",
    speed: "Velocidad",
    width: "Ancho",
    bloom: "Bloom",
    density: "Densidad",
    gravity: "Gravedad",
    trail: "Estela",
    attractors: "Atractores",
    share: "Compartir PNG",
    help: "Clic en el lienzo para colocar waypoints. Arrastrá los existentes para mover. Las partículas fluyen con estelas que se desvanecen. Espacio = pausa · R = aleatorio · C = limpiar.",
  },
} as const;

function encodeWaypoints(wps: Point[]): string {
  return wps.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join("~");
}

function decodeWaypoints(s: string | null): Point[] | null {
  if (!s) return null;
  try {
    const parts = s.split("~").filter(Boolean);
    if (parts.length < 2) return null;
    const pts = parts.map((seg) => {
      const [xs, ys] = seg.split(",");
      const x = parseFloat(xs);
      const y = parseFloat(ys);
      if (Number.isNaN(x) || Number.isNaN(y)) return null;
      return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    });
    if (pts.some((p) => !p)) return null;
    return pts as Point[];
  } catch {
    return null;
  }
}

export function WaypointRiverComposer({ locale }: { locale: "en" | "es" }) {
  const t = LABELS[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waypoints, setWaypoints] = useState<Point[]>(() => {
    if (typeof window === "undefined") {
      return [
        { x: 0.2, y: 0.5 },
        { x: 0.4, y: 0.3 },
        { x: 0.6, y: 0.6 },
        { x: 0.8, y: 0.4 },
      ];
    }
    const params = new URLSearchParams(window.location.search);
    const decoded = decodeWaypoints(params.get("wp"));
    return (
      decoded ?? [
        { x: 0.2, y: 0.5 },
        { x: 0.4, y: 0.3 },
        { x: 0.6, y: 0.6 },
        { x: 0.8, y: 0.4 },
      ]
    );
  });
  const [attractors, setAttractors] = useState<Attractor[]>([]);
  const [speed, setSpeed] = useState(1);
  const [width, setWidth] = useState(12);
  const [bloom, setBloom] = useState(0.6);
  const [density, setDensity] = useState(40);
  const [gravity, setGravity] = useState(0);
  const [trailLen, setTrailLen] = useState(12);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<"waypoint" | "attractor">("waypoint");
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const dragIdxRef = useRef<number | null>(null);
  const waypointsRef = useRef(waypoints);
  waypointsRef.current = waypoints;

  // Sync URL deep-link when waypoints change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("wp", encodeWaypoints(waypoints));
    window.history.replaceState({}, "", url.toString());
  }, [waypoints]);

  const getCanvasSize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return { w: 600, h: 400 };
    const rect = c.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }, []);

  const toCanvas = useCallback(
    (p: Point) => {
      const { w, h } = getCanvasSize();
      return { x: p.x * w, y: p.y * h };
    },
    [getCanvasSize],
  );

  const fromCanvas = useCallback(
    (x: number, y: number): Point => {
      const { w, h } = getCanvasSize();
      return { x: Math.max(0, Math.min(1, x / w)), y: Math.max(0, Math.min(1, y / h)) };
    },
    [getCanvasSize],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === "r" || e.key === "R") {
        randomize();
      } else if (e.key === "c" || e.key === "C") {
        clearAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const { w, h } = getCanvasSize();
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { w, h } = getCanvasSize();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      const wps = waypointsRef.current;

      // Path
      if (wps.length > 1) {
        ctx.beginPath();
        const first = toCanvas(wps[0]);
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < wps.length; i++) {
          const p = toCanvas(wps[i]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(100, 200, 255, ${0.25 + bloom * 0.35})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Bloom glow
        if (bloom > 0.05) {
          ctx.shadowBlur = 18 * bloom;
          ctx.shadowColor = "#66ccff";
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Waypoints
      wps.forEach((wp, i) => {
        const p = toCanvas(wp);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "#4ade80" : i === wps.length - 1 ? "#f472b6" : "#60a5fa";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Attractors
      attractors.forEach((a) => {
        const p = toCanvas(a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = a.strength > 0 ? "rgba(255,100,100,0.55)" : "rgba(100,255,100,0.55)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Particles + fading trails
      if (!paused && wps.length > 1) {
        const totalLen = wps.length - 1;
        particlesRef.current.forEach((part) => {
          part.t = (part.t + speed * 0.0018) % 1;
          const idx = Math.floor(part.t * totalLen);
          const frac = (part.t * totalLen) % 1;
          const a = toCanvas(wps[idx]);
          const b = toCanvas(wps[Math.min(idx + 1, wps.length - 1)]);
          let px = a.x + (b.x - a.x) * frac;
          let py = a.y + (b.y - a.y) * frac;

          // Attractor influence
          attractors.forEach((at) => {
            const ap = toCanvas(at);
            const dx = ap.x - px;
            const dy = ap.y - py;
            const dist = Math.hypot(dx, dy) + 1;
            const force = (at.strength * 600) / dist;
            px += (dx / dist) * force * 0.012;
            py += (dy / dist) * force * 0.012;
          });

          py += gravity * 0.45;

          // Trail history
          part.trail.push({ x: px, y: py });
          if (part.trail.length > trailLen) part.trail.shift();

          // Draw trail (oldest = most faded)
          if (part.trail.length > 1) {
            for (let i = 1; i < part.trail.length; i++) {
              const alpha = (i / part.trail.length) * 0.55;
              const prev = part.trail[i - 1];
              const cur = part.trail[i];
              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(cur.x, cur.y);
              ctx.strokeStyle = `hsla(${part.hue}, 80%, 65%, ${alpha})`;
              ctx.lineWidth = 1.5 + bloom * 1.5;
              ctx.stroke();
            }
          }

          // Head
          ctx.beginPath();
          ctx.arc(px, py, 2.2 + bloom * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${part.hue}, 85%, 72%, 0.95)`;
          ctx.fill();
        });

        while (particlesRef.current.length < density) {
          particlesRef.current.push({
            t: Math.random(),
            trail: [],
            hue: Math.random() * 360,
          });
        }
        if (particlesRef.current.length > density) {
          particlesRef.current.length = density;
        }
      } else if (paused) {
        // Still draw existing trails while paused
        particlesRef.current.forEach((part) => {
          if (part.trail.length > 1) {
            for (let i = 1; i < part.trail.length; i++) {
              const alpha = (i / part.trail.length) * 0.55;
              const prev = part.trail[i - 1];
              const cur = part.trail[i];
              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(cur.x, cur.y);
              ctx.strokeStyle = `hsla(${part.hue}, 80%, 65%, ${alpha})`;
              ctx.lineWidth = 1.5 + bloom * 1.5;
              ctx.stroke();
            }
            const head = part.trail[part.trail.length - 1];
            ctx.beginPath();
            ctx.arc(head.x, head.y, 2.2 + bloom * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${part.hue}, 85%, 72%, 0.95)`;
            ctx.fill();
          }
        });
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [attractors, speed, width, bloom, density, gravity, trailLen, paused, toCanvas, getCanvasSize]);

  const hitTestWaypoint = (cx: number, cy: number): number => {
    const wps = waypointsRef.current;
    for (let i = 0; i < wps.length; i++) {
      const p = toCanvas(wps[i]);
      if (Math.hypot(p.x - cx, p.y - cy) < 14) return i;
    }
    return -1;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const idx = hitTestWaypoint(cx, cy);
    if (idx >= 0) {
      dragIdxRef.current = idx;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }
    const p = fromCanvas(cx, cy);
    if (mode === "waypoint") {
      setWaypoints((prev) => [...prev, p]);
    } else {
      setAttractors((prev) => [...prev, { ...p, strength: 1 }]);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragIdxRef.current === null) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const p = fromCanvas(e.clientX - rect.left, e.clientY - rect.top);
    setWaypoints((prev) => {
      const next = [...prev];
      next[dragIdxRef.current!] = p;
      return next;
    });
  };

  const onPointerUp = () => {
    dragIdxRef.current = null;
  };

  const randomize = () => {
    const n = 4 + Math.floor(Math.random() * 4);
    setWaypoints(
      Array.from({ length: n }, () => ({
        x: 0.1 + Math.random() * 0.8,
        y: 0.15 + Math.random() * 0.7,
      })),
    );
    setAttractors([]);
    particlesRef.current = [];
  };

  const clearAll = () => {
    setWaypoints([
      { x: 0.2, y: 0.5 },
      { x: 0.8, y: 0.5 },
    ]);
    setAttractors([]);
    particlesRef.current = [];
  };

  const sharePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, 0, 0);
    // Baked title + branding
    const dpr = devicePixelRatio || 1;
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const { w } = getCanvasSize();
    octx.fillStyle = "rgba(0,0,0,0.55)";
    octx.fillRect(0, 0, w, 36);
    octx.fillStyle = "#e0f2fe";
    octx.font = "bold 14px system-ui, sans-serif";
    const title = locale === "es" ? "Compositor Río de Waypoints" : "Waypoint River Composer";
    octx.fillText(title, 12, 22);
    octx.font = "12px system-ui, sans-serif";
    octx.fillStyle = "#94a3b8";
    octx.fillText(`utilihub.com · ${waypoints.length} waypoints`, 12, 48);
    const link = document.createElement("a");
    link.download = "waypoint-river.png";
    link.href = off.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t.help}</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("waypoint")}
          className={`rounded px-3 py-1 text-sm ${
            mode === "waypoint" ? "bg-primary text-primary-foreground" : "bg-accent"
          }`}
        >
          {t.place}
        </button>
        <button
          type="button"
          onClick={() => setMode("attractor")}
          className={`rounded px-3 py-1 text-sm ${
            mode === "attractor" ? "bg-primary text-primary-foreground" : "bg-accent"
          }`}
        >
          {t.attractors}
        </button>
        <button type="button" onClick={randomize} className="rounded bg-accent px-3 py-1 text-sm">
          {t.randomize}
        </button>
        <button type="button" onClick={clearAll} className="rounded bg-accent px-3 py-1 text-sm">
          {t.clear}
        </button>
        <button type="button" onClick={() => setPaused((p) => !p)} className="rounded bg-accent px-3 py-1 text-sm">
          {paused ? t.resume : t.pause}
        </button>
        <button
          type="button"
          onClick={sharePng}
          className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
        >
          {t.share}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs">
          {t.speed}
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-xs">
          {t.width}
          <input
            type="range"
            min="4"
            max="30"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-xs">
          {t.bloom}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={bloom}
            onChange={(e) => setBloom(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-xs">
          {t.density}
          <input
            type="range"
            min="10"
            max="80"
            value={density}
            onChange={(e) => setDensity(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-xs">
          {t.gravity}
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={gravity}
            onChange={(e) => setGravity(+e.target.value)}
            className="w-full"
          />
        </label>
        <label className="text-xs">
          {t.trail}
          <input
            type="range"
            min="4"
            max="24"
            value={trailLen}
            onChange={(e) => setTrailLen(+e.target.value)}
            className="w-full"
          />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="w-full max-w-3xl rounded-xl border border-border/70 bg-black"
        style={{ aspectRatio: "16/9", touchAction: "none" }}
      />
    </div>
  );
}
