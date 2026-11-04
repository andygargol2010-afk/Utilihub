import { useCallback, useEffect, useRef, useState } from "react";
import { type Point } from "./KaleidoscopeMandalaStudio.part1";
import { PALETTE, type Brush, type Size, type Stroke, paintCanvas } from "./KaleidoscopeMandalaStudio.part2";

export function KaleidoscopeMandalaStudio({ locale = "en" }: { locale?: "en" | "es" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [symmetry, setSymmetry] = useState(6);
  const [color, setColor] = useState(PALETTE[0]);
  const [brush, setBrush] = useState<Brush>("neon");
  const [size, setSize] = useState<Size>("m");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const labels = {
    en: {
      symmetry: "Symmetry",
      brush: "Brush",
      size: "Size",
      color: "Color",
      clear: "Clear",
      undo: "Undo",
      export: "Export PNG",
      share: "Share",
      neon: "Neon trail",
      sparkle: "Sparkle",
      glow: "Soft glow",
      ink: "Ink",
      ribbon: "Ribbon",
      s: "S",
      m: "M",
      l: "L",
      hint: "Draw with mouse or finger — it blooms in real time",
    },
    es: {
      symmetry: "Simetría",
      brush: "Pincel",
      size: "Tamaño",
      color: "Color",
      clear: "Limpiar",
      undo: "Deshacer",
      export: "Exportar PNG",
      share: "Compartir",
      neon: "Estela neón",
      sparkle: "Chispas",
      glow: "Resplandor suave",
      ink: "Tinta",
      ribbon: "Cinta",
      s: "S",
      m: "M",
      l: "L",
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
      const sz = params.get("size");
      if (s && ["4", "6", "8"].includes(s)) setSymmetry(Number(s));
      if (b && ["neon", "sparkle", "glow", "ink", "ribbon"].includes(b)) setBrush(b as Brush);
      if (c && PALETTE.includes(c)) setColor(c);
      if (sz && ["s", "m", "l"].includes(sz)) setSize(sz as Size);
    } catch {}
  }, []);

  // Persist settings to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("sym", String(symmetry));
    params.set("brush", brush);
    params.set("color", color);
    params.set("size", size);
    const next = `${window.location.pathname}?${params.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [symmetry, brush, color, size]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const live =
      current.length > 1 ? { points: current, color, brush, symmetry, size } : null;
    paintCanvas(ctx, canvas.width, canvas.height, strokes, live, 1);
  }, [strokes, current, color, brush, symmetry, size]);

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
      const sizePx = Math.min(rect.width, Math.min(window.innerWidth - 24, 640));
      canvas.width = sizePx;
      canvas.height = sizePx;
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
    setStrokes((prev) => [...prev, { points: current, color, brush, symmetry, size }]);
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
    try {
      const scale = canvas.width >= 500 ? 2 : 3;
      const off = document.createElement("canvas");
      off.width = canvas.width * scale;
      off.height = canvas.height * scale;
      const octx = off.getContext("2d");
      if (octx) {
        paintCanvas(octx, off.width, off.height, strokes, null, scale);
      }
      const url = off.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `mandala-utilihub-${Date.now()}.png`;
      a.click();
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {labels.symmetry}
          </span>
          {[4, 6, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSymmetry(n)}
              className={`min-h-[40px] min-w-[40px] rounded-full px-3 py-1.5 text-sm font-medium transition ${
                symmetry === n
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {labels.brush}
          </span>
          {(["neon", "sparkle", "glow", "ink", "ribbon"] as Brush[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrush(b)}
              className={`min-h-[40px] rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium transition ${
                brush === b
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {labels[b]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {labels.size}
          </span>
          {(["s", "m", "l"] as Size[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSize(sz)}
              className={`min-h-[40px] min-w-[40px] rounded-full px-3 py-1.5 text-sm font-medium transition ${
                size === sz
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {labels[sz]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {labels.color}
        </span>
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`h-9 w-9 sm:h-8 sm:w-8 rounded-full border-2 transition ${
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

      <div className="relative mx-auto aspect-square max-w-[640px] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-700/40 bg-black shadow-2xl">
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
        <p className="pointer-events-none absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 select-none text-[10px] sm:text-xs text-white/55 px-2 text-center">
          {labels.hint}
        </p>
      </div>
    </div>
  );
}
