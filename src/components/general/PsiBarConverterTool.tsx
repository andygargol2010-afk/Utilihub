import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./PsiBarConverterTool.part1";
import { type Unit, PSI_TO_BAR, BAR_TO_PSI, fieldClass, buttonClass } from "./PsiBarConverterTool.part2";

export function PsiBarConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState("32");
  const [from, setFrom] = useState<Unit>("psi");
  const [to, setTo] = useState<Unit>("bar");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (Number.isNaN(v) || !Number.isFinite(v)) return null;
    if (v < 0) return { error: es ? "La presión no puede ser negativa" : "Pressure cannot be negative" };
    if (v > 10000) return { error: es ? "Valor fuera de rango razonable" : "Value outside reasonable range" };
    let out = v;
    if (from === "psi" && to === "bar") out = v * PSI_TO_BAR;
    else if (from === "bar" && to === "psi") out = v * BAR_TO_PSI;
    else if (from === to) out = v;
    return { out, v, from, to };
  }, [value, from, to, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `${result.v} ${result.from} = ${result.out.toFixed(4)} ${result.to}`
      : `${result.v} ${result.from} = ${result.out.toFixed(4)} ${result.to}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setValue("32");
    setFrom("psi");
    setTo("bar");
    setCopied(false);
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Conversión de presión" : "Pressure conversion"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.out.toFixed(4)} {result.to}</p>
            <p className="text-sm text-muted-foreground">
              {result.v} {result.from} → {result.to}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un valor válido" : "Enter a valid value"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Valor" : "Value"}</span>
          <input
            type="number"
            min="0"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={fieldClass}
            placeholder="32"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "De" : "From"}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as Unit)} className={fieldClass}>
            <option value="psi">psi</option>
            <option value="bar">bar</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "A" : "To"}</span>
          <select value={to} onChange={(e) => setTo(e.target.value as Unit)} className={fieldClass}>
            <option value="psi">psi</option>
            <option value="bar">bar</option>
          </select>
        </label>
      </div>

      <div className="flex gap-2">
        <button type="button" className={buttonClass} onClick={swap}>
          {es ? "Intercambiar" : "Swap"}
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "1 psi ≈ 0.06895 bar · 1 bar ≈ 14.5038 psi. Útil para neumáticos, sistemas hidráulicos y ciencia."
          : "1 psi ≈ 0.06895 bar · 1 bar ≈ 14.5038 psi. Useful for tires, hydraulic systems and science."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "32 psi → ~2.2063 bar" : "32 psi → ~2.2063 bar"}</p>
        <p>{es ? "2 bar → ~29.0075 psi" : "2 bar → ~29.0075 psi"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/conversor-mpg-l100km" : "/tools/conversor-mpg-l100km"} className="underline text-primary">
            {es ? "Conversor MPG ↔ L/100km" : "MPG ↔ L/100km converter"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/conversor-celsius-kelvin" : "/tools/conversor-celsius-kelvin"} className="underline text-primary">
            {es ? "Conversor Celsius-Kelvin" : "Celsius-Kelvin converter"}
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
