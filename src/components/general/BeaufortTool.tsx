import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { BEAUFORT_SAMPLE_KMH, BEAUFORT_SAMPLE_MS, windToBeaufort, type BeaufortUnit } from "@/lib/general/beaufort";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const UNITS: { id: BeaufortUnit; en: string; es: string }[] = [
  { id: "ms", en: "m/s", es: "m/s" },
  { id: "kmh", en: "km/h", es: "km/h" },
  { id: "kn", en: "knots", es: "nudos" },
  { id: "mph", en: "mph", es: "mph" },
];

export function BeaufortTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [speed, setSpeed] = useState(BEAUFORT_SAMPLE_MS);
  const [unit, setUnit] = useState<BeaufortUnit>("ms");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => windToBeaufort(speed, unit), [speed, unit]);

  async function copyResult() {
    if (result.status !== "ok") return;
    const label = es ? `Fuerza ${result.force} · ${result.nameEs}` : `Force ${result.force} · ${result.nameEn}`;
    try {
      await navigator.clipboard.writeText(label);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const status =
    result.status === "empty"
      ? es
        ? "La velocidad está vacía. No se inventa una fuerza."
        : "The speed is empty. No force is invented."
      : result.status === "invalid"
        ? result.error === "negative"
          ? es
            ? "La velocidad no puede ser negativa. No se inventa una fuerza."
            : "Speed cannot be negative. No force is invented."
          : es
            ? "Ingresá un número. No se inventa una fuerza."
            : "Enter a number. No force is invented."
        : es
          ? `Fuerza ${result.force} lista. No se inventó una fuerza 13.`
          : `Force ${result.force} ready. Force 13 was not invented.`;

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Velocidad del viento" : "Wind speed"}</span>
        <input
          className={fieldClass}
          value={speed}
          onChange={(event) => setSpeed(event.target.value)}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder="10"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Unidad" : "Unit"}</span>
        <select className={fieldClass} value={unit} onChange={(event) => setUnit(event.target.value as BeaufortUnit)}>
          {UNITS.map((item) => (
            <option key={item.id} value={item.id}>
              {es ? item.es : item.en}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setSpeed(BEAUFORT_SAMPLE_MS);
            setUnit("ms");
          }}
        >
          {es ? "Ejemplo 10 m/s" : "10 m/s example"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setSpeed(BEAUFORT_SAMPLE_KMH);
            setUnit("kmh");
          }}
        >
          {es ? "Ejemplo 20 km/h" : "20 km/h example"}
        </button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={result.status !== "ok"}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar fuerza" : "Copy force"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setSpeed("");
            setUnit("ms");
          }}
        >
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? (
        <div className="rounded-xl border p-4">
          <p className="text-2xl font-semibold">
            {es ? `Fuerza ${result.force}` : `Force ${result.force}`}
          </p>
          <p className="mt-1 text-base">{es ? result.nameEs : result.nameEn}</p>
          <p className="mt-2 text-sm text-muted-foreground">{es ? result.rangeEs : result.rangeEn}</p>
        </div>
      ) : null}
    </div>
  );
}
