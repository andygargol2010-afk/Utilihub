import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type ToolId = "pencil" | "eraser" | "eyedropper" | "fill" | "line" | "rect" | "circle";
type Symmetry = "none" | "x" | "y" | "xy";

const SIZES = [8, 16, 32, 64, 128, 256] as const;
const MAX_LAYERS = 4;
const STORAGE_KEY = "utilihub-pixelihub-v1";

/** Fixed 24-color studio palette + transparent handled by eraser */
const PALETTE = [
  "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#e94560", "#ff6b6b", "#feca57", "#ff9ff3",
  "#54a0ff", "#5f27cd", "#01a3a4", "#10ac84",
  "#ffffff", "#c8d6e5", "#8395a7", "#576574",
  "#222f3e", "#ee5a24", "#f79f1f", "#a3cb38",
  "#1289a7", "#d980fa", "#bdc3c7", "#6c5ce7",
];

function emptyLayer(n: number): string[] {
  return Array(n * n).fill("");
}

function cloneLayers(layers: string[][]): string[][] {
  return layers.map((l) => l.slice());
}

function exampleLayers(id: string, size: number): string[][] {
  const layer = emptyLayer(size);
  const set = (x: number, y: number, c: string) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    layer[y * size + x] = c;
  };
  const mid = Math.floor(size / 2);
  if (id === "heart") {
    const s = size / 32;
    const pts = [
      [8, 6], [9, 5], [10, 5], [11, 6], [12, 7], [13, 8], [14, 9], [15, 10],
      [16, 10], [17, 9], [18, 8], [19, 7], [20, 6], [21, 5], [22, 5], [23, 6],
      [23, 7], [22, 8], [21, 10], [20, 12], [18, 15], [16, 18], [15, 20], [14, 18],
      [12, 15], [10, 12], [9, 10], [8, 8], [8, 7],
    ];
    for (const [x, y] of pts) set(Math.floor(x * s), Math.floor(y * s), "#e94560");
  } else if (id === "smiley") {
    const r = Math.floor(size * 0.35);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - mid;
        const dy = y - mid;
        if (dx * dx + dy * dy <= r * r) set(x, y, "#feca57");
      }
    }
    const eye = Math.max(1, Math.floor(size / 16));
    for (let dy = -eye; dy <= eye; dy++)
      for (let dx = -eye; dx <= eye; dx++) {
        set(mid - Math.floor(size / 6) + dx, mid - Math.floor(size / 8) + dy, "#1a1a2e");
        set(mid + Math.floor(size / 6) + dx, mid - Math.floor(size / 8) + dy, "#1a1a2e");
      }
    for (let a = 0.2; a < Math.PI - 0.2; a += 0.08) {
      const x = mid + Math.floor(Math.cos(a) * r * 0.55);
      const y = mid + Math.floor(Math.sin(a) * r * 0.55);
      set(x, y, "#1a1a2e");
    }
  } else if (id === "sword") {
    for (let y = 2; y < size - 4; y++) set(mid, y, "#c8d6e5");
    for (let x = mid - 3; x <= mid + 3; x++) set(x, size - 5, "#f79f1f");
    set(mid, 1, "#ffffff");
    set(mid, size - 3, "#ee5a24");
    set(mid, size - 2, "#ee5a24");
  } else if (id === "tree") {
    for (let y = mid; y < size - 2; y++) {
      set(mid, y, "#576574");
      set(mid - 1, y, "#576574");
    }
    for (let y = 4; y < mid + 2; y++)
      for (let x = mid - (mid - y + 2); x <= mid + (mid - y + 2); x++)
        if (x >= 0 && x < size) set(x, y, "#10ac84");
  } else {
    for (let y = 4; y < size - 4; y++) {
      set(6, y, "#5f27cd");
      set(7, y, "#5f27cd");
    }
    for (let x = 6; x < Math.min(size - 6, 18); x++) {
      set(x, 4, "#5f27cd");
      set(x, 5, "#5f27cd");
      set(x, Math.floor(size / 2), "#5f27cd");
    }
    for (let y = 4; y <= Math.floor(size / 2); y++) {
      set(Math.min(size - 7, 17), y, "#5f27cd");
    }
  }
  return [layer, emptyLayer(size)];
}

function floodFill(data: string[], size: number, x: number, y: number, target: string, repl: string) {
  if (target === repl) return;
  const stack: [number, number][] = [[x, y]];
  const seen = new Uint8Array(size * size);
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cy < 0 || cx >= size || cy >= size) continue;
    const i = cy * size + cx;
    if (seen[i]) continue;
    seen[i] = 1;
    if (data[i] !== target) continue;
    data[i] = repl;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

function plotLine(x0: number, y0: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  let dx = Math.abs(x1 - x0);
  let dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    plot(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function plotRect(x0: number, y0: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);
  for (let x = minX; x <= maxX; x++) {
    plot(x, minY);
    plot(x, maxY);
  }
  for (let y = minY; y <= maxY; y++) {
    plot(minX, y);
    plot(maxX, y);
  }
}

function plotCircle(cx: number, cy: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  const r = Math.max(Math.abs(x1 - cx), Math.abs(y1 - cy));
  let x = r;
  let y = 0;
  let err = 1 - r;
  while (x >= y) {
    plot(cx + x, cy + y);
    plot(cx + y, cy + x);
    plot(cx - y, cy + x);
    plot(cx - x, cy + y);
    plot(cx - x, cy - y);
    plot(cx - y, cy - x);
    plot(cx + y, cy - x);
    plot(cx + x, cy - y);
    y++;
    if (err < 0) err += 2 * y + 1;
    else {
      x--;
      err += 2 * (y - x) + 1;
    }
  }
}

function encodeShare(size: number, layers: string[][]): string {
  try {
    const payload = JSON.stringify({ v: 1, size, layers });
    return btoa(unescape(encodeURIComponent(payload)));
  } catch {
    return "";
  }
}

function decodeShare(raw: string): { size: number; layers: string[][] } | null {
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const data = JSON.parse(json) as { v?: number; size?: number; layers?: string[][] };
    if (!data.size || !Array.isArray(data.layers)) return null;
    if (!SIZES.includes(data.size as (typeof SIZES)[number])) return null;
    return { size: data.size, layers: data.layers.map((l) => l.slice(0, data.size! * data.size!)) };
  } catch {
    return null;
  }
}

export function PixelArtStudio({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [size, setSize] = useState(32);
  const [layers, setLayers] = useState<string[][]>(() => [emptyLayer(32), emptyLayer(32)]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [layerVisible, setLayerVisible] = useState([true, true, true, true]);
  const [tool, setTool] = useState<ToolId>("pencil");
  const [color, setColor] = useState("#e94560");
  const [symmetry, setSymmetry] = useState<Symmetry>("none");
  const [zoom, setZoom] = useState(12);
  const [history, setHistory] = useState<string[][][]>([]);
  const [future, setFuture] = useState<string[][][]>([]);
  const [status, setStatus] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const startCell = useRef<{ x: number; y: number } | null>(null);
  const snapshot = useRef<string[][] | null>(null);

  const t = useMemo(
    () =>
      es
        ? {
            title: "PixeliHub",
            subtitle: "Estudio de pixel art en el navegador",
            size: "Tamaño",
            tools: "Herramientas",
            pencil: "Lápiz",
            eraser: "Goma",
            eyedropper: "Gotero",
            fill: "Relleno",
            line: "Línea",
            rect: "Rectángulo",
            circle: "Círculo",
            color: "Color",
            custom: "Personalizado",
            layers: "Capas",
            addLayer: "Añadir capa",
            sym: "Simetría",
            symNone: "Ninguna",
            zoom: "Zoom",
            undo: "Deshacer",
            redo: "Rehacer",
            clear: "Limpiar capa",
            export: "Exportar PNG",
            copy: "Copiar imagen",
            share: "Copiar enlace",
            examples: "Ejemplos",
            tip: "Clic o arrastrá para pintar. Rueda = zoom. Escritorio prioritario; móvil usable.",
          }
        : {
            title: "PixeliHub",
            subtitle: "Browser pixel-art studio",
            size: "Size",
            tools: "Tools",
            pencil: "Pencil",
            eraser: "Eraser",
            eyedropper: "Eyedropper",
            fill: "Fill",
            line: "Line",
            rect: "Rectangle",
            circle: "Circle",
            color: "Color",
            custom: "Custom",
            layers: "Layers",
            addLayer: "Add layer",
            sym: "Symmetry",
            symNone: "None",
            zoom: "Zoom",
            undo: "Undo",
            redo: "Redo",
            clear: "Clear layer",
            export: "Export PNG",
            copy: "Copy image",
            share: "Copy link",
            examples: "Examples",
            tip: "Click or drag to paint. Wheel = zoom. Desktop-first; mobile usable.",
          },
    [es],
  );

  const pushHistory = useCallback((next: string[][]) => {
    setHistory((h) => [...h.slice(-39), cloneLayers(next)]);
    setFuture([]);
  }, []);

  const compositeColor = useCallback(
    (i: number): string => {
      for (let li = layers.length - 1; li >= 0; li--) {
        if (!layerVisible[li]) continue;
        const c = layers[li]?.[i];
        if (c) return c;
      }
      return "";
    },
    [layers, layerVisible],
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const px = zoom;
    canvas.width = size * px;
    canvas.height = size * px;
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const light = (x + y) % 2 === 0;
        ctx.fillStyle = light ? "#2a2a32" : "#1e1e24";
        ctx.fillRect(x * px, y * px, px, px);
        const c = compositeColor(y * size + x);
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(x * px, y * px, px, px);
        }
      }
    }
    if (px >= 8) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= size; i++) {
        ctx.beginPath();
        ctx.moveTo(i * px + 0.5, 0);
        ctx.lineTo(i * px + 0.5, size * px);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * px + 0.5);
        ctx.lineTo(size * px, i * px + 0.5);
        ctx.stroke();
      }
    }
  }, [size, zoom, compositeColor]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    try {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash.startsWith("px=")) {
        const decoded = decodeShare(hash.slice(3));
        if (decoded) {
          setSize(decoded.size);
          setLayers(decoded.layers);
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { size?: number; layers?: string[][] };
        if (data.size && data.layers) {
          setSize(data.size);
          setLayers(data.layers);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ size, layers }));
    } catch {
      /* ignore */
    }
  }, [size, layers]);

  const paintAt = (data: string[], x: number, y: number, col: string) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    data[y * size + x] = col;
    const mirror = (mx: number, my: number) => {
      if (mx < 0 || my < 0 || mx >= size || my >= size) return;
      data[my * size + mx] = col;
    };
    if (symmetry === "x" || symmetry === "xy") mirror(size - 1 - x, y);
    if (symmetry === "y" || symmetry === "xy") mirror(x, size - 1 - y);
    if (symmetry === "xy") mirror(size - 1 - x, size - 1 - y);
  };

  const cellFromEvent = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * size);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * size);
    if (x < 0 || y < 0 || x >= size || y >= size) return null;
    return { x, y };
  };

  const applyTool = (x: number, y: number, endX?: number, endY?: number) => {
    setLayers((prev) => {
      const next = cloneLayers(prev);
      const data = next[activeLayer];
      if (!data) return prev;
      const col = tool === "eraser" ? "" : color;
      if (tool === "eyedropper") {
        const c = compositeColor(y * size + x);
        if (c) setColor(c);
        return prev;
      }
      if (tool === "fill") {
        floodFill(data, size, x, y, data[y * size + x] ?? "", col);
        pushHistory(next);
        return next;
      }
      if (tool === "pencil" || tool === "eraser") {
        paintAt(data, x, y, col);
        return next;
      }
      if (startCell.current && endX !== undefined && endY !== undefined) {
        const sx = startCell.current.x;
        const sy = startCell.current.y;
        if (snapshot.current) {
          for (let i = 0; i < data.length; i++) data[i] = snapshot.current[activeLayer][i];
        }
        const plot = (px: number, py: number) => paintAt(data, px, py, col);
        if (tool === "line") plotLine(sx, sy, endX, endY, plot);
        if (tool === "rect") plotRect(sx, sy, endX, endY, plot);
        if (tool === "circle") plotCircle(sx, sy, endX, endY, plot);
      }
      return next;
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const cell = cellFromEvent(e);
    if (!cell) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    drawing.current = true;
    startCell.current = cell;
    snapshot.current = cloneLayers(layers);
    if (tool === "pencil" || tool === "eraser" || tool === "fill" || tool === "eyedropper") {
      applyTool(cell.x, cell.y);
    } else {
      applyTool(cell.x, cell.y, cell.x, cell.y);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const cell = cellFromEvent(e);
    if (!cell) return;
    if (tool === "pencil" || tool === "eraser") applyTool(cell.x, cell.y);
    else if (tool === "line" || tool === "rect" || tool === "circle") applyTool(cell.x, cell.y, cell.x, cell.y);
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (tool !== "eyedropper") {
      setLayers((curr) => {
        pushHistory(curr);
        return curr;
      });
    }
    startCell.current = null;
    snapshot.current = null;
  };

  const changeSize = (n: number) => {
    pushHistory(layers);
    setSize(n);
    setLayers([emptyLayer(n), emptyLayer(n)]);
    setActiveLayer(0);
  };

  const loadExample = (id: string) => {
    pushHistory(layers);
    const n = size >= 32 ? size : 32;
    if (n !== size) setSize(n);
    setLayers(exampleLayers(id, n));
    setActiveLayer(0);
  };

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [cloneLayers(layers), ...f]);
      setLayers(cloneLayers(prev));
      return h.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture((f) => {
      if (!f.length) return f;
      const [next, ...rest] = f;
      setHistory((h) => [...h, cloneLayers(layers)]);
      setLayers(cloneLayers(next));
      return rest;
    });
  };

  const exportPng = async (copy: boolean) => {
    const off = document.createElement("canvas");
    off.width = size;
    off.height = size;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    for (let i = 0; i < size * size; i++) {
      const c = compositeColor(i);
      if (!c) continue;
      const x = i % size;
      const y = Math.floor(i / size);
      ctx.fillStyle = c;
      ctx.fillRect(x, y, 1, 1);
    }
    if (copy) {
      try {
        const blob = await new Promise<Blob | null>((res) => off.toBlob(res, "image/png"));
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setStatus(es ? "Imagen copiada" : "Image copied");
        }
      } catch {
        setStatus(es ? "No se pudo copiar" : "Copy failed");
      }
      return;
    }
    const a = document.createElement("a");
    a.href = off.toDataURL("image/png");
    a.download = `pixelihub-${size}.png`;
    a.click();
    setStatus(es ? "PNG descargado" : "PNG downloaded");
  };

  const shareLink = async () => {
    const token = encodeShare(size, layers);
    if (!token) {
      setStatus(es ? "Escena demasiado grande para el enlace" : "Scene too large for link");
      return;
    }
    const url = `${window.location.pathname}${window.location.search}#px=${token}`;
    try {
      await navigator.clipboard.writeText(url);
      window.location.hash = `px=${token}`;
      setStatus(es ? "Enlace copiado" : "Link copied");
    } catch {
      setStatus(es ? "No se pudo copiar el enlace" : "Could not copy link");
    }
  };

  const toolBtn = (id: ToolId, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTool(id)}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${
        tool === id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <h2 className="text-lg font-black tracking-tight">{t.title}</h2>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t.tip}</p>
        </div>
        <div
          className="overflow-auto rounded-xl border border-border/60 bg-[#121218] p-3"
          onWheel={(e) => {
            e.preventDefault();
            setZoom((z) => Math.min(32, Math.max(4, z + (e.deltaY > 0 ? -1 : 1))));
          }}
        >
          <canvas
            ref={canvasRef}
            className="mx-auto touch-none cursor-crosshair"
            style={{ imageRendering: "pixelated", maxWidth: "100%" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        </div>
        {status ? <p className="text-xs font-medium text-primary">{status}</p> : null}
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-72">
        <div className="rounded-xl border border-border/60 bg-card p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.size}</p>
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => changeSize(n)}
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  size === n ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.tools}</p>
          <div className="flex flex-wrap gap-1.5">
            {toolBtn("pencil", t.pencil)}
            {toolBtn("eraser", t.eraser)}
            {toolBtn("eyedropper", t.eyedropper)}
            {toolBtn("fill", t.fill)}
            {toolBtn("line", t.line)}
            {toolBtn("rect", t.rect)}
            {toolBtn("circle", t.circle)}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.color}</p>
          <div className="mb-2 flex flex-wrap gap-1">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => setColor(c)}
                className={`size-6 rounded-md border-2 ${color === c ? "border-primary" : "border-transparent"}`}
                style={{ background: c }}
              />
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span>{t.custom}</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
            />
          </label>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.layers}</p>
          <div className="space-y-1">
            {layers.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLayer(i)}
                  className={`flex-1 rounded-md px-2 py-1 text-left text-xs font-bold ${
                    activeLayer === i ? "bg-primary/15 text-primary" : "bg-muted"
                  }`}
                >
                  {es ? `Capa ${i + 1}` : `Layer ${i + 1}`}
                </button>
                <button
                  type="button"
                  className="text-xs text-muted-foreground"
                  onClick={() =>
                    setLayerVisible((v) => {
                      const n = v.slice();
                      n[i] = !n[i];
                      return n;
                    })
                  }
                >
                  {layerVisible[i] ? "👁" : "—"}
                </button>
              </div>
            ))}
          </div>
          {layers.length < MAX_LAYERS ? (
            <button
              type="button"
              className="mt-2 w-full rounded-lg bg-muted py-1.5 text-xs font-bold"
              onClick={() => {
                pushHistory(layers);
                setLayers((L) => [...L, emptyLayer(size)]);
              }}
            >
              {t.addLayer}
            </button>
          ) : null}
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.sym}</p>
          <div className="flex flex-wrap gap-1.5">
            {(["none", "x", "y", "xy"] as Symmetry[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSymmetry(s)}
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  symmetry === s ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {s === "none" ? t.symNone : s.toUpperCase()}
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center justify-between text-xs">
            <span>{t.zoom}</span>
            <input
              type="range"
              min={4}
              max={32}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-28"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button type="button" className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-bold" onClick={undo}>
            {t.undo}
          </button>
          <button type="button" className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-bold" onClick={redo}>
            {t.redo}
          </button>
          <button
            type="button"
            className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-bold"
            onClick={() => {
              pushHistory(layers);
              setLayers((L) => {
                const n = cloneLayers(L);
                n[activeLayer] = emptyLayer(size);
                return n;
              });
            }}
          >
            {t.clear}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button type="button" className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-bold text-primary-foreground" onClick={() => exportPng(false)}>
            {t.export}
          </button>
          <button type="button" className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-bold" onClick={() => exportPng(true)}>
            {t.copy}
          </button>
          <button type="button" className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-bold" onClick={shareLink}>
            {t.share}
          </button>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.examples}</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              ["heart", es ? "Corazón" : "Heart"],
              ["smiley", es ? "Cara" : "Smiley"],
              ["sword", es ? "Espada" : "Sword"],
              ["tree", es ? "Árbol" : "Tree"],
              ["logo", "P"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="rounded-md bg-muted px-2 py-1 text-xs font-bold"
                onClick={() => loadExample(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
