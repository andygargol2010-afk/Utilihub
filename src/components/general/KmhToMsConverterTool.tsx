import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function KmhToMsConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("36");
  const [from, setFrom] = useState<"kmh" | "ms">("kmh");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!Number.isFinite(v) || Math.abs(v) > 1e9) return null;
    if (from === "kmh") {
      const ms = v / 3.6;
      return { primary: Math.round(ms * 10000) / 10000, unit: "m/s", secondary: v, secondaryUnit: "km/h" };
    }
    const kmh = v * 3.6;
    return { primary: Math.round(kmh * 10000) / 10000, unit: "km/h", secondary: v, secondaryUnit: "m/s" };
  }, [value, from]);

  async function copy() {
    if (!result) return;
    const text = `${result.secondary} ${result.secondaryUnit} = ${result.primary} ${result.unit}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("36");
    setFrom("kmh");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversión de velocidad" : "Speed conversion"}</p>
        {result ? (
          <div>
            <p className="text-3xl font-semibold">
              {result.primary} {result.unit}
            </p>
            <p className="text-sm text-muted-foreground">
              {result.secondary} {result.secondaryUnit}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un valor numérico válido" : "Enter a valid numeric value"}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={`${buttonClass} ${from === "kmh" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setFrom("kmh")}
        >
          km/h → m/s
        </button>
        <button
          type="button"
          className={`${buttonClass} ${from === "ms" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setFrom("ms")}
        >
          m/s → km/h
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          {from === "kmh" ? (es ? "Velocidad (km/h)" : "Speed (km/h)") : es ? "Velocidad (m/s)" : "Speed (m/s)"}
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={fieldClass}
          placeholder={from === "kmh" ? "36" : "10"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Convierte entre kilómetros por hora (km/h) y metros por segundo (m/s). 1 m/s = 3,6 km/h."
          : "Convert between kilometres per hour (km/h) and metres per second (m/s). 1 m/s = 3.6 km/h."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>36 km/h → 10 m/s</p>
        <p>100 km/h → 27.78 m/s</p>
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
