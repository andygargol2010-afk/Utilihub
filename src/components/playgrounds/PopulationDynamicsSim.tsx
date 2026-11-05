"use client";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Locale = "en" | "es";

const labels = {
  en: {
    initial: "Initial population",
    birth: "Birth rate (per gen)",
    death: "Death rate (per gen)",
    capacity: "Carrying capacity",
    generations: "Generations",
    run: "Run simulation",
    scenarioA: "Scenario A",
    scenarioB: "Scenario B",
    compare: "Compare",
    phase: "Phase",
    growth: "Growth",
    decline: "Decline",
    stable: "Stable",
    peak: "Peak population",
    gensToCap: "Generations to capacity",
    shareUrl: "Copy share URL",
    downloadPng: "Download PNG",
    copied: "Copied!",
    presets: "Presets",
    rapid: "Rapid growth",
    stablePreset: "Stable",
    declinePreset: "Decline",
    overshoot: "Overshoot",
    chartAria: "Population over generations chart",
    axisGen: "Generations",
    axisPop: "Population",
    netRate: "Net growth rate r",
    animate: "Animate",
    stop: "Stop",
    gen: "Gen",
    reset: "Reset",
    legend: "Legend",
  },
  es: {
    initial: "Población inicial",
    birth: "Tasa de natalidad (por gen)",
    death: "Tasa de mortalidad (por gen)",
    capacity: "Capacidad de carga",
    generations: "Generaciones",
    run: "Ejecutar simulación",
    scenarioA: "Escenario A",
    scenarioB: "Escenario B",
    compare: "Comparar",
    phase: "Fase",
    growth: "Crecimiento",
    decline: "Declive",
    stable: "Estable",
    peak: "Población máxima",
    gensToCap: "Generaciones hasta capacidad",
    shareUrl: "Copiar URL de compartir",
    downloadPng: "Descargar PNG",
    copied: "¡Copiado!",
    presets: "Preajustes",
    rapid: "Crecimiento rápido",
    stablePreset: "Estable",
    declinePreset: "Declive",
    overshoot: "Sobrepaso",
    chartAria: "Gráfico de población a lo largo de las generaciones",
    axisGen: "Generaciones",
    axisPop: "Población",
    netRate: "Tasa neta de crecimiento r",
    animate: "Animar",
    stop: "Detener",
    gen: "Gen",
    reset: "Reiniciar",
    legend: "Leyenda",
  },
};

function simulate(initial: number, birth: number, death: number, capacity: number, gens: number): number[] {
  const r = Math.max(-0.5, Math.min(1.5, birth - death));
  const data = [Math.max(0, initial)];
  let p = data[0];
  const K = Math.max(1, capacity);
  for (let i = 0; i < gens; i++) {
    const growth = r * p * (1 - p / K);
    p = Math.max(0, Math.min(K * 1.5, p + growth));
    data.push(p);
  }
  return data;
}

function getStats(data: number[], capacity: number) {
  const peak = Math.max(...data);
  const peakIdx = data.indexOf(peak);
  let gensToCap = data.findIndex((v) => v >= capacity * 0.95);
  if (gensToCap < 0) gensToCap = data.length - 1;
  const last = data[data.length - 1];
  const prev = data[Math.max(0, data.length - 2)];
  const delta = last - prev;
  const phase = Math.abs(delta) < capacity * 0.01 ? "stable" : delta > 0 ? "growth" : "decline";
  return { peak, peakIdx, gensToCap, phase, last };
}

const PRESETS = {
  rapid: { initial: 50, birth: 0.45, death: 0.05, capacity: 1200, gens: 60 },
  stable: { initial: 800, birth: 0.12, death: 0.12, capacity: 1000, gens: 40 },
  decline: { initial: 900, birth: 0.05, death: 0.25, capacity: 1000, gens: 50 },
  overshoot: { initial: 200, birth: 0.6, death: 0.1, capacity: 600, gens: 70 },
};

const DEFAULT_A = { initial: 100, birth: 0.3, death: 0.05, capacity: 1000, gens: 50 };
const DEFAULT_B = { initial: 100, birth: 0.15, death: 0.08, capacity: 800, gens: 50 };

export function PopulationDynamicsSim({ locale }: { locale: Locale }) {
  const t = labels[locale] || labels.en;
  useEffect(() => {
    trackEvent("simulator_open", { id: "population-dynamics-simulator", locale });
  }, [locale]);

  const [paramsA, setParamsA] = useState(DEFAULT_A);
  const [paramsB, setParamsB] = useState(DEFAULT_B);
  const [compare, setCompare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visibleGens, setVisibleGens] = useState(50);
  const [animating, setAnimating] = useState(false);

  const dataA = useMemo(() => simulate(paramsA.initial, paramsA.birth, paramsA.death, paramsA.capacity, paramsA.gens), [paramsA]);
  const dataB = useMemo(() => simulate(paramsB.initial, paramsB.birth, paramsB.death, paramsB.capacity, paramsB.gens), [paramsB]);
  const statsA = useMemo(() => getStats(dataA, paramsA.capacity), [dataA, paramsA.capacity]);
  const statsB = useMemo(() => getStats(dataB, paramsB.capacity), [dataB, paramsB.capacity]);

  const maxY = Math.max(paramsA.capacity, paramsB.capacity, ...dataA, ...dataB) * 1.1;
  const width = 600;
  const height = 280;
  const padL = 48;
  const padB = 36;
  const plotW = width - padL - 12;
  const plotH = height - padB - 16;

  const toPath = (data: number[], upTo: number) => {
    const slice = data.slice(0, Math.min(upTo + 1, data.length));
    if (slice.length < 2) return "";
    const step = plotW / (data.length - 1);
    return slice
      .map((v, i) => `${i === 0 ? "M" : "L"} ${(padL + i * step).toFixed(1)} ${(16 + plotH - (v / maxY) * plotH).toFixed(1)}`)
      .join(" ");
  };

  const updateParam = (which: "A" | "B", key: string, value: number) => {
    const setter = which === "A" ? setParamsA : setParamsB;
    setter((p) => ({ ...p, [key]: value }));
    setVisibleGens(paramsA.gens);
  };

  const applyPreset = (key: keyof typeof PRESETS) => {
    setParamsA({ ...PRESETS[key] });
    setVisibleGens(PRESETS[key].gens);
    setAnimating(false);
  };

  const resetAll = () => {
    setParamsA(DEFAULT_A);
    setParamsB(DEFAULT_B);
    setCompare(false);
    setVisibleGens(DEFAULT_A.gens);
    setAnimating(false);
  };

  const shareUrl = () => {
    const u = new URL(window.location.href);
    u.searchParams.set("a", `${paramsA.initial},${paramsA.birth},${paramsA.death},${paramsA.capacity},${paramsA.gens}`);
    u.searchParams.set("b", `${paramsB.initial},${paramsB.birth},${paramsB.death},${paramsB.capacity},${paramsB.gens}`);
    u.searchParams.set("c", compare ? "1" : "0");
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
    ctx.fillText(locale === "es" ? "Dinámica Poblacional" : "Population Dynamics", 40, 48);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("UtiliHub · ideas-lab", 40, 76);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 100, 820, 360);
    const drawLine = (data: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.8;
      data.forEach((v, i) => {
        const x = 40 + (i / (data.length - 1)) * 820;
        const y = 460 - (v / maxY) * 360;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };
    drawLine(dataA, "#22d3ee");
    if (compare) drawLine(dataB, "#f472b6");
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(`${t.peak} A: ${statsA.peak.toFixed(0)} · ${t.phase}: ${t[statsA.phase as keyof typeof t]}`, 40, 490);
    if (compare) ctx.fillText(`${t.peak} B: ${statsB.peak.toFixed(0)} · ${t.phase}: ${t[statsB.phase as keyof typeof t]}`, 40, 510);
    ctx.fillStyle = "#64748b";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText(new Date().toISOString().slice(0, 10), 40, 540);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "population-dynamics.png";
    a.click();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aStr = params.get("a");
    if (aStr) {
      const [i, b, d, c, g] = aStr.split(",").map(Number);
      if (!isNaN(i)) setParamsA({ initial: i, birth: b || 0.3, death: d || 0.05, capacity: c || 1000, gens: g || 50 });
    }
    const bStr = params.get("b");
    if (bStr) {
      const [i, b, d, c, g] = bStr.split(",").map(Number);
      if (!isNaN(i)) setParamsB({ initial: i, birth: b || 0.15, death: d || 0.08, capacity: c || 800, gens: g || 50 });
    }
    if (params.get("c") === "1") setCompare(true);
  }, []);

  useEffect(() => {
    if (!animating) return;
    if (visibleGens >= paramsA.gens) {
      setAnimating(false);
      return;
    }
    const id = setTimeout(() => setVisibleGens((v) => v + 1), 80);
    return () => clearTimeout(id);
  }, [animating, visibleGens, paramsA.gens]);

  const rA = Math.max(-0.5, Math.min(1.5, paramsA.birth - paramsA.death));

  const ParamControls = ({ which, params }: { which: "A" | "B"; params: typeof paramsA }) => (
    <div className="space-y-3 rounded-xl border border-border bg-card/50 p-4">
      <h3 className="text-sm font-bold">{which === "A" ? t.scenarioA : t.scenarioB}</h3>
      {(["initial", "birth", "death", "capacity", "gens"] as const).map((key) => (
        <label key={key} className="block text-xs">
          <span className="text-muted-foreground">{t[key === "gens" ? "generations" : key]}</span>
          <input
            type="number"
            step={key === "birth" || key === "death" ? 0.01 : 1}
            min={0}
            value={params[key]}
            onChange={(e) => updateParam(which, key, parseFloat(e.target.value) || 0)}
            aria-label={t[key === "gens" ? "generations" : key]}
            className="mt-1 w-full rounded border border-border bg-background px-2 py-1.5 text-sm"
          />
        </label>
      ))}
      {which === "A" && <p className="text-xs text-muted-foreground">{t.netRate}: {rA.toFixed(3)}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-muted-foreground self-center">{t.presets}:</span>
        {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => applyPreset(k)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent"
          >
            {t[k === "stable" ? "stablePreset" : k === "decline" ? "declinePreset" : k]}
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
      <div className="grid gap-4 md:grid-cols-2">
        <ParamControls which="A" params={paramsA} />
        {compare && <ParamControls which="B" params={paramsB} />}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCompare((v) => !v)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent"
        >
          {t.compare}: {compare ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={() => { setAnimating((a) => !a); if (!animating) setVisibleGens(0); }}
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
          <path d={toPath(dataA, visibleGens)} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          {compare && <path d={toPath(dataB, visibleGens)} fill="none" stroke="#f472b6" strokeWidth="2.5" />}
          <line
            x1={padL}
            y1={16 + plotH - (paramsA.capacity / maxY) * plotH}
            x2={padL + plotW}
            y2={16 + plotH - (paramsA.capacity / maxY) * plotH}
            stroke="#64748b"
            strokeDasharray="4"
          />
          <text x={padL + plotW - 4} y={16 + plotH - (paramsA.capacity / maxY) * plotH - 4} fill="#94a3b8" fontSize="9" textAnchor="end">K</text>
          <text x={padL + 8} y={28} fill="#22d3ee" fontSize="11">{t.gen}: {Math.min(visibleGens, paramsA.gens)}</text>
        </svg>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold">{t.legend}:</span>
          <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-6 bg-cyan-400" /> {t.scenarioA}</span>
          {compare && <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-6 bg-pink-400" /> {t.scenarioB}</span>}
          <span className="inline-flex items-center gap-1"><span className="inline-block h-px w-6 border-t border-dashed border-slate-500" /> K</span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-4 text-sm">
          <p className="font-semibold">{t.scenarioA}</p>
          <p>{t.phase}: <span className="font-bold text-cyan-400">{t[statsA.phase as keyof typeof t]}</span></p>
          <p>{t.peak}: {statsA.peak.toFixed(0)}</p>
          <p>{t.gensToCap}: {statsA.gensToCap}</p>
        </div>
        {compare && (
          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="font-semibold">{t.scenarioB}</p>
            <p>{t.phase}: <span className="font-bold text-pink-400">{t[statsB.phase as keyof typeof t]}</span></p>
            <p>{t.peak}: {statsB.peak.toFixed(0)}</p>
            <p>{t.gensToCap}: {statsB.gensToCap}</p>
          </div>
        )}
      </div>
    </div>
  );
}
