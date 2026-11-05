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

export function PopulationDynamicsSim({ locale }: { locale: Locale }) {
  const t = labels[locale] || labels.en;
  useEffect(() => {
    trackEvent("simulator_open", { id: "population-dynamics-simulator", locale });
  }, [locale]);

  const [paramsA, setParamsA] = useState({ initial: 100, birth: 0.3, death: 0.05, capacity: 1000, gens: 50 });
  const [paramsB, setParamsB] = useState({ initial: 100, birth: 0.15, death: 0.08, capacity: 800, gens: 50 });
  const [compare, setCompare] = useState(false);
  const [copied, setCopied] = useState(false);

  const dataA = useMemo(() => simulate(paramsA.initial, paramsA.birth, paramsA.death, paramsA.capacity, paramsA.gens), [paramsA]);
  const dataB = useMemo(() => simulate(paramsB.initial, paramsB.birth, paramsB.death, paramsB.capacity, paramsB.gens), [paramsB]);
  const statsA = useMemo(() => getStats(dataA, paramsA.capacity), [dataA, paramsA.capacity]);
  const statsB = useMemo(() => getStats(dataB, paramsB.capacity), [dataB, paramsB.capacity]);

  const maxY = Math.max(paramsA.capacity, paramsB.capacity, ...dataA, ...dataB) * 1.1;
  const width = 600;
  const height = 280;

  const toPath = (data: number[]) => {
    if (data.length < 2) return "";
    const step = width / (data.length - 1);
    return data
      .map((v, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(height - (v / maxY) * height).toFixed(1)}`)
      .join(" ");
  };

  const updateParam = (which: "A" | "B", key: string, value: number) => {
    const setter = which === "A" ? setParamsA : setParamsB;
    setter((p) => ({ ...p, [key]: value }));
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
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 800, 500);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 24px system-ui";
    ctx.fillText(locale === "es" ? "Dinámica Poblacional" : "Population Dynamics", 40, 40);
    ctx.strokeStyle = "#334155";
    ctx.strokeRect(40, 60, 720, 340);
    const drawLine = (data: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      data.forEach((v, i) => {
        const x = 40 + (i / (data.length - 1)) * 720;
        const y = 400 - (v / maxY) * 340;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };
    drawLine(dataA, "#22d3ee");
    if (compare) drawLine(dataB, "#f472b6");
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui";
    ctx.fillText(`Peak A: ${statsA.peak.toFixed(0)}`, 40, 440);
    if (compare) ctx.fillText(`Peak B: ${statsB.peak.toFixed(0)}`, 40, 460);
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
            className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
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
        <button type="button" onClick={shareUrl} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">
          {copied ? t.copied : t.shareUrl}
        </button>
        <button type="button" onClick={downloadPng} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">
          {t.downloadPng}
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-full" style={{ minWidth: "320px" }}>
          <rect width={width} height={height} fill="#0f172a" />
          <path d={toPath(dataA)} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          {compare && <path d={toPath(dataB)} fill="none" stroke="#f472b6" strokeWidth="2.5" />}
          <line x1="0" y1={height - (paramsA.capacity / maxY) * height} x2={width} y2={height - (paramsA.capacity / maxY) * height} stroke="#64748b" strokeDasharray="4" />
        </svg>
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
