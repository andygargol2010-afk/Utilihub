"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";
type Point = { x: number; y: number };
type Path = { points: Point[]; hueBase: number };

interface Particle {
  pathIndex: number;
  ribbonIndex: number;
  t: number;
  speed: number;
  size: number;
  hueOffset: number;
}

const AURORA_HUES = [180, 200, 220, 260, 300, 320, 140, 160];
const STORAGE_KEY = "utilihub_aurora_ribbon_weaver_v1";

export function AuroraRibbonWeaver({ locale = "en" }: { locale?: Locale }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "aurora-ribbon-weaver", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<Path[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const drawingRef = useRef<Point[] | null>(null);
  const rafRef = useRef(0);
  const pausedRef = useRef(false);

  const [ribbonCount, setRibbonCount] = useState(5);
  const [width, setWidth] = useState(4);
  const [speed, setSpeed] = useState(1);
  const [density, setDensity] = useState(40);
  const [bloom, setBloom] = useState(1.2);
  const [pathCount, setPathCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const loadedRef = useRef(false);

  const labels = {
    en: {
      ribbons: "Ribbons per path",
      width: "Ribbon width",
      speed: "Flow speed",
      density: "Particle density",
      bloom: "Aurora bloom",
      clear: "Clear",
      pause: "Pause",
      resume: "Resume",
      randomize: "Randomize",
      export: "Share PNG",
      help: "Draw freehand paths or press R to randomize. Space pauses, C clears. Composition persists and deep-links via URL. Multi-ribbon aurora streams with bloom.",
      count: "Paths",
    },
    es: {
      ribbons: "Cintas por camino",
      width: "Ancho de cinta",
      speed: "Velocidad de flujo",
      density: "Densidad de partículas",
      bloom: "Bloom aurora",
      clear: "Limpiar",
      pause: "Pausar",
      resume: "Reanudar",
      randomize: "Aleatorio",
      export: "Compartir PNG",
      help: "Dibujá caminos a mano alzada o presioná R para aleatorizar. Espacio pausa, C limpia. La composición persiste y se puede deep-linkear por URL. Flujos multi-cinta aurora con bloom.",
      count: "Caminos",
    },
  }[locale];

  const initParticles = useCallback(() => {
    const ps: Particle[] = [];
    const n = Math.min(density, 80);
    for (let i = 0; i < n; i++) {
      if (pathsRef.current.length === 0) break;
      ps.push({
        pathIndex: Math.floor(Math.random() * pathsRef.current.length),
        ribbonIndex: Math.floor(Math.random() * ribbonCount),
        t: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        size: 1.2 + Math.random() * 2,
        hueOffset: Math.random() * 40 - 20,
      });
    }
    particlesRef.current = ps;
  }, [density, ribbonCount]);

  useEffect(() => {
    initParticles();
  }, [pathCount, density, ribbonCount, initParticles]);

  // Load from URL deep-link or localStorage on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    try {
      const params = new URLSearchParams(window.location.search);
      const arp = params.get("arp");
      if (arp) {
        const decoded = JSON.parse(atob(arp));
        if (decoded.paths && Array.isArray(decoded.paths)) {
          pathsRef.current = decoded.paths;
          setPathCount(decoded.paths.length);
          if (typeof decoded.ribbonCount === "number") setRibbonCount(decoded.ribbonCount);
          if (typeof decoded.width === "number") setWidth(decoded.width);
          if (typeof decoded.speed === "number") setSpeed(decoded.speed);
          if (typeof decoded.density === "number") setDensity(decoded.density);
          if (typeof decoded.bloom === "number") setBloom(decoded.bloom);
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.paths && Array.isArray(data.paths)) {
          pathsRef.current = data.paths;
          setPathCount(data.paths.length);
          if (typeof data.ribbonCount === "number") setRibbonCount(data.ribbonCount);
          if (typeof data.width === "number") setWidth(data.width);
          if (typeof data.speed === "number") setSpeed(data.speed);
          if (typeof data.density === "number") setDensity(data.density);
          if (typeof data.bloom === "number") setBloom(data.bloom);
        }
      }
    } catch {}
  }, []);

  // Persist to localStorage and update URL deep-link
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      const payload = {
        paths: pathsRef.current,
        ribbonCount,
        width,
        speed,
        density,
        bloom,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      // Keep URL short: only include if paths exist and not too large
      const json = JSON.stringify(payload);
      if (json.length < 1800) {
        const encoded = btoa(json);
        const url = new URL(window.location.href);
        if (pathsRef.current.length > 0) {
          url.searchParams.set("arp", encoded);
        } else {
          url.searchParams.delete("arp");
        }
        window.history.replaceState({}, "", url.toString());
      }
    } catch {}
  }, [pathCount, ribbonCount, width, speed, density, bloom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const getPos = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
        y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      drawingRef.current = [getPos(e)];
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const p = getPos(e);
      const last = drawingRef.current[drawingRef.current.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 3) {
        drawingRef.current.push(p);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (drawingRef.current && drawingRef.current.length > 4) {
        pathsRef.current.push({
          points: drawingRef.current,
          hueBase: AURORA_HUES[pathsRef.current.length % AURORA_HUES.length],
        });
        setPathCount(pathsRef.current.length);
      }
      drawingRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const loop = () => {
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.fillStyle = "#040814";
      ctx.fillRect(0, 0, w, h);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const path of pathsRef.current) {
        const pts = path.points;
        if (pts.length < 2) continue;
        for (let r = 0; r < ribbonCount; r++) {
          const offset = (r - (ribbonCount - 1) / 2) * (width * 1.8);
          const hue = (path.hueBase + r * 18) % 360;
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            let nx = 0, ny = 0;
            if (i < pts.length - 1) {
              const dx = pts[i + 1].x - p.x;
              const dy = pts[i + 1].y - p.y;
              const len = Math.hypot(dx, dy) || 1;
              nx = -dy / len;
              ny = dx / len;
            } else if (i > 0) {
              const dx = p.x - pts[i - 1].x;
              const dy = p.y - pts[i - 1].y;
              const len = Math.hypot(dx, dy) || 1;
              nx = -dy / len;
              ny = dx / len;
            }
            const x = p.x + nx * offset;
            const y = p.y + ny * offset;
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.strokeStyle = `hsla(${hue}, 85%, 70%, ${0.12 * bloom})`;
          ctx.lineWidth = width * 5 * bloom;
          ctx.stroke();
          ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${0.45 * bloom})`;
          ctx.lineWidth = width * 1.8;
          ctx.stroke();
          ctx.strokeStyle = `hsla(${hue}, 95%, 75%, 0.9)`;
          ctx.lineWidth = Math.max(1, width * 0.6);
          ctx.stroke();
        }
      }

      if (drawingRef.current && drawingRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(drawingRef.current[0].x, drawingRef.current[0].y);
        for (const p of drawingRef.current) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "lighter";
      for (const p of particlesRef.current) {
        const path = pathsRef.current[p.pathIndex];
        if (!path || path.points.length < 2) continue;
        const pts = path.points;
        const idx = Math.min(pts.length - 2, Math.floor(p.t * (pts.length - 1)));
        const frac = (p.t * (pts.length - 1)) - idx;
        const a = pts[idx];
        const b = pts[idx + 1];
        const baseX = a.x + (b.x - a.x) * frac;
        const baseY = a.y + (b.y - a.y) * frac;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const offset = (p.ribbonIndex - (ribbonCount - 1) / 2) * (width * 1.8);
        const x = baseX + nx * offset;
        const y = baseY + ny * offset;

        const hue = (path.hueBase + p.ribbonIndex * 18 + p.hueOffset) % 360;
        ctx.beginPath();
        ctx.arc(x, y, p.size * bloom, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 75%, 0.7)`;
        ctx.fill();

        p.t += p.speed * speed;
        if (p.t > 1) p.t = 0;
      }
      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [ribbonCount, width, speed, bloom]);

  const clear = useCallback(() => {
    pathsRef.current = [];
    particlesRef.current = [];
    drawingRef.current = null;
    setPathCount(0);
  }, []);

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  const randomize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const newPaths: Path[] = [];
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const points: Point[] = [];
      let x = 40 + Math.random() * (w - 80);
      let y = 40 + Math.random() * (h - 80);
      const steps = 18 + Math.floor(Math.random() * 22);
      for (let j = 0; j < steps; j++) {
        x += (Math.random() - 0.5) * 48;
        y += (Math.random() - 0.5) * 36;
        x = Math.max(16, Math.min(w - 16, x));
        y = Math.max(16, Math.min(h - 16, y));
        points.push({ x: Math.round(x), y: Math.round(y) });
      }
      newPaths.push({
        points,
        hueBase: AURORA_HUES[i % AURORA_HUES.length],
      });
    }
    pathsRef.current = newPaths;
    setPathCount(newPaths.length);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "c" || e.key === "C") {
        clear();
      } else if (e.key === "r" || e.key === "R") {
        randomize();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear, togglePause, randomize]);

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, 0, 0);
    octx.fillStyle = "rgba(0,0,0,0.55)";
    octx.fillRect(0, off.height - 48, off.width, 48);
    octx.fillStyle = "#fff";
    octx.font = "bold 18px system-ui, sans-serif";
    octx.fillText("Aurora Ribbon Weaver", 16, off.height - 28);
    octx.font = "14px system-ui, sans-serif";
    octx.fillText(`utilihub.com · ${pathCount} paths`, 16, off.height - 10);
    const url = off.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `aurora-ribbon-weaver-utilihub-${Date.now()}.png`;
    a.click();
    trackEvent("share_png", { id: "aurora-ribbon-weaver", locale, paths: pathCount });
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#040814] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block", touchAction: "none" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {labels.count}: {pathCount}
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{labels.ribbons} ({ribbonCount})</span>
          <input type="range" min={3} max={8} step={1} value={ribbonCount} onChange={(e) => setRibbonCount(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{labels.width} ({width.toFixed(1)})</span>
          <input type="range" min={2} max={10} step={0.5} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{labels.speed} ({speed.toFixed(2)})</span>
          <input type="range" min={0.3} max={2.5} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{labels.density} ({density})</span>
          <input type="range" min={10} max={80} step={5} value={density} onChange={(e) => setDensity(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{labels.bloom} ({bloom.toFixed(1)})</span>
          <input type="range" min={0.5} max={2.5} step={0.1} value={bloom} onChange={(e) => setBloom(Number(e.target.value))} className="accent-primary" />
        </label>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">
          <button type="button" onClick={randomize} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">{labels.randomize}</button>
          <button type="button" onClick={clear} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">{labels.clear}</button>
          <button type="button" onClick={togglePause} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">{paused ? labels.resume : labels.pause}</button>
          <button type="button" onClick={exportPng} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">{labels.export}</button>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-3">{labels.help}</p>
      </div>
    </div>
  );
}
