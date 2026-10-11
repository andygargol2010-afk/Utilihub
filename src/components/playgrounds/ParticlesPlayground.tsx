"use client";

import { useEffect, useRef, useState } from "react";

type Locale = "en" | "es";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const labels = {
  en: {
    count: "Particles",
    gravity: "Gravity",
    friction: "Friction",
    trails: "Trails",
    mode: "Mouse",
    attract: "Attract",
    repel: "Repel",
    reset: "Reset",
    colorVel: "Color by speed",
  },
  es: {
    count: "Partículas",
    gravity: "Gravedad",
    friction: "Fricción",
    trails: "Estelas",
    mode: "Mouse",
    attract: "Atraer",
    repel: "Repeler",
    reset: "Reiniciar",
    colorVel: "Color por velocidad",
  },
};

export function ParticlesPlayground({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const paramsRef = useRef({
    count: 150,
    gravity: 0.04,
    friction: 0.985,
    trails: true,
    mode: "attract" as "attract" | "repel",
    colorByVel: true,
  });

  const [count, setCount] = useState(150);
  const [gravity, setGravity] = useState(0.04);
  const [friction, setFriction] = useState(0.985);
  const [trails, setTrails] = useState(true);
  const [mode, setMode] = useState<"attract" | "repel">("attract");
  const [colorByVel, setColorByVel] = useState(true);

  useEffect(() => {
    paramsRef.current = { count, gravity, friction, trails, mode, colorByVel };
  }, [count, gravity, friction, trails, mode, colorByVel]);

  const init = (n: number, w: number, h: number) => {
    const ps: Particle[] = [];
    for (let i = 0; i < n; i++) {
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 1.5 + Math.random() * 2.5,
      });
    }
    particlesRef.current = ps;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width);
      canvas.height = Math.max(1, rect.height);
      if (particlesRef.current.length === 0) {
        init(paramsRef.current.count, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      mouseRef.current.x = clientX - rect.left;
      mouseRef.current.y = clientY - rect.top;
    };
    const onDown = () => {
      mouseRef.current.active = true;
    };
    const onUp = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    const loop = () => {
      const { gravity: g, friction: f, trails: tr, mode: m, colorByVel: cVel } = paramsRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (tr) {
        ctx.fillStyle = "rgba(15, 23, 42, 0.12)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      const mouse = mouseRef.current;
      const ps = particlesRef.current;

      for (const p of ps) {
        p.vy += g;
        p.vx *= f;
        p.vy *= f;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const strength = m === "attract" ? 0.35 : -0.55;
          const force = strength / Math.max(dist * 0.04, 8);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) {
          p.x = 0;
          p.vx *= -0.75;
        } else if (p.x > w) {
          p.x = w;
          p.vx *= -0.75;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -0.75;
        } else if (p.y > h) {
          p.y = h;
          p.vy *= -0.75;
        }

        const speed = Math.hypot(p.vx, p.vy);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (cVel) {
          const hue = Math.min(220, 200 - speed * 30);
          ctx.fillStyle = `hsl(${hue}, 85%, 62%)`;
        } else {
          ctx.fillStyle = "#38bdf8";
        }
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("touchstart", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  // re-init when count changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return;
    init(count, canvas.width, canvas.height);
  }, [count]);

  const reset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    init(count, canvas.width, canvas.height);
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none sm:h-[480px]"
          style={{ display: "block" }}
        />
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.count} ({count})</span>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.gravity} ({gravity.toFixed(2)})</span>
          <input
            type="range"
            min={0}
            max={0.2}
            step={0.01}
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.friction} ({friction.toFixed(3)})</span>
          <input
            type="range"
            min={0.9}
            max={0.999}
            step={0.001}
            value={friction}
            onChange={(e) => setFriction(Number(e.target.value))}
            className="accent-primary"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={trails}
            onChange={(e) => setTrails(e.target.checked)}
            className="accent-primary"
          />
          {t.trails}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={colorByVel}
            onChange={(e) => setColorByVel(e.target.checked)}
            className="accent-primary"
          />
          {t.colorVel}
        </label>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{t.mode}:</span>
          <button
            type="button"
            onClick={() => setMode(mode === "attract" ? "repel" : "attract")}
            className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold"
          >
            {mode === "attract" ? t.attract : t.repel}
          </button>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {t.reset}
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            {locale === "es"
              ? "Mantén pulsado (o toca) en el canvas para atraer/repeler."
              : "Hold click (or touch) on the canvas to attract/repel."}
          </p>
        </div>
      </div>
    </div>
  );
}
