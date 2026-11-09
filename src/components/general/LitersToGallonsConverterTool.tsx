import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const LITERS_PER_GALLON = 3.78541;

export function LitersToGallonsConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [liters, setLiters] = useState("1");
  const [gallons, setGallons] = useState("");
  const [mode, setMode] = useState<"l2g" | "g2l">("l2g");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === "l2g") {
      const l = parseFloat(liters);
      if (isNaN(l) || l < 0 || l > 1000000) return null;
      return { value: (l / LITERS_PER_GALLON).toFixed(4), unit: "gal" };
    } else {
      const g = parseFloat(gallons);
      if (isNaN(g) || g < 0 || g > 1000000) return null;
      return { value: (g * LITERS_PER_GALLON).toFixed(4), unit: "L" };
    }
  }, [liters, gallons, mode]);

  async function copy() {
    if (!result?.value) return;
    try {
      await navigator.clipboard.writeText(result.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLiters("1");
    setGallons("");
    setMode("l2g");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        {result?.value != null ? (
          <p className="text-3xl font-semibold">{result.value} {result.unit}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Ingresa un valor válido ≥ 0" : "Enter a valid value ≥ 0"}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className={mode === "l2g" ? `${buttonClass} bg-primary text-primary-foreground` : buttonClass} onClick={() => setMode("l2g")}>{es ? "Litros → Galones" : "Liters → Gallons"}</button>
        <button type="button" className={mode === "g2l" ? `${buttonClass} bg-primary text-primary-foreground` : buttonClass} onClick={() => setMode("g2l")}>{es ? "Galones → Litros" : "Gallons → Liters"}</button>
      </div>

      {mode === "l2g" ? (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Litros" : "Liters"}</span>
          <input type="number" min="0" step="0.01" value={liters} onChange={(e) => setLiters(e.target.value)} className={fieldClass} />
        </label>
      ) : (
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Galones (US)" : "Gallons (US)"}</span>
          <input type="number" min="0" step="0.01" value={gallons} onChange={(e) => setGallons(e.target.value)} className={fieldClass} />
        </label>
      )}

      <p className="text-sm text-muted-foreground">{es ? "1 galón US = 3.78541 litros" : "1 US gallon = 3.78541 liters"}</p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "1 L → 0.2642 gal" : "1 L → 0.2642 gal"}</p>
        <p>{es ? "1 gal → 3.7854 L" : "1 gal → 3.7854 L"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!result?.value}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
