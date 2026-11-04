// Part 2 of 3 — split from MathTool.tsx on 2026-11-04. Edit here; MathTool.tsx re-exports.
import { values, median } from "./MathTool.part1";

export function calculate(slug: string, raw: string, rawB: string, es: boolean): string {
  const xs = values(raw);
  if (!xs.length) throw new Error(es ? "Introduce uno o más números válidos." : "Enter one or more valid numbers.");
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  switch (slug) {
    case "promedio":
      return `${es ? "Promedio" : "Average"}: ${mean}`;
    case "mediana":
      return `${es ? "Mediana" : "Median"}: ${median(xs)}`;
    case "moda": {
      const counts = new Map<number, number>();
      xs.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
      const max = Math.max(...counts.values());
      return max === 1
        ? es
          ? "Moda: no hay valores repetidos."
          : "Mode: no repeated values."
        : `${es ? "Moda" : "Mode"}: ${[...counts]
            .filter(([, n]) => n === max)
            .map(([x]) => x)
            .join(", ")}`;
    }
    case "rango": {
      const a = [...xs].sort((x, y) => x - y);
      return `${es ? "Rango" : "Range"}: ${a[a.length - 1] - a[0]}`;
    }
    case "varianza":
      return `${es ? "Varianza poblacional" : "Population variance"}: ${xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length}`;
    case "desviacion-estandar":
      return `${es ? "Desviación estándar poblacional" : "Population standard deviation"}: ${Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length)}`;
    case "percentil": {
      const p = Number(rawB);
      if (!Number.isFinite(p) || p < 0 || p > 100)
        throw new Error(es ? "El percentil debe estar entre 0 y 100." : "Percentile must be between 0 and 100.");
      const a = [...xs].sort((x, y) => x - y);
      const pos = (p / 100) * (a.length - 1);
      const lo = Math.floor(pos);
      const hi = Math.ceil(pos);
      return `${es ? "Percentil" : "Percentile"} ${p}: ${a[lo] + (a[hi] - a[lo]) * (pos - lo)}`;
    }
    case "cuartiles": {
      const a = [...xs].sort((x, y) => x - y);
      const q2 = median(a);
      if (a.length === 1) return `Q1: ${a[0]}\n${es ? "Mediana (Q2)" : "Median (Q2)"}: ${a[0]}\nQ3: ${a[0]}`;
      const mid = Math.floor(a.length / 2);
      const q1 = median(a.slice(0, mid));
      const q3 = median(a.slice(a.length % 2 ? mid + 1 : mid));
      return `Q1: ${q1}\n${es ? "Mediana (Q2)" : "Median (Q2)"}: ${q2}\nQ3: ${q3}`;
    }
    case "z-score": {
      const x = Number(rawB);
      if (!Number.isFinite(x))
        throw new Error(es ? "Introduce el valor a estandarizar en el segundo campo." : "Enter the value to standardize in the second field.");
      const sd = Math.sqrt(xs.reduce((a, v) => a + (v - mean) ** 2, 0) / xs.length);
      if (sd === 0)
        throw new Error(es ? "No se puede calcular un z-score con desviación estándar cero." : "Cannot compute a z-score with zero standard deviation.");
      return `Z-score: ${(x - mean) / sd}`;
    }
    case "correlacion":
    case "covarianza": {
      const ys = values(rawB);
      if (ys.length !== xs.length || ys.length < 2)
        throw new Error(es ? "Ambas series deben tener la misma cantidad de valores (al menos 2)." : "Both series must have the same number of values (at least 2).");
      const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
      const cov = xs.reduce((s, x, i) => s + (x - mean) * (ys[i] - meanY), 0) / xs.length;
      if (slug === "covarianza") return `${es ? "Covarianza poblacional" : "Population covariance"}: ${cov}`;
      const sdX = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length);
      const sdY = Math.sqrt(ys.reduce((s, y) => s + (y - meanY) ** 2, 0) / ys.length);
      if (sdX === 0 || sdY === 0)
        throw new Error(es ? "La correlación requiere variación en ambas series." : "Correlation requires variation in both series.");
      return `${es ? "Correlación de Pearson" : "Pearson correlation"}: ${cov / (sdX * sdY)}`;
    }
    case "error-absoluto": {
      // measured, reference (order does not matter for absolute difference)
      if (xs.length !== 2)
        throw new Error(
          es
            ? "Introduce exactamente dos valores: medido y de referencia (ej. 65 78 o 65, 78)."
            : "Enter exactly two values: measured and reference (e.g. 65 78 or 65, 78).",
        );
      return `${es ? "Error absoluto" : "Absolute error"}: ${Math.abs(xs[0] - xs[1])}`;
    }
    case "error-relativo": {
      if (xs.length !== 2)
        throw new Error(
          es
            ? "Introduce exactamente dos valores: medido y de referencia (ej. 65 78)."
            : "Enter exactly two values: measured and reference (e.g. 65 78).",
        );
      if (xs[1] === 0)
        throw new Error(es ? "El valor de referencia no puede ser 0." : "The reference value cannot be 0.");
      return `${es ? "Error relativo" : "Relative error"}: ${Math.abs(xs[0] - xs[1]) / Math.abs(xs[1])}`;
    }
    case "error-porcentual": {
      if (xs.length !== 2)
        throw new Error(
          es
            ? "Introduce exactamente dos valores: medido y de referencia (ej. 65 78)."
            : "Enter exactly two values: measured and reference (e.g. 65 78).",
        );
      if (xs[1] === 0)
        throw new Error(es ? "El valor de referencia no puede ser 0." : "The reference value cannot be 0.");
      return `${es ? "Error porcentual" : "Percent error"}: ${(Math.abs(xs[0] - xs[1]) / Math.abs(xs[1])) * 100}%`;
    }
    default:
      throw new Error(es ? `Herramienta estadística no implementada: ${slug}` : `Statistical tool not implemented: ${slug}`);
  }
}
