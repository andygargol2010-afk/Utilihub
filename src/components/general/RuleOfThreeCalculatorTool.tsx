import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function RuleOfThreeCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [a, setA] = useState("2");
  const [b, setB] = useState("4");
  const [c, setC] = useState("6");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const va = parseFloat(a);
    const vb = parseFloat(b);
    const vc = parseFloat(c);
    if (!Number.isFinite(va) || !Number.isFinite(vb) || !Number.isFinite(vc) || va === 0) return null;
    const x = (vb * vc) / va;
    return {
      x: Math.round(x * 100) / 100,
    };
  }, [a, b, c]);

  async function copy() {
    if (!result) return;
    const text = es ? `x = ${result.x}` : `x = ${result.x}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setA("2");
    setB("4");
    setC("6");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado (x)" : "Result (x)"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{result.x}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `a/b = c/x → x = (b × c) / a` : `a/b = c/x → x = (b × c) / a`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce a, b, c (a ≠ 0)" : "Enter a, b, c (a ≠ 0)"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">a</span>
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className={fieldClass} placeholder="2" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">b</span>
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className={fieldClass} placeholder="4" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">c</span>
          <input type="number" value={c} onChange={(e) => setC(e.target.value)} className={fieldClass} placeholder="6" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Si a/b = c/x, entonces x = (b × c) / a. Para proporciones directas."
          : "If a/b = c/x, then x = (b × c) / a. For direct proportions."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2/4 = 6/x → x = 12" : "2/4 = 6/x → x = 12"}</p>
        <p>{es ? "3/9 = 5/x → x = 15" : "3/9 = 5/x → x = 15"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/calculadora-cambio-porcentual" : "/calculadora-cambio-porcentual"} className="underline">
            {es ? "Calculadora de cambio porcentual" : "Percentage change calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-porcentaje-del-total" : "/calculadora-porcentaje-del-total"} className="underline">
            {es ? "Calculadora de porcentaje del total" : "Percentage of total calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
