import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Particle = {
  t: number;
  life: number;
  size: number;
  color: string;
  bloom?: boolean;
};

const PALETTE = ["#00f5ff", "#7cff6b", "#ffd700", "#ff2d95", "#b388ff", "#ffffff", "#ff6b35", "#4fc3f7"];

function parseWaypoints(s: string | null): Point[] {
  if (!s) return [];
  return s.split(";").map((pair) => {
    const [xs, ys] = pair.split(",");
    return { x: Number(xs), y: Number(ys) };
  }).filter((p) => !isNaN(p.x) && !isNaN(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1);
}

function serializeWaypoints(pts: Point[]): string {
  return pts.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(";");
}

export function RiverOfLightJourney({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waypointsRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const [waypoints, setWaypoints] = useState<Point[]>([
    { x: 0.15, y: 0.5 },
    { x: 0.35, y: 0.35 },
    { x: 0.55, y: 0.65 },
    { x: 0.8, y: 0.45 },
  ]);
  const [speed, setSpeed] = useState(0.8);
  const [density, setDensity] = useState(40);
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
      core: "Core",
      glow: "Glow",
      loop: "Loop",
      clear: "Clear waypoints",
      export: "Snapshot PNG",
      share: "Share",
      hint: "Click to place waypoints. Particles flow as a glowing river with afterglows.",
      add: "Click canvas to add waypoint",
    },
    es: {
      speed: "Velocidad flujo",
      density: "Densidad",
      core: "Núcleo",
      glow: "Resplandor",
      loop: "Bucle",
      clear: "Limpiar puntos",
      export: "Captura PNG",
      share: "Compartir",
      hint: "Hacé clic para colocar puntos. Las partículas fluyen como un río brillante con resplandores.",
      add: "Clic en el canvas para agregar punto",
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
      const c = params.get("c");
      const g = params.get("g");
      const l = params.get("l");
      if (w) {
        const parsed = parseWaypoints(w);
        if (parsed.length >= 2) setWaypoints(parsed);
      }
      if (sp && !isNaN(Number(sp))) setSpeed(Math.max(0.2, Math.min(2.5, Number(sp))));
      if (d && !isNaN(Number(d))) setDensity(Math.max(10, Math.min(120, Number(d))));
      if (c && PALETTE.includes(c)) setCoreColor(c);
      if (g && PALETTE.includes(g)) setGlowColor(g);
      if (l === "0") setLoop(false);
    } catch {}
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("w", serializeWaypoints(waypoints));
    params.set("sp", speed.toFixed(2));
    params.set("d", String(density));
    params.set("c", coreColor);
    params.set("g", glowColor);
    params.set("l", loop ? "1" : "0");
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [waypoints, speed, density, coreColor, glowColor, loop]);

  const getPathPoints = useCallback((): Point[] => {
    const pts = waypointsRef.current;
    if (pts.length < 2) return pts;
    if (loop && pts.length >= 3) return [...pts, pts[0]];
    return pts;
  }, [loop]);

  const interpolate = useCallback((t: number, path: Point[]): Point => {
    if (path.length < 2) return path[0] || { x: 0.5, y: 0.5 };
    const total = path.length - 1;
    const seg = Math.min(Math.floor(t * total), total - 1);
    const local = (t * total) - seg;
    const a = path[seg];
    const b = path[seg + 1];
    return {
      x: a.x + (b.x - a.x) * local,
      y: a.y + (b.y - a.y) * local,
    };
  }, []);

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

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let pass = 0; pass < 3; pass++) {
      ctx.beginPath();
      ctx.moveTo(path[0].x * w, path[0].y * h);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * w, path[i].y * h);
      }
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, coreColor);
      grad.addColorStop(1, glowColor);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = pass === 0 ? 0.15 : pass === 1 ? 0.35 : 0.9;
      ctx.lineWidth = (pass === 0 ? 28 : pass === 1 ? 12 : 3);
      ctx.shadowColor = pass === 2 ? coreColor : glowColor;
      ctx.shadowBlur = pass === 0 ? 40 : 18;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    waypointsRef.current.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, i === 0 ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#fff" : glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    particlesRef.current.forEach((p) => {
      const pos = interpolate(p.t, path);
      const alpha = Math.min(1, p.life);
      ctx.globalAlpha = alpha * (p.bloom ? 0.5 : 0.9);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.bloom ? 20 : 8;
      ctx.beginPath();
      ctx.arc(pos.x * w, pos.y * h, p.size * (p.bloom ? 1.8 : 1), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [coreColor, glowColor, getPathPoints, interpolate]);

  useEffect(() => {
    const loopFn = (now: number) => {
      const dt = Math.min(0.05, (now - timeRef.current) / 1000);
      timeRef.current = now;

      const path = getPathPoints();
      const targetCount = density;

      particlesRef.current.forEach((p) => {
        p.t = (p.t + speed * dt * 0.35) % 1;
        p.life = Math.min(1, p.life + dt * 2);
      });

      while (particlesRef.current.length < targetCount && path.length >= 2) {
        particlesRef.current.push({
          t: Math.random(),
          life: 0,
          size: 1.5 + Math.random() * 2.5,
          color: Math.random() > 0.4 ? coreColor : glowColor,
          bloom: Math.random() > 0.7,
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
  }, [redraw, speed, density, coreColor, glowColor, getPathPoints]);

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

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (waypoints.length >= 16) return;
    const p = getPos(e);
    setWaypoints((prev) => [...prev, p]);
  };

  const clear = () => setWaypoints([]);

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
              key={c}
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
              key={c}
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
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none text-[10px] sm:text-xs text-white/55 px-2 text-center">
          {waypoints.length < 2 ? labels.add : labels.hint}
        </p>
      </div>
    </div>
  );
}
