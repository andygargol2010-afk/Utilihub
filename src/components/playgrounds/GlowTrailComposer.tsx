import { useCallback, useEffect, useRef, useState } from "react";

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

const PALETTE = ["#ff2d95", "#00f5ff", "#ffd700", "#7cff6b", "#b388ff", "#ff6b35", "#ffffff", "#ff3b30"];

export function GlowTrailComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Point[][]>([]);
  const [thickness, setThickness] = useState(8);
  const [color, setColor] = useState(PALETTE[0]);
  const [color2, setColor2] = useState(PALETTE[1]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const animRef = useRef<number>(0);

  const labels = {
    en: {
      thickness: "Trail thickness",
      color: "Core color",
      color2: "Glow color",
      clear: "Clear",
      export: "Snapshot PNG",
      share: "Share",
      hint: "Draw with mouse or finger — glowing trails leave particle afterglows",
    },
    es: {
      thickness: "Grosor de estela",
      color: "Color núcleo",
      color2: "Color resplandor",
      clear: "Limpiar",
      export: "Captura PNG",
      share: "Compartir",
      hint: "Dibujá con el mouse o el dedo — las estelas brillantes dejan resplandores de partículas",
    },
  }[locale];

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("th");
      const c = params.get("c");
      const c2 = params.get("c2");
      if (t && !isNaN(Number(t))) setThickness(Math.max(2, Math.min(24, Number(t))));
      if (c && PALETTE.includes(c)) setColor(c);
      if (c2 && PALETTE.includes(c2)) setColor2(c2);
    } catch {}
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("th", String(thickness));
    params.set("c", color);
    params.set("c2", color2);
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [thickness, color, color2]);

  const spawnParticles = useCallback((x: number, y: number, n = 6) => {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 1.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.8,
        size: 2 + Math.random() * 6,
        color: Math.random() > 0.5 ? color : color2,
      });
    }
  }, [color, color2]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, w, h);

    // Trails
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    trailsRef.current.forEach((trail) => {
      if (trail.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(trail[0].x * w, trail[0].y * h);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x * w, trail[i].y * h);
      }
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = thickness;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 8;
      ctx.lineWidth = thickness * 0.4;
      ctx.stroke();
    });

    // Particles
    particlesRef.current.forEach((p) => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.size * alpha * 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [color, color2, thickness]);

  useEffect(() => {
    const loop = () => {
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx * 0.002,
          y: p.y + p.vy * 0.002,
          life: p.life - 0.016,
          size: p.size * 0.995,
        }))
        .filter((p) => p.life > 0);
      redraw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 24, 720));
      canvas.width = sizePx;
      canvas.height = sizePx * 0.75;
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
    spawnParticles(p.x, p.y, 12);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    const last = trailsRef.current[trailsRef.current.length - 1];
    if (last) last.push(p);
    spawnParticles(p.x, p.y, 4);
  };

  const onPointerUp = () => {
    setIsDrawing(false);
  };

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
      a.download = `glow-trail-utilihub-${Date.now()}.png`;
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
      const file = new File([blob], "glow-trail.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Glow Trail UtiliHub",
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
          {labels.thickness}
          <input
            type="range"
            min={2}
            max={24}
            value={thickness}
            onChange={(e) => setThickness(Number(e.target.value))}
            className="w-24 accent-primary"
          />
          <span className="w-6 text-right">{thickness}</span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.color}</span>
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full border-2 transition ${
                color === c ? "border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.color2}</span>
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor2(c)}
              className={`h-8 w-8 rounded-full border-2 transition ${
                color2 === c ? "border-white scale-110" : "border-transparent"
              }`}
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

      <div className="relative mx-auto max-w-[720px] overflow-hidden rounded-2xl border border-slate-700/40 bg-black shadow-2xl">
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
