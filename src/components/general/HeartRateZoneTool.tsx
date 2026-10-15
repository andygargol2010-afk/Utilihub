import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const ZONES = [
  { min: 50, max: 60, en: "Zone 1 — Warm-up / Recovery", es: "Zona 1 — Calentamiento / Recuperación" },
  { min: 60, max: 70, en: "Zone 2 — Fat burn / Endurance", es: "Zona 2 — Quema de grasa / Resistencia" },
  { min: 70, max: 80, en: "Zone 3 — Aerobic / Cardio", es: "Zona 3 — Aeróbica / Cardio" },
  { min: 80, max: 90, en: "Zone 4 — Threshold / Anaerobic", es: "Zona 4 — Umbral / Anaeróbica" },
  { min: 90, max: 100, en: "Zone 5 — Peak / VO2 max", es: "Zona 5 — Pico / VO2 máx" },
];

export function HeartRateZoneTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [age, setAge] = useState("30");
  const [maxHr, setMaxHr] = useState("");
  const [copied, setCopied] = useState(false);

  const ageNum = parseFloat(age) || 0;
  const maxHrNum = parseFloat(maxHr) || 0;
  const calculatedMax = maxHrNum > 0 ? maxHrNum : ageNum > 0 ? 220 - ageNum : 0;
  const valid = calculatedMax > 40 && calculatedMax < 220;

  const zones = valid
    ? ZONES.map((z) => ({
        ...z,
        low: Math.round((z.min / 100) * calculatedMax),
        high: Math.round((z.max / 100) * calculatedMax),
      }))
    : [];

  const resultText = zones
    .map((z) => `${es ? z.es : z.en}: ${z.low}–${z.high} bpm`)
    .join("\n");

  async function copy() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setAge("30");
    setMaxHr("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Frecuencia cardíaca máxima estimada" : "Estimated max heart rate"}</p>
        <p className="text-3xl font-semibold">{valid ? `${calculatedMax} bpm` : "—"}</p>
        {!valid && ageNum <= 0 && maxHrNum <= 0 && (
          <p className="text-sm text-amber-600">{es ? "Ingresá edad o FC máxima" : "Enter age or max HR"}</p>
        )}
        {!valid && (ageNum > 0 || maxHrNum > 0) && (
          <p className="text-sm text-amber-600">{es ? "Valor fuera de rango razonable" : "Value outside reasonable range"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Edad (años)" : "Age (years)"}</span>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={fieldClass} min="1" max="120" step="1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "FC máxima conocida (opcional)" : "Known max HR (optional)"}</span>
          <input type="number" value={maxHr} onChange={(e) => setMaxHr(e.target.value)} className={fieldClass} min="40" max="220" step="1" placeholder={es ? "Dejá vacío para estimar" : "Leave empty to estimate"} />
        </label>
      </div>

      {valid && (
        <div className="space-y-2">
          {zones.map((z) => (
            <div key={z.min} className="flex justify-between items-center rounded-xl border px-4 py-3 text-sm">
              <span>{es ? z.es : z.en}</span>
              <span className="font-medium">{z.low}–{z.high} bpm</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!valid}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar zonas" : "Copy zones"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>{es ? "Ejemplo 1: edad 30 → FC máx 190, Zona 2: 114–133 bpm" : "Example 1: age 30 → max HR 190, Zone 2: 114–133 bpm"}</p>
        <p>{es ? "Ejemplo 2: FC máx 180 → Zona 4: 144–162 bpm" : "Example 2: max HR 180 → Zone 4: 144–162 bpm"}</p>
      </div>
    </div>
  );
}
