import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const FACTOR = 235.214583; // US MPG to L/100km

export function MpgL100kmConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("30");
  const [from, setFrom] = useState<"mpg" | "l100">("mpg");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!Number.isFinite(v) || v <= 0 || v > 1000) return null;
    if (from === "mpg") {
      return { out: Math.round((FACTOR / v) * 100) / 100, unit: "L/100km", input: v, inputUnit: "MPG" };
    } else {
      return { out: Math.round((FACTOR / v) * 100) / 100, unit: "MPG", input: v, inputUnit: "L/100km" };
    }
  }, [value, from]);

  async function copy() {
    if (!result) return;
    const text = `${result.input} ${result.inputUnit} = ${result.out} ${result.unit}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("30");
    setFrom("mpg");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor MPG a L/100 km" : "MPG to L/100km converter"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.out} {result.unit}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un valor válido > 0" : "Enter a valid value > 0"}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} ${from === "mpg" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setFrom("mpg")}>
          MPG → L/100km
        </button>
        <button type="button" className={`${buttonClass} ${from === "l100" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setFrom("l100")}>
          L/100km → MPG
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor" : "Value"}</span>
        <input
          type="number"
          min="0.1"
          max="1000"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 30" : "e.g. 30"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Convierte millas por galón (US) a litros por 100 km y viceversa. Útil para comparar consumo de coches."
          : "Convert US miles per gallon to liters per 100 km and vice versa. Useful for comparing car fuel efficiency."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "30 MPG → 7.84 L/100km" : "30 MPG → 7.84 L/100km"}</p>
        <p>{es ? "10 L/100km → 23.52 MPG" : "10 L/100km → 23.52 MPG"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-consumo-viaje" : "/tools/calculadora-consumo-viaje"} className="underline text-primary">
            {es ? "Consumo de viaje" : "Trip fuel consumption"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-costo-litro-combustible" : "/tools/calculadora-costo-litro-combustible"} className="underline text-primary">
            {es ? "Costo por litro" : "Cost per liter"}
          </a>
        </p>
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
