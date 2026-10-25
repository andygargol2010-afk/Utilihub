import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Tile = { type: string; color: string; color2?: string; phase: number; rot?: number };
type Layer = { id: number; tiles: (Tile | null)[][]; opacity: number; blend: GlobalCompositeOperation };

type Palette = "neon" | "aurora" | "sunset" | "cyber";
type Symmetry = "none" | "mirror" | "radial";
type Anim = "flow" | "pulse" | "morph" | "spin";

const PALETTES: Record<Palette, string[]> = {
  neon: ["#ff00ff", "#00ffff", "#39ff14", "#ff073a", "#fe019a", "#0ff0fc"],
  aurora: ["#7df9ff", "#b388ff", "#80ffdb", "#c77dff", "#48bfe3", "#64dfdf"],
  sunset: ["#ff6b6b", "#ff8e53", "#ffd93d", "#ff6b9d", "#c44569", "#f8b500"],
  cyber: ["#00f5ff", "#ff00aa", "#b026ff", "#00ff9f", "#ffea00", "#ff2e97"],
};

const TILE_TYPES = ["square", "circle", "triangle", "cross", "particle", "diamond", "star", "blob", "hex"];

const GRID = 12;
const BLENDS: GlobalCompositeOperation[] = ["source-over", "lighter", "screen", "overlay", "multiply"];

export function ModularPatternComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "modular-pattern-composer", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<Layer[]>([]);
  const nextId = useRef(1);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const playingRef = useRef(true);
  const activeLayerIdx = useRef(0);

  const [palette, setPalette] = useState<Palette>("neon");
  const [symmetry, setSymmetry] = useState<Symmetry>("mirror");
  const [anim, setAnim] = useState<Anim>("flow");
  const [tileType, setTileType] = useState("square");
  const [speed, setSpeed] = useState(1);
  const [globalOpacity, setGlobalOpacity] = useState(0.9);
  const [title, setTitle] = useState("");
  const [playing, setPlaying] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [layersTick, setLayersTick] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);
  const [eraseMode, setEraseMode] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(1);
  const [layerBlend, setLayerBlend] = useState<GlobalCompositeOperation>("source-over");

  const colors = PALETTES[palette];

  const labels = {
    en: {
      palette: "Palette",
      symmetry: "Symmetry",
      anim: "Animation",
      tile: "Tile",
      speed: "Speed",
      opacity: "Global Opacity",
      title: "Title",
      play: "Play",
      pause: "Pause",
      clear: "Clear All",
      randomize: "Randomize",
      export: "Share PNG",
      addLayer: "Add Layer",
      layer: "Active Layer",
      layerOp: "Layer Opacity",
      blend: "Blend",
      erase: "Erase",
      place: "Place",
      hint: "Place modular tiles on the grid. Multi-layers with blend modes + opacity, live procedural animations (flow, pulse, morph, spin), symmetry, gradient fills, organic blobs + hex. Per-tile rotation. Auto-saves your composition. Distinct from freehand neon by repeatable tile systems + playback. Space play/pause, C clear, R randomize.",
      symmetries: { none: "None", mirror: "Mirror", radial: "Radial" } as Record<Symmetry, string>,
      palettes: { neon: "Neon", aurora: "Aurora", sunset: "Sunset", cyber: "Cyber" } as Record<Palette, string>,
      anims: { flow: "Flow", pulse: "Pulse", morph: "Morph", spin: "Spin" } as Record<Anim, string>,
      tiles: { square: "Square", circle: "Circle", triangle: "Triangle", cross: "Cross", particle: "Particle", diamond: "Diamond", star: "Star", blob: "Blob", hex: "Hex" },
    },
    es: {
      palette: "Paleta",
      symmetry: "Simetría",
      anim: "Animación",
      tile: "Baldosa",
      speed: "Velocidad",
      opacity: "Opacidad Global",
      title: "Título",
      play: "Reproducir",
      pause: "Pausa",
      clear: "Limpiar Todo",
      randomize: "Aleatorizar",
      export: "Compartir PNG",
      addLayer: "Añadir Capa",
      layer: "Capa Activa",
      layerOp: "Opacidad Capa",
      blend: "Blend",
      erase: "Borrar",
      place: "Colocar",
      hint: "Colocá baldosas modulares en la grilla. Multicapa con modos de blend + opacidad, animaciones procedurales en vivo (flujo, pulso, morph, giro), simetría, degradados, manchas orgánicas + hex. Rotación por baldosa. Guarda automáticamente tu composición. Distinto del neón a mano alzada por sistemas de baldosas repetibles + reproducción. Espacio play/pausa, C limpiar, R aleatorizar.",
      symmetries: { none: "Ninguna", mirror: "Espejo", radial: "Radial" } as Record<Symmetry, string>,
      palettes: { neon: "Neón", aurora: "Aurora", sunset: "Atardecer", cyber: "Cyber" } as Record<Palette, string>,
      anims: { flow: "Flujo", pulse: "Pulso", morph: "Morph", spin: "Giro" } as Record<Anim, string>,
      tiles: { square: "Cuadrado", circle: "Círculo", triangle: "Triángulo", cross: "Cruz", particle: "Partícula", diamond: "Diamante", star: "Estrella", blob: "Mancha", hex: "Hexágono" },
    },
  }[locale];

  // URL hydrate
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const c = p.get("c") as Palette | null; if (c && PALETTES[c]) setPalette(c);
      const s = p.get("s") as Symmetry | null; if (s && ["none","mirror","radial"].includes(s)) setSymmetry(s);
      const a = p.get("a") as Anim | null; if (a && ["flow","pulse","morph","spin"].includes(a)) setAnim(a);
      const sp = p.get("sp"); if (sp) setSpeed(Math.max(0.2, Math.min(3, Number(sp))));
      const o = p.get("o"); if (o) setGlobalOpacity(Math.max(0.2, Math.min(1, Number(o))));
      const t = p.get("t"); if (t) setTitle(decodeURIComponent(t).slice(0, 40));
    } catch {}
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    p.set("c", palette);
    p.set("s", symmetry);
    p.set("a", anim);
    p.set("sp", String(speed));
    p.set("o", String(globalOpacity));
    if (title) p.set("t", encodeURIComponent(title.slice(0, 40))); else p.delete("t");
    const next = `${window.location.pathname}?${p.toString()}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [palette, symmetry, anim, speed, globalOpacity, title]);

  // localStorage persistence of composition
  const STORAGE_KEY = "utilihub-modular-pattern-v1";
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.layers && Array.isArray(data.layers) && data.layers.length > 0 && data.layers.length <= 6) {
          layersRef.current = data.layers;
          nextId.current = Math.max(...data.layers.map((l: Layer) => l.id), 0) + 1;
          activeLayerIdx.current = Math.min(data.activeLayer ?? 0, data.layers.length - 1);
          setActiveLayer(activeLayerIdx.current);
          const l = data.layers[activeLayerIdx.current];
          if (l) {
            setLayerOpacity(l.opacity);
            setLayerBlend(l.blend);
          }
          setLayersTick((t) => t + 1);
          trackEvent("playground_load", { id: "modular-pattern-composer", locale, source: "localStorage" });
        }
      }
    } catch {}
  }, [locale]);

  useEffect(() => {
    try {
      const data = {
        layers: layersRef.current,
        activeLayer: activeLayerIdx.current,
        palette, symmetry, anim, speed, globalOpacity, title, tileType,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [layersTick, palette, symmetry, anim, speed, globalOpacity, title, tileType]);

  const ensureLayer = useCallback(() => {
    if (layersRef.current.length === 0) {
      const tiles = Array.from({ length: GRID }, () => Array(GRID).fill(null));
      layersRef.current.push({ id: nextId.current++, tiles, opacity: 1, blend: "source-over" });
      activeLayerIdx.current = 0;
      setActiveLayer(0);
    }
  }, []);

  useEffect(() => { ensureLayer(); }, [ensureLayer]);

  const addLayer = () => {
    if (layersRef.current.length >= 6) return; // modest cap for CWV
    const tiles = Array.from({ length: GRID }, () => Array(GRID).fill(null));
    layersRef.current.push({ id: nextId.current++, tiles, opacity: 1, blend: "source-over" });
    const idx = layersRef.current.length - 1;
    activeLayerIdx.current = idx;
    setActiveLayer(idx);
    setLayerOpacity(1);
    setLayerBlend("source-over");
    setLayersTick((t) => t + 1);
    trackEvent("playground_add_layer", { id: "modular-pattern-composer", locale, count: layersRef.current.length });
  };

  const selectLayer = (idx: number) => {
    if (idx >= 0 && idx < layersRef.current.length) {
      activeLayerIdx.current = idx;
      setActiveLayer(idx);
      const l = layersRef.current[idx];
      setLayerOpacity(l.opacity);
      setLayerBlend(l.blend);
    }
  };

  const updateActiveLayer = (op?: number, bl?: GlobalCompositeOperation) => {
    const idx = activeLayerIdx.current;
    if (layersRef.current[idx]) {
      if (op !== undefined) layersRef.current[idx].opacity = op;
      if (bl) layersRef.current[idx].blend = bl;
      setLayersTick((t) => t + 1);
    }
  };

  const placeTile = useCallback((gx: number, gy: number) => {
    ensureLayer();
    const layer = layersRef.current[activeLayerIdx.current];
    if (!layer) return;
    if (eraseMode) {
      layer.tiles[gy][gx] = null;
      if (symmetry === "mirror") layer.tiles[gy][GRID - 1 - gx] = null;
      else if (symmetry === "radial") {
        const cx = Math.floor(GRID / 2), cy = Math.floor(GRID / 2);
        const dx = gx - cx, dy = gy - cy;
        for (let k = 1; k < 4; k++) {
          const ang = (k * Math.PI) / 2;
          const rx = Math.round(cx + dx * Math.cos(ang) - dy * Math.sin(ang));
          const ry = Math.round(cy + dx * Math.sin(ang) + dy * Math.cos(ang));
          if (rx >= 0 && rx < GRID && ry >= 0 && ry < GRID) layer.tiles[ry][rx] = null;
        }
      }
    } else {
      const col = colors[Math.floor(Math.random() * colors.length)];
      const col2 = colors[Math.floor(Math.random() * colors.length)];
      const tile = { type: tileType, color: col, color2: col2 !== col ? col2 : undefined, phase: Math.random() * Math.PI * 2, rot: Math.random() * Math.PI * 2 };
      layer.tiles[gy][gx] = tile;
      if (symmetry === "mirror") {
        layer.tiles[gy][GRID - 1 - gx] = { ...tile, phase: Math.random() * Math.PI * 2, rot: Math.random() * Math.PI * 2 };
      } else if (symmetry === "radial") {
        const cx = Math.floor(GRID / 2), cy = Math.floor(GRID / 2);
        const dx = gx - cx, dy = gy - cy;
        for (let k = 1; k < 4; k++) {
          const ang = (k * Math.PI) / 2;
          const rx = Math.round(cx + dx * Math.cos(ang) - dy * Math.sin(ang));
          const ry = Math.round(cy + dx * Math.sin(ang) + dy * Math.cos(ang));
          if (rx >= 0 && rx < GRID && ry >= 0 && ry < GRID) {
            layer.tiles[ry][rx] = { ...tile, phase: Math.random() * Math.PI * 2, rot: Math.random() * Math.PI * 2 };
          }
        }
      }
    }
    setLayersTick((t) => t + 1);
  }, [colors, tileType, symmetry, ensureLayer, eraseMode]);

  const drawTile = (ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number, size: number, t: number) => {
    const phase = tile.phase + t * speed * 0.8;
    let scale = 1;
    if (anim === "pulse") scale = 0.7 + 0.4 * Math.sin(phase);
    if (anim === "morph") scale = 0.6 + 0.5 * Math.abs(Math.sin(phase * 0.7));
    const s = size * 0.7 * scale;
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    let rot = tile.rot ?? 0;
    if (anim === "spin") rot += phase * 0.6;
    ctx.rotate(rot);
    if (tile.color2) {
      const g = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
      g.addColorStop(0, tile.color);
      g.addColorStop(1, tile.color2);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = tile.color;
    }
    ctx.globalAlpha = 0.85;
    if (tile.type === "square") {
      ctx.fillRect(-s / 2, -s / 2, s, s);
    } else if (tile.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tile.type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(s / 2, s / 2);
      ctx.lineTo(-s / 2, s / 2);
      ctx.closePath();
      ctx.fill();
    } else if (tile.type === "cross") {
      ctx.fillRect(-s / 6, -s / 2, s / 3, s);
      ctx.fillRect(-s / 2, -s / 6, s, s / 3);
    } else if (tile.type === "particle") {
      for (let i = 0; i < 5; i++) {
        const a = phase + i * 1.2;
        const r = s * 0.4 * (0.5 + 0.5 * Math.sin(a));
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2 + Math.sin(a) * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (tile.type === "diamond") {
      ctx.beginPath();
      ctx.moveTo(0, -s / 2);
      ctx.lineTo(s / 2, 0);
      ctx.lineTo(0, s / 2);
      ctx.lineTo(-s / 2, 0);
      ctx.closePath();
      ctx.fill();
    } else if (tile.type === "star") {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? s / 2 : s / 4;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    } else if (tile.type === "blob") {
      ctx.beginPath();
      const pts = 6;
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2 + phase * 0.3;
        const r = s * 0.4 * (0.7 + 0.3 * Math.sin(a * 2 + phase));
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (tile.type === "hex") {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const px = Math.cos(a) * (s / 2);
        const py = Math.sin(a) * (s / 2);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cell = Math.min(w, h) / GRID;

    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, w, h);

    if (playingRef.current) timeRef.current += 0.016 * speed;

    layersRef.current.forEach((layer) => {
      ctx.globalCompositeOperation = layer.blend;
      ctx.globalAlpha = layer.opacity * globalOpacity;
      for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
          const tile = layer.tiles[y][x];
          if (tile) {
            const px = (x + 0.5) * cell - cell / 2;
            const py = (y + 0.5) * cell - cell / 2;
            let ox = 0, oy = 0;
            if (anim === "flow") {
              ox = Math.sin(timeRef.current + x * 0.4) * 4;
              oy = Math.cos(timeRef.current + y * 0.4) * 4;
            }
            drawTile(ctx, tile, px + ox, py + oy, cell, timeRef.current);
          }
        }
      }
    });
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    if (title) {
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 10;
      ctx.fillText(title.slice(0, 40), w / 2, 36);
      ctx.shadowBlur = 0;
    }

    animRef.current = requestAnimationFrame(tick);
  }, [anim, speed, globalOpacity, title]);

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

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cell = Math.min(r.width, r.height) / GRID;
    const gx = Math.floor(x / cell);
    const gy = Math.floor(y / cell);
    if (gx >= 0 && gx < GRID && gy >= 0 && gy < GRID) {
      placeTile(gx, gy);
    }
  };

  const clear = () => {
    layersRef.current = [];
    ensureLayer();
    setLayersTick((t) => t + 1);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    trackEvent("playground_clear", { id: "modular-pattern-composer", locale });
  };

  const randomize = () => {
    const pals: Palette[] = ["neon", "aurora", "sunset", "cyber"];
    const syms: Symmetry[] = ["none", "mirror", "radial"];
    const anims: Anim[] = ["flow", "pulse", "morph", "spin"];
    setPalette(pals[Math.floor(Math.random() * pals.length)]);
    setSymmetry(syms[Math.floor(Math.random() * syms.length)]);
    setAnim(anims[Math.floor(Math.random() * anims.length)]);
    setSpeed(0.5 + Math.random() * 2);
    setGlobalOpacity(0.6 + Math.random() * 0.35);
    // seed a few tiles on active layer for immediate visual
    ensureLayer();
    const layer = layersRef.current[activeLayerIdx.current];
    if (layer) {
      for (let i = 0; i < 8; i++) {
        const gx = Math.floor(Math.random() * GRID);
        const gy = Math.floor(Math.random() * GRID);
        const col = colors[Math.floor(Math.random() * colors.length)];
        const col2 = colors[Math.floor(Math.random() * colors.length)];
        const types = TILE_TYPES;
        const tile = { type: types[Math.floor(Math.random() * types.length)], color: col, color2: col2 !== col ? col2 : undefined, phase: Math.random() * Math.PI * 2, rot: Math.random() * Math.PI * 2 };
        layer.tiles[gy][gx] = tile;
      }
      setLayersTick((t) => t + 1);
    }
    trackEvent("playground_randomize", { id: "modular-pattern-composer", locale });
  };

  const togglePlay = () => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      else if (e.key === "c" || e.key === "C") clear();
      else if (e.key === "r" || e.key === "R") randomize();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, clear, randomize]);

  const exportPng = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    try {
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(canvas, 0, 0);
      octx.fillStyle = "rgba(255,255,255,0.88)";
      octx.font = "bold 14px system-ui, sans-serif";
      octx.textAlign = "left";
      octx.fillText("utilihub.com", 12, off.height - 16);
      const count = layersRef.current.reduce((n, l) => n + l.tiles.flat().filter(Boolean).length, 0);
      octx.font = "11px system-ui, sans-serif";
      octx.fillText(`${anim} · ${symmetry} · ${count} tiles · ${layersRef.current.length} layers`, 12, off.height - 32);
      if (title) {
        octx.font = "bold 20px system-ui, sans-serif";
        octx.textAlign = "center";
        octx.fillText(title.slice(0, 40), off.width / 2, 28);
      }
      const dataUrl = off.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `modular-pattern-${Date.now()}.png`;
      a.click();
      trackEvent("playground_share", { id: "modular-pattern-composer", type: "png", locale });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{labels.hint}</p>
      <div className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-2xl border border-primary/20 bg-[#050510] shadow-lg">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-crosshair"
          onPointerDown={onPointer}
          onPointerMove={(e) => e.buttons && onPointer(e)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium">
          {labels.palette}
          <select value={palette} onChange={(e) => setPalette(e.target.value as Palette)} className="mt-1 w-full rounded border bg-background px-2 py-1">
            {Object.entries(labels.palettes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium">
          {labels.symmetry}
          <select value={symmetry} onChange={(e) => setSymmetry(e.target.value as Symmetry)} className="mt-1 w-full rounded border bg-background px-2 py-1">
            {Object.entries(labels.symmetries).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium">
          {labels.anim}
          <select value={anim} onChange={(e) => setAnim(e.target.value as Anim)} className="mt-1 w-full rounded border bg-background px-2 py-1">
            {Object.entries(labels.anims).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium">
          {labels.tile}
          <select value={tileType} onChange={(e) => setTileType(e.target.value)} className="mt-1 w-full rounded border bg-background px-2 py-1">
            {Object.entries(labels.tiles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <label className="text-xs font-medium">
          {labels.speed}
          <input type="range" min={0.2} max={3} step={0.1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {labels.opacity}
          <input type="range" min={0.2} max={1} step={0.05} value={globalOpacity} onChange={(e) => setGlobalOpacity(Number(e.target.value))} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium col-span-2">
          {labels.title}
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 40))} className="mt-1 w-full rounded border bg-background px-2 py-1" maxLength={40} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-medium">{labels.layer}:</span>
        {layersRef.current.map((_, i) => (
          <button key={i} onClick={() => selectLayer(i)} className={`rounded px-2 py-1 ${i === activeLayer ? "bg-primary text-primary-foreground" : "border"}`}>{i + 1}</button>
        ))}
        <button onClick={addLayer} className="rounded border px-2 py-1" disabled={layersRef.current.length >= 6}>{labels.addLayer}</button>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={eraseMode} onChange={(e) => setEraseMode(e.target.checked)} />
          {eraseMode ? labels.erase : labels.place}
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium">
          {labels.layerOp}
          <input type="range" min={0.1} max={1} step={0.05} value={layerOpacity} onChange={(e) => { const v = Number(e.target.value); setLayerOpacity(v); updateActiveLayer(v); }} className="mt-1 w-full" />
        </label>
        <label className="text-xs font-medium">
          {labels.blend}
          <select value={layerBlend} onChange={(e) => { const v = e.target.value as GlobalCompositeOperation; setLayerBlend(v); updateActiveLayer(undefined, v); }} className="mt-1 w-full rounded border bg-background px-2 py-1">
            {BLENDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={togglePlay} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{playing ? labels.pause : labels.play}</button>
        <button onClick={clear} className="rounded-lg border px-4 py-2 text-sm">{labels.clear}</button>
        <button onClick={randomize} className="rounded-lg border px-4 py-2 text-sm">{labels.randomize}</button>
        <button onClick={exportPng} disabled={exporting} className="rounded-lg border px-4 py-2 text-sm">{labels.export}</button>
      </div>
    </div>
  );
}

