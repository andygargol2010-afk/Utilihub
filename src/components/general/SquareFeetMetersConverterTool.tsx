import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const FT2_TO_M2 = 0.09290304;

export function SquareFeetMetersConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("100");
  const [from, setFrom] = useState<"ft2" | "m2">("ft2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!Number.isFinite(v) || v < 0 || v > 100000000) return null;
    if (from === "ft2") {
      return { out: Math.round(v * FT2_TO_M2 * 10000) / 10000, unit: "m²", input: v, inputUnit: "ft²" };
    } else {
      return { out: Math.round(v / FT2_TO_M2 * 100) / 100, unit: "ft²", input: v, inputUnit: "m²" };
    }
  }, [value, from]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `${result.input} ${result.inputUnit} = ${result.out} ${result.unit}`
      : `${result.input} ${result.inputUnit} = ${result.out} ${result.unit}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("100");
    setFrom("ft2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversor de pies² a m²" : "Square feet to square meters converter"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.out} {result.unit}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce un valor válido ≥ 0" : "Enter a valid value ≥ 0"}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} ${from === "ft2" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setFrom("ft2")}>
          ft² → m²
        </button>
        <button type="button" className={`${buttonClass} ${from === "m2" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setFrom("m2")}>
          m² → ft²
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Valor" : "Value"}</span>
        <input
          type="number"
          min="0"
          max="100000000"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 100" : "e.g. 100"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Multiplica pies cuadrados por 0.092903 para obtener metros cuadrados. Útil para habitaciones, terrenos o construcción."
          : "Multiply square feet by 0.092903 to get square meters. Useful for rooms, land, or construction."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "100 ft² → 9.2903 m²" : "100 ft² → 9.2903 m²"}</p>
        <p>{es ? "10 m² → 107.64 ft²" : "10 m² → 107.64 ft²"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/conversor-acres-hectareas" : "/tools/conversor-acres-hectareas"} className="underline text-primary">
            {es ? "Acres a hectáreas" : "Acres to hectares"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-area-rectangular" : "/tools/calculadora-area-rectangular"} className="underline text-primary">
            {es ? "Área rectangular" : "Rectangular area"}
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
