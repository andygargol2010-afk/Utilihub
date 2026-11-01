import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CaloriesPerServingCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [totalCalories, setTotalCalories] = useState("800");
  const [servings, setServings] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const total = parseFloat(totalCalories);
    const serv = parseFloat(servings);
    if (!Number.isFinite(total) || total < 0 || total > 100000 || !Number.isFinite(serv) || serv <= 0 || serv > 1000) return null;
    const perServing = Math.round((total / serv) * 10) / 10;
    return { perServing };
  }, [totalCalories, servings]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Calorías por porción: ${result.perServing}`
      : `Calories per serving: ${result.perServing}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTotalCalories("800");
    setServings("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Calculadora de calorías por porción" : "Calories per serving calculator"}</p>
        {result ? (
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{es ? `${result.perServing} kcal/porción` : `${result.perServing} kcal/serving`}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Introduce valores válidos (porciones > 0)" : "Enter valid values (servings > 0)"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Calorías totales" : "Total calories"}</span>
        <input
          type="number"
          min="0"
          max="100000"
          step="1"
          value={totalCalories}
          onChange={(e) => setTotalCalories(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 800" : "e.g. 800"}
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Número de porciones" : "Number of servings"}</span>
        <input
          type="number"
          min="0.1"
          max="1000"
          step="0.1"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          className={fieldClass}
          placeholder={es ? "Ej. 4" : "e.g. 4"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Divide las calorías totales de la receta o paquete entre el número de porciones. Ideal para control de dieta y cocina."
          : "Divide the total calories of the recipe or package by the number of servings. Ideal for diet tracking and cooking."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "800 kcal totales / 4 porciones → 200 kcal/porción" : "800 total kcal / 4 servings → 200 kcal/serving"}</p>
        <p>{es ? "1200 kcal totales / 6 porciones → 200 kcal/porción" : "1200 total kcal / 6 servings → 200 kcal/serving"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/calculadora-calorias-diarias" : "/tools/calculadora-calorias-diarias"} className="underline text-primary">
            {es ? "Calorías diarias" : "Daily calories"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/calculadora-porciones-pizza" : "/tools/calculadora-porciones-pizza"} className="underline text-primary">
            {es ? "Porciones de pizza" : "Pizza portions"}
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
