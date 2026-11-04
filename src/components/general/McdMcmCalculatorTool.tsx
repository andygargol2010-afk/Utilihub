import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./McdMcmCalculatorTool.part1";
import { gcd, lcm, fieldClass, buttonClass } from "./McdMcmCalculatorTool.part2";

export function McdMcmCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("12");
  const [b, setB] = useState("18");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const na = Number(a.trim());
    const nb = Number(b.trim());
    if (a.trim() === "" || b.trim() === "" || Number.isNaN(na) || Number.isNaN(nb)) {
      return { error: es ? "Introduce dos números válidos" : "Enter two valid numbers" };
    }
    if (!Number.isInteger(na) || !Number.isInteger(nb)) {
      return { error: es ? "Solo enteros (positivos o negativos)" : "Integers only (positive or negative)" };
    }
    if (Math.abs(na) > 1e12 || Math.abs(nb) > 1e12) {
      return { error: es ? "Números demasiado grandes" : "Numbers too large" };
    }
    const g = gcd(na, nb);
    const l = lcm(na, nb);
    return { gcd: g, lcm: l, na, nb };
  }, [a, b, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `MCD(${result.na}, ${result.nb}) = ${result.gcd}; MCM = ${result.lcm}`
      : `GCD(${result.na}, ${result.nb}) = ${result.gcd}; LCM = ${result.lcm}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setA("12");
    setB("18");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">
              {es ? "MCD" : "GCD"}: {result.gcd} · {es ? "MCM" : "LCM"}: {result.lcm}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce dos enteros" : "Enter two integers"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Número A" : "Number A"}</span>
          <input type="text" value={a} onChange={(e) => setA(e.target.value)} className={fieldClass} placeholder="12" inputMode="numeric" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Número B" : "Number B"}</span>
          <input type="text" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} placeholder="18" inputMode="numeric" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Máximo común divisor (MCD / GCD) y mínimo común múltiplo (MCM / LCM) de dos enteros. Usa el algoritmo de Euclides."
          : "Greatest common divisor (GCD) and least common multiple (LCM) of two integers. Uses the Euclidean algorithm."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "12 y 18 → MCD 6, MCM 36" : "12 and 18 → GCD 6, LCM 36"}</p>
        <p>{es ? "15 y 25 → MCD 5, MCM 75" : "15 and 25 → GCD 5, LCM 75"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-regla-de-tres" : "/tools/calculadora-regla-de-tres"} className="underline text-primary">
            {es ? "Regla de tres" : "Rule of three"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-porcentaje-de-numero" : "/tools/calculadora-porcentaje-de-numero"} className="underline text-primary">
            {es ? "Porcentaje de un número" : "Percentage of a number"}
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
