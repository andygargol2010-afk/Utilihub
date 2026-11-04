import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type SolveFor = "V" | "I" | "R";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function calculateOhms(solve: SolveFor, a: number, b: number): number | { error: string } {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return { error: "finite" };
  if (solve === "V") {
    if (a < 0 || b < 0) return { error: "neg" };
    return a * b; // I * R
  }
  if (solve === "I") {
    if (b <= 0) return { error: "rpos" };
    if (a < 0) return { error: "neg" };
    return a / b; // V / R
  }
  // R
  if (b <= 0) return { error: "ipos" };
  if (a < 0) return { error: "neg" };
  return a / b; // V / I
}

export function OhmsLawCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [solve, setSolve] = useState<SolveFor>("V");
  const [valA, setValA] = useState("2");
  const [valB, setValB] = useState("10");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const a = parseFloat(valA);
    const b = parseFloat(valB);
    const out = calculateOhms(solve, a, b);
    if (typeof out === "object") {
      if (out.error === "finite") return { error: es ? "Ingresa valores numéricos" : "Enter numeric values" };
      if (out.error === "neg") return { error: es ? "Los valores no pueden ser negativos" : "Values cannot be negative" };
      if (out.error === "rpos") return { error: es ? "La resistencia debe ser mayor que 0" : "Resistance must be greater than 0" };
      return { error: es ? "La corriente debe ser mayor que 0" : "Current must be greater than 0" };
    }
    return { value: out, solve, a, b };
  }, [solve, valA, valB, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const unit = result.solve === "V" ? "V" : result.solve === "I" ? "A" : "Ω";
    const t = result.value.toFixed(4) + " " + unit;
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setSolve("V");
    setValA("2");
    setValB("10");
    setCopied(false);
  }

  const labelA = solve === "V" ? (es ? "Corriente (A)" : "Current (A)") : (es ? "Voltaje (V)" : "Voltage (V)");
  const labelB = solve === "R" ? (es ? "Corriente (A)" : "Current (A)") : (es ? "Resistencia (Ω)" : "Resistance (Ω)");
  const unit = solve === "V" ? "V" : solve === "I" ? "A" : "Ω";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Ley de Ohm" : "Ohm's law"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-2xl font-semibold">{result.value.toFixed(4)} {unit}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Resultado para ${result.solve}` : `Result for ${result.solve}`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa valores" : "Enter values"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Calcular" : "Solve for"}</span>
          <select value={solve} onChange={(e) => setSolve(e.target.value as SolveFor)} className={fieldClass}>
            <option value="V">{es ? "Voltaje (V)" : "Voltage (V)"}</option>
            <option value="I">{es ? "Corriente (I)" : "Current (I)"}</option>
            <option value="R">{es ? "Resistencia (R)" : "Resistance (R)"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{labelA}</span>
          <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{labelB}</span>
          <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "V = I × R. Calculá cualquiera de las tres magnitudes a partir de las otras dos."
          : "V = I × R. Calculate any of the three quantities from the other two."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>I = 2 A, R = 10 Ω → V = 20 V</p>
        <p>V = 12 V, R = 4 Ω → I = 3 A</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/potencia-electrica" : "/tools/potencia-electrica"} className="underline text-primary">
            {es ? "Potencia eléctrica" : "Electrical power"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/resistencias-serie" : "/tools/resistencias-serie"} className="underline text-primary">
            {es ? "Resistencias en serie" : "Series resistors"}
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
