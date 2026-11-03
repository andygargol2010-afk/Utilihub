import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CoffeeDoseCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [people, setPeople] = useState("2");
  const [gramsPer, setGramsPer] = useState("15");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(people);
    const g = parseFloat(gramsPer);
    if (Number.isNaN(p) || Number.isNaN(g) || !Number.isFinite(p) || !Number.isFinite(g)) return null;
    if (p <= 0 || g <= 0) return { error: es ? "Valores deben ser mayores que cero" : "Values must be greater than zero" };
    if (p > 50 || g > 100) return { error: es ? "Valores fuera de rango razonable" : "Values outside reasonable range" };
    const total = p * g;
    return { total, p, g };
  }, [people, gramsPer, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `${result.p} personas × ${result.g} g = ${result.total.toFixed(1)} g`
      : `${result.p} people × ${result.g} g = ${result.total.toFixed(1)} g`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPeople("2");
    setGramsPer("15");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Dosis total de café" : "Total coffee dose"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.total.toFixed(1)} g</p>
            <p className="text-sm text-muted-foreground">
              {result.p} × {result.g} g/persona
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores válidos" : "Enter valid values"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Personas" : "People"}</span>
          <input
            type="number"
            min="1"
            step="1"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className={fieldClass}
            placeholder="2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Gramos por persona" : "Grams per person"}</span>
          <input
            type="number"
            min="1"
            step="any"
            value={gramsPer}
            onChange={(e) => setGramsPer(e.target.value)}
            className={fieldClass}
            placeholder="15"
          />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Ratio estándar ~15 g por persona (taza o pour-over). Ajusta para café más fuerte o suave."
          : "Standard ratio ~15 g per person (cup or pour-over). Adjust for stronger or milder coffee."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2 personas × 15 g = 30 g" : "2 people × 15 g = 30 g"}</p>
        <p>{es ? "4 personas × 12 g = 48 g" : "4 people × 12 g = 48 g"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-calorias-porcion" : "/tools/calculadora-calorias-porcion"} className="underline text-primary">
            {es ? "Calculadora de calorías por porción" : "Calories per serving calculator"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/conversor-tazas-ml" : "/tools/conversor-tazas-ml"} className="underline text-primary">
            {es ? "Conversor tazas a ml" : "Cups to ml converter"}
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
