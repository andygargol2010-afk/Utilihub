import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Layer = {
  id: number;
  points: Point[];
  color: string;
  opacity: number;
  created: number;
};
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

type Palette = "neon" | "aurora" | "sunset" | "cyber";
type Symmetry = "none" | "mirror" | "kaleido";

const PALETTES: Record<Palette, string[]> = {
  neon: ["#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fe019a", "#0ff0fc"],
  aurora: ["#7df9ff", "#b388ff", "#80ffdb", "#c77dff", "#48bfe3", "#64dfdf"],
  sunset: ["#ff6b6b", "#ff8e53", "#ffd93d", "#ff6b9d", "#c44569", "#f8b500"],
  cyber: ["#00f5ff", "#ff00aa", "#b026ff", "#00ff9f", "#ffea00", "#ff2e97"],
};

export function NeonLayerComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "neon-layer-composer", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<Layer[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const currentStroke = useRef<Point[]>([]);
  const nextId = useRef(1);
  const animRef = useRef<number>(0);

  const [bloom, setBloom] = useState(22);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [symmetry, setSymmetry] = useState<Symmetry>("mirror");
  const [palette, setPalette] = useState<Palette>("neon");
  const [layerOpacity, setLayerOpacity] = useState(0.85);
  const [gravity, setGravity] = useState(0.15);
  const [wind, setWind] = useState(0.05);
  const [title, setTitle] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeLayer, setActiveLayer] = useState(0);

  const colors = PALETTES[palette];

  const labels = {
    en: {
      bloom: "Bloom",
      width: "Stroke",
      symmetry: "Symmetry",
      palette: "Palette",
      opacity: "Layer opacity",
      gravity: "Particle gravity",
      wind: "Wind",
      title: "Title overlay",
      clear: "Clear all",
      undo: "Undo layer",
      export: "Share PNG",
      hint: "Draw freehand neon layers. Particles emit along strokes and fade with gravity + wind. Symmetry modes multiply your strokes.",
      symmetries: { none: "None", mirror: "Mirror", kaleido: "Kaleidoscope" } as Record<Symmetry, string>,
      palettes: { neon: "Neon", aurora: "Aurora", sunset: "Sunset", cyber: "Cyber" } as Record<Palette, string>,
    },
    es: {
      bloom: "Bloom",
      width: "Trazo",
      symmetry: "Simetría",
      palette: "Paleta",
      opacity: "Opacidad capa",
      gravity: "Gravedad partículas",
      wind: "Viento",
      title: "Título superpuesto",
      clear: "Limpiar todo",
      undo: "Deshacer capa",
      export: "Compartir PNG",
      hint: "Dibujá capas de neón a mano alzada. Las partículas se emiten a lo largo de los trazos y se desvanecen con gravedad y viento. Los modos de simetría multiplican tus trazos.",
      symmetries: { none: "Ninguna", mirror: "Espejo", kaleido: "Caleidoscopio" } as Record<Symmetry, string>,
      palettes: { neon: "Neón", aurora: "Aurora", sunset: "Atardecer", cyber: "Cyber" } as Record<Palette, string>,
    },
  }[locale];

  // URL deep-link hydrate
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const b = p.get("b"); if (b) setBloom(Math.max(0, Math.min(48, Number(b))));
      const w = p.get("w"); if (w) setStrokeWidth(Math.max(2, Math.min(14, Number(w))));
      const s = p.get("s") as Symmetry | null; if (s && ["none","mirror","kaleido"].includes(s)) setSymmetry(s);
      const c = p.get("c") as Palette | null; if (c && PALETTES[c]) setPalette(c);
      const o = p.get("o"); if (o) setLayerOpacity(Math.max(0.2, Math.min(1, Number(o))));
      const g = p.get("g"); if (g) setGravity(Math.max(0, Math.min(1, Number(g))));
      const wi = p.get("wi"); if (wi) setWind(Math.max(-0.3, Math.min(0.3, Number(wi))));
      const t = p.get("t"); if (t) setTitle(decodeURIComponent(t).slice(0, 48));
    } catch {}
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    p.set("b", String(bloom));
    p.set("w", String(strokeWidth));
    p.set("s", symmetry);
    p.set("c", palette);
    p.set("o", String(layerOpacity));
    p.set("g", String(gravity));
    p.set("wi", String(wind));
    if (title) p.set("t", encodeURIComponent(title.slice(0, 48))); else p.delete("t");
    const next = `${window.location.pathname}?${p.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [bloom, strokeWidth, symmetry, palette, layerOpacity, gravity, wind, title]);

  const spawnAlong = useCallback((pts: Point[], color: string) => {
    if (pts.length < 2) return;
    const step = Math.max(4, Math.floor(pts.length / 12));
    for (let i = 0; i < pts.length; i += step) {
      const pt = pts[i];
      particlesRef.current.push({
        x: pt.x,
        y: pt.y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.4,
        life: 60 + Math.random() * 40,
        maxLife: 100,
        size: 1.5 + Math.random() * 2.5,
        color,
      });
    }
    // Cap for CWV
    if (particlesRef.current.length > 280) {
      particlesRef.current.splice(0, particlesRef.current.length - 280);
    }
  }, []);

  const drawSymmetry = useCallback((ctx: CanvasRenderingContext2D, pts: Point[], w: number, h: number, color: string, alpha: number) => {
    if (pts.length < 2) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = color;
    ctx.shadowBlur = bloom;

    const drawOne = (transform?: (x: number, y: number) => [number, number]) => {
      ctx.beginPath();
      pts.forEach((p, i) => {
        const [tx, ty] = transform ? transform(p.x, p.y) : [p.x, p.y];
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      });
      ctx.stroke();
    };

    drawOne();
    if (symmetry === "mirror") {
      drawOne((x, y) => [w - x, y]);
    } else if (symmetry === "kaleido") {
      const cx = w / 2, cy = h / 2;
      for (let k = 1; k < 6; k++) {
        const ang = (k * Math.PI) / 3;
        drawOne((x, y) => {
          const dx = x - cx, dy = y - cy;
          const ca = Math.cos(ang), sa = Math.sin(ang);
          return [cx + dx * ca - dy * sa, cy + dx * sa + dy * ca];
        });
      }
    }
    ctx.restore();
  }, [bloom, strokeWidth, symmetry]);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, w, h);

    // Soft vignette
    const vg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.7);
    vg.addColorStop(0, "rgba(5,5,16,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);

    // Layers
    layersRef.current.forEach((layer) => {
      drawSymmetry(ctx, layer.points, w, h, layer.color, layer.opacity);
    });

    // Live stroke
    if (currentStroke.current.length > 1) {
      const col = colors[activeLayer % colors.length];
      drawSymmetry(ctx, currentStroke.current, w, h, col, layerOpacity);
    }

    // Particles
    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
    particlesRef.current.forEach((p) => {
      p.x += p.vx + wind;
      p.y += p.vy;
      p.vy += gravity * 0.08;
      p.life -= 1;
      const a = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = a * 0.8;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = bloom * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Title overlay
    if (title) {
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "bold 28px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 12;
      ctx.fillText(title.slice(0, 48), w / 2, 48);
      ctx.shadowBlur = 0;
    }

    animRef.current = requestAnimationFrame(tick);
  }, [drawSymmetry, colors, activeLayer, layerOpacity, gravity, wind, bloom, title]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [tick]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    currentStroke.current = [pos(e)];
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    currentStroke.current.push(pos(e));
  };

  const onUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.current.length > 2) {
      const col = colors[activeLayer % colors.length];
      layersRef.current.push({
        id: nextId.current++,
        points: [...currentStroke.current],
        color: col,
        opacity: layerOpacity,
        created: Date.now(),
      });
      spawnAlong(currentStroke.current, col);
      setActiveLayer((n) => n + 1);
    }
    currentStroke.current = [];
  };

  const clear = () => {
    layersRef.current = [];
    particlesRef.current = [];
    currentStroke.current = [];
    setActiveLayer(0);
  };

  const undo = () => {
    layersRef.current.pop();
    setActiveLayer(Math.max(0, activeLayer - 1));
  };

  const exportPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `neon-layer-${Date.now()}.png`;
      a.click();
      trackEvent("playground_share", { id: "neon-layer-composer", type: "png", locale });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{labels.hint}</p>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-primary/20 bg-[#050510] shadow-lg">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-medium">
          {labels.bloom}
          <input type="range" min={0} max={48} value={bloom} onChange={(e) => setBloom(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {labels.width}
          <input type="range" min={2} max={14} value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {labels.opacity}
          <input type="range" min={0.2} max={1} step={0.05} value={layerOpacity} onChange={(e) => setLayerOpacity(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {labels.gravity}
          <input type="range" min={0} max={1} step={0.05} value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {labels.wind}
          <input type="range" min={-0.3} max={0.3} step={0.02} value={wind} onChange={(e) => setWind(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {labels.symmetry}
          <select value={symmetry} onChange={(e) => setSymmetry(e.target.value as Symmetry)} className="mt-1 w-full rounded border bg-background px-2 py-1 text-sm">
            {Object.entries(labels.symmetries).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium">
          {labels.palette}
          <select value={palette} onChange={(e) => setPalette(e.target.value as Palette)} className="mt-1 w-full rounded border bg-background px-2 py-1 text-sm">
            {Object.entries(labels.palettes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium sm:col-span-2">
          {labels.title}
          <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 48))} placeholder={locale === "es" ? "Tu título…" : "Your title…"} className="mt-1 w-full rounded border bg-background px-2 py-1 text-sm" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={clear} className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent">{labels.clear}</button>
        <button type="button" onClick={undo} className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent">{labels.undo}</button>
        <button type="button" onClick={exportPng} disabled={exporting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">{exporting ? "…" : labels.export}</button>
      </div>
    </div>
  );
}
