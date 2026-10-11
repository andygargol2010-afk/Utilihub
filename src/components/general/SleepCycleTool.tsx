import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseTime(time: string): { h: number; m: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, m: min };
}

function formatTime(h: number, m: number, es: boolean) {
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

function addMinutes(h: number, m: number, delta: number) {
  let total = h * 60 + m + delta;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return { h: Math.floor(total / 60), m: total % 60 };
}

export function SleepCycleTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"wake" | "bed">("wake");
  const [time, setTime] = useState("07:00");
  const [fallAsleep, setFallAsleep] = useState("15");
  const [cycles, setCycles] = useState("5");
  const [copied, setCopied] = useState(false);

  const parsed = parseTime(time);
  const fall = Math.max(0, parseInt(fallAsleep) || 0);
  const numCycles = Math.min(6, Math.max(4, parseInt(cycles) || 5));

  const recommendations = useMemo(() => {
    if (!parsed) return [];
    const results: { cycles: number; time: string; label: string }[] = [];
    for (let c = 4; c <= 6; c++) {
      const cycleMinutes = c * 90;
      let targetH = parsed.h;
      let targetM = parsed.m;
      if (mode === "wake") {
        // bedtime = wake - cycles*90 - fallAsleep
        const bed = addMinutes(targetH, targetM, -(cycleMinutes + fall));
        results.push({
          cycles: c,
          time: formatTime(bed.h, bed.m, es),
          label: es ? `${c} ciclos` : `${c} cycles`,
        });
      } else {
        // wake = bed + fallAsleep + cycles*90
        const wake = addMinutes(targetH, targetM, fall + cycleMinutes);
        results.push({
          cycles: c,
          time: formatTime(wake.h, wake.m, es),
          label: es ? `${c} ciclos` : `${c} cycles`,
        });
      }
    }
    return results;
  }, [parsed, fall, mode, es]);

  async function copy() {
    if (!recommendations.length) return;
    const lines = recommendations.map((r) => `${r.label}: ${r.time}`).join("\n");
    const text = es
      ? `Recomendaciones de ${mode === "wake" ? "hora de acostarse" : "hora de despertar"}:\n${lines}`
      : `Recommended ${mode === "wake" ? "bedtimes" : "wake times"}:\n${lines}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMode("wake");
    setTime("07:00");
    setFallAsleep("15");
    setCycles("5");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Recomendaciones" : "Recommendations"}</p>
        {!parsed ? (
          <p className="text-muted-foreground">{es ? "Ingres\u00e1 una hora v\u00e1lida (HH:MM)." : "Enter a valid time (HH:MM)."}</p>
        ) : recommendations.length === 0 ? (
          <p className="text-muted-foreground">{es ? "Sin resultados." : "No results."}</p>
        ) : (
          <ul className="space-y-2">
            {recommendations.map((r) => (
              <li key={r.cycles} className="flex justify-between text-lg font-medium">
                <span>{r.label}</span>
                <span>{r.time}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">
          {es
            ? "Basado en ciclos de 90 min + tiempo para dormirse. No es consejo m\u00e9dico."
            : "Based on 90-min cycles + time to fall asleep. Not medical advice."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Modo" : "Mode"}</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as "wake" | "bed")} className={fieldClass}>
            <option value="wake">{es ? "Quiero despertarme a las" : "I want to wake up at"}</option>
            <option value="bed">{es ? "Me acuesto a las" : "I go to bed at"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Hora" : "Time"}</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Minutos para dormirse" : "Minutes to fall asleep"}</span>
          <input type="number" value={fallAsleep} onChange={(e) => setFallAsleep(e.target.value)} className={fieldClass} min="0" max="60" step="1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ciclos preferidos (4-6)" : "Preferred cycles (4-6)"}</span>
          <input type="number" value={cycles} onChange={(e) => setCycles(e.target.value)} className={fieldClass} min="4" max="6" step="1" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!recommendations.length}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar recomendaciones" : "Copy recommendations"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
