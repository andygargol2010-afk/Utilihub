import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};

const RAINBOW = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#8b00ff"];

export function PrismTrailComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "prism-trail-composer", locale });
  }, [locale]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Point[][]>([]);
  const [dispersion, setDispersion] = useState(12);
  const [speed, setSpeed] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const animRef = useRef<number>(0);

  const labels = {
    en: {
      dispersion: "Dispersion",
      speed: "Particle speed",
      clear: "Clear",
      export: "Snapshot PNG",
      share: "Share",
      hint: "Draw freehand — paths split into rainbow prism beams with bloom and particle afterglow",
    },
    es: {
      dispersion: "Dispersión",
      speed: "Velocidad partículas",
      clear: "Limpiar",
      export: "Captura PNG",
      share: "Compartir",
      hint: "Dibujá a mano alzada — las trayectorias se dividen en haces de prisma arcoíris con bloom y resplandor de partículas",
    },
  }[locale];

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const d = params.get("d");
      const s = params.get("s");
      if (d && !isNaN(Number(d))) setDispersion(Math.max(0, Math.min(40, Number(d))));
      if (s && !isNaN(Number(s))) setSpeed(Math.max(0.2, Math.min(3, Number(s))));
    } catch {}
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("d", String(dispersion));
    params.set("s", String(speed));
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [dispersion, speed]);

  const spawnParticles = useCallback((x: number, y: number, n = 5) => {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (0.3 + Math.random() * 1.4) * speed;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: 1,
        maxLife: 0.7 + Math.random() * 0.9,
        size: 1.5 + Math.random() * 5,
        color: RAINBOW[Math.floor(Math.random() * RAINBOW.length)],
      });
    }
  }, [speed]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, w, h);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    trailsRef.current.forEach((trail) => {
      if (trail.length < 2) return;
      const layers = RAINBOW.length;
      for (let li = 0; li < layers; li++) {
        const offset = (li - (layers - 1) / 2) * (dispersion / 100);
        ctx.beginPath();
        const first = trail[0];
        // Simple perpendicular offset approximation
        let dx = 0, dy = 0;
        if (trail.length > 1) {
          const next = trail[1];
          dx = -(next.y - first.y);
          dy = next.x - first.x;
          const len = Math.hypot(dx, dy) || 1;
          dx = (dx / len) * offset;
          dy = (dy / len) * offset;
        }
        ctx.moveTo((first.x + dx) * w, (first.y + dy) * h);
        for (let i = 1; i < trail.length; i++) {
          const p = trail[i];
          let odx = 0, ody = 0;
          if (i < trail.length - 1) {
            const nx = trail[i + 1].x - trail[i - 1].x;
            const ny = trail[i + 1].y - trail[i - 1].y;
            const len = Math.hypot(nx, ny) || 1;
            odx = (-ny / len) * offset;
            ody = (nx / len) * offset;
          }
          ctx.lineTo((p.x + odx) * w, (p.y + ody) * h);
        }
        ctx.strokeStyle = RAINBOW[li];
        ctx.lineWidth = 6 - li * 0.4;
        ctx.shadowColor = RAINBOW[li];
        ctx.shadowBlur = 18 + dispersion * 0.3;
        ctx.globalAlpha = 0.85;
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Particles
    particlesRef.current.forEach((p) => {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha * 0.75;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.size * alpha * 1.4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [dispersion]);

  useEffect(() => {
    const loop = () => {
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx * 0.0025 * speed,
          y: p.y + p.vy * 0.0025 * speed,
          life: p.life - 0.014,
          size: p.size * 0.992,
        }))
        .filter((p) => p.life > 0);
      redraw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 24, 760));
      canvas.width = sizePx;
      canvas.height = sizePx * 0.7;
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
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDrawing(true);
    const p = getPos(e);
    trailsRef.current.push([p]);
    spawnParticles(p.x, p.y, 10);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    const last = trailsRef.current[trailsRef.current.length - 1];
    if (last) last.push(p);
    spawnParticles(p.x, p.y, 3);
  };

  const onPointerUp = () => setIsDrawing(false);

  const clear = () => {
    trailsRef.current = [];
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
      a.download = `prism-trail-utilihub-${Date.now()}.png`;
      a.click();
    } finally {
      setTimeout(() => setExporting(false), 400);
    }
  };

  const share = async () => {
    trackEvent("share_click", { id: "prism-trail-composer", locale });
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], "prism-trail.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Prism Trail Composer UtiliHub",
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
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.dispersion}
          <input
            type="range"
            min={0}
            max={40}
            value={dispersion}
            onChange={(e) => setDispersion(Number(e.target.value))}
            className="w-28 accent-violet-500"
          />
          <span className="w-6 text-right">{dispersion}</span>
        </label>
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.speed}
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-28 accent-cyan-500"
          />
          <span className="w-8 text-right">{speed.toFixed(1)}</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={clear} className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          {labels.clear}
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
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none text-[10px] sm:text-xs text-white/55 px-2 text-center">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
