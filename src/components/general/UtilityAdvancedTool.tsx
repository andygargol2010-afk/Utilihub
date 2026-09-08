import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

export function UtilityAdvancedTool({ tool }: { tool: GeneralTool }) {
  const [values, setValues] = useState(["", "", ""]);
  const [out, setOut] = useState("");
  const n = (value: string) => Number(value.replace(",", "."));
  const update = (index: number, value: string) => setValues((current) => current.map((item, i) => i === index ? value : item));
  const process = () => {
    const nums = values.map(n);
    if (nums.some((value) => !Number.isFinite(value))) { setOut("Completa todos los valores con números válidos."); return; }
    if (tool.slug === "propina-y-cuenta-compartida") {
      const [bill, tip, people] = nums;
      if (bill < 0 || tip < 0 || people <= 0) { setOut("La cuenta y la propina no pueden ser negativas, y las personas deben ser mayores que 0."); return; }
      const total = bill * (1 + tip / 100); setOut(`Total con propina: ${total.toFixed(2)}\nImporte por persona: ${(total / Math.floor(people)).toFixed(2)}\nPropina total: ${(bill * tip / 100).toFixed(2)}`); return;
    }
    if (tool.slug === "regla-50-30-20") {
      const [income, needs, wants] = nums;
      if (income <= 0 || needs < 0 || wants < 0 || needs + wants > 100) { setOut("Los ingresos deben ser positivos y las proporciones no pueden superar el 100 %."); return; }
      const savings = 100 - needs - wants; setOut(`Necesidades: ${(income * needs / 100).toFixed(2)}\nDeseos: ${(income * wants / 100).toFixed(2)}\nAhorro disponible: ${(income * savings / 100).toFixed(2)}\nDistribución restante: ${savings.toFixed(2)} %`); return;
    }
    if (tool.slug === "horas-decimales") {
      const [hours, minutes, seconds] = nums;
      if (hours < 0 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) { setOut("Las horas no pueden ser negativas y minutos/segundos deben estar entre 0 y 59."); return; }
      setOut(`Horas decimales: ${(hours + minutes / 60 + seconds / 3600).toFixed(4)}\nMinutos totales: ${(hours * 60 + minutes + seconds / 60).toFixed(2)}`); return;
    }
    setOut("Operación no disponible.");
  };
  const labels = tool.slug === "propina-y-cuenta-compartida" ? ["Cuenta base", "Propina (%)", "Personas"] : tool.slug === "regla-50-30-20" ? ["Ingresos mensuales", "Necesidades (%)", "Deseos (%)"] : ["Horas", "Minutos", "Segundos"];
  return <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-3">{labels.map((label, index) => <label key={label} className="space-y-1"><span className="text-sm font-medium">{label}</span><input type="number" value={values[index]} onChange={(event) => update(index, event.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" placeholder="0" /></label>)}</div><button type="button" className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={process}>Calcular</button>{out && <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4">{out}</output>}</div>;
}
