import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

const units: Record<string, Record<string, number>> = {
  area: { "m²": 1, "km²": 1e6, "ft²": 0.092903, acres: 4046.8564224, ha: 10000 },
  volume: { L: 1, mL: 0.001, gal: 3.785411784, "m³": 1000 },
  speed: { "km/h": 1, mph: 1.609344, "m/s": 3.6, kn: 1.852 },
  energy: { J: 1, cal: 4.184, kWh: 3600000, BTU: 1055.05585262 },
  power: { W: 1, kW: 1000, hp: 745.699872 },
  pressure: { Pa: 1, bar: 100000, atm: 101325, psi: 6894.757293 },
  frequency: { Hz: 1, kHz: 1000, MHz: 1e6, GHz: 1e9 },
  data: { bit: 1, byte: 8, KB: 8000, MB: 8e6, GB: 8e9, TB: 8e12 },
};

const sets: Record<string, string[]> = {
  area: ["m²", "km²", "ft²", "acres", "ha"],
  volume: ["L", "mL", "gal", "m³"],
  speed: ["km/h", "mph", "m/s", "kn"],
  energy: ["J", "cal", "kWh", "BTU"],
  power: ["W", "kW", "hp"],
  pressure: ["Pa", "bar", "atm", "psi"],
  frequency: ["Hz", "kHz", "MHz", "GHz"],
  data: ["bit", "byte", "KB", "MB", "GB", "TB"],
};

const hexToRgb = (value: string): { r: number; g: number; b: number } | null => {
  const hex = value.replace(/^#/, "").trim();
  const expanded = hex.length === 3 ? [...hex].map((character) => character + character).join("") : hex;
  if (!/^[0-9a-f]{6}$/i.test(expanded)) return null;
  return { r: parseInt(expanded.slice(0, 2), 16), g: parseInt(expanded.slice(2, 4), 16), b: parseInt(expanded.slice(4, 6), 16) };
};

const parseRgb = (value: string): [number, number, number] => {
  const parts = value.split(/[,;\s]+/).filter(Boolean).map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    throw new Error("Introduce R, G y B como tres enteros entre 0 y 255.");
  }
  return [parts[0], parts[1], parts[2]];
};

const rgbToHsl = (r: number, g: number, b: number): string => {
  const [rr, gg, bb] = [r, g, b].map((value) => value / 255);
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const lightness = (max + min) / 2;
  if (max === min) return `HSL: 0°, 0%, ${(lightness * 100).toFixed(2)}%`;
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = max === rr ? (gg - bb) / delta + (gg < bb ? 6 : 0) : max === gg ? (bb - rr) / delta + 2 : (rr - gg) / delta + 4;
  hue /= 6;
  return `HSL: ${(hue * 360).toFixed(2)}°, ${(saturation * 100).toFixed(2)}%, ${(lightness * 100).toFixed(2)}%`;
};

export function ConverterTool({ tool }: { tool: GeneralTool }) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [angleDirection, setAngleDirection] = useState<"degrees-to-radians" | "radians-to-degrees">("degrees-to-radians");
  const [out, setOut] = useState("");
  const base = tool.slug.replace("conversor-", "");
  const kind = base === "datos" ? "data" : base === "velocidad" ? "speed" : base === "energia" ? "energy" : base === "potencia" ? "power" : base === "presion" ? "pressure" : base === "frecuencia" ? "frequency" : base === "area" ? "area" : base === "volumen" ? "volume" : "";
  const options = sets[kind] ?? [];

  const convert = () => {
    try {
      const raw = value.trim();
      if (!raw) throw new Error("Introduce un valor para convertir.");

      if (tool.slug === "hexadecimal-decimal") {
        if (!/^(?:0x)?[0-9a-f]+$/i.test(raw)) throw new Error("Introduce un número hexadecimal válido.");
        setOut(String(parseInt(raw.replace(/^0x/i, ""), 16)));
        return;
      }
      if (tool.slug === "hex-rgb") {
        const rgb = hexToRgb(raw);
        if (!rgb) throw new Error("Introduce un HEX válido de 3 o 6 dígitos, por ejemplo #2A6.");
        setOut(`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`);
        return;
      }
      if (tool.slug === "rgb-hsl") {
        setOut(rgbToHsl(...parseRgb(raw)));
        return;
      }
      if (tool.slug === "rgb-hex") {
        const [r, g, b] = parseRgb(raw);
        setOut(`#${[r, g, b].map((part) => part.toString(16).padStart(2, "0")).join("").toUpperCase()}`);
        return;
      }
      if (tool.slug === "binario-decimal") {
        if (!/^(?:0b)?[01]+$/i.test(raw)) throw new Error("Introduce un número binario válido, opcionalmente con prefijo 0b.");
        setOut(String(parseInt(raw.replace(/^0b/i, ""), 2)));
        return;
      }
      if (tool.slug === "decimal-binario") {
        const number = Number(raw);
        if (!Number.isSafeInteger(number) || number < 0) throw new Error("Introduce un entero decimal no negativo dentro del rango seguro de JavaScript.");
        setOut(number.toString(2));
        return;
      }
      if (tool.slug === "decimal-hexadecimal") {
        const number = Number(raw);
        if (!Number.isSafeInteger(number) || number < 0) throw new Error("Introduce un entero decimal no negativo dentro del rango seguro de JavaScript.");
        setOut(number.toString(16).toUpperCase());
        return;
      }
      if (tool.slug === "grados-radianes" || tool.slug === "conversor-angulos") {
        const number = Number(raw);
        if (!Number.isFinite(number)) throw new Error("Introduce un ángulo numérico válido.");
        if (tool.slug === "grados-radianes" || angleDirection === "degrees-to-radians") {
          setOut(`${number}° = ${(number * Math.PI / 180).toFixed(10)} rad`);
        } else {
          setOut(`${number} rad = ${(number * 180 / Math.PI).toFixed(10)}°`);
        }
        return;
      }

      const number = Number(raw.replace(",", "."));
      if (!Number.isFinite(number)) throw new Error("Introduce un número válido.");
      if (kind) {
        const source = from || options[0];
        const target = to || options[1] || options[0];
        if (!source || !target || units[kind]?.[source] === undefined || units[kind]?.[target] === undefined) {
          throw new Error("Selecciona unidades de origen y destino válidas.");
        }
        setOut(`${number} ${source} = ${(number * units[kind][source] / units[kind][target]).toPrecision(10)} ${target}`);
        return;
      }
      throw new Error(`Conversor sin implementación específica: ${tool.slug}`);
    } catch (error) {
      setOut(error instanceof Error ? error.message : "No se pudo convertir el valor.");
    }
  };

  return (
    <div className="space-y-4">
      <label className="block space-y-1"><span className="text-sm font-medium">Valor</span><input value={value} onChange={(event) => setValue(event.target.value)} className="h-11 w-full rounded-xl border bg-background px-3" placeholder={tool.slug.includes("rgb") ? "255, 99, 71" : "100"} inputMode="decimal" /></label>
      {tool.slug === "conversor-angulos" && <label className="block space-y-1 text-sm font-medium">Dirección<select value={angleDirection} onChange={(event) => setAngleDirection(event.target.value as "degrees-to-radians" | "radians-to-degrees")} className="mt-1 h-11 w-full rounded-xl border bg-background px-3"><option value="degrees-to-radians">Grados → radianes</option><option value="radians-to-degrees">Radianes → grados</option></select></label>}
      {options.length > 1 && <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-sm font-medium">Desde<select value={from} onChange={(event) => setFrom(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3"><option value="">Predeterminado</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label><label className="space-y-1 text-sm font-medium">Hacia<select value={to} onChange={(event) => setTo(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3"><option value="">Predeterminado</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label></div>}
      {tool.slug === "conversor-datos" && <p className="text-xs text-muted-foreground">Las unidades KB, MB, GB y TB usan múltiplos decimales: 1 KB = 1000 bytes.</p>}
      <button className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={convert}>Convertir</button>
      {out && <output aria-live="polite" className="block break-all rounded-xl border bg-muted/30 p-4">{out}</output>}
    </div>
  );
}
