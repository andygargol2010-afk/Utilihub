import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { generateBySlug } from "@/lib/general/generator-engine";

const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (items: string[]): string[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = randomInt(0, index);
    const current = result[index];
    const target = result[randomIndex];
    if (current === undefined || target === undefined) continue;
    result[index] = target;
    result[randomIndex] = current;
  }
  return result;
};

export function GeneratorTool({ tool }: { tool: GeneralTool }) {
  const [out, setOut] = useState("");
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [sides, setSides] = useState("6");
  const [count, setCount] = useState("1");
  const [list, setList] = useState("");

  const run = () => {
    try {
      if (tool.slug === "sorteo" || tool.slug === "lista-aleatoria") {
        const items = list.split(/\r\n|\r|\n|,/).map((item) => item.trim()).filter(Boolean);
        if (!items.length) throw new Error("Introduce al menos un elemento para procesar.");
        setOut(tool.slug === "sorteo" ? items[randomInt(0, items.length - 1)] ?? "" : shuffle(items).join("\n"));
        return;
      }

      if (tool.slug === "generador-numeros") {
        const minimum = Number(min);
        const maximum = Number(max);
        if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum > maximum) {
          throw new Error("Introduce un rango entero válido: el mínimo no puede superar al máximo.");
        }
        setOut(generateBySlug(tool.slug, { min: minimum, max: maximum }));
        return;
      }

      if (tool.slug === "generador-dados") {
        const numberOfSides = Number(sides);
        const numberOfDice = Number(count);
        setOut(generateBySlug(tool.slug, { sides: numberOfSides, count: numberOfDice }));
        return;
      }

      setOut(generateBySlug(tool.slug));
    } catch (error) {
      setOut(error instanceof Error ? error.message : "No se pudo generar el resultado.");
    }
  };

  const needsList = tool.slug === "sorteo" || tool.slug === "lista-aleatoria";

  return (
    <div className="space-y-4">
      {tool.slug === "generador-numeros" && <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-sm font-medium">Mínimo<input type="number" value={min} onChange={(event) => setMin(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label><label className="space-y-1 text-sm font-medium">Máximo<input type="number" value={max} onChange={(event) => setMax(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label></div>}
      {tool.slug === "generador-dados" && <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1 text-sm font-medium">Caras por dado<input type="number" min="2" max="10000" value={sides} onChange={(event) => setSides(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label><label className="space-y-1 text-sm font-medium">Cantidad de dados<input type="number" min="1" max="1000" value={count} onChange={(event) => setCount(event.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-background px-3" /></label></div>}
      {needsList && <label className="block text-sm font-medium">Elementos<textarea value={list} onChange={(event) => setList(event.target.value)} placeholder="Un elemento por línea o separados por comas" className="mt-1 min-h-32 w-full rounded-xl border border-border bg-background p-4" /></label>}
      <p className="text-xs text-muted-foreground">Los resultados se generan localmente en el navegador y no se envían a ningún servidor.</p>
      <button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Generar</button>
      {out && <output aria-live="polite" className="block whitespace-pre-wrap break-all rounded-xl border bg-muted/30 p-4">{out}</output>}
    </div>
  );
}
