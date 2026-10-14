import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-2 text-sm";
const buttonClass = "h-10 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const primaryBtn = `${buttonClass} bg-primary text-primary-foreground`;

const UNITS = [
  { value: "kg", labelEn: "kg", labelEs: "kg" },
  { value: "g", labelEn: "g", labelEs: "g" },
  { value: "lb", labelEn: "lb", labelEs: "lb" },
  { value: "L", labelEn: "L", labelEs: "L" },
  { value: "mL", labelEn: "mL", labelEs: "mL" },
  { value: "oz", labelEn: "oz", labelEs: "oz" },
  { value: "item", labelEn: "item", labelEs: "unidad" },
];

export function UnitPriceTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [price, setPrice] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("kg");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (quantity <= 0) return null;
    const perUnit = price / quantity;
    return { perUnit, formatted: perUnit.toFixed(2) };
  }, [price, quantity]);

  function copy() {
    if (!result) return;
    const unitLabel = UNITS.find((u) => u.value === unit);
    const label = es ? unitLabel?.labelEs : unitLabel?.labelEn;
    const text = es
      ? `Precio unitario: $${result.formatted} por ${label} (total $${price.toFixed(2)} por ${quantity} ${label})`
      : `Unit price: $${result.formatted} per ${label} (total $${price.toFixed(2)} for ${quantity} ${label})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function reset() {
    setPrice(10);
    setQuantity(1);
    setUnit("kg");
  }

  const unitObj = UNITS.find((u) => u.value === unit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Precio total" : "Total price"}</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Cantidad" : "Quantity"}</span>
          <input
            type="number"
            min={0}
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, Number(e.target.value) || 0))}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">{es ? "Unidad" : "Unit"}</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className={fieldClass}>
            {UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {es ? u.labelEs : u.labelEn}
              </option>
            ))}
          </select>
        </label>
      </div>
      {result && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium">{es ? "Precio por unidad" : "Price per unit"}</p>
          <p className="text-2xl font-semibold mt-1">${result.formatted} / {es ? unitObj?.labelEs : unitObj?.labelEn}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {es ? "Compara con otros productos de la misma unidad." : "Compare with other products of the same unit."}
          </p>
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" className={primaryBtn} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {es
          ? "Ingresa el precio total y la cantidad para obtener el precio por unidad. Útil para comparar ofertas."
          : "Enter the total price and quantity to get the price per unit. Useful for comparing deals."}
      </p>
    </div>
  );
}
