import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

function n(v: string) {
  return Number(String(v).trim().replace(",", "."));
}

const inputClass = "h-11 w-full rounded-xl border bg-background px-3";

export function GpaCalculator({ tool, locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [rows, setRows] = useState<{ grade: string; credits: string }[]>([
    { grade: "", credits: "" },
    { grade: "", credits: "" },
  ]);
  const [out, setOut] = useState("");

  const run = () => {
    try {
      const parsed = rows
        .map((r) => ({ grade: n(r.grade), credits: n(r.credits) }))
        .filter((r) => r.credits > 0 && Number.isFinite(r.grade));
      if (!parsed.length) {
        setOut(es ? "Añade al menos una materia con créditos > 0." : "Add at least one course with credits > 0.");
        return;
      }
      const totalC = parsed.reduce((s, r) => s + r.credits, 0);
      const pts = parsed.reduce((s, r) => s + r.grade * r.credits, 0);
      setOut(
        `GPA: ${(pts / totalC).toFixed(3)}\n${es ? "Materias" : "Courses"}: ${parsed.length}\n${es ? "Créditos" : "Credits"}: ${totalC}`,
      );
    } catch {
      setOut(es ? "Entrada no válida." : "Invalid input.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{es ? "Calculadora de GPA" : "GPA calculator"}</p>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className="space-y-1">
              <span className="text-sm font-medium">{es ? `Nota ${i + 1}` : `Grade ${i + 1}`}</span>
              <input
                type="number"
                className={inputClass}
                value={row.grade}
                step="any"
                onChange={(e) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, grade: e.target.value } : r)))}
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">{es ? `Créditos ${i + 1}` : `Credits ${i + 1}`}</span>
              <input
                type="number"
                className={inputClass}
                value={row.credits}
                step="any"
                min="0"
                onChange={(e) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, credits: e.target.value } : r)))}
              />
            </label>
            <button
              type="button"
              className="h-11 rounded-xl border px-3 text-sm text-muted-foreground hover:bg-muted disabled:opacity-40"
              disabled={rows.length <= 1}
              onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
            >
              {es ? "Quitar" : "Remove"}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="rounded-xl border border-dashed px-4 py-2 text-sm font-medium hover:bg-muted"
          onClick={() => setRows((rs) => [...rs, { grade: "", credits: "" }])}
        >
          {es ? "+ Añadir materia" : "+ Add course"}
        </button>
      </div>
      <button type="button" onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">
        {es ? "Calcular" : "Calculate"}
      </button>
      {out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm">{out}</output>}
    </div>
  );
}
