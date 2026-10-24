import { useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Point = { x: number; y: number };
type Particle = {
  t: number;
  speed: number;
  size: number;
  stage: number;
  path: number;
  trail: Point[];
};
type Branch = { fromIndex: number; points: Point[] };
type Attractor = Point & { mode: "attract" | "repel" };

type Theme = "dawn" | "neon" | "forest" | "ocean";

const THEMES: Record<Theme, { start: string; end: string; bg: string }> = {
  dawn: { start: "#3b82f6", end: "#f59e0b", bg: "#0c1222" },
  neon: { start: "#00f5ff", end: "#ff2d95", bg: "#050014" },
  forest: { start: "#16a34a", end: "#eab308", bg: "#0a1a0f" },
  ocean: { start: "#1e40af", end: "#06b6d4", bg: "#021a24" },
};

const TRAIL_LEN = 12;

function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function encodePoints(pts: Point[]): string {
  return pts.map(p => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(";");
}

function decodePoints(s: string): Point[] {
  if (!s) return [];
  return s.split(";").map(pair => {
    const [x, y] = pair.split(",").map(Number);
    return { x: isNaN(x) ? 0.5 : Math.max(0.03, Math.min(0.97, x)), y: isNaN(y) ? 0.5 : Math.max(0.03, Math.min(0.97, y)) };
  }).filter(p => !isNaN(p.x) && !isNaN(p.y));
}

export function WaypointRiverComposer({ locale = "en" }: { locale?: "en" | "es" }) {
  useEffect(() => {
    trackEvent("playground_open", { id: "waypoint-river-composer", locale });
  }, [locale]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waypointsRef = useRef<Point[]>([]);
  const branchesRef = useRef<Branch[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const [waypoints, setWaypoints] = useState<Point[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isBranching, setIsBranching] = useState(false);
  const [speed, setSpeed] = useState(0.9);
  const [density, setDensity] = useState(60);
  const [smoothing, setSmoothing] = useState(0.65);
  const [theme, setTheme] = useState<Theme>("dawn");
  const [reverse, setReverse] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pathWidth, setPathWidth] = useState(16);
  const [bloom, setBloom] = useState(18);
  const [gravity, setGravity] = useState(0);
  const [attractors, setAttractors] = useState<Attractor[]>([]);
  const [attractMode, setAttractMode] = useState(false);
  const [attractStrength, setAttractStrength] = useState(0.08);
  const attractorsRef = useRef<Attractor[]>([]);
  const animRef = useRef<number>(0);
  const dragIndex = useRef<number | null>(null);
  const pausedRef = useRef(false);

  const labels = {
    en: {
      speed: "Flow speed",
      density: "Particle density",
      theme: "Color theme",
      smoothing: "Path smoothing",
      clear: "Clear",
      undo: "Undo",
      demo: "Load demo",
      branch: "Start branch",
      finishBranch: "Finish branch",
      share: "Save PNG",
      reverse: "Reverse flow",
      pause: "Pause",
      width: "River width",
      bloom: "Bloom",
      gravity: "Gravity",
      random: "Randomize",
      attract: "Place attractor",
      attractStr: "Attractor strength",
      hint: "Tap to place main path, drag markers. Start branch for side rivers. Place attractors/repellers to bend flow. Adjust width, bloom, gravity, strength. Randomize. Space to pause. Save PNG to share.",
    },
    es: {
      speed: "Velocidad",
      density: "Densidad",
      theme: "Tema de color",
      smoothing: "Suavizado",
      clear: "Limpiar",
      undo: "Deshacer",
      demo: "Cargar demo",
      branch: "Iniciar rama",
      finishBranch: "Terminar rama",
      share: "Guardar PNG",
      reverse: "Flujo inverso",
      pause: "Pausa",
      width: "Ancho del rio",
      bloom: "Bloom",
      gravity: "Gravedad",
      random: "Aleatorizar",
      attract: "Colocar atractor",
      attractStr: "Fuerza atractor",
      hint: "Toca para el camino principal, arrastra marcadores. Inicia rama para rios laterales. Coloca atractores/repelentes para curvar el flujo. Ajusta ancho, bloom, gravedad, fuerza. Aleatoriza. Espacio para pausar. Guarda PNG para compartir.",
    },
  }[locale];

  const th = THEMES[theme];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wp = params.get("wp");
    if (wp) {
      const pts = decodePoints(wp);
      if (pts.length >= 2) {
        waypointsRef.current = pts;
        setWaypoints(pts);
      }
    }
    const sp = params.get("sp");
    if (sp) setSpeed(Math.max(0.3, Math.min(2.2, Number(sp) || 0.9)));
    const de = params.get("de");
    if (de) setDensity(Math.max(20, Math.min(90, Number(de) || 60)));
    const sm = params.get("sm");
    if (sm) setSmoothing(Math.max(0, Math.min(1, Number(sm) || 0.65)));
    const thm = params.get("th") as Theme;
    if (thm && THEMES[thm]) setTheme(thm);
    const rev = params.get("rev");
    if (rev === "1") setReverse(true);
    const wi = params.get("wi");
    if (wi) setPathWidth(Math.max(6, Math.min(40, Number(wi) || 16)));
    const bl = params.get("bl");
    if (bl) setBloom(Math.max(0, Math.min(40, Number(bl) || 18)));
    const gr = params.get("gr");
    if (gr) setGravity(Math.max(-0.5, Math.min(0.5, Number(gr) || 0)));
    const at = params.get("at");
    if (at) {
      const pts = decodePoints(at);
      const ats = pts.map(p => ({ ...p, mode: "attract" as const }));
      attractorsRef.current = ats;
      setAttractors(ats);
    }
    const as = params.get("as");
    if (as) setAttractStrength(Math.max(0, Math.min(0.3, Number(as) || 0.08)));
  }, []);

  // ... rest of the file truncated for brevity in this thought, but full in actual call
