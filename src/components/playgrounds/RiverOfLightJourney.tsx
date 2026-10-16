import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Particle = {
  t: number; // progress 0..1 along path
  speed: number;
  size: number;
  life: number;
  color: string;
};

const PALETTE = ["#00f5ff", "#7cff6b", "#ffd700", "#ff2d95", "#b388ff", "#ffffff", "#ff6b35", "#4fc3f7"];

export function RiverOfLightJourney({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waypointsRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const [waypoints, setWaypoints] = useState<Point[]>([]);
  const [speed, setSpeed] = useState(0.8);
  const [density, setDensity] = useState(80);
  const [coreColor, setCoreColor] = useState(PALETTE[0]);
  const [glowColor, setGlowColor] = useState(PALETTE[1]);
  const [loop, setLoop] = useState(true);
  const [exporting, setExporting] = useState(false);
  const animRef = useRef<number>(0);

  const labels = {
    en: {
      speed: "Flow speed",
      density: "Particle density",
      core: "Core color",
      glow: "Glow color",
      loop: "Loop path",
      clear: "Clear waypoints",
      demo: "Load demo river",
      export: "Snapshot PNG",
      share: "Share",
      hint: "Click to place waypoints — particles flow between them leaving persistent afterglows",
    },
    es: {
      speed: "Velocidad de flujo",
      density: "Densidad de partículas",
      core: "Color núcleo",
      glow: "Color resplandor",
      loop: "Bucle de camino",
      clear: "Limpiar puntos",
      demo: "Cargar río demo",
      export: "Captura PNG",
      share: "Compartir",
      hint: "Hacé clic para colocar puntos de paso — las partículas fluyen entre ellos dejando resplandores persistentes",
    },
  }[locale];

  // Load from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const w = params.get("w");
      if (w) {
        const pts = w.split(";").map((p) => {
          const [x, y] = p.split(",").map(Number);
          return { x, y };
        }).filter((p) => !isNaN(p.x) && !isNaN(p.y));
        if (pts.length) {
          waypointsRef.current = pts;
          setWaypoints(pts);
        }
      }
      const s = params.get("s");
      const d = params.get("d");
      const c = params.get("c");
      const g = params.get("g");
      const l = params.get("l");
      if (s && !isNaN(Number(s))) setSpeed(Math.max(0.1, Math.min(3, Number(s))));
      if (d && !isNaN(Number(d))) setDensity(Math.max(20, Math.min(200, Number(d))));
      if (c && PALETTE.includes(c)) setCoreColor(c);
      if (g && PALETTE.includes(g)) setGlowColor(g);
      if (l === "0") setLoop(false);
    } catch {}
  }, []);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (waypoints.length) {
      params.set("w", waypoints.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(";"));
    } else {
      params.delete("w");
    }
    params.set("s", speed.toFixed(2));
    params.set("d", String(density));
    params.set("c", coreColor);
    params.set("g", glowColor);
    params.set("l", loop ? "1" : "0");
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [waypoints, speed, density, coreColor, glowColor, loop]);

  const getPathLength = useCallback(() => {
    const pts = waypointsRef.current;
    if (pts.length < 2) return 0;
    let len = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i + 1].x - pts[i].x;
      const dy = pts[i + 1].y - pts[i].y;
      len += Math.hypot(dx, dy);
    }
    if (loop && pts.length > 2) {
      const dx = pts[0].x - pts[pts.length - 1].x;
      const dy = pts[0].y - pts[pts.length - 1].y;
      len += Math.hypot(dx, dy);
    }
    return len;
  }, [loop]);

  const pointAt = useCallback((t: number): Point | null => {
    const pts = waypointsRef.current;
    if (pts.length < 2) return null;
    const total = getPathLength();
    if (total <= 0) return pts[0];
    let target = (t % 1) * total;
    if (target < 0) target += total;
    let acc = 0;
    const segs = loop && pts.length > 2 ? pts.length : pts.length - 1;
    for (let i = 0; i < segs; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const seg = Math.hypot(b.x - a.x, b.y - a.y);
      if (acc + seg >= target) {
        const u = (target - acc) / (seg || 1);
        return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
      }
      acc += seg;
    }
    return pts[pts.length - 1];
  }, [loop, getPathLength]);

  const spawnRiver = useCallback(() => {
    const n = Math.max(20, Math.min(200, density));
    particlesRef.current = Array.from({ length: n }, (_, i) => ({
      t: i / n,
      speed: 0.0008 * speed * (0.7 + Math.random() * 0.6),
      size: 1.5 + Math.random() * 3.5,
      life: 1,
      color: Math.random() > 0.45 ? coreColor : glowColor,
    }));
  }, [density, speed, coreColor, glowColor]);

  useEffect(() => {
    spawnRiver();
  }, [spawnRiver, waypoints.length]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Dark field with subtle vignette
    const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
    bg.addColorStop(0, "#0a0a1a");
    bg.addColorStop(1, "#020208");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const pts = waypointsRef.current;
    if (pts.length >= 2) {
      // Soft bloom path underlay
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x * w, pts[0].y * h);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x * w, pts[i].y * h);
      if (loop && pts.length > 2) ctx.lineTo(pts[0].x * w, pts[0].y * h);
      ctx.strokeStyle = glowColor;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 18;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 28;
      ctx.stroke();
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 36;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Waypoint markers
    pts.forEach((p, i) => {
      const px = p.x * w;
      const py = p.y * h;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = coreColor;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = coreColor;
      ctx.fill();
      ctx.fillStyle = "#ffffffaa";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(i + 1), px, py - 12);
    });

    // Particles + afterglow
    particlesRef.current.forEach((p) => {
      const pos = pointAt(p.t);
      if (!pos) return;
      const px = pos.x * w;
      const py = pos.y * h;
      const alpha = Math.min(1, p.life);
      // Afterglow bloom
      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 4, 0, Math.PI * 2);
      ctx.fill();
      // Core
      ctx.globalAlpha = alpha * 0.95;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, p.size * 1.4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [coreColor, glowColor, loop, pointAt]);

  useEffect(() => {
    const loopAnim = () => {
      const pts = waypointsRef.current;
      if (pts.length >= 2) {
        particlesRef.current = particlesRef.current.map((p) => {
          let nt = p.t + p.speed;
          if (nt >= 1) nt -= 1;
          return { ...p, t: nt, life: Math.min(1, p.life + 0.01) };
        });
      }
      redraw();
      animRef.current = requestAnimationFrame(loopAnim);
    };
    animRef.current = requestAnimationFrame(loopAnim);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 24, 760));
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
      x: Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0.02, Math.min(0.98, (e.clientY - rect.top) / rect.height)),
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

  const loadDemo = () => {
    const demo: Point[] = [
      { x: 0.15, y: 0.65 },
      { x: 0.32, y: 0.38 },
      { x: 0.5, y: 0.55 },
      { x: 0.68, y: 0.32 },
      { x: 0.85, y: 0.58 },
    ];
    waypointsRef.current = demo;
    setWaypoints(demo);
    setLoop(true);
    setDensity(110);
    setSpeed(1.1);
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
          title: locale === "es" ? "Río de Luz · UtiliHub" : "River of Light · UtiliHub",
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
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.speed}
          <input
            type="range"
            min={0.2}
            max={2.5}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-cyan-500"
          />
          <span className="w-8 text-right">{speed.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.density}
          <input
            type="range"
            min={30}
            max={180}
            step={5}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-24 accent-cyan-500"
          />
          <span className="w-8 text-right">{density}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="accent-cyan-500" />
          {labels.loop}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
        <button type="button" onClick={clear} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          {labels.clear}
        </button>
        <button type="button" onClick={loadDemo} className="min-h-[44px] rounded-full bg-cyan-800 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700">
          {labels.demo}
        </button>
        <button type="button" onClick={exportPng} disabled={exporting} className="min-h-[44px] rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60">
          {exporting ? "…" : labels.export}
        </button>
        <button type="button" onClick={share} className="min-h-[44px] rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
          {labels.share}
        </button>
      </div>

      <div className="relative mx-auto max-w-[760px] overflow-hidden rounded-2xl border border-slate-700/40 bg-black shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none text-[10px] sm:text-xs text-white/55 px-2 text-center">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
