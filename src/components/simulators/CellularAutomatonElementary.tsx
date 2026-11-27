"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildUrl, copyText, downloadCanvas, drawCard, packBits } from "./cellularAutomatonShare";

type Locale = "en" | "es" | "pt";

export type ElemInit = { rule: number; g: Uint8Array | null };

const W = 81;
const H = 81;
const CELL = 8;

const labels = {
  en: {
    note: "Elementary automaton: one row of cells. Each new row is computed from the row above — a cell looks at itself and its two neighbours (8 possible patterns), and the rule table says what it becomes. Rule number 0-255 is just that table read as binary. Edges wrap around.",
    ruleNumber: "Rule number (0-255)",
    presets: "Presets",
    table: "Rule table — tap a result to flip it",
    seed: "Starting row",
    single: "Single cell",
    random: "Random row",
    play: "Play",
    pause: "Pause",
    step: "Step",
    reset: "Restart",
    speed: "Speed",
    slow: "Slow",
    normal: "Normal",
    fast: "Fast",
    rule: "Rule",
    rows: "Rows",
    live: "Live cells in last row",
    gridAria: "One-dimensional automaton: each row is generated from the row above.",
    stateAria: (r: number, n: number) => `Rule ${r}, ${n} rows`,
    keys: "Keys: Space play/pause · S step · R restart",
    resultOf: "Result for pattern",
    copyLink: "Copy share link",
    savePng: "Download PNG",
    copied: "Link copied to clipboard.",
    copyFail: "Could not copy the link — copy it from the address bar instead.",
    pngDone: "PNG card downloaded.",
    playingMsg: "Playing.",
    pausedMsg: "Paused.",
    hiddenMsg: "Paused because the tab is hidden.",
    shareTitle: "Cellular Automaton Lab",
    ruleWord: "Rule",
    rowsWord: "rows",
  },
  es: {
    note: "Autómata elemental: una sola fila de celdas. Cada fila nueva se calcula a partir de la anterior — una celda mira a sí misma y a sus dos vecinas (8 patrones posibles) y la tabla de la regla dice en qué se convierte. El número de regla 0-255 es esa tabla leída como binario. Los bordes se envuelven.",
    ruleNumber: "Número de regla (0-255)",
    presets: "Reglas predefinidas",
    table: "Tabla de la regla — tocá un resultado para invertirlo",
    seed: "Fila inicial",
    single: "Una celda",
    random: "Fila aleatoria",
    play: "Reproducir",
    pause: "Pausar",
    step: "Paso",
    reset: "Reiniciar",
    speed: "Velocidad",
    slow: "Lenta",
    normal: "Normal",
    fast: "Rápida",
    rule: "Regla",
    rows: "Filas",
    live: "Celdas vivas en la última fila",
    gridAria: "Autómata unidimensional: cada fila se genera a partir de la anterior.",
    stateAria: (r: number, n: number) => `Regla ${r}, ${n} filas`,
    keys: "Teclas: Espacio reproducir/pausar · S paso · R reiniciar",
    resultOf: "Resultado para el patrón",
    copyLink: "Copiar enlace",
    savePng: "Descargar PNG",
    copied: "Enlace copiado al portapapeles.",
    copyFail: "No se pudo copiar el enlace — copialo desde la barra de direcciones.",
    pngDone: "Tarjeta PNG descargada.",
    playingMsg: "Reproduciendo.",
    pausedMsg: "En pausa.",
    hiddenMsg: "En pausa porque la pestaña está oculta.",
    shareTitle: "Laboratorio de Autómatas Celulares",
    ruleWord: "Regla",
    rowsWord: "filas",
  },
} as const;

type T = {
  [K in keyof (typeof labels)["en"]]: (typeof labels)["en"][K] extends (...a: never[]) => string
    ? (r: number, n: number) => string
    : string;
};

const PRESETS = [30, 90, 110, 184] as const;

function seedRow(kind: "single" | "random"): Uint8Array {
  const row = new Uint8Array(W);
  if (kind === "single") row[Math.floor(W / 2)] = 1;
  else for (let i = 0; i < W; i++) row[i] = Math.random() < 0.5 ? 1 : 0;
  return row;
}

function nextRow(prev: Uint8Array, rule: number): Uint8Array {
  const out = new Uint8Array(W);
  for (let x = 0; x < W; x++) {
    const l = prev[(x + W - 1) % W] ?? 0;
    const c = prev[x] ?? 0;
    const r = prev[(x + 1) % W] ?? 0;
    out[x] = (rule >> (l * 4 + c * 2 + r)) & 1;
  }
  return out;
}

const btn =
  "min-h-10 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent disabled:opacity-50 motion-reduce:transition-none";
const on = "border-cyan-400 bg-cyan-950/40";

export function CellularAutomatonElementary({ locale = "en", init }: { locale?: Locale; init?: ElemInit | null }) {
  const t = (locale === "es" ? labels.es : labels.en) as unknown as T;
  const [rule, setRule] = useState(() => init?.rule ?? 30);
  const [seed, setSeed] = useState<"single" | "random" | null>(init?.g ? null : "single");
  const seedRef = useRef<Uint8Array>(init?.g ?? seedRow("single"));
  const [rows, setRows] = useState<Uint8Array[]>(() => [seedRef.current]);
  const [shareMsg, setShareMsg] = useState("");
  const [playMsg, setPlayMsg] = useState("");
  const firstPlay = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [total, setTotal] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ruleRef = useRef(rule);
  ruleRef.current = rule;

  const restart = useCallback((kind: "single" | "random") => {
    setSeed(kind);
    seedRef.current = seedRow(kind);
    setRows([seedRef.current]);
    setTotal(1);
  }, []);

  const doStep = useCallback(() => {
    setRows((rs) => {
      const last = rs[rs.length - 1] ?? seedRow("single");
      const next = [...rs, nextRow(last, ruleRef.current)];
      return next.length > H ? next.slice(next.length - H) : next;
    });
    setTotal((n) => n + 1);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const onHide = () => {
      if (document.hidden) {
        setPlaying(false);
        setPlayMsg(t.hiddenMsg);
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [playing, t]);

  useEffect(() => {
    if (firstPlay.current) {
      firstPlay.current = false;
      return;
    }
    setPlayMsg((m) => (!playing && m === t.hiddenMsg ? m : playing ? t.playingMsg : t.pausedMsg));
  }, [playing, t]);

  useEffect(() => {
    if (!playing) return;
    const delay = speed === "slow" ? 320 : speed === "fast" ? 30 : 100;
    const id = setInterval(doStep, delay);
    return () => clearInterval(id);
  }, [playing, speed, doStep]);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W * CELL, H * CELL);
    ctx.fillStyle = "#22d3ee";
    rows.forEach((row, y) => {
      for (let x = 0; x < W; x++) if (row[x]) ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
    });
  }, [rows]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLButtonElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "s" || e.key === "S") doStep();
      else if (e.key === "r" || e.key === "R") restart(seed ?? "single");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doStep, restart, seed]);

  const live = useMemo(() => {
    const last = rows[rows.length - 1];
    let n = 0;
    if (last) for (let i = 0; i < last.length; i++) n += last[i] ?? 0;
    return n;
  }, [rows]);

  const setRuleNum = (v: number) => {
    const n = Math.min(255, Math.max(0, Math.round(v) || 0));
    setRule(n);
    restart(seed ?? "single");
  };

  const flipBit = (p: number) => {
    setRule((r) => r ^ (1 << p));
    restart(seed ?? "single");
  };

  const shareLink = async () => {
    const url = buildUrl({ mode: "1d", rule: String(rule), g: packBits(seedRef.current) });
    setShareMsg((await copyText(url)) ? t.copied : t.copyFail);
  };

  const savePng = () => {
    const cells = new Uint8Array(W * H);
    rows.forEach((row, y) => cells.set(row, y * W));
    const card = drawCard({
      title: t.shareTitle,
      subtitle: `${t.ruleWord} ${rule}`,
      lines: [`${total} ${t.rowsWord}`],
      cols: W,
      rows: H,
      cells,
      cell: CELL,
    });
    downloadCanvas(card, `cellular-automaton-rule-${rule}.png`);
    setShareMsg(t.pngDone);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs leading-relaxed text-muted-foreground">{t.note}</p>

      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-semibold text-muted-foreground">
          {t.ruleNumber}
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={255}
            value={rule}
            onChange={(e) => setRuleNum(Number(e.target.value))}
            className="mt-1 block h-10 w-28 rounded-lg border border-border bg-card px-3 text-sm font-bold text-foreground"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="self-center text-xs font-semibold text-muted-foreground">{t.presets}:</span>
          {PRESETS.map((p) => (
            <button key={p} type="button" onClick={() => setRuleNum(p)} aria-pressed={rule === p} className={`${btn} ${rule === p ? on : ""}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="rounded-xl border border-border p-3">
        <legend className="px-1 text-xs font-semibold text-muted-foreground">{t.table}</legend>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {Array.from({ length: 8 }, (_, k) => 7 - k).map((p) => {
            const bits = [(p >> 2) & 1, (p >> 1) & 1, p & 1];
            const res = (rule >> p) & 1;
            return (
              <div key={p} className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5" aria-hidden="true">
                  {bits.map((b, i) => (
                    <span key={i} className={`h-4 w-4 rounded-sm border border-border ${b ? "bg-cyan-400" : "bg-slate-900"}`} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => flipBit(p)}
                  aria-pressed={res === 1}
                  aria-label={`${t.resultOf} ${bits.join("")}: ${res}`}
                  className={`h-10 w-10 rounded-lg border text-sm font-bold ${res ? on : "border-border bg-card"}`}
                >
                  {res}
                </button>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <span className="self-center text-xs font-semibold text-muted-foreground">{t.seed}:</span>
        <button type="button" onClick={() => restart("single")} aria-pressed={seed === "single"} className={`${btn} ${seed === "single" ? on : ""}`}>
          {t.single}
        </button>
        <button type="button" onClick={() => restart("random")} aria-pressed={seed === "random"} className={`${btn} ${seed === "random" ? on : ""}`}>
          {t.random}
        </button>
      </div>

      <div className="mx-auto w-full max-w-[480px]">
        <canvas
          ref={canvasRef}
          width={W * CELL}
          height={H * CELL}
          role="img"
          aria-label={`${t.gridAria} ${t.stateAria(rule, total)}`}
          className="aspect-square w-full rounded-2xl border border-border"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPlaying((p) => !p)} className={`${btn} ${playing ? on : ""}`}>
          {playing ? t.pause : t.play}
        </button>
        <button type="button" onClick={doStep} className={btn}>
          {t.step}
        </button>
        <button type="button" onClick={() => restart(seed ?? "single")} className={btn}>
          {t.reset}
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
          {t.rule}: <span className="font-bold text-cyan-400">{rule}</span>
        </p>
        <p>
          {t.rows}: {total} · {t.live}: {live}
        </p>
        <span className="sr-only" role="status" aria-live="polite">{playMsg}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={shareLink} className={btn}>
          {t.copyLink}
        </button>
        <button type="button" onClick={savePng} className={btn}>
          {t.savePng}
        </button>
        <span role="status" aria-live="polite" className="text-xs text-muted-foreground">
          {shareMsg}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground">{t.keys}</p>
    </div>
  );
}
