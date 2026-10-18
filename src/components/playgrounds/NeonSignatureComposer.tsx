import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Stroke = Point[];
type Layer = {
  id: string;
  strokes: Stroke[];
  color: string;
  endColor: string;
  width: number;
  opacity: number;
  glow: number;
  gradient: boolean;
};

const THEMES = [
  { id: "cyan", color: "#00f5ff", end: "#ff2d95", labelEn: "Cyan", labelEs: "Cian" },
  { id: "pink", color: "#ff2d95", end: "#00f5ff", labelEn: "Hot Pink", labelEs: "Rosa intenso" },
  { id: "lime", color: "#7cff6b", end: "#ffd700", labelEn: "Lime", labelEs: "Lima" },
  { id: "gold", color: "#ffd700", end: "#ff2d95", labelEn: "Gold", labelEs: "Oro" },
  { id: "purple", color: "#b388ff", end: "#00f5ff", labelEn: "Purple", labelEs: "Púrpura" },
  { id: "white", color: "#ffffff", end: "#b388ff", labelEn: "White", labelEs: "Blanco" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function roundPt(p: Point): Point {
  return { x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 };
}

function serializeLayers(layers: Layer[]): string {
  try {
    const slim = layers.map((l) => ({
      ...l,
      strokes: l.strokes.map((s) => s.map(roundPt)),
    }));
    return btoa(unescape(encodeURIComponent(JSON.stringify(slim))));
  } catch {
    return "";
  }
}

function deserializeLayers(data: string): Layer[] | null {
  try {
    const json = decodeURIComponent(escape(atob(data)));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function NeonSignatureComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "neon-signature-composer", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<Layer[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [currentLayerIdx, setCurrentLayerIdx] = useState(0);
  const [brushWidth, setBrushWidth] = useState(8);
  const [glowStrength, setGlowStrength] = useState(24);
  const [layerOpacity, setLayerOpacity] = useState(0.9);
  const [theme, setTheme] = useState(THEMES[0]);
  const [sparkles, setSparkles] = useState(true);
  const [useGradient, setUseGradient] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  const animRef = useRef<number>(0);
  const sparklesRef = useRef<{ x: number; y: number; life: number; maxLife: number; size: number }[]>([]);

  const labels = {
    en: {
      width: "Brush width",
      glow: "Glow strength",
      opacity: "Layer opacity",
      theme: "Color theme",
      sparkles: "Sparkles",
      gradient: "Stroke gradient",
      newLayer: "New layer",
      undo: "Undo stroke",
      clear: "Clear all",
      share: "Share URL",
      copied: "Copied!",
      hint: "Draw freehand neon signatures. Multi-layer gradients, flowing glow, touch-friendly. Share via URL.",
      layers: "Layers",
      up: "Up",
      down: "Down",
    },
    es: {
      width: "Grosor pincel",
      glow: "Fuerza del brillo",
      opacity: "Opacidad de capa",
      theme: "Tema de color",
      sparkles: "Chispas",
      gradient: "Gradiente en trazo",
      newLayer: "Nueva capa",
      undo: "Deshacer trazo",
      clear: "Limpiar todo",
      share: "Compartir URL",
      copied: "¡Copiado!",
      hint: "Dibujá firmas de neón a mano alzada. Gradientes multicapa, brillo fluido, compatible con tacto. Compartí por URL.",
      layers: "Capas",
      up: "Subir",
      down: "Bajar",
    },
  }[locale];

  // Load from hash if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      const loaded = deserializeLayers(hash);
      if (loaded && loaded.length) {
        layersRef.current = loaded;
        setLayers(loaded);
        setCurrentLayerIdx(0);
        const first = loaded[0];
        if (first) {
          setBrushWidth(first.width);
          setGlowStrength(first.glow);
          setLayerOpacity(first.opacity);
          setUseGradient(first.gradient);
          const th = THEMES.find((t) => t.color === first.color) || THEMES[0];
          setTheme(th);
        }
      }
    }
  }, []);

  // Init first layer if empty
  useEffect(() => {
    if (layersRef.current.length === 0) {
      const initial: Layer = {
        id: uid(),
        strokes: [],
        color: theme.color,
        endColor: theme.end,
        width: brushWidth,
        opacity: layerOpacity,
        glow: glowStrength,
        gradient: useGradient,
      };
      layersRef.current = [initial];
      setLayers([initial]);
    }
  }, []);

  // Sync params to current layer on change
  useEffect(() => {
    const layers = layersRef.current;
    if (layers[currentLayerIdx]) {
      layers[currentLayerIdx].color = theme.color;
      layers[currentLayerIdx].endColor = theme.end;
      layers[currentLayerIdx].width = brushWidth;
      layers[currentLayerIdx].opacity = layerOpacity;
      layers[currentLayerIdx].glow = glowStrength;
      layers[currentLayerIdx].gradient = useGradient;
      setLayers([...layers]);
    }
  }, [theme, brushWidth, layerOpacity, glowStrength, useGradient, currentLayerIdx]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#06060c";
    ctx.fillRect(0, 0, w, h);

    // Draw all layers
    layersRef.current.forEach((layer) => {
      if (layer.strokes.length === 0) return;
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      layer.strokes.forEach((stroke) => {
        if (stroke.length < 2) return;
        const sx = stroke[0].x * w;
        const sy = stroke[0].y * h;
        const ex = stroke[stroke.length - 1].x * w;
        const ey = stroke[stroke.length - 1].y * h;

        let strokeStyle: string | CanvasGradient = layer.color;
        if (layer.gradient) {
          const grad = ctx.createLinearGradient(sx, sy, ex, ey);
          grad.addColorStop(0, layer.color);
          grad.addColorStop(1, layer.endColor);
          strokeStyle = grad;
        }

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x * w, stroke[i].y * h);
        }
        // Glow layers
        ctx.strokeStyle = strokeStyle;
        ctx.shadowColor = layer.color;
        ctx.shadowBlur = layer.glow;
        ctx.lineWidth = layer.width;
        ctx.stroke();
        ctx.shadowBlur = layer.glow * 0.4;
        ctx.lineWidth = layer.width * 0.45;
        ctx.stroke();
        // Core
        ctx.shadowBlur = 0;
        ctx.lineWidth = Math.max(1, layer.width * 0.25);
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = layer.opacity * 0.7;
        ctx.stroke();
        ctx.globalAlpha = layer.opacity;
      });
      ctx.restore();
    });

    // Sparkles
    if (sparkles) {
      sparklesRef.current.forEach((s) => {
        const a = s.life / s.maxLife;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.size * a, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }, [sparkles]);

  useEffect(() => {
    const loop = () => {
      if (sparkles) {
        sparklesRef.current = sparklesRef.current
          .map((s) => ({ ...s, life: s.life - 0.02 }))
          .filter((s) => s.life > 0);
      }
      redraw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [redraw, sparkles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 32, 800));
      canvas.width = sizePx;
      canvas.height = sizePx * 0.72;
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
    const layer = layersRef.current[currentLayerIdx];
    if (layer) {
      layer.strokes.push([p]);
      if (sparkles) {
        for (let i = 0; i < 5; i++) {
          sparklesRef.current.push({
            x: p.x + (Math.random() - 0.5) * 0.02,
            y: p.y + (Math.random() - 0.5) * 0.02,
            life: 1,
            maxLife: 0.4 + Math.random() * 0.4,
            size: 1.5 + Math.random() * 2.5,
          });
        }
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    const layer = layersRef.current[currentLayerIdx];
    if (layer && layer.strokes.length) {
      const last = layer.strokes[layer.strokes.length - 1];
      last.push(p);
      if (sparkles && Math.random() < 0.3) {
        sparklesRef.current.push({
          x: p.x,
          y: p.y,
          life: 1,
          maxLife: 0.3 + Math.random() * 0.3,
          size: 1 + Math.random() * 2,
        });
      }
    }
  };

  const onPointerUp = () => {
    setIsDrawing(false);
    setLayers([...layersRef.current]);
  };

  const newLayer = () => {
    const nl: Layer = {
      id: uid(),
      strokes: [],
      color: theme.color,
      endColor: theme.end,
      width: brushWidth,
      opacity: layerOpacity,
      glow: glowStrength,
      gradient: useGradient,
    };
    layersRef.current.push(nl);
    setLayers([...layersRef.current]);
    setCurrentLayerIdx(layersRef.current.length - 1);
  };

  const undo = () => {
    const layer = layersRef.current[currentLayerIdx];
    if (layer && layer.strokes.length) {
      layer.strokes.pop();
      setLayers([...layersRef.current]);
    }
  };

  const clear = () => {
    layersRef.current = [
      {
        id: uid(),
        strokes: [],
        color: theme.color,
        endColor: theme.end,
        width: brushWidth,
        opacity: layerOpacity,
        glow: glowStrength,
        gradient: useGradient,
      },
    ];
    setLayers([...layersRef.current]);
    setCurrentLayerIdx(0);
    sparklesRef.current = [];
    if (typeof window !== "undefined") window.location.hash = "";
  };

  const selectLayer = (idx: number) => {
    setCurrentLayerIdx(idx);
    const layer = layersRef.current[idx];
    if (layer) {
      setBrushWidth(layer.width);
      setGlowStrength(layer.glow);
      setLayerOpacity(layer.opacity);
      setUseGradient(layer.gradient);
      const th = THEMES.find((t) => t.color === layer.color) || THEMES[0];
      setTheme(th);
    }
  };

  const moveLayer = (dir: -1 | 1) => {
    const from = currentLayerIdx;
    const to = from + dir;
    if (to < 0 || to >= layersRef.current.length) return;
    const arr = layersRef.current;
    [arr[from], arr[to]] = [arr[to], arr[from]];
    setLayers([...arr]);
    setCurrentLayerIdx(to);
  };

  const shareUrl = () => {
    const data = serializeLayers(layersRef.current);
    if (!data || typeof window === "undefined") return;
    window.location.hash = data;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.width}
          <input
            type="range"
            min={2}
            max={32}
            value={brushWidth}
            onChange={(e) => setBrushWidth(Number(e.target.value))}
            className="w-20 accent-fuchsia-500"
          />
          <span className="w-5 text-right">{brushWidth}</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.glow}
          <input
            type="range"
            min={0}
            max={48}
            value={glowStrength}
            onChange={(e) => setGlowStrength(Number(e.target.value))}
            className="w-20 accent-fuchsia-500"
          />
          <span className="w-5 text-right">{glowStrength}</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.opacity}
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={layerOpacity}
            onChange={(e) => setLayerOpacity(Number(e.target.value))}
            className="w-20 accent-fuchsia-500"
          />
          <span className="w-8 text-right">{Math.round(layerOpacity * 100)}%</span>
        </label>

        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <input
            type="checkbox"
            checked={sparkles}
            onChange={(e) => setSparkles(e.target.checked)}
            className="accent-fuchsia-500"
          />
          {labels.sparkles}
        </label>

        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <input
            type="checkbox"
            checked={useGradient}
            onChange={(e) => setUseGradient(e.target.checked)}
            className="accent-fuchsia-500"
          />
          {labels.gradient}
        </label>
      </div>

      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.theme}</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => setTheme(th)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                theme.id === th.id
                  ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-900 dark:bg-fuchsia-950/40 dark:text-fuchsia-100"
                  : "border-border bg-background hover:border-fuchsia-400"
              }`}
              style={{ boxShadow: theme.id === th.id ? `0 0 8px ${th.color}` : undefined }}
            >
              {locale === "es" ? th.labelEs : th.labelEn}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.layers}</span>
        {layers.map((layer, idx) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => selectLayer(idx)}
            className={`min-h-[36px] rounded-full border px-3 py-1 text-xs font-semibold ${
              idx === currentLayerIdx
                ? "border-fuchsia-500 bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950/50 dark:text-fuchsia-100"
                : "border-border bg-background"
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={newLayer}
          className="min-h-[36px] rounded-full bg-fuchsia-600 px-3 py-1 text-xs font-bold text-white hover:bg-fuchsia-500"
        >
          {labels.newLayer}
        </button>
        <button
          type="button"
          onClick={() => moveLayer(-1)}
          disabled={currentLayerIdx === 0}
          className="min-h-[36px] rounded-full bg-muted px-3 py-1 text-xs font-medium disabled:opacity-40"
        >
          {labels.up}
        </button>
        <button
          type="button"
          onClick={() => moveLayer(1)}
          disabled={currentLayerIdx === layers.length - 1}
          className="min-h-[36px] rounded-full bg-muted px-3 py-1 text-xs font-medium disabled:opacity-40"
        >
          {labels.down}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={undo}
          className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
        >
          {labels.undo}
        </button>
        <button
          type="button"
          onClick={clear}
          className="min-h-[44px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
        >
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={shareUrl}
          className="min-h-[44px] rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-bold text-white hover:bg-fuchsia-500"
        >
          {copied ? labels.copied : labels.share}
        </button>
      </div>

      <div className="relative mx-auto max-w-[800px] overflow-hidden rounded-2xl border border-fuchsia-500/30 bg-black shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          style={{ touchAction: "none", aspectRatio: "1.39" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none text-[10px] sm:text-xs text-white/50 px-2 text-center">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
