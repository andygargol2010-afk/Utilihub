import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function parseTime(timeStr: string): number | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function formatTime(minutes: number): string {
  const total = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function SleepCycleCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"wake" | "bed">("wake");
  const [time, setTime] = useState("07:00");
  const [cycles, setCycles] = useState(5);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const mins = parseTime(time);
    if (mins === null || cycles < 1 || cycles > 8) return null;
    const cycleMins = cycles * 90;
    const buffer = 15;
    const total = cycleMins + buffer;
    if (mode === "wake") {
      // bedtime = wake - total
      return formatTime(mins - total);
    } else {
      // wake = bed + total
      return formatTime(mins + total);
    }
  }, [mode, time, cycles]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { setCopied(false); }
  }

  function reset() {
    setMode("wake"); setTime("07:00"); setCycles(5); setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa una hora válida" : "Enter a valid time"}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Modo" : "Mode"}</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as "wake" | "bed")} className={fieldClass}>
            <option value="wake">{es ? "Tengo hora de despertar" : "I know my wake-up time"}</option>
            <option value="bed">{es ? "Tengo hora de acostarme" : "I know my bedtime"}</option>
          </select>
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{mode === "wake" ? (es ? "Hora de despertar" : "Wake-up time") : (es ? "Hora de acostarse" : "Bedtime")}</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} />
        </label>

        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ciclos de sueño (4-6 recomendado)" : "Sleep cycles (4-6 recommended)"}</span>
          <input type="number" min={1} max={8} value={cycles} onChange={(e) => setCycles(Number(e.target.value))} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es ? "Cada ciclo dura ~90 min + 15 min para dormirse. Despertar al final de un ciclo es más descansado." : "Each cycle is ~90 min + 15 min to fall asleep. Waking at the end of a cycle feels more refreshed."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Despertar 07:00, 5 ciclos → acostarse 22:45" : "Wake 07:00, 5 cycles → bed 22:45"}</p>
        <p>{es ? "Acostarse 23:00, 6 ciclos → despertar 08:15" : "Bed 23:00, 6 cycles → wake 08:15"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p><a href={es ? "/es/herramientas/calculadora-edad" : "/tools/calculadora-edad"} className="underline">{es ? "Calculadora de edad" : "Age calculator"}</a></p>
        <p><a href={es ? "/es/herramientas/calculadora-calorias-diarias" : "/tools/calculadora-calorias-diarias"} className="underline">{es ? "Calculadora de calorías diarias" : "Daily calories calculator"}</a></p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
