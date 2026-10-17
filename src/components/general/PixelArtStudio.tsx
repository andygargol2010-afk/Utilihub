import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type ToolId = "pencil" | "eraser" | "eyedropper" | "fill" | "line" | "rect" | "circle";
type Symmetry = "none" | "x" | "y" | "xy";

const SIZES = [8, 16, 32, 64, 128, 256] as const;
const MAX_LAYERS = 4;
const STORAGE_KEY = "utilihub-pixelihub-v1";
/* palettes-v1 */
const PALETTE_PRESETS: { id: string; labelEn: string; labelEs: string; colors: string[] }[] = [
  {
    id: "default",
    labelEn: "Default",
    labelEs: "Default",
    colors: [
      "#000000", "#1a1a2e", "#16213e", "#0f3460", "#e94560", "#ff6b6b", "#feca57", "#ff9ff3",
      "#54a0ff", "#5f27cd", "#01a3a4", "#10ac84", "#ffffff", "#c8d6e5", "#8395a7", "#576574",
      "#222f3e", "#ee5a24", "#f79f1f", "#a3cb38", "#1289a7", "#d980fa", "#bdc3c7", "#6c5ce7",
    ],
  },
  {
    id: "pico",
    labelEn: "Retro 16",
    labelEs: "Retro 16",
    colors: [
      "#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
      "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa",
    ],
  },
  {
    id: "earth",
    labelEn: "Earth",
    labelEs: "Tierra",
    colors: [
      "#1a120b", "#3d2914", "#6b4226", "#a67c52", "#d4a574", "#f5e6d3", "#2d4a22", "#4a7c3f",
      "#8fbc8f", "#c4e0c4", "#4a3728", "#8b6914", "#c9a227", "#5c4033", "#ffffff", "#000000",
    ],
  },
  {
    id: "pastel",
    labelEn: "Pastel",
    labelEs: "Pastel",
    colors: [
      "#f8f1f1", "#ffe5ec", "#ffc2d1", "#ffb3c6", "#ff8fab", "#fb6f92", "#e0aaff", "#c77dff",
      "#9b5de5", "#a0c4ff", "#bdb2ff", "#caffbf", "#fdffb6", "#ffd6a5", "#ffadad", "#2b2d42",
    ],
  },
  {
    id: "mono",
    labelEn: "Mono",
    labelEs: "Mono",
    colors: [
      "#000000", "#111111", "#222222", "#333333", "#555555", "#777777", "#999999", "#bbbbbb",
      "#dddddd", "#ffffff", "#1a1a1a", "#2e2e2e", "#424242", "#616161", "#9e9e9e", "#e0e0e0",
    ],
  },
  {
    id: "neon",
    labelEn: "Neon",
    labelEs: "Neón",
    colors: [
      "#0d0d0d", "#1a0033", "#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fff01f", "#ff6ec7",
      "#7df9ff", "#b6ff00", "#fe019a", "#0ff0fc", "#ccff00", "#ff3131", "#ffffff", "#222222",
    ],
  },
];

function emptyLayer(n: number) { return Array(n * n).fill("") as string[]; }
function cloneLayers(layers: string[][]) { return layers.map((l) => l.slice()); }

/* share-v1 */
function toBase64Url(str: string) {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromBase64Url(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return decodeURIComponent(escape(atob(b64)));
}
function encodeSharePayload(size: number, layers: string[][]) {
  const L = layers.map((layer) => {
    const sparse: string[] = [];
    for (let i = 0; i < layer.length; i++) {
      const c = layer[i];
      if (c && c.startsWith("#") && c.length === 7) sparse.push(`${i}:${c.slice(1)}`);
    }
    return sparse;
  });
  return toBase64Url(JSON.stringify({ v: 1, s: size, L }));
}
function decodeSharePayload(encoded: string): { size: number; layers: string[][] } | null {
  try {
    const data = JSON.parse(fromBase64Url(encoded)) as { v?: number; s?: number; L?: string[][] };
    if (!data || data.v !== 1 || !data.s || !Array.isArray(data.L)) return null;
    const size = data.s;
    if (![8, 16, 32, 64, 128, 256].includes(size)) return null;
    const layers = data.L.slice(0, 4).map((sparse) => {
      const layer = emptyLayer(size);
      if (!Array.isArray(sparse)) return layer;
      for (const entry of sparse) {
        const [idxStr, hex] = entry.split(":");
        const idx = Number(idxStr);
        if (!Number.isFinite(idx) || idx < 0 || idx >= size * size) continue;
        if (!hex || !/^[0-9a-fA-F]{6}$/.test(hex)) continue;
        layer[idx] = `#${hex.toLowerCase()}`;
      }
      return layer;
    });
    if (!layers.length) layers.push(emptyLayer(size));
    return { size, layers };
  } catch {
    return null;
  }
}

function floodFill(data: string[], size: number, x: number, y: number, target: string, repl: string) {
  if (target === repl) return;
  const stack: [number, number][] = [[x, y]];
  const seen = new Uint8Array(size * size);
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cy < 0 || cx >= size || cy >= size) continue;
    const i = cy * size + cx;
    if (seen[i] || data[i] !== target) continue;
    seen[i] = 1; data[i] = repl;
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

function plotLine(x0: number, y0: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    plot(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function plotRect(x0: number, y0: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
  for (let x = minX; x <= maxX; x++) { plot(x, minY); plot(x, maxY); }
  for (let y = minY; y <= maxY; y++) { plot(minX, y); plot(maxX, y); }
}

function plotCircle(cx: number, cy: number, x1: number, y1: number, plot: (x: number, y: number) => void) {
  const r = Math.max(Math.abs(x1 - cx), Math.abs(y1 - cy));
  let x = r, y = 0, err = 1 - r;
  while (x >= y) {
    plot(cx + x, cy + y); plot(cx + y, cy + x); plot(cx - y, cy + x); plot(cx - x, cy + y);
    plot(cx - x, cy - y); plot(cx - y, cy - x); plot(cx + y, cy - x); plot(cx + x, cy - y);
    y++;
    if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
  }
}

export function PixelArtStudio({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [size, setSize] = useState(32);
  const [layers, setLayers] = useState(() => [emptyLayer(32), emptyLayer(32)]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [layerVisible, setLayerVisible] = useState([true, true, true, true]);
  /* opacity-v1 */
  const [layerOpacity, setLayerOpacity] = useState([100, 100, 100, 100]);
  const [tool, setTool] = useState<ToolId>("pencil");
  const [color, setColor] = useState("#e94560");
  const [paletteId, setPaletteId] = useState("default");
  const [customColors, setCustomColors] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("utilihub-pixelihub-custom-colors");
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) return parsed.filter((c) => typeof c === "string").slice(0, 16);
      }
    } catch { /* ignore */ }
    return [];
  });
  const [symmetry, setSymmetry] = useState<Symmetry>("none");
  const [zoom, setZoom] = useState(12);
  const [brushSize, setBrushSize] = useState(1);
  /* export-nx-v1 */
  const [exportScale, setExportScale] = useState(4);
  const [history, setHistory] = useState<string[][][]>([]);
  const [future, setFuture] = useState<string[][][]>([]);
  const [status, setStatus] = useState("");
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* import-v1 */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const startCell = useRef<{ x: number; y: number } | null>(null);
  const snapshot = useRef<string[][] | null>(null);

  const t = useMemo(() => ({
    undo: es ? "Deshacer" : "Undo", redo: es ? "Rehacer" : "Redo",
    export: "PNG", import: es ? "Importar" : "Import", copy: es ? "Copiar" : "Copy", share: es ? "Enlace" : "Link",
    size: es ? "Tamaño" : "Size", zoom: "Zoom", brush: es ? "Grosor" : "Brush", color: es ? "Color" : "Color", palette: es ? "Paleta" : "Palette", addColor: es ? "+ color" : "+ color",
    layers: es ? "Capas" : "Layers", opacity: es ? "Opacidad" : "Opacity", add: es ? "Añadir" : "Add", clear: es ? "Limpiar" : "Clear",
    sym: es ? "Simetría" : "Symmetry", none: es ? "No" : "None",
    tip: es ? "Clic/arrastrá · rueda = zoom · B/E/I/G · [ ] grosor · Ctrl+Z" : "Click/drag · wheel = zoom · B/E/I/G · [ ] brush · Ctrl+Z",
  }), [es]);

  const pushHistory = useCallback((next: string[][]) => {
    setHistory((h) => [...h.slice(-39), cloneLayers(next)]);
    setFuture([]);
  }, []);

  const compositeColor = useCallback((i: number) => {
    let r = 0, g = 0, b = 0, a = 0;
    for (let li = 0; li < layers.length; li++) {
      if (!layerVisible[li]) continue;
      const c = layers[li]?.[i];
      if (!c) continue;
      const oa = Math.max(0, Math.min(1, (layerOpacity[li] ?? 100) / 100));
      if (oa <= 0) continue;
      const m = /^#?([0-9a-fA-F]{6})$/.exec(c.trim());
      if (!m) continue;
      const n = parseInt(m[1], 16);
      const cr = (n >> 16) & 255, cg = (n >> 8) & 255, cb = n & 255;
      const outA = oa + a * (1 - oa);
      if (outA > 0) {
        r = (cr * oa + r * a * (1 - oa)) / outA;
        g = (cg * oa + g * a * (1 - oa)) / outA;
        b = (cb * oa + b * a * (1 - oa)) / outA;
      }
      a = outA;
    }
    if (a <= 0.001) return "";
    return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
  }, [layers, layerVisible, layerOpacity]);

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
        ctx.fillStyle = (x + y) % 2 === 0 ? "#2a2a32" : "#1e1e24";
        ctx.fillRect(x * px, y * px, px, px);
        const c = compositeColor(y * size + x);
        if (c) { ctx.fillStyle = c; ctx.fillRect(x * px, y * px, px, px); }
      }
    }
    /* cursor-preview-v1 */
    if (hoverCell && tool !== "eyedropper") {
      const hx = hoverCell.x;
      const hy = hoverCell.y;
      if (tool === "pencil" || tool === "eraser") {
        const half = Math.floor((brushSize - 1) / 2);
        ctx.save();
        ctx.globalAlpha = tool === "eraser" ? 0.35 : 0.45;
        ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.strokeStyle = tool === "eraser" ? "#f43f5e" : "#ffffff";
        ctx.lineWidth = Math.max(1, px * 0.12);
        for (let oy = 0; oy < brushSize; oy++) {
          for (let ox = 0; ox < brushSize; ox++) {
            const cx = hx - half + ox;
            const cy = hy - half + oy;
            if (cx < 0 || cy < 0 || cx >= size || cy >= size) continue;
            ctx.fillRect(cx * px, cy * px, px, px);
            ctx.strokeRect(cx * px + 0.5, cy * px + 0.5, px - 1, px - 1);
          }
        }
        ctx.restore();
      } else {
        ctx.save();
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = Math.max(1, px * 0.15);
        ctx.strokeRect(hx * px + 0.5, hy * px + 0.5, px - 1, px - 1);
        ctx.restore();
      }
    }
  }, [size, zoom, compositeColor, hoverCell, tool, brushSize, color]);

  useEffect(() => { redraw(); }, [redraw]);

  useEffect(() => {
    try {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const m = /^#ph=([A-Za-z0-9_-]+)/.exec(hash);
      if (m) {
        const decoded = decodeSharePayload(m[1]);
        if (decoded) {
          setSize(decoded.size);
          setLayers(decoded.layers);
          setActiveLayer(0);
          setStatus(es ? "Enlace cargado" : "Link loaded");
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { size?: number; layers?: string[][] };
        if (data.size && data.layers) { setSize(data.size); setLayers(data.layers); }
      }
    } catch { /* ignore */ }
  }, [es]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ size, layers })); } catch { /* ignore */ }
  }, [size, layers]);

  useEffect(() => {
    try { localStorage.setItem("utilihub-pixelihub-custom-colors", JSON.stringify(customColors)); } catch { /* ignore */ }
  }, [customColors]);

  const activePalette = useMemo(
    () => PALETTE_PRESETS.find((p) => p.id === paletteId) ?? PALETTE_PRESETS[0],
    [paletteId],
  );
  const paletteColors = activePalette.colors;

  const putPixel = (data: string[], x: number, y: number, col: string) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    data[y * size + x] = col;
    const mir = (mx: number, my: number) => {
      if (mx >= 0 && my >= 0 && mx < size && my < size) data[my * size + mx] = col;
    };
    if (symmetry === "x" || symmetry === "xy") mir(size - 1 - x, y);
    if (symmetry === "y" || symmetry === "xy") mir(x, size - 1 - y);
    if (symmetry === "xy") mir(size - 1 - x, size - 1 - y);
  };

  const paintAt = (data: string[], x: number, y: number, col: string) => {
    const half = Math.floor((brushSize - 1) / 2);
    for (let oy = 0; oy < brushSize; oy++) {
      for (let ox = 0; ox < brushSize; ox++) {
        putPixel(data, x - half + ox, y - half + oy, col);
      }
    }
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
        for (let li = layers.length - 1; li >= 0; li--) {
          if (!layerVisible[li]) continue;
          const c = layers[li]?.[y * size + x];
          if (c) { setColor(c); break; }
        }
        return prev;
      }
      if (tool === "fill") { /* stroke-undo-v1 */ floodFill(data, size, x, y, data[y * size + x] ?? "", col); pushHistory(prev); return next; }
      if (tool === "pencil" || tool === "eraser") { paintAt(data, x, y, col); return next; }
      if (startCell.current && endX !== undefined && endY !== undefined) {
        const sx = startCell.current.x, sy = startCell.current.y;
        if (snapshot.current) for (let i = 0; i < data.length; i++) data[i] = snapshot.current[activeLayer][i];
        const plot = (px: number, py: number) => putPixel(data, px, py, col);
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
    if (tool === "pencil" || tool === "eraser" || tool === "fill" || tool === "eyedropper") applyTool(cell.x, cell.y);
    else applyTool(cell.x, cell.y, cell.x, cell.y);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const cell = cellFromEvent(e);
    setHoverCell(cell);
    if (!drawing.current || !cell) return;
    if (tool === "pencil" || tool === "eraser") applyTool(cell.x, cell.y);
    else if (tool === "line" || tool === "rect" || tool === "circle") applyTool(cell.x, cell.y, cell.x, cell.y);
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    // One stroke = one undo: store state from before the stroke began.
    if (tool !== "eyedropper" && tool !== "fill" && snapshot.current) {
      pushHistory(snapshot.current);
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

  /* shortcuts-v1 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement | null)?.isContentEditable) return;

      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();

      if (mod && k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((mod && k === "z" && e.shiftKey) || (mod && k === "y")) {
        e.preventDefault();
        redo();
        return;
      }

      if (e.key === "[" || e.key === "]") {
        e.preventDefault();
        setBrushSize((n) => {
          if (e.key === "[") return Math.max(1, n - 1);
          return Math.min(8, n + 1);
        });
        return;
      }

      if (!mod && /^[1-8]$/.test(e.key)) {
        setBrushSize(Number(e.key));
        return;
      }

      if (mod) return;

      const toolMap: Record<string, ToolId> = {
        b: "pencil",
        p: "pencil",
        e: "eraser",
        i: "eyedropper",
        o: "eyedropper",
        g: "fill",
        f: "fill",
        l: "line",
        r: "rect",
        c: "circle",
      };
      const nextTool = toolMap[k];
      if (nextTool) {
        e.preventDefault();
        setTool(nextTool);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const exportPng = async (copy: boolean) => {
    const s = Math.max(1, Math.min(32, exportScale));
    const off = document.createElement("canvas");
    off.width = size * s;
    off.height = size * s;
    const ctx = off.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    for (let i = 0; i < size * size; i++) {
      const c = compositeColor(i);
      if (!c) continue;
      ctx.fillStyle = c;
      const x = (i % size) * s;
      const y = Math.floor(i / size) * s;
      ctx.fillRect(x, y, s, s);
    }
    if (copy) {
      try {
        const blob = await new Promise<Blob | null>((res) => off.toBlob(res, "image/png"));
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setStatus(es ? `Copiado ${s}×` : `Copied ${s}×`);
        }
      } catch { setStatus("Error"); }
      return;
    }
    const a = document.createElement("a");
    a.href = off.toDataURL("image/png");
    a.download = `pixelihub-${size}-${s}x.png`;
    a.click();
    setStatus(`PNG ${s}×`);
  };

  const importImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus(es ? "No es imagen" : "Not an image");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const off = document.createElement("canvas");
        off.width = size;
        off.height = size;
        const ctx = off.getContext("2d");
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;
        // Cover-fit: scale to fill canvas, center crop
        const scale = Math.max(size / img.width, size / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        const dx = (size - dw) / 2;
        const dy = (size - dh) / 2;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, dx, dy, dw, dh);
        const data = ctx.getImageData(0, 0, size, size).data;
        const layer = emptyLayer(size);
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const i = (y * size + x) * 4;
            const a = data[i + 3];
            if (a < 16) continue;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            layer[y * size + x] = hex;
          }
        }
        pushHistory(layers);
        setLayers((L) => {
          const next = cloneLayers(L);
          next[activeLayer] = layer;
          return next;
        });
        setStatus(es ? "Importado" : "Imported");
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setStatus("Error");
    };
    img.src = url;
  };

  const shareProject = async () => {
    try {
      const encoded = encodeSharePayload(size, layers);
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#ph=${encoded}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "PixeliHub", url });
          setStatus(es ? "Compartido" : "Shared");
          return;
        } catch {
          /* fall through to clipboard */
        }
      }
      await navigator.clipboard.writeText(url);
      setStatus(es ? "Enlace copiado" : "Link copied");
    } catch {
      setStatus("Error");
    }
  };

  const tools: { id: ToolId; icon: string; label: string }[] = [
    { id: "pencil", icon: "✎", label: "Pencil" },
    { id: "eraser", icon: "⌫", label: "Eraser" },
    { id: "eyedropper", icon: "◎", label: "Dropper" },
    { id: "fill", icon: "⬡", label: "Fill" },
    { id: "line", icon: "／", label: "Line" },
    { id: "rect", icon: "▭", label: "Rect" },
    { id: "circle", icon: "○", label: "Circle" },
  ];

  return (
    <div className="-m-1 overflow-hidden rounded-xl border border-zinc-700/80 bg-[#1a1a1f] text-zinc-100 shadow-inner sm:-m-2">
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-700/80 bg-[#121216] px-2 py-1.5">
        <span className="mr-1 text-[11px] font-black tracking-[0.18em] text-rose-400">PIXELIHUB</span>
        <div className="mx-1 h-4 w-px bg-zinc-700" />
        <button type="button" onClick={undo} disabled={!history.length} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-30">↶ {t.undo}</button>
        <button type="button" onClick={redo} disabled={!future.length} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-30">↷ {t.redo}</button>
        <div className="mx-1 h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-0.5 rounded bg-zinc-800/80 p-0.5">
          {[1, 2, 4, 8, 16].map((n) => (
            <button
              key={n}
              type="button"
              title={`${n}×`}
              onClick={() => setExportScale(n)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${exportScale === n ? "bg-rose-500 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              {n}×
            </button>
          ))}
        </div>
        <button type="button" onClick={() => exportPng(false)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↓ {t.export}</button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↑ {t.import}</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importImage(f);
            e.target.value = "";
          }}
        />
        <button type="button" onClick={() => exportPng(true)} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">{t.copy}</button>
        <button type="button" onClick={() => void shareProject()} className="rounded px-2 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-800">↗ {t.share}</button>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-500">{hoverCell ? `X:${hoverCell.x} Y:${hoverCell.y}` : "—"}</span>
          <span className="font-mono text-[10px] text-zinc-500">{size}×{size}</span>
        </div>
      </div>

      <div className="flex min-h-[min(70vh,560px)] flex-col md:flex-row">
        <div className="flex shrink-0 flex-row gap-0.5 overflow-x-auto border-b border-zinc-700/80 bg-[#141418] p-1.5 md:w-12 md:flex-col md:border-b-0 md:border-r">
          {tools.map((tb) => (
            <button key={tb.id} type="button" title={tb.label} onClick={() => setTool(tb.id)}
              className={`flex size-9 shrink-0 items-center justify-center rounded-md text-base ${tool === tb.id ? "bg-rose-500/90 text-white shadow" : "text-zinc-400 hover:bg-zinc-800"}`}>
              <span aria-hidden>{tb.icon}</span>
            </button>
          ))}
          <div className="mt-auto hidden size-8 rounded border border-zinc-600 md:block" style={{ background: color }} />
        </div>

        <div className="relative min-w-0 flex-1 bg-[#0e0e12]">
          <div className="flex h-full min-h-[280px] items-center justify-center overflow-auto p-3"
            onWheel={(e) => { e.preventDefault(); setZoom((z) => Math.min(32, Math.max(4, z + (e.deltaY > 0 ? -1 : 1)))); }}>
            <canvas ref={canvasRef} className={`touch-none rounded-sm ${tool === "eyedropper" ? "cursor-copy" : tool === "fill" ? "cursor-cell" : "cursor-none"}`}
              style={{ imageRendering: "pixelated" }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
              onPointerLeave={() => { onPointerUp(); setHoverCell(null); }} />
          </div>
          {status ? <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[11px] text-rose-300">{status}</p> : null}
        </div>

        <aside className="flex w-full shrink-0 flex-col border-t border-zinc-700/80 bg-[#141418] md:w-52 md:border-l md:border-t-0">
          <div className="border-b border-zinc-700/60 p-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.size}</p>
            <div className="flex flex-wrap gap-1">
              {SIZES.map((n) => (
                <button key={n} type="button" onClick={() => changeSize(n)}
                  className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${size === n ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300"}`}>{n}</button>
              ))}
            </div>
            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              {t.zoom}
              <input type="range" min={4} max={32} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="h-1 flex-1 accent-rose-500" />
              <span className="w-6 font-mono text-zinc-400">{zoom}</span>
            </label>
            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              {t.brush}
              <input type="range" min={1} max={8} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="h-1 flex-1 accent-rose-500" />
              <span className="w-6 font-mono text-zinc-400">{brushSize}px</span>
            </label>
            <div className="mt-1 flex flex-wrap gap-1">
              {[1, 2, 3, 4, 6, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBrushSize(n)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${brushSize === n ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="border-b border-zinc-700/60 p-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.palette}</p>
            <div className="mb-2 flex flex-wrap gap-1">
              {PALETTE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaletteId(p.id)}
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${paletteId === p.id ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                >
                  {es ? p.labelEs : p.labelEn}
                </button>
              ))}
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.color}</p>
            <div className="grid grid-cols-8 gap-0.5">
              {paletteColors.map((c) => (
                <button key={`${paletteId}-${c}`} type="button" title={c} onClick={() => setColor(c)}
                  className={`aspect-square rounded-sm ${color === c ? "ring-2 ring-rose-400 ring-offset-1 ring-offset-[#141418]" : ""}`}
                  style={{ background: c }} />
              ))}
            </div>
            {customColors.length > 0 ? (
              <div className="mt-1.5 grid grid-cols-8 gap-0.5">
                {customColors.map((c, idx) => (
                  <button
                    key={`custom-${idx}-${c}`}
                    type="button"
                    title={c}
                    onClick={() => setColor(c)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setCustomColors((arr) => arr.filter((_, j) => j !== idx));
                    }}
                    className={`aspect-square rounded-sm ${color === c ? "ring-2 ring-rose-400 ring-offset-1 ring-offset-[#141418]" : ""}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            ) : null}
            <div className="mt-2 flex items-center gap-2">
              <input type="color" value={color.length === 7 ? color : "#e94560"} onChange={(e) => setColor(e.target.value)}
                className="h-6 w-10 cursor-pointer rounded border border-zinc-600 bg-transparent" />
              <button
                type="button"
                className="rounded bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-300 hover:bg-zinc-700"
                onClick={() => {
                  const c = color.length === 7 ? color : "#e94560";
                  setCustomColors((arr) => {
                    if (arr.includes(c)) return arr;
                    return [...arr, c].slice(-16);
                  });
                }}
              >
                {t.addColor}
              </button>
            </div>
          </div>
          <div className="border-b border-zinc-700/60 p-2">
            {/* layers-reorder-v1 */}
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.layers}</p>
            {layers.map((_, i) => (
              <div key={i} className="mb-1 flex items-center gap-0.5">
                <button type="button" onClick={() => setActiveLayer(i)}
                  className={`min-w-0 flex-1 rounded px-1.5 py-1 text-left text-[11px] font-semibold ${activeLayer === i ? "bg-rose-500/20 text-rose-300" : "bg-zinc-800 text-zinc-400"}`}>
                  {es ? `Capa ${i + 1}` : `Layer ${i + 1}`}
                </button>
                <button type="button" title={es ? "Visible" : "Visible"} className="px-1 text-[11px] text-zinc-500"
                  onClick={() => setLayerVisible((v) => { const n = v.slice(); n[i] = !n[i]; return n; })}>
                  {layerVisible[i] ? "◉" : "○"}
                </button>
                <button type="button" title="Up" disabled={i === 0}
                  className="px-0.5 text-[10px] text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                  onClick={() => {
                    if (i === 0) return;
                    pushHistory(layers);
                    setLayers((L) => {
                      const n = cloneLayers(L);
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setLayerOpacity((v) => {
                      const n = v.slice();
                      [n[i - 1], n[i]] = [n[i], n[i - 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i - 1 : a === i - 1 ? i : a));
                  }}>↑</button>
                <button type="button" title="Down" disabled={i >= layers.length - 1}
                  className="px-0.5 text-[10px] text-zinc-500 hover:text-zinc-200 disabled:opacity-25"
                  onClick={() => {
                    if (i >= layers.length - 1) return;
                    pushHistory(layers);
                    setLayers((L) => {
                      const n = cloneLayers(L);
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setLayerVisible((v) => {
                      const n = v.slice();
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setLayerOpacity((v) => {
                      const n = v.slice();
                      [n[i + 1], n[i]] = [n[i], n[i + 1]];
                      return n;
                    });
                    setActiveLayer((a) => (a === i ? i + 1 : a === i + 1 ? i : a));
                  }}>↓</button>
                <button type="button" title={es ? "Eliminar" : "Delete"} disabled={layers.length <= 1}
                  className="px-0.5 text-[11px] text-zinc-500 hover:text-rose-400 disabled:opacity-25"
                  onClick={() => {
                    if (layers.length <= 1) return;
                    pushHistory(layers);
                    setLayers((L) => L.filter((_, j) => j !== i));
                    setLayerVisible((v) => {
                      const n = v.slice();
                      n.splice(i, 1);
                      while (n.length < MAX_LAYERS) n.push(true);
                      return n;
                    });
                    setLayerOpacity((v) => {
                      const n = v.slice();
                      n.splice(i, 1);
                      while (n.length < MAX_LAYERS) n.push(100);
                      return n;
                    });
                    setActiveLayer((a) => {
                      if (a > i) return a - 1;
                      if (a === i) return Math.max(0, i - 1);
                      return a;
                    });
                  }}>×</button>
              </div>
            ))}
            {layers.length < MAX_LAYERS ? (
              <button type="button" className="mt-1 w-full rounded bg-zinc-800 py-1 text-[11px] text-zinc-300"
                onClick={() => { pushHistory(layers); setLayers((L) => [...L, emptyLayer(size)]); }}>+ {t.add}</button>
            ) : null}
            <label className="mt-2 flex items-center gap-2 text-[10px] text-zinc-500">
              {t.opacity}
              <input
                type="range"
                min={0}
                max={100}
                value={layerOpacity[activeLayer] ?? 100}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLayerOpacity((op) => {
                    const n = op.slice();
                    while (n.length < MAX_LAYERS) n.push(100);
                    n[activeLayer] = val;
                    return n;
                  });
                }}
                className="h-1 flex-1 accent-rose-500"
              />
              <span className="w-8 font-mono text-zinc-400">{layerOpacity[activeLayer] ?? 100}%</span>
            </label>
            <button type="button" className="mt-1 w-full rounded py-1 text-[11px] text-zinc-500"
              onClick={() => { pushHistory(layers); setLayers((L) => { const n = cloneLayers(L); n[activeLayer] = emptyLayer(size); return n; }); }}>{t.clear}</button>
          </div>
          <div className="p-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">{t.sym}</p>
            <div className="flex flex-wrap gap-1">
              {(["none", "x", "y", "xy"] as Symmetry[]).map((s) => (
                <button key={s} type="button" onClick={() => setSymmetry(s)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${symmetry === s ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                  {s === "none" ? t.none : s}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-zinc-600">{t.tip}</p>
            <p className="mt-1 font-mono text-[9px] leading-relaxed text-zinc-500">
              B pencil · E eraser · I dropper · G fill · L line · R rect · C circle<br />
              [ ] brush · 1–8 size · Ctrl+Z undo · Ctrl+Shift+Z redo
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
