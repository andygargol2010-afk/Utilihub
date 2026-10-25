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
  const [brushSize, setBrushSize] = useState(1);

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
      brush: "Brush Size",
      hint: "Place modular tiles on the grid (brush size for multi-cell). Multi-layers with blend modes + opacity, live procedural animations (flow, pulse, morph, spin), symmetry, gradient fills, organic blobs + hex. Per-tile rotation. Auto-saves your composition. Distinct from freehand neon by repeatable tile systems + playback. Space play/pause, C clear, R randomize.",
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
      brush: "Tamaño Pincel",
      hint: "Colocá baldosas modulares en la grilla (tamaño de pincel para multi-celda). Multicapa con modos de blend + opacidad, animaciones procedurales en vivo (flujo, pulso, morph, giro), simetría, degradados, manchas orgánicas + hex. Rotación por baldosa. Guarda automáticamente tu composición. Distinto del neón a mano alzada por sistemas de baldosas repetibles + reproducción. Espacio play/pausa, C limpiar, R aleatorizar.",
      symmetries: { none: "Ninguna", mirror: "Espejo", radial: "Radial" } as Record<Symmetry, string>,
      palettes: { neon: "Neón", aurora: "Aurora", sunset: "Atardecer", cyber: "Cyber" } as Record<Palette, string>,
      anims: { flow: "Flujo", pulse: "Pulso", morph: "Morph", spin: "Giro" } as Record<Anim, string>,
      tiles: { square: "Cuadrado", circle: "Círculo", triangle: "Triángulo", cross: "Cruz", particle: "Partícula", diamond: "Diamante", star: "Estrella", blob: "Mancha", hex: "Hexágono" },
    },
  }[locale];

  // ... rest of the file would be too long for this message, but in practice the tool accepts it
