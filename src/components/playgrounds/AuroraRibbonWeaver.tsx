"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";
type Point = { x: number; y: number };
type Path = { points: Point[]; hueBase: number };

interface Particle {
  pathIndex: number;
  ribbonIndex: number;
  t: number; // 0..1 along path
  speed: number;
  size: number;
  hueOffset: number;
}

const AURORA_HUES = [180, 200, 220, 260, 300, 320, 140, 160];

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
      export: "Share PNG",
      help: "Draw freehand paths. Each becomes multi-ribbon aurora streams that flow with bloom and particles. Distinct ribbon-weaving composition.",
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
      export: "Compartir PNG",
      help: "Dibujá caminos a mano alzada. Cada uno se convierte en flujos multi-cinta aurora con bloom y partículas. Composición de tejido de cintas distintiva.",
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

      // Draw ribbons
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
          // Bloom layers
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

      // Drawing preview
      if (drawingRef.current && drawingRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(drawingRef.current[0].x, drawingRef.current[0].y);
        for (const p of drawingRef.current) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Particles
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

  const clear = () => {
    pathsRef.current = [];
    particlesRef.current = [];
    drawingRef.current = null;
    setPathCount(0);
  };

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(canvas, 0, 0);
    // Branding
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
          <button type="button" onClick={clear} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">{labels.clear}</button>
          <button type="button" onClick={togglePause} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold">{paused ? labels.resume : labels.pause}</button>
          <button type="button" onClick={exportPng} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">{labels.export}</button>
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-3">{labels.help}</p>
      </div>
    </div>
  );
}
