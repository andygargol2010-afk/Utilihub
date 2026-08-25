import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Field = { label: string; unit: string; placeholder: string };

const FIELD_MAP: Record<string, Field[]> = {
  densidad: [{ label: "Masa", unit: "kg", placeholder: "Ej.: 2" }, { label: "Volumen", unit: "m³", placeholder: "Ej.: 0.5" }],
  "velocidad-fisica": [{ label: "Distancia", unit: "m", placeholder: "Ej.: 100" }, { label: "Tiempo", unit: "s", placeholder: "Ej.: 20" }],
  aceleracion: [{ label: "Cambio de velocidad", unit: "m/s", placeholder: "Ej.: 20" }, { label: "Tiempo", unit: "s", placeholder: "Ej.: 4" }],
  fuerza: [{ label: "Masa", unit: "kg", placeholder: "Ej.: 10" }, { label: "Aceleración", unit: "m/s²", placeholder: "Ej.: 9.81" }],
  "energia-cinetica": [{ label: "Masa", unit: "kg", placeholder: "Ej.: 10" }, { label: "Velocidad", unit: "m/s", placeholder: "Ej.: 5" }],
  "energia-potencial": [{ label: "Masa", unit: "kg", placeholder: "Ej.: 10" }, { label: "Altura", unit: "m", placeholder: "Ej.: 5" }],
  "ley-de-ohm": [{ label: "Corriente", unit: "A", placeholder: "Ej.: 2" }, { label: "Resistencia", unit: "Ω", placeholder: "Ej.: 10" }],
  "potencia-electrica": [{ label: "Voltaje", unit: "V", placeholder: "Ej.: 230" }, { label: "Corriente", unit: "A", placeholder: "Ej.: 2" }],
  "resistencias-serie": [{ label: "Resistencia 1", unit: "Ω", placeholder: "Ej.: 10" }, { label: "Resistencia 2", unit: "Ω", placeholder: "Ej.: 20" }],
  "resistencias-paralelo": [{ label: "Resistencia 1", unit: "Ω", placeholder: "Ej.: 10" }, { label: "Resistencia 2", unit: "Ω", placeholder: "Ej.: 20" }],
  "longitud-onda": [{ label: "Velocidad de onda", unit: "m/s", placeholder: "Ej.: 343" }, { label: "Frecuencia", unit: "Hz", placeholder: "Ej.: 440" }],
  presion: [{ label: "Fuerza", unit: "N", placeholder: "Ej.: 100" }, { label: "Área", unit: "m²", placeholder: "Ej.: 2" }],
  caudal: [{ label: "Volumen", unit: "m³", placeholder: "Ej.: 1" }, { label: "Tiempo", unit: "s", placeholder: "Ej.: 10" }],
  ph: [{ label: "Concentración de H⁺", unit: "mol/L", placeholder: "Ej.: 0.001" }],
  "temperatura-cientifica": [{ label: "Temperatura", unit: "°C", placeholder: "Ej.: 25" }],
  gravedad: [{ label: "Masa", unit: "kg", placeholder: "Ej.: 10" }, { label: "Gravedad", unit: "m/s²", placeholder: "Ej.: 9.81" }],
};

const POSITIVE_FIELDS: Record<string, number[]> = {
  densidad: [0, 1],
  "velocidad-fisica": [0, 1],
  aceleracion: [1],
  fuerza: [0],
  "energia-cinetica": [0],
  "energia-potencial": [0],
  "ley-de-ohm": [0, 1],
  "potencia-electrica": [0, 1],
  "resistencias-serie": [0, 1],
  "resistencias-paralelo": [0, 1],
  "longitud-onda": [0, 1],
  presion: [0, 1],
  caudal: [0, 1],
  ph: [0],
  gravedad: [0, 1],
};

const DIVISOR_SLUGS = new Set(["densidad", "velocidad-fisica", "aceleracion", "longitud-onda", "presion", "caudal"]);

const calculate = (slug: string, a: number, b: number): string => {
  switch (slug) {
    case "densidad": return `Densidad: ${(a / b).toFixed(4)} kg/m³`;
    case "velocidad-fisica": return `Velocidad media: ${(a / b).toFixed(4)} m/s`;
    case "aceleracion": return `Aceleración media: ${(a / b).toFixed(4)} m/s²`;
    case "fuerza": return `Fuerza: ${(a * b).toFixed(4)} N`;
    case "energia-cinetica": return `Energía cinética: ${(0.5 * a * b * b).toFixed(4)} J`;
    case "energia-potencial": return `Energía potencial gravitatoria: ${(a * b * 9.80665).toFixed(4)} J`;
    case "ley-de-ohm": return `Voltaje: ${(a * b).toFixed(4)} V`;
    case "potencia-electrica": return `Potencia eléctrica: ${(a * b).toFixed(4)} W`;
    case "resistencias-serie": return `Resistencia equivalente: ${(a + b).toFixed(4)} Ω`;
    case "resistencias-paralelo": return `Resistencia equivalente: ${((a * b) / (a + b)).toFixed(4)} Ω`;
    case "longitud-onda": return `Longitud de onda: ${(a / b).toFixed(4)} m`;
    case "presion": return `Presión: ${(a / b).toFixed(4)} Pa`;
    case "caudal": return `Caudal volumétrico: ${(a / b).toFixed(4)} m³/s`;
    case "ph": return `pH: ${(-Math.log10(a)).toFixed(4)}`;
    case "temperatura-cientifica": return `Celsius: ${a.toFixed(2)} °C · Kelvin: ${(a + 273.15).toFixed(2)} K · Fahrenheit: ${(a * 9 / 5 + 32).toFixed(2)} °F`;
    case "gravedad": return `Peso: ${(a * b).toFixed(4)} N`;
    default: throw new Error(`Herramienta científica sin implementación específica: ${slug}`);
  }
};

export function ScienceTool({ tool }: { tool: GeneralTool }) {
  const fields = FIELD_MAP[tool.slug];
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [out, setOut] = useState("");

  const run = () => {
    try {
      if (!fields) throw new Error(`Herramienta científica sin configuración de campos: ${tool.slug}`);
      const values = fields.length === 1 ? [Number(first)] : [Number(first), Number(second)];
      if (values.some((value) => !Number.isFinite(value))) throw new Error("Introduce todos los valores requeridos con números válidos.");
      const positiveFields = POSITIVE_FIELDS[tool.slug] ?? [];
      for (const index of positiveFields) {
        const value = values[index];
        if (value !== undefined && value <= 0) throw new Error(`${fields[index]?.label ?? "La magnitud"} debe ser mayor que cero.`);
      }
      if (DIVISOR_SLUGS.has(tool.slug) && values[1] === 0) throw new Error(`${fields[1]?.label ?? "El divisor"} no puede ser cero.`);
      setOut(calculate(tool.slug, values[0] ?? 0, values[1] ?? 0));
    } catch (error) {
      setOut(error instanceof Error ? error.message : "No se pudo calcular el resultado.");
    }
  };

  if (!fields) return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">Herramienta científica no configurada: {tool.slug}</div>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field, index) => (
          <label key={field.label} className="space-y-1">
            <span className="text-sm font-medium">{field.label}</span>
            <div className="flex">
              <input required value={index === 0 ? first : second} onChange={(event) => index === 0 ? setFirst(event.target.value) : setSecond(event.target.value)} placeholder={field.placeholder} type="number" inputMode="decimal" className="h-11 min-w-0 flex-1 rounded-l-xl border bg-background px-3" />
              <span className="flex h-11 items-center rounded-r-xl border border-l-0 bg-muted px-3 text-sm font-medium">{field.unit}</span>
            </div>
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Las magnitudes se interpretan en las unidades indicadas. Los valores negativos se permiten cuando representan una dirección o signo físico válido.</p>
      <button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={run}>Calcular</button>
      {out && <output aria-live="polite" className="block rounded-xl border bg-muted/30 p-4">{out}</output>}
    </div>
  );
}
