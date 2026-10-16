import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function scaleLine(line: string, factor: number): string {
  return line.replace(/(\d+(?:[.,]\d+)?)/g, (match) => {
    const num = parseFloat(match.replace(",", "."));
    if (isNaN(num)) return match;
    const scaled = num * factor;
    return scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(2).replace(/\.?0+$/, "");
  });
}

export function RecipeScalerTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [orig, setOrig] = useState("4");
  const [desired, setDesired] = useState("8");
  const [ingredients, setIngredients] = useState("2 cups flour\n1 tsp salt\n3 eggs");
  const [copied, setCopied] = useState(false);

  const factor = useMemo(() => {
    const o = parseFloat(orig) || 0;
    const d = parseFloat(desired) || 0;
    if (o <= 0 || d <= 0) return 0;
    return d / o;
  }, [orig, desired]);

  const scaled = useMemo(() => {
    if (factor <= 0) return "";
    return ingredients
      .split("\n")
      .map((line) => scaleLine(line.trim(), factor))
      .join("\n");
  }, [ingredients, factor]);

  async function copy() {
    if (!scaled) return;
    try {
      await navigator.clipboard.writeText(scaled);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setOrig("4");
    setDesired("8");
    setIngredients("2 cups flour\n1 tsp salt\n3 eggs");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Factor de escala" : "Scale factor"}</p>
        <p className="text-3xl font-semibold">{factor > 0 ? factor.toFixed(2) : "—"}</p>
        <p className="text-sm text-muted-foreground">
          {es ? "Ingredientes escalados:" : "Scaled ingredients:"}
        </p>
        <pre className="whitespace-pre-wrap text-sm bg-background rounded-lg p-3 border">{scaled || (es ? "Introduce porciones válidas" : "Enter valid servings")}</pre>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Porciones originales" : "Original servings"}</span>
          <input type="number" value={orig} onChange={(e) => setOrig(e.target.value)} className={fieldClass} min="0.1" step="0.1" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Porciones deseadas" : "Desired servings"}</span>
          <input type="number" value={desired} onChange={(e) => setDesired(e.target.value)} className={fieldClass} min="0.1" step="0.1" />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Ingredientes (una línea cada uno)" : "Ingredients (one per line)"}</span>
        <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} className={fieldClass} rows={6} />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "4 porciones → 8: 2 tazas harina se convierte en 4" : "4 servings → 8: 2 cups flour becomes 4"}</p>
        <p>{es ? "6 porciones → 3: 1.5 cucharadas se convierte en 0.75" : "6 servings → 3: 1.5 tbsp becomes 0.75"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar ingredientes" : "Copy ingredients"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
