import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

type Ingredient = { name: string; packPrice: string; packSize: string; used: string };

export function RecipeCostCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [servings, setServings] = useState("4");
  const [ings, setIngs] = useState<Ingredient[]>([
    { name: "Flour", packPrice: "6", packSize: "1000", used: "300" },
    { name: "Butter", packPrice: "14", packSize: "500", used: "200" },
    { name: "", packPrice: "", packSize: "", used: "" },
  ]);
  const [copied, setCopied] = useState(false);

  function update(i: number, key: keyof Ingredient, val: string) {
    setIngs((prev) => prev.map((ing, idx) => (idx === i ? { ...ing, [key]: val } : ing)));
  }

  function add() {
    setIngs((prev) => [...prev, { name: "", packPrice: "", packSize: "", used: "" }]);
  }

  function remove(i: number) {
    setIngs((prev) => prev.filter((_, idx) => idx !== i));
  }

  const total = ings.reduce((sum, ing) => {
    const pp = parseFloat(ing.packPrice) || 0;
    const ps = parseFloat(ing.packSize) || 0;
    const u = parseFloat(ing.used) || 0;
    if (ps <= 0 || u <= 0) return sum;
    return sum + (pp / ps) * u;
  }, 0);

  const per = (total / (parseFloat(servings) || 1)).toFixed(2);
  const totalStr = total.toFixed(2);

  async function copy() {
    const text = es
      ? `Costo total: ${totalStr} | Por porción (${servings}): ${per}`
      : `Total cost: ${totalStr} | Per serving (${servings}): ${per}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setServings("4");
    setIngs([
      { name: "Flour", packPrice: "6", packSize: "1000", used: "300" },
      { name: "Butter", packPrice: "14", packSize: "500", used: "200" },
      { name: "", packPrice: "", packSize: "", used: "" },
    ]);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Costo total de la receta" : "Total recipe cost"}</p>
        <p className="text-3xl font-semibold">{totalStr}</p>
        <p className="text-sm text-muted-foreground">{es ? `Por porción (${servings}): ${per}` : `Per serving (${servings}): ${per}`}</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Porciones" : "Servings"}</span>
        <input type="number" value={servings} onChange={(e) => setServings(e.target.value)} className={fieldClass} min="1" />
      </label>

      <div className="space-y-4">
        {ings.map((ing, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-5 items-end">
            <input placeholder={es ? "Ingrediente" : "Ingredient"} value={ing.name} onChange={(e) => update(i, "name", e.target.value)} className={fieldClass} />
            <input type="number" placeholder={es ? "Precio paquete" : "Pack price"} value={ing.packPrice} onChange={(e) => update(i, "packPrice", e.target.value)} className={fieldClass} />
            <input type="number" placeholder={es ? "Tamaño paquete" : "Pack size"} value={ing.packSize} onChange={(e) => update(i, "packSize", e.target.value)} className={fieldClass} />
            <input type="number" placeholder={es ? "Cantidad usada" : "Amount used"} value={ing.used} onChange={(e) => update(i, "used", e.target.value)} className={fieldClass} />
            <button type="button" className={buttonClass} onClick={() => remove(i)}>{es ? "Quitar" : "Remove"}</button>
          </div>
        ))}
        <button type="button" className={buttonClass} onClick={add}>{es ? "Agregar ingrediente" : "Add ingredient"}</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>
    </div>
  );
}
