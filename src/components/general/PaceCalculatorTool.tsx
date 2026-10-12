import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseTime(str: string): number | null {
  // Accept mm:ss or h:mm:ss or minutes as number
  const cleaned = str.trim();
  if (!cleaned) return null;
  if (/^\d+(\.\d+)?$/.test(cleaned)) return parseFloat(cleaned) * 60; // minutes to seconds
  const parts = cleaned.split(":").map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatPace(secondsPerUnit: number): string {
  if (!isFinite(secondsPerUnit) || secondsPerUnit <= 0) return "—";
  return formatTime(secondsPerUnit);
}

export function PaceCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"pace" | "time">("pace");
  const [distance, setDistance] = useState("10");
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const [timeStr, setTimeStr] = useState("50:00");
  const [paceStr, setPaceStr] = useState("5:00");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const dist = parseFloat(distance);
    if (!isFinite(dist) || dist <= 0) return null;

    if (mode === "pace") {
      const totalSec = parseTime(timeStr);
      if (totalSec === null || totalSec <= 0) return null;
      const paceSec = totalSec / dist;
      return {
        pace: formatPace(paceSec),
        totalTime: formatTime(totalSec),
        distance: dist,
        unit,
        speedKmh: unit === "km" ? (dist / (totalSec / 3600)) : (dist * 1.60934) / (totalSec / 3600),
      };
    } else {
      const paceSec = parseTime(paceStr);
      if (paceSec === null || paceSec <= 0) return null;
      const totalSec = paceSec * dist;
      return {
        pace: formatPace(paceSec),
        totalTime: formatTime(totalSec),
        distance: dist,
        unit,
        speedKmh: unit === "km" ? (dist / (totalSec / 3600)) : (dist * 1.60934) / (totalSec / 3600),
      };
    }
  }, [mode, distance, unit, timeStr, paceStr]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Distancia: ${result.distance} ${result.unit}\nTiempo: ${result.totalTime}\nRitmo: ${result.pace} /${result.unit}\nVelocidad: ${result.speedKmh.toFixed(1)} km/h`
      : `Distance: ${result.distance} ${result.unit}\nTime: ${result.totalTime}\nPace: ${result.pace} /${result.unit}\nSpeed: ${result.speedKmh.toFixed(1)} km/h`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setDistance("10");
    setUnit("km");
    setTimeStr("50:00");
    setPaceStr("5:00");
    setMode("pace");
    setCopied(false);
  }

  const presets = unit === "km"
    ? [
        { label: "5K", dist: "5" },
        { label: "10K", dist: "10" },
        { label: "Half", dist: "21.1" },
        { label: "Marathon", dist: "42.195" },
      ]
    : [
        { label: "5K", dist: "3.1" },
        { label: "10K", dist: "6.2" },
        { label: "Half", dist: "13.1" },
        { label: "Marathon", dist: "26.2" },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">
              {result.pace} <span className="text-lg font-normal">/{result.unit}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {es
                ? `Tiempo total: ${result.totalTime} · Velocidad: ${result.speedKmh.toFixed(1)} km/h`
                : `Total time: ${result.totalTime} · Speed: ${result.speedKmh.toFixed(1)} km/h`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Ingresá distancia y tiempo o ritmo válidos" : "Enter valid distance and time or pace"}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={`${buttonClass} flex-1 ${mode === "pace" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setMode("pace")}
        >
          {es ? "Desde tiempo" : "From time"}
        </button>
        <button
          type="button"
          className={`${buttonClass} flex-1 ${mode === "time" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setMode("time")}
        >
          {es ? "Desde ritmo" : "From pace"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Distancia" : "Distance"}</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Unidad" : "Unit"}</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value as "km" | "mi")} className={fieldClass}>
            <option value="km">km</option>
            <option value="mi">mi</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p.label} type="button" className={buttonClass} onClick={() => setDistance(p.dist)}>
            {p.label}
          </button>
        ))}
      </div>

      {mode === "pace" ? (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tiempo total (mm:ss o h:mm:ss)" : "Total time (mm:ss or h:mm:ss)"}</span>
          <input
            type="text"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            placeholder="50:00"
            className={fieldClass}
          />
        </label>
      ) : (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ritmo (mm:ss por unidad)" : "Pace (mm:ss per unit)"}</span>
          <input
            type="text"
            value={paceStr}
            onChange={(e) => setPaceStr(e.target.value)}
            placeholder="5:00"
            className={fieldClass}
          />
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
