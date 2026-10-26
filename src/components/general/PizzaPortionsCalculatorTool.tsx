import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function PizzaPortionsCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [people, setPeople] = useState("4");
  const [slicesPerPerson, setSlicesPerPerson] = useState("3");
  const [slicesPerPizza, setSlicesPerPizza] = useState("8");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(people);
    const spp = parseFloat(slicesPerPerson);
    const spz = parseFloat(slicesPerPizza);
    if (!Number.isFinite(p) || !Number.isFinite(spp) || !Number.isFinite(spz) || p <= 0 || spp <= 0 || spz <= 0) return null;
    const totalSlices = p * spp;
    const pizzas = Math.ceil(totalSlices / spz);
    const leftover = pizzas * spz - totalSlices;
    return { totalSlices: Math.round(totalSlices * 10) / 10, pizzas, leftover: Math.round(leftover * 10) / 10 };
  }, [people, slicesPerPerson, slicesPerPizza]);

  async function copy() {
    if (!result) return;
    const text = es
      ? `Pizzas necesarias: ${result.pizzas} (${result.totalSlices} porciones, sobran ${result.leftover})`
      : `Pizzas needed: ${result.pizzas} (${result.totalSlices} slices, leftover ${result.leftover})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setPeople("4");
    setSlicesPerPerson("3");
    setSlicesPerPizza("8");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Pizzas a pedir" : "Pizzas to order"}</p>
        {result ? (
          <>
            <p className="text-3xl font-semibold">{result.pizzas}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `${result.totalSlices} porciones totales · sobran ${result.leftover}` : `${result.totalSlices} total slices · leftover ${result.leftover}`}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {es ? "Personas, porciones y por pizza > 0" : "People, slices per person and per pizza > 0"}
          </p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Personas" : "People"}</span>
        <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} className={fieldClass} placeholder="4" min="1" step="1" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Porciones por persona" : "Slices per person"}</span>
        <input type="number" value={slicesPerPerson} onChange={(e) => setSlicesPerPerson(e.target.value)} className={fieldClass} placeholder="3" min="0.5" step="0.5" />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Porciones por pizza" : "Slices per pizza"}</span>
        <input type="number" value={slicesPerPizza} onChange={(e) => setSlicesPerPizza(e.target.value)} className={fieldClass} placeholder="8" min="1" step="1" />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Total porciones = personas × porciones/persona. Pizzas = techo(total / porciones por pizza)." : "Total slices = people × slices/person. Pizzas = ceil(total / slices per pizza)."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "4 personas, 3 porciones, 8/pizza → 2 pizzas (12 porciones)" : "4 people, 3 slices, 8/pizza → 2 pizzas (12 slices)"}</p>
        <p>{es ? "2 personas, 2.5 porciones, 6/pizza → 1 pizza (5 porciones)" : "2 people, 2.5 slices, 6/pizza → 1 pizza (5 slices)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
