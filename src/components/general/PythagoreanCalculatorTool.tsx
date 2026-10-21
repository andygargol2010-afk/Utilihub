import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type Mode = "hyp" | "leg";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PythagoreanCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<Mode>("hyp");
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const va = parseFloat(a);
    const vb = parseFloat(b);
    if (isNaN(va) || isNaN(vb) || va < 0 || vb < 0) return null;
    if (mode === "hyp") {
      const c = Math.sqrt(va * va + vb * vb);
      return { value: Math.round(c * 100) / 100, label: es ? "Hipotenusa" : "Hypotenuse" };
    } else {
      if (va <= vb) return null; // c must be larger
      const leg = Math.sqrt(va * va - vb * vb);
      return { value: Math.round(leg * 100) / 100, label: es ? "Cateto" : "Leg" };
    }
  }, [a, b, mode, es]);

  async function copy() {
    if (!result) return;
    const textOut = `${result.label}: ${result.value}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setMode("hyp");
    setA("3");
    setB("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{result ? result.label : (es ? "Resultado" : "Result")}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.value}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Valores positivos válidos" : "Valid positive values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{mode === "hyp" ? (es ? "Cateto a" : "Leg a") : (es ? "Hipotenusa c" : "Hypotenuse c")}</span>
          <input type="number" step="0.01" min="0" value={a} onChange={(e) => setA(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{mode === "hyp" ? (es ? "Cateto b" : "Leg b") : (es ? "Cateto conocido" : "Known leg")}</span>
          <input type="number" step="0.01" min="0" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} ${mode === "hyp" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("hyp")}>
          {es ? "Hallar hipotenusa" : "Find hypotenuse"}
        </button>
        <button type="button" className={`${buttonClass} ${mode === "leg" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("leg")}>
          {es ? "Hallar cateto" : "Find leg"}
        </button>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>3-4-5 → hipotenusa 5</p>
        <p>5-12-13 → hipotenusa 13</p>
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
