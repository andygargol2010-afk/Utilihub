"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";
type Point = { x: number; y: number };
type Ribbon = Point[];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hueOffset: number;
  trail: Point[];
}

const THEMES = {
  aurora: { bg: "#050816", hues: [180, 220, 260, 300], ribbon: "rgba(160,210,255,0.55)" },
  solar: { bg: "#1a0a05", hues: [20, 40, 60, 10], ribbon: "rgba(255,180,80,0.5)" },
  neon: { bg: "#0a0514", hues: [300, 320, 180, 140], ribbon: "rgba(255,100,220,0.5)" },
  ocean: { bg: "#051018", hues: [190, 200, 210, 170], ribbon: "rgba(100,200,255,0.5)" },
};

const labels = {
  en: {
    count: "Particle count",
    strength: "Attraction strength",
    speed: "Flow speed",
    trail: "Trail length",
    theme: "Color theme",
    clear: "Clear ribbons",
    reset: "Reset particles",
    undo: "Undo last ribbon",
    help: "Draw freeform ribbons. Particles are pulled toward them and leave glowing trails that form temporary signatures. Multiple ribbons interact. Themes color both ribbons and particles.",
    ribbons: "Ribbons",
  },
  es: {
    count: "Cantidad de partículas",
    strength: "Fuerza de atracción",
    speed: "Velocidad de flujo",
    trail: "Longitud de estela",
    theme: "Tema de color",
    clear: "Limpiar cintas",
    reset: "Reiniciar partículas",
    undo: "Deshacer última cinta",
    help: "Dibujá cintas libres. Las partículas se atraen hacia ellas y dejan estelas brillantes que forman firmas temporales. Varias cintas interactúan. Los temas colorean cintas y partículas.",
    ribbons: "Cintas",
  },
};

export function GravityRibbonCanvas({ locale }: { locale: Locale }) {
  const t = labels[locale];
  useEffect(() => {
    trackEvent("playground_open", { id: "gravity-ribbon-canvas", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ribbonsRef = useRef<Ribbon[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const drawingRef = useRef<Point[] | null>(null);
  const paramsRef = useRef({
    count: 180,
    strength: 1.2,
    speed: 1,
    trailLen: 18,
    theme: "aurora" as keyof typeof THEMES,
  });

  const [count, setCount] = useState(180);
  const [strength, setStrength] = useState(1.2);
  const [speed, setSpeed] = useState(1);
  const [trailLen, setTrailLen] = useState(18);
  const [theme, setTheme] = useState<keyof typeof THEMES>("aurora");
  const [ribbonCount, setRibbonCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    setIsMobile(mql.matches);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const mobileCap = isMobile ? 120 : 300;
    paramsRef.current = {
      count: Math.min(count, mobileCap),
      strength,
      speed,
      trailLen,
      theme,
    };
  }, [count, strength, speed, trailLen, theme, isMobile]);

  const initParticles = useCallback((n: number, w: number, h: number) => {
    const ps: Particle[] = [];
    const themeData = THEMES[paramsRef.current.theme];
    for (let i = 0; i < n; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1.4 + Math.random() * 1.8,
        hueOffset: Math.random() * 40 - 20,
        trail: [],
      });
    }
    particlesRef.current = ps;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particlesRef.current.length === 0) {
        initParticles(paramsRef.current.count, rect.width, rect.height);
      }
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
      const p = getPos(e);
      drawingRef.current = [p];
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const p = getPos(e);
      const last = drawingRef.current[drawingRef.current.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 4) {
        drawingRef.current.push(p);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (drawingRef.current && drawingRef.current.length > 3) {
        ribbonsRef.current.push(drawingRef.current);
        setRibbonCount(ribbonsRef.current.length);
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
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const { strength: str, speed: spd, trailLen: tl, theme: th } = paramsRef.current;
      const themeData = THEMES[th];
      const ribbons = ribbonsRef.current;
      const ps = particlesRef.current;

      // Fade trail (theme bg with slight persistence)
      ctx.fillStyle = themeData.bg + "d0";
      ctx.fillRect(0, 0, w, h);

      // Draw ribbons with theme color + glow
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const ribbon of ribbons) {
        if (ribbon.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(ribbon[0].x, ribbon[0].y);
        for (let i = 1; i < ribbon.length; i++) {
          ctx.lineTo(ribbon[i].x, ribbon[i].y);
        }
        // Glow
        ctx.strokeStyle = themeData.ribbon.replace("0.5", "0.18").replace("0.55", "0.2");
        ctx.lineWidth = 14;
        ctx.stroke();
        // Core
        ctx.strokeStyle = themeData.ribbon;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

      // Current drawing
      if (drawingRef.current && drawingRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(drawingRef.current[0].x, drawingRef.current[0].y);
        for (const p of drawingRef.current) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = "rgba(255,255,255,0.75)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Physics + particles
      for (const p of ps) {
        let ax = 0;
        let ay = 0;
        for (const ribbon of ribbons) {
          const step = Math.max(1, Math.floor(ribbon.length / 10));
          for (let i = 0; i < ribbon.length; i += step) {
            const pt = ribbon[i];
            const dx = pt.x - p.x;
            const dy = pt.y - p.y;
            const dist2 = dx * dx + dy * dy;
            const dist = Math.sqrt(dist2) || 1;
            const force = (str * 90) / (dist2 * 0.007 + 100);
            ax += (dx / dist) * force;
            ay += (dy / dist) * force;
          }
        }
        p.vx += ax * 0.015 * spd;
        p.vy += ay * 0.015 * spd;
        p.vx *= 0.982;
        p.vy *= 0.982;

        p.x += p.vx * spd;
        p.y += p.vy * spd;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > tl) p.trail.shift();

        const speedMag = Math.hypot(p.vx, p.vy);
        const baseHue = themeData.hues[Math.floor((p.x / w) * themeData.hues.length) % themeData.hues.length];
        const hue = (baseHue + p.hueOffset + speedMag * 3) % 360;

        // Trail with fading glow
        if (p.trail.length > 2) {
          for (let i = 1; i < p.trail.length; i++) {
            const alpha = (i / p.trail.length) * 0.55;
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.strokeStyle = `hsla(${hue}, 88%, 62%, ${alpha})`;
            ctx.lineWidth = p.size * (0.6 + alpha * 0.8);
            ctx.stroke();
          }
        }

        // Particle core + soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 90%, 70%, 0.25)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hue}, 92%, 68%)`;
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0) {
      const n = isMobile ? Math.min(count, 120) : count;
      initParticles(n, rect.width, rect.height);
    }
  }, [count, initParticles, isMobile]);

  const clearRibbons = () => {
    ribbonsRef.current = [];
    drawingRef.current = null;
    setRibbonCount(0);
  };

  const undoRibbon = () => {
    if (ribbonsRef.current.length > 0) {
      ribbonsRef.current.pop();
      setRibbonCount(ribbonsRef.current.length);
    }
  };

  const resetParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const n = isMobile ? Math.min(count, 120) : count;
    initParticles(n, rect.width, rect.height);
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[#050816] shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[520px]"
          style={{ display: "block", touchAction: "none" }}
        />
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          {t.ribbons}: {ribbonCount}
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.count} ({isMobile ? Math.min(count, 120) : count})</span>
          <input
            type="range"
            min={60}
            max={isMobile ? 160 : 320}
            step={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.strength} ({strength.toFixed(2)})</span>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.05}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.speed} ({speed.toFixed(2)})</span>
          <input
            type="range"
            min={0.4}
            max={2.2}
            step={0.05}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.trail} ({trailLen})</span>
          <input
            type="range"
            min={4}
            max={40}
            step={1}
            value={trailLen}
            onChange={(e) => setTrailLen(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">{t.theme}</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTheme(k)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  theme === k ? "bg-primary text-primary-foreground" : "bg-background border border-border"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </label>

        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">
          <button
            type="button"
            onClick={undoRibbon}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.undo}
          </button>
          <button
            type="button"
            onClick={clearRibbons}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.clear}
          </button>
          <button
            type="button"
            onClick={resetParticles}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
          >
            {t.reset}
          </button>
        </div>

        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-3">
          {t.help}
        </p>
      </div>
    </div>
  );
}
