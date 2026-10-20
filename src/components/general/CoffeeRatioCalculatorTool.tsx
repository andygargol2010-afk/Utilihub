import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CoffeeRatioCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [coffee, setCoffee] = useState("20");
  const [ratio, setRatio] = useState("15");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const c = parseFloat(coffee);
    const r = parseFloat(ratio);
    if (isNaN(c) || isNaN(r) || c <= 0 || r <= 0) return null;
    const water = c * r;
    return { water: Math.round(water * 10) / 10, coffee: c, ratio: r };
  }, [coffee, ratio]);

  async function copy() {
    if (!result) return;
    const textOut = es
      ? `Agua: ${result.water} g (café ${result.coffee} g, ratio 1:${result.ratio})`
      : `Water: ${result.water} g (coffee ${result.coffee} g, ratio 1:${result.ratio})`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setCoffee("20");
    setRatio("15");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Agua necesaria" : "Water needed"}</p>
        {result ? (
          <p className="text-3xl font-semibold">{result.water} g</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce valores > 0" : "Enter values > 0"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Café (g)" : "Coffee (g)"}</span>
          <input type="number" step="any" min="0" value={coffee} onChange={(e) => setCoffee(e.target.value)} className={fieldClass} />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Ratio (agua:café)" : "Ratio (water:coffee)"}</span>
          <input type="number" step="any" min="1" value={ratio} onChange={(e) => setRatio(e.target.value)} className={fieldClass} />
        </label>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "20 g café, ratio 15 → 300 g agua" : "20 g coffee, ratio 15 → 300 g water"}</p>
        <p>{es ? "15 g café, ratio 16 → 240 g agua" : "15 g coffee, ratio 16 → 240 g water"}</p>
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
