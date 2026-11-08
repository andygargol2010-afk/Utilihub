"use client";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es" | "pt";

const labels = {
  en: {
    preyInit: "Initial prey",
    predInit: "Initial predators",
    growth: "Prey growth rate (a)",
    predation: "Predation rate (b)",
    conversion: "Conversion efficiency (c)",
    death: "Predator death rate (d)",
    generations: "Generations",
    presets: "Presets",
    balanced: "Balanced",
    preyBoom: "Prey boom",
    predCrash: "Predator crash",
    animate: "Animate",
    stop: "Stop",
    reset: "Reset",
    shareUrl: "Copy share URL",
    downloadPng: "Download PNG",
    copied: "Copied!",
    phase: "Phase",
    oscillating: "Oscillating",
    stable: "Stable",
    extinct: "Extinct",
    peakPrey: "Peak prey",
    peakPred: "Peak predators",
    current: "Current",
    gen: "Gen",
    chartAria: "Predator-prey populations over generations chart",
    axisGen: "Generations",
    axisPop: "Population",
    legend: "Legend",
    prey: "Prey",
    predator: "Predators",
  },
  es: {
    preyInit: "Presas iniciales",
    predInit: "Depredadores iniciales",
    growth: "Tasa de crecimiento de presas (a)",
    predation: "Tasa de depredación (b)",
    conversion: "Eficiencia de conversión (c)",
    death: "Tasa de muerte de depredadores (d)",
    generations: "Generaciones",
    presets: "Preajustes",
    balanced: "Equilibrado",
    preyBoom: "Boom de presas",
    predCrash: "Caída de depredadores",
    animate: "Animar",
    stop: "Detener",
    reset: "Reiniciar",
    shareUrl: "Copiar URL de compartir",
    downloadPng: "Descargar PNG",
    copied: "¡Copiado!",
    phase: "Fase",
    oscillating: "Oscilando",
    stable: "Estable",
    extinct: "Extinto",
    peakPrey: "Pico de presas",
    peakPred: "Pico de depredadores",
    current: "Actual",
    gen: "Gen",
    chartAria: "Gráfico de poblaciones depredador-presa a lo largo de las generaciones",
    axisGen: "Generaciones",
    axisPop: "Población",
    legend: "Leyenda",
    prey: "Presas",
    predator: "Depredadores",
  },
  pt: {
    preyInit: "Presas iniciais",
    predInit: "Predadores iniciais",
    growth: "Taxa de crescimento das presas (a)",
    predation: "Taxa de predação (b)",
    conversion: "Eficiência de conversão (c)",
    death: "Taxa de morte dos predadores (d)",
    generations: "Gerações",
    presets: "Predefinições",
    balanced: "Equilibrado",
    preyBoom: "Boom de presas",
    predCrash: "Queda de predadores",
    animate: "Animar",
    stop: "Parar",
    reset: "Redefinir",
    shareUrl: "Copiar URL de compartilhamento",
    downloadPng: "Baixar PNG",
    copied: "Copiado!",
    phase: "Fase",
    oscillating: "Oscilando",
    stable: "Estável",
    extinct: "Extinto",
    peakPrey: "Pico de presas",
    peakPred: "Pico de predadores",
    current: "Atual",
    gen: "Gen",
    chartAria: "Gráfico de populações predador-presa ao longo das gerações",
    axisGen: "Gerações",
    axisPop: "População",
    legend: "Legenda",
    prey: "Presas",
    predator: "Predadores",
  },
};

type Params = {
  preyInit: number;
  predInit: number;
  growth: number;
  predation: number;
  conversion: number;
  death: number;
  gens: number;
};

function simulate(p: Params): { prey: number[]; pred: number[] } {
  const prey = [Math.max(0, p.preyInit)];
  const pred = [Math.max(0, p.predInit)];
  let x = prey[0];
  let y = pred[0];
  const a = Math.max(0, Math.min(2, p.growth));
  const b = Math.max(0, Math.min(0.01, p.predation));
  const c = Math.max(0, Math.min(0.01, p.conversion));
  const d = Math.max(0, Math.min(2, p.death));
  for (let i = 0; i < p.gens; i++) {
    const dx = a * x - b * x * y;
    const dy = c * x * y - d * y;
    x = Math.max(0, Math.min(5000, x + dx));
    y = Math.max(0, Math.min(5000, y + dy));
    prey.push(x);
    pred.push(y);
  }
  return { prey, pred };
}

function getPhase(prey: number[], pred: number[]): "oscillating" | "stable" | "extinct" {
  const lastPrey = prey[prey.length - 1];
  const lastPred = pred[pred.length - 1];
  if (lastPrey < 1 && lastPred < 1) return "extinct";
  const recent = Math.min(20, prey.length);
  const preySlice = prey.slice(-recent);
  const predSlice = pred.slice(-recent);
  const ampP = Math.max(...preySlice) - Math.min(...preySlice);
  const ampY = Math.max(...predSlice) - Math.min(...predSlice);
  const meanP = preySlice.reduce((s, v) => s + v, 0) / recent;
  const meanY = predSlice.reduce((s, v) => s + v, 0) / recent;
  if (ampP > meanP * 0.15 || ampY > meanY * 0.15) return "oscillating";
  return "stable";
}

const PRESETS: Record<string, Params> = {
  balanced: { preyInit: 100, predInit: 40, growth: 0.4, predation: 0.002, conversion: 0.001, death: 0.3, gens: 80 },
  preyBoom: { preyInit: 80, predInit: 15, growth: 0.55, predation: 0.0012, conversion: 0.0008, death: 0.25, gens: 80 },
  predCrash: { preyInit: 120, predInit: 60, growth: 0.3, predation: 0.003, conversion: 0.0015, death: 0.45, gens: 80 },
};

const DEFAULT: Params = PRESETS.balanced;

export function PredatorPreySim({ locale }: { locale: Locale }) {
  const t = labels[locale] || labels.en;
  useEffect(() => {
    trackEvent("simulator_open", { id: "predator-prey-simulator", locale });
  }, [locale]);

  const [params, setParams] = useState<Params>(DEFAULT);
  const [copied, setCopied] = useState(false);
  const [visibleGens, setVisibleGens] = useState(DEFAULT.gens);
  const [animating, setAnimating] = useState(false);

  const data = useMemo(() => simulate(params), [params]);
  const phase = useMemo(() => getPhase(data.prey, data.pred), [data]);
  const peakPrey = Math.max(...data.prey);
  const peakPred = Math.max(...data.pred);
  const currentPrey = data.prey[Math.min(visibleGens, data.prey.length - 1)];
  const currentPred = data.pred[Math.min(visibleGens, data.pred.length - 1)];

  const maxY = Math.max(peakPrey, peakPred, 10) * 1.15;
  const width = 600;
  const height = 280;
  const padL = 48;
  const padB = 36;
  const plotW = width - padL - 12;
  const plotH = height - padB - 16;

  const toPath = (series: number[], upTo: number) => {
    const slice = series.slice(0, Math.min(upTo + 1, series.length));
    if (slice.length < 2) return "";
    const step = plotW / (series.length - 1);
    return slice
      .map((v, i) => `${i === 0 ? "M" : "L"} ${(padL + i * step).toFixed(1)} ${(16 + plotH - (v / maxY) * plotH).toFixed(1)}`)
      .join(" ");
  };

  const updateParam = (key: keyof Params, value: number) => {
    setParams((p) => ({ ...p, [key]: value }));
    setVisibleGens(params.gens);
    setAnimating(false);
  };

  const applyPreset = (key: string) => {
    setParams({ ...PRESETS[key] });
    setVisibleGens(PRESETS[key].gens);
    setAnimating(false);
  };

  const resetAll = () => {
    setParams(DEFAULT);
    setVisibleGens(DEFAULT.gens);
    setAnimating(false);
  };

  const shareUrl = () => {
    const u = new URL(window.location.href);
    const { preyInit, predInit, growth, predation, conversion, death, gens } = params;
    u.searchParams.set("params", `${preyInit},${predInit},${growth},${predation},${conversion},${death},${gens}`);
    navigator.clipboard.writeText(u.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});
  };

  const downloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 900, 560);
    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 28px system-ui, sans-serif";
    const title = locale === "es" ? "Depredador-Presa (Lotka-Volterra)" : "Predator-Prey (Lotka-Volterra)";
    ctx.fillText(title, 40, 48);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("UtiliHub · ideas-lab", 40, 76);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 100, 820, 360);
    const drawLine = (series: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.8;
      series.forEach((v, i) => {
        const x = 40 + (i / (series.length - 1)) * 820;
        const y = 460 - (v / maxY) * 360;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };
    drawLine(data.prey, "#22d3ee");
    drawLine(data.pred, "#f472b6");
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(`${t.peakPrey}: ${peakPrey.toFixed(0)} · ${t.peakPred}: ${peakPred.toFixed(0)} · ${t.phase}: ${t[phase]}`, 40, 490);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(new Date().toISOString().slice(0, 10), 40, 540);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "predator-prey.png";
    a.click();
  };

  useEffect(() => {
    const paramsUrl = new URLSearchParams(window.location.search);
    const pStr = paramsUrl.get("params");
    if (pStr) {
      const [pi, yi, g, b, c, d, gens] = pStr.split(",").map(Number);
      if (!isNaN(pi)) {
        setParams({
          preyInit: pi || 100,
          predInit: yi || 40,
          growth: g || 0.4,
          predation: b || 0.002,
          conversion: c || 0.001,
          death: d || 0.3,
          gens: gens || 80,
        });
        setVisibleGens(gens || 80);
      }
    }
  }, []);

  useEffect(() => {
    if (!animating) return;
    if (visibleGens >= params.gens) {
      setAnimating(false);
      return;
    }
    const id = setTimeout(() => setVisibleGens((v) => v + 1), 70);
    return () => clearTimeout(id);
  }, [animating, visibleGens, params.gens]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-muted-foreground self-center">{t.presets}:</span>
        {Object.keys(PRESETS).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => applyPreset(k)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent"
          >
            {t[k as keyof typeof t]}
          </button>
        ))}
        <button
          type="button"
          onClick={resetAll}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent"
        >
          {t.reset}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {([
          ["preyInit", t.preyInit, 1],
          ["predInit", t.predInit, 1],
          ["growth", t.growth, 0.01],
          ["predation", t.predation, 0.0001],
          ["conversion", t.conversion, 0.0001],
          ["death", t.death, 0.01],
          ["gens", t.generations, 1],
        ] as const).map(([key, label, step]) => (
          <label key={key} className="block text-xs">
            <span className="text-muted-foreground">{label}</span>
            <input
              type="number"
              step={step}
              min={0}
              value={params[key]}
              onChange={(e) => updateParam(key, parseFloat(e.target.value) || 0)}
              aria-label={label}
              className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setAnimating((a) => !a);
            if (!animating) setVisibleGens(0);
          }}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent"
        >
          {animating ? t.stop : t.animate}
        </button>
        <button type="button" onClick={shareUrl} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">
          {copied ? t.copied : t.shareUrl}
        </button>
        <button type="button" onClick={downloadPng} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">
          {t.downloadPng}
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-full"
          style={{ minWidth: "280px" }}
          role="img"
          aria-label={t.chartAria}
        >
          <rect width={width} height={height} fill="#0f172a" />
          <line x1={padL} y1={16} x2={padL} y2={16 + plotH} stroke="#475569" />
          <line x1={padL} y1={16 + plotH} x2={padL + plotW} y2={16 + plotH} stroke="#475569" />
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={padL}
              y1={16 + plotH * (1 - f)}
              x2={padL + plotW}
              y2={16 + plotH * (1 - f)}
              stroke="#334155"
              strokeDasharray="2"
            />
          ))}
          <text x={padL - 8} y={12} fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(maxY)}</text>
          <text x={padL - 8} y={16 + plotH} fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
          <text x={padL + plotW / 2} y={height - 6} fill="#94a3b8" fontSize="11" textAnchor="middle">{t.axisGen}</text>
          <text x={12} y={16 + plotH / 2} fill="#94a3b8" fontSize="11" textAnchor="middle" transform={`rotate(-90 12 ${16 + plotH / 2})`}>{t.axisPop}</text>
          <path d={toPath(data.prey, visibleGens)} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          <path d={toPath(data.pred, visibleGens)} fill="none" stroke="#f472b6" strokeWidth="2.5" />
          <text x={padL + 8} y={28} fill="#22d3ee" fontSize="11">{t.gen}: {Math.min(visibleGens, params.gens)}</text>
        </svg>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold">{t.legend}:</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-6 bg-cyan-400" /> {t.prey}</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-6 bg-pink-400" /> {t.predator}</span>
        </div>
      </div>
      <div className="rounded-xl border border-border p-4 text-sm" aria-live="polite">
        <p className="font-semibold">{t.phase}: <span className="font-bold text-cyan-400">{t[phase]}</span></p>
        <p>{t.peakPrey}: {peakPrey.toFixed(0)} · {t.peakPred}: {peakPred.toFixed(0)}</p>
        <p>{t.current} ({t.gen} {Math.min(visibleGens, params.gens)}): {t.prey} {currentPrey.toFixed(0)}, {t.predator} {currentPred.toFixed(0)}</p>
      </div>
    </div>
  );
}
