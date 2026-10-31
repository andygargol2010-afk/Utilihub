import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Unit = "C" | "F" | "K";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function toCelsius(value: number, from: Unit): number {
  if (from === "C") return value;
  if (from === "F") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function fromCelsius(celsius: number, to: Unit): number {
  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function TemperatureConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("20");
  const [from, setFrom] = useState<Unit>("C");
  const [copied, setCopied] = useState(false);

  const all = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const c = toCelsius(v, from);
    return {
      input: v,
      from,
      C: round(fromCelsius(c, "C")),
      F: round(fromCelsius(c, "F")),
      K: round(fromCelsius(c, "K")),
    };
  }, [value, from]);

  async function copy() {
    if (!all) return;
    const text = `${all.input} °${all.from} = ${all.C} °C = ${all.F} °F = ${all.K} K`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("20");
    setFrom("C");
    setCopied(false);
  }

  function setPreset(celsius: number) {
    setFrom("C");
    setValue(String(celsius));
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="rounded-2xl border bg-card p-4 sm:p-5 space-y-4">
        <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            {es ? "Resultado en las tres escalas" : "Result in all three scales"}
          </p>
          {all ? (
            <dl className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Celsius</dt>
                <dd className="text-2xl font-semibold tabular-nums">{all.C} °C</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fahrenheit</dt>
                <dd className="text-2xl font-semibold tabular-nums">{all.F} °F</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Kelvin</dt>
                <dd className="text-2xl font-semibold tabular-nums">{all.K} K</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">{es ? "Valor inválido" : "Invalid value"}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{es ? "Valor" : "Value"}</span>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={fieldClass}
              inputMode="decimal"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{es ? "Escala de entrada" : "Input scale"}</span>
            <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
              <option value="K">Kelvin (K)</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={buttonClass} onClick={() => setPreset(0)}>
            0 °C
          </button>
          <button type="button" className={buttonClass} onClick={() => setPreset(20)}>
            20 °C
          </button>
          <button type="button" className={buttonClass} onClick={() => setPreset(37)}>
            37 °C
          </button>
          <button type="button" className={buttonClass} onClick={() => setPreset(100)}>
            100 °C
          </button>
        </div>

        <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-1 font-mono">
          <p className="font-sans font-medium">{es ? "Fórmulas" : "Formulas"}</p>
          <p>°F = °C × 9/5 + 32</p>
          <p>°C = (°F − 32) × 5/9</p>
          <p>K = °C + 273.15</p>
        </div>

        <div className="overflow-x-auto rounded-xl border text-sm">
          <table className="w-full text-left">
            <caption className="border-b bg-muted/30 px-3 py-2 text-left font-medium">
              {es ? "Ejemplos" : "Examples"}
            </caption>
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="px-3 py-2">°C</th>
                <th className="px-3 py-2">°F</th>
                <th className="px-3 py-2">K</th>
                <th className="px-3 py-2">{es ? "Nota" : "Note"}</th>
              </tr>
            </thead>
            <tbody>
              {(
                es
                  ? [
                      ["0", "32", "273.15", "Congelación del agua"],
                      ["20", "68", "293.15", "Ambiente típico"],
                      ["37", "98.6", "310.15", "Cuerpo humano (aprox.)"],
                      ["100", "212", "373.15", "Ebullición del agua"],
                    ]
                  : [
                      ["0", "32", "273.15", "Water freezes"],
                      ["20", "68", "293.15", "Typical room"],
                      ["37", "98.6", "310.15", "Body temp (approx.)"],
                      ["100", "212", "373.15", "Water boils"],
                    ]
              ).map((row) => (
                <tr key={row[0]} className="border-b border-border/60">
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-2 tabular-nums">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
          </button>
          <button type="button" className={buttonClass} onClick={reset}>
            {es ? "Reiniciar" : "Reset"}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {es ? "Relacionadas: " : "Related: "}
          <a className="underline" href={es ? "/es/herramientas/calculadora-punto-rocio" : "/tools/dew-point-calculator"}>
            {es ? "Punto de rocío" : "Dew point"}
          </a>
          {" · "}
          <a className="underline" href={es ? "/es/herramientas/calculadora-sensacion-termica" : "/tools/heat-index-and-wind-chill"}>
            {es ? "Sensación térmica" : "Heat index"}
          </a>
        </p>
      </div>
    </div>
  );
}
