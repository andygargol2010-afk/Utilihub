import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

export function UtilityAdvancedTool({ tool, locale = "en" }: { tool: GeneralTool; locale?: "en" | "es" }) {
  const [values, setValues] = useState(["", "", ""]);
  const [out, setOut] = useState("");
  const es = locale === "es";
  const n = (value: string) => Number(value.replace(",", "."));
  const update = (index: number, value: string) => setValues((current) => current.map((item, i) => i === index ? value : item));
  const process = () => {
    const nums = values.map(n);
    if (nums.some((value) => !Number.isFinite(value))) { setOut(es ? "Completa todos los valores con números válidos." : "Fill all values with valid numbers."); return; }
    if (tool.slug === "propina-y-cuenta-compartida") {
      const [bill, tip, people] = nums;
      if (bill < 0 || tip < 0 || people <= 0) { setOut(es ? "La cuenta y la propina no pueden ser negativas, y el número de personas debe ser mayor que 0." : "Bill and tip cannot be negative, and people must be greater than 0."); return; }
      const total = bill * (1 + tip / 100); setOut(es ? `Total con propina: ${total.toFixed(2)}\nImporte por persona: ${(total / Math.floor(people)).toFixed(2)}\nPropina total: ${(bill * tip / 100).toFixed(2)}` : `Total with tip: ${total.toFixed(2)}\nAmount per person: ${(total / Math.floor(people)).toFixed(2)}\nTotal tip: ${(bill * tip / 100).toFixed(2)}`); return;
    }
    if (tool.slug === "regla-50-30-20") {
      const [income, needs, wants] = nums;
      if (income <= 0 || needs < 0 || wants < 0 || needs + wants > 100) { setOut(es ? "Los ingresos deben ser positivos y los porcentajes no pueden superar el 100 %." : "Income must be positive and percentages cannot exceed 100%."); return; }
      const savings = 100 - needs - wants; setOut(es ? `Necesidades: ${(income * needs / 100).toFixed(2)}\nDeseos: ${(income * wants / 100).toFixed(2)}\nAhorro disponible: ${(income * savings / 100).toFixed(2)}\nDistribución restante: ${savings.toFixed(2)} %` : `Needs: ${(income * needs / 100).toFixed(2)}\nWants: ${(income * wants / 100).toFixed(2)}\nAvailable savings: ${(income * savings / 100).toFixed(2)}\nRemaining distribution: ${savings.toFixed(2)} %`); return;
    }
    if (tool.slug === "horas-decimales") {
      const [hours, minutes, seconds] = nums;
      if (hours < 0 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) { setOut(es ? "Las horas no pueden ser negativas y los minutos/segundos deben estar entre 0 y 59." : "Hours cannot be negative and minutes/seconds must be between 0 and 59."); return; }
      setOut(es ? `Horas decimales: ${(hours + minutes / 60 + seconds / 3600).toFixed(4)}\nMinutos totales: ${(hours * 60 + minutes + seconds / 60).toFixed(2)}` : `Decimal hours: ${(hours + minutes / 60 + seconds / 3600).toFixed(4)}\nTotal minutes: ${(hours * 60 + minutes + seconds / 60).toFixed(2)}`); return;
    }
    setOut(es ? "Operación no disponible." : "Operation not available.");
  };
  const labels = tool.slug === "propina-y-cuenta-compartida" ? (es ? ["Cuenta base", "Propina (%)", "Personas"] : ["Base bill", "Tip (%)", "People"]) : tool.slug === "regla-50-30-20" ? (es ? ["Ingresos mensuales", "Necesidades (%)", "Deseos (%)"] : ["Monthly income", "Needs (%)", "Wants (%)"]) : (es ? ["Horas", "Minutos", "Segundos"] : ["Hours", "Minutes", "Seconds"]);
  return <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-3">{labels.map((label, index) => <label key={label} className="space-y-1"><span className="text-sm font-medium">{label}</span><input type="number" value={values[index] ?? ""} onChange={(event) => update(index, event.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" /></label>)}</div><button onClick={process} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">{es ? "Calcular" : "Calculate"}</button>{out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4">{out}</output>}</div>;
}
