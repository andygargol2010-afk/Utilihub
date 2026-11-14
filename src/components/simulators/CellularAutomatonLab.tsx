"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { CellularAutomatonElementary } from "./CellularAutomatonElementary";

type Locale = "en" | "es" | "pt";

const N = 48;
const CELL = 10;
const SIZE = N * CELL;

const labels = {
  en: {
    note: "Life-like rules: each generation, a dead cell is born if its live-neighbour count is in the Birth set, and a live cell survives if its count is in the Survive set. The grid wraps around the edges.",
    rules: "Rule presets",
    conway: "Conway B3/S23",
    highlife: "HighLife",
    seeds: "Seeds",
    dayNight: "Day & Night",
    maze: "Maze",
    birth: "Birth (B)",
    survive: "Survive (S)",
    neighbours: "live neighbours",
    tool: "Tap tool",
    cells: "Toggle cells",
    glider: "Glider",
    blinker: "Blinker",
    pulsar: "Pulsar",
    rpent: "R-pentomino",
    gun: "Glider gun",
    play: "Play",
    pause: "Pause",
    step: "Step",
    clear: "Clear",
    random: "Random",
    speed: "Speed",
    slow: "Slow",
    normal: "Normal",
    fast: "Fast",
    generation: "Generation",
    population: "Live cells",
    ruleLabel: "Rule",
    gridAria: "Cellular automaton grid. Tap a cell to toggle it or to place the selected pattern.",
    stateAria: (g: number, p: number) => `Generation ${g}, ${p} live cells`,
    stable: "Nothing changes any more — the pattern is stable or empty.",
    keys: "Keys: Space play/pause · S step · R random · C clear",
    tab2d: "Life-like 2D",
    tab1d: "Elementary 1D",
    spark: "Population over generations",
  },
  es: {
    note: "Reglas tipo Life: en cada generación, una celda muerta nace si su cantidad de vecinas vivas está en el conjunto de Nacimiento, y una celda viva sobrevive si su cantidad está en el conjunto de Supervivencia. La grilla se envuelve en los bordes.",
    rules: "Reglas predefinidas",
    conway: "Conway B3/S23",
    highlife: "HighLife",
    seeds: "Semillas",
    dayNight: "Día y Noche",
    maze: "Laberinto",
    birth: "Nacimiento (B)",
    survive: "Supervivencia (S)",
    neighbours: "vecinas vivas",
    tool: "Herramienta al tocar",
    cells: "Alternar celdas",
    glider: "Planeador",
    blinker: "Parpadeador",
    pulsar: "Púlsar",
    rpent: "R-pentominó",
    gun: "Cañón de planeadores",
    play: "Reproducir",
    pause: "Pausar",
    step: "Paso",
    clear: "Limpiar",
    random: "Aleatorio",
    speed: "Velocidad",
    slow: "Lenta",
    normal: "Normal",
    fast: "Rápida",
    generation: "Generación",
    population: "Celdas vivas",
    ruleLabel: "Regla",
    gridAria: "Grilla de autómata celular. Tocá una celda para alternarla o para colocar el patrón elegido.",
    stateAria: (g: number, p: number) => `Generación ${g}, ${p} celdas vivas`,
    stable: "Ya nada cambia: el patrón es estable o está vacío.",
    keys: "Teclas: Espacio reproducir/pausar · S paso · R aleatorio · C limpiar",
    tab2d: "Tipo Life 2D",
    tab1d: "Elemental 1D",
    spark: "Población por generación",
  },
} as const;

type T = {
  [K in keyof (typeof labels)["en"]]: (typeof labels)["en"][K] extends (...a: never[]) => string
    ? (g: number, p: number) => string
    : string;
};

type Rule = { b: boolean[]; s: boolean[] };

const mk = (b: number[], s: number[]): Rule => ({
  b: Array.from({ length: 9 }, (_, i) => b.includes(i)),
  s: Array.from({ length: 9 }, (_, i) => s.includes(i)),
});

const RULES: Record<string, Rule> = {
  conway: mk([3], [2, 3]),
  highlife: mk([3, 6], [2, 3]),
  seeds: mk([2], []),
  dayNight: mk([3, 6, 7, 8], [3, 4, 6, 7, 8]),
  maze: mk([3], [1, 2, 3, 4, 5]),
};

const PATTERNS: Record<string, string[]> = {
  glider: [".#.", "..#", "###"],
  blinker: ["###"],
  rpent: [".##", "##.", ".#."],
  pulsar: [
    "..###...###..",
    ".............",
    "#....#.#....#",
    "#....#.#....#",
    "#....#.#....#",
    "..###...###..",
    ".............",
    "..###...###..",
    "#....#.#....#",
    "#....#.#....#",
    "#....#.#....#",
    ".............",
    "..###...###..",
  ],
  gun: [
    "........................#...........",
    "......................#.#...........",
    "............##......##............##",
    "...........#...#....##............##",
    "##........#.....#...##..............",
    "##........#...#.##....#.#...........",
    "..........#.....#.......#...........",
    "...........#...#....................",
    "............##......................",
  ],
};

function ruleCode(r: Rule): string {
  const bs = r.b.map((v, i) => (v ? i : -1)).filter((i) => i >= 0).join("");
  const ss = r.s.map((v, i) => (v ? i : -1)).filter((i) => i >= 0).join("");
  return `B${bs}/S${ss}`;
}

function stepGrid(g: Uint8Array, r: Rule): Uint8Array {
  const out = new Uint8Array(N * N);
  for (let y = 0; y < N; y++) {
    const ym = ((y + N - 1) % N) * N;
    const y0 = y * N;
    const yp = ((y + 1) % N) * N;
    for (let x = 0; x < N; x++) {
      const xm = (x + N - 1) % N;
      const xp = (x + 1) % N;
      const n =
        (g[ym + xm] ?? 0) + (g[ym + x] ?? 0) + (g[ym + xp] ?? 0) + (g[y0 + xm] ?? 0) +
        (g[y0 + xp] ?? 0) + (g[yp + xm] ?? 0) + (g[yp + x] ?? 0) + (g[yp + xp] ?? 0);
      out[y0 + x] = g[y0 + x] ? (r.s[n] ? 1 : 0) : r.b[n] ? 1 : 0;
    }
  }
  return out;
}

function countLive(g: Uint8Array): number {
  let c = 0;
  for (let i = 0; i < g.length; i++) c += g[i] ?? 0;
  return c;
}

function sameGrid(a: Uint8Array, b: Uint8Array): boolean {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function stamp(g: Uint8Array, key: string, cx: number, cy: number): Uint8Array {
  const rows = PATTERNS[key] ?? [];
  const out = new Uint8Array(g);
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  const ox = cx - Math.floor(w / 2);
  const oy = cy - Math.floor(h / 2);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (rows[j]?.[i] === "#") out[((oy + j + N * 4) % N) * N + ((ox + i + N * 4) % N)] = 1;
    }
  }
  return out;
}

function initialGrid(): Uint8Array {
  return stamp(new Uint8Array(N * N), "rpent", Math.floor(N / 2), Math.floor(N / 2));
}

const btn =
  "min-h-10 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent disabled:opacity-50 motion-reduce:transition-none";
const on = "border-cyan-400 bg-cyan-950/40";

function LifeLike2D({ locale = "en" }: { locale?: Locale }) {
  const t = (locale === "es" ? labels.es : labels.en) as unknown as T;

  const [grid, setGrid] = useState<Uint8Array>(initialGrid);
  const [rule, setRule] = useState<Rule>(RULES['conway'] as Rule);
  const [gen, setGen] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [tool, setTool] = useState<string>("cells");
  const [settled, setSettled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<{ active: boolean; value: number }>({ active: false, value: 1 });
  const ruleRef = useRef(rule);
  ruleRef.current = rule;

  const pop = useMemo(() => countLive(grid), [grid]);
  const [hist, setHist] = useState<number[]>([]);
  const lastGenRef = useRef(-1);
  useEffect(() => {
    if (gen === 0) {
      lastGenRef.current = 0;
      setHist([pop]);
    } else if (gen !== lastGenRef.current) {
      lastGenRef.current = gen;
      setHist((h) => [...h, pop].slice(-120));
    }
  }, [gen, pop]);
  const code = useMemo(() => ruleCode(rule), [rule]);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= N; i += 1) {
      ctx.moveTo(i * CELL + 0.5, 0);
      ctx.lineTo(i * CELL + 0.5, SIZE);
      ctx.moveTo(0, i * CELL + 0.5);
      ctx.lineTo(SIZE, i * CELL + 0.5);
    }
    ctx.stroke();
    ctx.fillStyle = "#22d3ee";
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (grid[y * N + x]) ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 1, CELL - 1);
      }
    }
  }, [grid]);

  const doStep = useCallback(() => {
    setGrid((g) => {
      const next = stepGrid(g, ruleRef.current);
      if (sameGrid(g, next)) {
        setSettled(true);
        setPlaying(false);
        return g;
      }
      setSettled(false);
      setGen((n) => n + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!playing) return;
    const delay = speed === "slow" ? 320 : speed === "fast" ? 45 : 130;
    const id = setInterval(doStep, delay);
    return () => clearInterval(id);
  }, [playing, speed, doStep]);

  const clear = useCallback(() => {
    setGrid(new Uint8Array(N * N));
    setGen(0);
    setPlaying(false);
    setSettled(false);
  }, []);

  const randomize = useCallback(() => {
    const g = new Uint8Array(N * N);
    for (let i = 0; i < g.length; i++) g[i] = Math.random() < 0.28 ? 1 : 0;
    setGrid(g);
    setGen(0);
    setSettled(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLButtonElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "s" || e.key === "S") doStep();
      else if (e.key === "r" || e.key === "R") randomize();
      else if (e.key === "c" || e.key === "C") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doStep, randomize, clear]);

  const cellAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(N - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * N)));
    const y = Math.min(N - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * N)));
    return { x, y };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = cellAt(e);
    setSettled(false);
    if (tool !== "cells") {
      setGrid((g) => stamp(g, tool, x, y));
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrid((g) => {
      const v = g[y * N + x] ? 0 : 1;
      paintRef.current = { active: true, value: v };
      const out = new Uint8Array(g);
      out[y * N + x] = v;
      return out;
    });
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!paintRef.current.active) return;
    const { x, y } = cellAt(e);
    const v = paintRef.current.value;
    setGrid((g) => {
      if (g[y * N + x] === v) return g;
      const out = new Uint8Array(g);
      out[y * N + x] = v;
      return out;
    });
  };

  const endPaint = () => {
    paintRef.current.active = false;
  };

  const toggleBit = (kind: "b" | "s", i: number) => {
    setRule((r) => {
      const arr = [...r[kind]];
      arr[i] = !arr[i];
      return { ...r, [kind]: arr };
    });
    setSettled(false);
  };

  const applyRule = (key: string) => {
    const r = RULES[key];
    if (r) setRule({ b: [...r.b], s: [...r.s] });
    setSettled(false);
  };

  const toolKeys = ["cells", "glider", "blinker", "pulsar", "rpent", "gun"] as const;

  return (
    <div className="space-y-5">
      <p className="text-xs leading-relaxed text-muted-foreground">{t.note}</p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="self-center text-xs font-semibold text-muted-foreground">{t.rules}:</span>
        {(["conway", "highlife", "seeds", "dayNight", "maze"] as const).map((k) => (
          <button key={k} type="button" onClick={() => applyRule(k)} className={btn}>
            {t[k]}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(["b", "s"] as const).map((kind) => (
          <fieldset key={kind} className="rounded-xl border border-border p-3">
            <legend className="px-1 text-xs font-semibold text-muted-foreground">
              {kind === "b" ? t.birth : t.survive} — {t.neighbours}
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 9 }, (_, i) => (
                <label
                  key={i}
                  className={`inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-bold ${
                    rule[kind][i] === true ? on : "border-border bg-card"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rule[kind][i] === true}
                    onChange={() => toggleBit(kind, i)}
                    aria-label={`${kind === "b" ? t.birth : t.survive} ${i}`}
                  />
                  {i}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="self-center text-xs font-semibold text-muted-foreground">{t.tool}:</span>
        {toolKeys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTool(k)}
            aria-pressed={tool === k}
            className={`${btn} ${tool === k ? on : ""}`}
          >
            {t[k]}
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[480px]">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label={`${t.gridAria} ${t.stateAria(gen, pop)}`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={endPaint}
          onPointerCancel={endPaint}
          className="aspect-square w-full touch-none rounded-2xl border border-border"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPlaying((p) => !p)} className={`${btn} ${playing ? on : ""}`}>
          {playing ? t.pause : t.play}
        </button>
        <button type="button" onClick={doStep} className={btn}>
          {t.step}
        </button>
        <button type="button" onClick={randomize} className={btn}>
          {t.random}
        </button>
        <button type="button" onClick={clear} className={btn}>
          {t.clear}
        </button>
        <span className="ml-1 self-center text-xs font-semibold text-muted-foreground">{t.speed}:</span>
        {(["slow", "normal", "fast"] as const).map((k) => (
          <button key={k} type="button" onClick={() => setSpeed(k)} aria-pressed={speed === k} className={`${btn} ${speed === k ? on : ""}`}>
            {t[k]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm" aria-live="polite">
        <p className="font-semibold">
          {t.ruleLabel}: <span className="font-bold text-cyan-400">{code}</span>
        </p>
        <p>
          {t.generation}: {gen} · {t.population}: {pop}
        </p>
        {settled && <p className="text-muted-foreground">{t.stable}</p>}
        <Sparkline data={hist} label={t.spark} />
      </div>
      <p className="text-[11px] text-muted-foreground">{t.keys}</p>
    </div>
  );
}

function Sparkline({ data, label }: { data: number[]; label: string }) {
  const w = 240;
  const h = 40;
  const max = Math.max(1, ...data);
  const pts = data
    .map((v, i) => `${data.length > 1 ? (i / (data.length - 1)) * w : 0},${h - 2 - (v / max) * (h - 4)}`)
    .join(" ");
  return (
    <div className="mt-2">
      <p className="text-[11px] text-muted-foreground">
        {label} (max {max})
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${label}: ${data[data.length - 1] ?? 0}`} className="mt-1 h-10 w-full">
        <polyline points={pts} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function CellularAutomatonLab({ locale = "en" }: { locale?: Locale }) {
  const t = (locale === "es" ? labels.es : labels.en) as unknown as T;
  const [mode, setMode] = useState<"2d" | "1d">("2d");
  useEffect(() => {
    trackEvent("simulator_open", { id: "cellular-automaton-lab", locale });
  }, [locale]);
  return (
    <div className="space-y-5">
      <div className="flex gap-2" role="group">
        <button type="button" aria-pressed={mode === "2d"} onClick={() => setMode("2d")} className={`${btn} ${mode === "2d" ? on : ""}`}>
          {t.tab2d}
        </button>
        <button type="button" aria-pressed={mode === "1d"} onClick={() => setMode("1d")} className={`${btn} ${mode === "1d" ? on : ""}`}>
          {t.tab1d}
        </button>
      </div>
      {mode === "2d" ? <LifeLike2D locale={locale} /> : <CellularAutomatonElementary locale={locale} />}
    </div>
  );
}
