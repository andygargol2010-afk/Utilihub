import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function SimpleInterestCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("2");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    if (!Number.isFinite(p) || !Number.isFinite(r) || !Number.isFinite(t) || p <= 0 || r < 0 || r > 100 || t <= 0) return null;
    const interest = (p * r * t) / 100;
    const total = p + interest;
    return {
      interest: Math.round(interest * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }, [principal, rate, time]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Interés: ${result.interest} | Total: ${result.total}`
      : `Interest: ${result.interest} | Total: ${result.total}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPrincipal("1000");
    setRate("5");
    setTime("2");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{es ? `Interés: ${result.interest}` : `Interest: ${result.interest}`}</p>
            <p className="text-lg font-medium">{es ? `Total: ${result.total}` : `Total: ${result.total}`}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `I = P × r × t / 100` : `I = P × r × t / 100`}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce capital > 0, tasa 0-100 y tiempo > 0" : "Enter principal > 0, rate 0-100 and time > 0"}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Capital (P)" : "Principal (P)"}</span>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={fieldClass} placeholder="1000" min="0" step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tasa anual % (r)" : "Annual rate % (r)"}</span>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={fieldClass} placeholder="5" min="0" max="100" step="any" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Tiempo años (t)" : "Time years (t)"}</span>
          <input type="number" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} placeholder="2" min="0" step="any" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Interés simple: el interés se calcula solo sobre el capital inicial. No se capitaliza."
          : "Simple interest: interest is calculated only on the original principal. It does not compound."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1000 al 5% durante 2 años → interés 100, total 1100" : "1000 at 5% for 2 years → interest 100, total 1100"}</p>
        <p>{es ? "5000 al 3.5% durante 1 año → interés 175, total 5175" : "5000 at 3.5% for 1 year → interest 175, total 5175"}</p>
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
          <a href={es ? "/es/calculadora-presupuesto-mensual" : "/calculadora-presupuesto-mensual"} className="underline">
            {es ? "Calculadora de presupuesto mensual" : "Monthly budget calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/calculadora-descuento" : "/calculadora-descuento"} className="underline">
            {es ? "Calculadora de descuento" : "Discount calculator"}
          </a>
        </p>
      </div>
    </div>
  );
}
