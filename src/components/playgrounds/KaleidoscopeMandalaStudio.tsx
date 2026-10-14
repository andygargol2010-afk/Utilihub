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
          ctx.lineWidth = 3;
          ctx.shadowColor = stroke.color;
          ctx.shadowBlur = 12;
          ctx.stroke();
        } else if (stroke.brush === "glow") {
          ctx.strokeStyle = stroke.color;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 14;
          ctx.shadowColor = stroke.color;
          ctx.shadowBlur = 20;
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.lineWidth = 4;
          ctx.shadowBlur = 6;
          ctx.stroke();
        } else if (stroke.brush === "ink") {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 0;
          ctx.stroke();
        } else if (stroke.brush === "sparkle") {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.8;
          ctx.stroke();
          // particles
          ctx.fillStyle = stroke.color;
          for (let i = 0; i < stroke.points.length; i += 3) {
            const p = stroke.points[i];
            const px = p.x * w;
            const py = p.y * h;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(px + (Math.random() - 0.5) * 8, py + (Math.random() - 0.5) * 8, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        ctx.restore();
      }
      ctx.restore();
    };

    strokes.forEach(drawStroke);

    // Live current stroke
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
      const size = Math.min(rect.width, 640);
      canvas.width = size;
      canvas.height = size;
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw]);

  const getPos = (e: React.PointerEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : (e as React.PointerEvent).clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : (e as React.PointerEvent).clientY;
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const p = getPos(e);
    setCurrent([p]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const p = getPos(e);
    setCurrent((prev) => [...prev, p]);
  };

  const onPointerUp = () => {
    if (!isDrawing || current.length < 2) {
      setIsDrawing(false);
      setCurrent([]);
      return;
    }
    setStrokes((prev) => [...prev, { points: current, color, brush, symmetry }]);
    setCurrent([]);
    setIsDrawing(false);
  };

  const undo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const clear = () => {
    setStrokes([]);
    setCurrent([]);
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `mandala-utilihub-${Date.now()}.png`;
    a.click();
    setTimeout(() => setExporting(false), 800);
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) return;
      const file = new File([blob], "mandala.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Mandala UtiliHub", text: labels.hint });
      } else {
        exportPng();
      }
    } catch {
      exportPng();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-muted-foreground">{labels.symmetry}</span>
          {[4, 6, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSymmetry(n)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                symmetry === n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-muted-foreground">{labels.brush}</span>
          {(["neon", "sparkle", "glow", "ink"] as Brush[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrush(b)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                brush === b ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {labels[b]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase text-muted-foreground">{labels.color}</span>
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`h-7 w-7 rounded-full border-2 ${
              color === c ? "border-white scale-110" : "border-transparent"
            }`}
            style={{ backgroundColor: c }}
            aria-label={c}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={undo} className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
          {labels.undo}
        </button>
        <button type="button" onClick={clear} className="rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
          {labels.clear}
        </button>
        <button
          type="button"
          onClick={exportPng}
          disabled={exporting}
          className="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          {exporting ? "…" : labels.export}
        </button>
        <button type="button" onClick={share} className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white">
          {labels.share}
        </button>
      </div>

      <div className="relative mx-auto aspect-square max-w-[640px] overflow-hidden rounded-3xl border border-slate-700/40 bg-black shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/60">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
