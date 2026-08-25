import { useState } from "react";
import type { FinancialDefinition } from "@/lib/financial/types";

export function AdvancedCalculator({ definition }: { definition: FinancialDefinition }) {
  const initial = Object.fromEntries(definition.fields.map((f) => [f.key, f.defaultValue]));
  const [values, setValues] = useState<Record<string, number>>(initial);
  const [ran, setRan] = useState(false);
  const results = ran ? definition.calculate(values) : [];

  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2">
      {definition.fields.map((field) => <label key={field.key} className="space-y-2">
        <span className="text-sm font-semibold">{field.label}{field.unit ? ` (${field.unit})` : ""}</span>
        <input type="number" name={field.key} data-share-param={field.key} data-export-field={field.label} inputMode="decimal" min={field.min} step={field.step ?? "any"} value={values[field.key]}
          onChange={(e) => setValues((v) => ({ ...v, [field.key]: Number(e.target.value) }))}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
      </label>)}
    </div>
    <button type="button" onClick={() => setRan(true)} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90">Calcular</button>
    {results.length > 0 && <div data-export-result className="grid gap-3 sm:grid-cols-2">
      {results.map((r) => <div key={r.label} className="rounded-xl border border-border bg-muted/30 p-4"><p className="text-xs font-semibold text-muted-foreground">{r.label}</p><p className="mt-1 text-xl font-black">{r.value}</p></div>)}
    </div>}
    {definition.note && <p className="text-xs leading-5 text-muted-foreground">{definition.note}</p>}
  </div>;
}
