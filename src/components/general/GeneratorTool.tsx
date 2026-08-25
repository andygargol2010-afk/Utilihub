import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const makeCode = (length: number) => Array.from({ length }, () => randomChars[randomInt(0, randomChars.length - 1)]).join("");

function generate(slug: string, input: string): string {
  switch (slug) {
    case "generador-numeros": {
      const [min, max] = input.split(/[,;\s]+/).map(Number);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) throw new Error("Introduce un mínimo y un máximo válidos.");
      return String(randomInt(Math.ceil(min), Math.floor(max)));
    }
    case "generador-dados": {
      const [sidesRaw, countRaw] = input.split(/[,;\s]+/).map(Number);
      const sides = Number.isFinite(sidesRaw) ? Math.trunc(sidesRaw) : 6;
      const count = Number.isFinite(countRaw) ? Math.trunc(countRaw) : 1;
      if (sides < 2 || sides > 10000 || count < 1 || count > 100) throw new Error("Usa entre 2 y 10.000 caras y entre 1 y 100 dados.");
      return Array.from({ length: count }, () => randomInt(1, sides)).join(" · ");
    }
    case "generador-pin": {
      const length = input.trim() ? Math.trunc(Number(input)) : 6;
      if (!Number.isInteger(length) || length < 1 || length > 32) throw new Error("La longitud debe estar entre 1 y 32.");
      return Array.from({ length }, () => String(randomInt(0, 9))).join("");
    }
    case "generador-codigos": {
      const length = input.trim() ? Math.trunc(Number(input)) : 12;
      if (!Number.isInteger(length) || length < 1 || length > 128) throw new Error("La longitud debe estar entre 1 y 128.");
      return makeCode(length);
    }
    case "sorteo": {
      const items = input.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
      if (!items.length) throw new Error("Introduce al menos un elemento, uno por línea.");
      return items[randomInt(0, items.length - 1)];
    }
    case "lista-aleatoria": {
      const items = input.split(/\r?\n/).filter((x) => x.length > 0);
      if (!items.length) throw new Error("Introduce al menos un elemento, uno por línea.");
      return [...items].sort(() => Math.random() - 0.5).join("\n");
    }
    case "generador-nombres": {
      const first = ["Alex", "Andrea", "Bruno", "Clara", "Diego", "Elena", "Lucas", "Mia", "Nora", "Sofia"];
      const last = ["Rivera", "Torres", "Vega", "Silva", "Molina", "Rojas", "Navarro", "Paz"];
      return `${first[randomInt(0, first.length - 1)]} ${last[randomInt(0, last.length - 1)]}`;
    }
    case "generador-usuarios": {
      const words = ["pixel", "nova", "orbit", "code", "matrix", "luna", "byte", "zen"];
      return `${words[randomInt(0, words.length - 1)]}${randomInt(10, 9999)}`;
    }
    case "datos-prueba":
      return JSON.stringify({ id: randomInt(1000, 999999), nombre: "Usuario de prueba", email: `test${randomInt(100, 9999)}@example.com` }, null, 2);
    case "lorem-ipsum":
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat, nisl at tincidunt consequat, sapien justo commodo urna, vitae posuere neque libero vitae erat.";
    default:
      throw new Error(`Generador no implementado: ${slug}`);
  }
}

export function GeneratorTool({ tool }: { tool: GeneralTool }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const run = () => {
    try { setError(""); setOutput(generate(tool.slug, input)); }
    catch (e) { setOutput(""); setError(e instanceof Error ? e.message : "No se pudo generar el resultado."); }
  };
  const placeholder = tool.slug === "generador-dados" ? "Caras, cantidad · Ej.: 6, 2" : tool.slug === "generador-numeros" ? "Mínimo, máximo · Ej.: 1, 100" : "Configuración opcional";
  return <div className="space-y-4">
    <label className="block text-sm font-semibold">Configuración</label>
    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border bg-background px-3" />
    <p className="text-xs text-muted-foreground">La generación se ejecuta localmente en tu navegador. Para sorteos y listas, usa un elemento por línea.</p>
    <button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">Generar</button>
    {error && <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm">{error}</p>}
    {output && <output className="block whitespace-pre-wrap break-words rounded-xl border bg-muted/30 p-4 font-medium">{output}</output>}
  </div>;
}
