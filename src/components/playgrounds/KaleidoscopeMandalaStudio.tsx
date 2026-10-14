import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Stroke = {
  points: Point[];
  color: string;
  brush: Brush;
  symmetry: number;
};
type Brush = "neon" | "sparkle" | "glow" | "ink";

const PALETTE = [
  "#ff2d95",
  "#00f5ff",
  "#ffd700",
  "#7cff6b",
  "#b388ff",
  "#ff6b35",
  "#ffffff",
  "#ff3b30",
];

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function KaleidoscopeMandalaStudio({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [symmetry, setSymmetry] = useState(6);
  const [color, setColor] = useState(PALETTE[0]);
  const [brush, setBrush] = useState<Brush>("neon");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const labels = {
    en: {
      symmetry: "Symmetry",
      brush: "Brush",
      color: "Color",
      clear: "Clear",
      undo: "Undo",
      export: "Export PNG",
      share: "Share",
      neon: "Neon trail",
      sparkle: "Sparkle",
      glow: "Soft glow",
      ink: "Ink",
      hint: "Draw with mouse or finger — it blooms in real time",
    },
    es: {
      symmetry: "Simetría",
      brush: "Pincel",
      color: "Color",
      clear: "Limpiar",
      undo: "Deshacer",
      export: "Exportar PNG",
      share: "Compartir",
      neon: "Estela neón",
      sparkle: "Chispas",
      glow: "Resplandor suave",
      ink: "Tinta",
      hint: "Dibujá con el mouse o el dedo — florece en tiempo real",
    },
  }[locale];

  // Restore settings from URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("sym");
      const b = params.get("brush");
      const c = params.get("color");
      if (s && ["4", "6", "8"].includes(s)) setSymmetry(Number(s));
      if (b && ["neon", "sparkle", "glow", "ink"].includes(b)) setBrush(b as Brush);
      if (c && PALETTE.includes(c)) setColor(c);
    } catch {}
  }, []);

  // Persist settings to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("sym", String(symmetry));
    params.set("brush", brush);
    params.set("color", color);
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [symmetry, brush, color]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
    bg.addColorStop(0, "#1a0a2e");
    bg.addColorStop(1, "#0d0518");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle center guide
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(w, h) * 0.42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    const drawStroke = (stroke: Stroke) => {
      if (stroke.points.length < 2) return;
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const n = stroke.symmetry;
      for (let k = 0; k < n; k++) {
        const angle = (Math.PI * 2 * k) / n;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.translate(-cx, -cy);

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x * w, stroke.points[0].y * h);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x * w, stroke.points[i].y * h);
        }

        if (stroke.brush === "neon") {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = stroke.color;
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.shadowBlur = 6;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (stroke.brush === "glow") {
          ctx.strokeStyle = stroke.color;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 18;
          ctx.shadowColor = stroke.color;
          ctx.shadowBlur = 24;
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.lineWidth = 4;
          ctx.shadowBlur = 8;
          ctx.stroke();
        } else if (stroke.brush === "ink") {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = 2.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        } else if (stroke.brush === "sparkle") {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.75;
          ctx.stroke();
          ctx.fillStyle = stroke.color;
          for (let i = 0; i < stroke.points.length; i += 2) {
            const p = stroke.points[i];
            const px = p.x * w;
            const py = p.y * h;
            const seed = i * 17 + k * 3;
            const ox = (seeded(seed) - 0.5) * 10;
            const oy = (seeded(seed + 1) - 0.5) * 10;
            const r = 1.2 + seeded(seed + 2) * 2.2;
            ctx.globalAlpha = 0.55 + seeded(seed + 3) * 0.4;
            ctx.beginPath();
            ctx.arc(px + ox, py + oy, r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      }
      ctx.restore();
    };

    strokes.forEach(drawStroke);

    if (current.length > 1) {
      drawStroke({ points: current, color, brush, symmetry });
    }
  }, [strokes, current, color, brush, symmetry]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const size = Math.min(rect.width, Math.min(window.innerWidth - 32, 640));
      canvas.width = size;
      canvas.height = size;
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
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDrawing(true);
    setCurrent([getPos(e)]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    setCurrent((prev) => [...prev, getPos(e)]);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isDrawing || current.length < 2) {
      setIsDrawing(false);
      setCurrent([]);
      return;
    }
    setStrokes((prev) => [...prev, { points: current, color, brush, symmetry }]);
    setCurrent([]);
    setIsDrawing(false);
  };

  const undo = () => setStrokes((prev) => prev.slice(0, -1));
  const clear = () => {
    setStrokes([]);
    setCurrent([]);
  };

  const exportPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    // Higher-res export
    const scale = 2;
    const off = document.createElement("canvas");
    off.width = canvas.width * scale;
    off.height = canvas.height * scale;
    const octx = off.getContext("2d");
    if (octx) {
      octx.scale(scale, scale);
      // Re-render into offscreen (simplified: drawImage current)
      octx.drawImage(canvas, 0, 0);
    }
    const url = off.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `mandala-utilihub-${Date.now()}.png`;
    a.click();
    setTimeout(() => setExporting(false), 600);
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], "mandala.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Mandala UtiliHub",
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
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {labels.symmetry}
          </span>
          {[4, 6, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSymmetry(n)}
              className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                symmetry === n
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {labels.brush}
          </span>
          {(["neon", "sparkle", "glow", "ink"] as Brush[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrush(b)}
              className={`min-h-[36px] rounded-full px-3 py-1.5 text-xs font-medium transition ${
                brush === b
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {labels[b]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.color}
        </span>
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`h-8 w-8 rounded-full border-2 transition ${
              color === c ? "border-white scale-110 shadow-md" : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: c }}
            aria-label={c}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={undo}
          className="min-h-[40px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
        >
          {labels.undo}
        </button>
        <button
          type="button"
          onClick={clear}
          className="min-h-[40px] rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
        >
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={exportPng}
          disabled={exporting}
          className="min-h-[40px] rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
        >
          {exporting ? "…" : labels.export}
        </button>
        <button
          type="button"
          onClick={share}
          className="min-h-[40px] rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          {labels.share}
        </button>
      </div>

      <div className="relative mx-auto aspect-square max-w-[640px] overflow-hidden rounded-3xl border border-slate-700/40 bg-black shadow-2xl">
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
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 select-none text-xs text-white/55">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
