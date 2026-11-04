import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./TripTotalBudgetCalculatorTool.part1";
import { fieldClass, buttonClass } from "./TripTotalBudgetCalculatorTool.part2";

export function TripTotalBudgetCalculatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [transport, setTransport] = useState("200");
  const [lodging, setLodging] = useState("400");
  const [food, setFood] = useState("150");
  const [misc, setMisc] = useState("50");
  const [people, setPeople] = useState("2");
  const [days, setDays] = useState("4");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const t = parseFloat(transport) || 0;
    const l = parseFloat(lodging) || 0;
    const f = parseFloat(food) || 0;
    const m = parseFloat(misc) || 0;
    const p = parseFloat(people) || 1;
    const d = parseFloat(days) || 1;
    if ([t, l, f, m].some((v) => Number.isNaN(v) || !Number.isFinite(v) || v < 0)) return { error: es ? "Los montos deben ser ≥ 0" : "Amounts must be ≥ 0" };
    if (p <= 0 || d <= 0 || !Number.isFinite(p) || !Number.isFinite(d)) return { error: es ? "Personas y días deben ser > 0" : "People and days must be > 0" };
    if (t + l + f + m > 1e9) return { error: es ? "Total fuera de rango" : "Total out of range" };
    const total = t + l + f + m;
    const perPerson = total / p;
    const perDay = total / d;
    return { total, perPerson, perDay, t, l, f, m, p, d };
  }, [transport, lodging, food, misc, people, days, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Presupuesto total viaje: ${result.total.toFixed(2)} (por persona: ${result.perPerson.toFixed(2)}, por día: ${result.perDay.toFixed(2)})`
      : `Total trip budget: ${result.total.toFixed(2)} (per person: ${result.perPerson.toFixed(2)}, per day: ${result.perDay.toFixed(2)})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setTransport("200");
    setLodging("400");
    setFood("150");
    setMisc("50");
    setPeople("2");
    setDays("4");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Presupuesto total del viaje" : "Total trip budget"}</p>
        {result && !("error" in result) ? (
          <div className="space-y-1">
            <p className="text-lg font-semibold">{result.total.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {es ? `Por persona: ${result.perPerson.toFixed(2)} · Por día: ${result.perDay.toFixed(2)}` : `Per person: ${result.perPerson.toFixed(2)} · Per day: ${result.perDay.toFixed(2)}`}
            </p>
          </div>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce montos válidos" : "Enter valid amounts"}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Transporte" : "Transport"}</span>
          <input type="number" min="0" step="any" value={transport} onChange={(e) => setTransport(e.target.value)} className={fieldClass} placeholder="200" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Alojamiento" : "Lodging"}</span>
          <input type="number" min="0" step="any" value={lodging} onChange={(e) => setLodging(e.target.value)} className={fieldClass} placeholder="400" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Comida" : "Food"}</span>
          <input type="number" min="0" step="any" value={food} onChange={(e) => setFood(e.target.value)} className={fieldClass} placeholder="150" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Otros" : "Misc"}</span>
          <input type="number" min="0" step="any" value={misc} onChange={(e) => setMisc(e.target.value)} className={fieldClass} placeholder="50" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Personas" : "People"}</span>
          <input type="number" min="1" step="1" value={people} onChange={(e) => setPeople(e.target.value)} className={fieldClass} placeholder="2" />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Días" : "Days"}</span>
          <input type="number" min="1" step="1" value={days} onChange={(e) => setDays(e.target.value)} className={fieldClass} placeholder="4" />
        </label>
      </div>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Suma transporte + alojamiento + comida + otros. Opcional: divide por personas y/o días."
          : "Sum transport + lodging + food + misc. Optional: divide by people and/or days."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "200 + 400 + 150 + 50 = 800 (2 pers, 4 días → 400/pers, 200/día)" : "200 + 400 + 150 + 50 = 800 (2 people, 4 days → 400/person, 200/day)"}</p>
        <p>{es ? "100 + 200 + 80 + 20 = 400 (1 pers, 2 días → 400/pers, 200/día)" : "100 + 200 + 80 + 20 = 400 (1 person, 2 days → 400/person, 200/day)"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/tiempo-viaje" : "/tools/tiempo-viaje"} className="underline text-primary">
            {es ? "Tiempo de viaje" : "Travel time"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/consumo-viaje" : "/tools/consumo-viaje"} className="underline text-primary">
            {es ? "Consumo de combustible" : "Fuel consumption"}
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
