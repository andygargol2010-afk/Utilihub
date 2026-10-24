import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Attractor = { x: number; y: number; strength: number };

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
    attractors: "Attractors",
    share: "Share PNG",
    help: "Click canvas to place waypoints. Drag to reorder. Particles flow along the path.",
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
    attractors: "Atractores",
    share: "Compartir PNG",
    help: "Clic en el lienzo para colocar waypoints. Arrastrá para mover. Las partículas fluyen por el camino.",
  },
} as const;

export function WaypointRiverComposer({ locale }: { locale: "en" | "es" }) {
  const t = LABELS[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waypoints, setWaypoints] = useState<Point[]>([
    { x: 0.2, y: 0.5 },
    { x: 0.4, y: 0.3 },
    { x: 0.6, y: 0.6 },
    { x: 0.8, y: 0.4 },
  ]);
  const [attractors, setAttractors] = useState<Attractor[]>([]);
  const [speed, setSpeed] = useState(1);
  const [width, setWidth] = useState(12);
  const [bloom, setBloom] = useState(0.6);
  const [density, setDensity] = useState(40);
  const [gravity, setGravity] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<"waypoint" | "attractor">("waypoint");
  const animRef = useRef<number>(0);
  const particlesRef = useRef<{ t: number; life: number }[]>([]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const { w, h } = getCanvasSize();
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { w, h } = getCanvasSize();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, w, h);

      // Path
      if (waypoints.length > 1) {
        ctx.beginPath();
        const first = toCanvas(waypoints[0]);
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < waypoints.length; i++) {
          const p = toCanvas(waypoints[i]);
          ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 + bloom * 0.4})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Bloom glow
        ctx.shadowBlur = 20 * bloom;
        ctx.shadowColor = "#66ccff";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Waypoints
      waypoints.forEach((wp, i) => {
        const p = toCanvas(wp);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "#4ade80" : i === waypoints.length - 1 ? "#f472b6" : "#60a5fa";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Attractors
      attractors.forEach((a) => {
        const p = toCanvas(a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = a.strength > 0 ? "rgba(255,100,100,0.6)" : "rgba(100,255,100,0.6)";
        ctx.fill();
      });

      // Particles along path
      if (!paused && waypoints.length > 1) {
        const totalLen = waypoints.length - 1;
        particlesRef.current.forEach((part) => {
          part.t += (speed * 0.002) % 1;
          if (part.t > 1) part.t -= 1;
          const idx = Math.floor(part.t * totalLen);
          const frac = (part.t * totalLen) % 1;
          const a = toCanvas(waypoints[idx]);
          const b = toCanvas(waypoints[Math.min(idx + 1, waypoints.length - 1)]);
          let px = a.x + (b.x - a.x) * frac;
          let py = a.y + (b.y - a.y) * frac;

          // Simple attractor influence
          attractors.forEach((at) => {
            const ap = toCanvas(at);
            const dx = ap.x - px;
            const dy = ap.y - py;
            const dist = Math.hypot(dx, dy) + 1;
            const force = (at.strength * 800) / dist;
            px += (dx / dist) * force * 0.01;
            py += (dy / dist) * force * 0.01;
          });

          // Gravity/wind
          py += gravity * 0.5;

          ctx.beginPath();
          ctx.arc(px, py, 2 + bloom, 0, Math.PI * 2);
          const hue = (part.t * 180 + Date.now() * 0.02) % 360;
          ctx.fillStyle = `hsla(${hue}, 80%, 70%, 0.9)`;
          ctx.fill();
        });

        // Maintain particle count
        while (particlesRef.current.length < density) {
          particlesRef.current.push({ t: Math.random(), life: 1 });
        }
        if (particlesRef.current.length > density) {
          particlesRef.current.length = density;
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [waypoints, attractors, speed, width, bloom, density, gravity, paused, toCanvas, getCanvasSize]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const p = fromCanvas(e.clientX - rect.left, e.clientY - rect.top);
    if (mode === "waypoint") {
      setWaypoints((prev) => [...prev, p]);
    } else {
      setAttractors((prev) => [...prev, { ...p, strength: 1 }]);
    }
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
  };

  const clearAll = () => {
    setWaypoints([{ x: 0.2, y: 0.5 }, { x: 0.8, y: 0.5 }]);
    setAttractors([]);
  };

  const sharePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "waypoint-river.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t.help}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setMode("waypoint")} className={`rounded px-3 py-1 text-sm ${mode === "waypoint" ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
          {t.place}
        </button>
        <button type="button" onClick={() => setMode("attractor")} className={`rounded px-3 py-1 text-sm ${mode === "attractor" ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
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
        <button type="button" onClick={sharePng} className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground">
          {t.share}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs">
          {t.speed}
          <input type="range" min="0.2" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-full" />
        </label>
        <label className="text-xs">
          {t.width}
          <input type="range" min="4" max="30" value={width} onChange={(e) => setWidth(+e.target.value)} className="w-full" />
        </label>
        <label className="text-xs">
          {t.bloom}
          <input type="range" min="0" max="1" step="0.05" value={bloom} onChange={(e) => setBloom(+e.target.value)} className="w-full" />
        </label>
        <label className="text-xs">
          {t.density}
          <input type="range" min="10" max="80" value={density} onChange={(e) => setDensity(+e.target.value)} className="w-full" />
        </label>
        <label className="text-xs">
          {t.gravity}
          <input type="range" min="-2" max="2" step="0.1" value={gravity} onChange={(e) => setGravity(+e.target.value)} className="w-full" />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        onClick={onCanvasClick}
        className="w-full max-w-3xl rounded-xl border border-border/70 bg-black"
        style={{ aspectRatio: "16/9", touchAction: "none" }}
      />
    </div>
  );
}
