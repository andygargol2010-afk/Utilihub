import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const ADJECTIVES = ["Cool", "Swift", "Bright", "Silent", "Epic", "Nova", "Pixel", "Zen", "Lunar", "Cosmic"];
const NOUNS = ["Fox", "Wolf", "Eagle", "Star", "Code", "Wave", "Byte", "Ninja", "Sage", "Spark"];

function generateUsername(length: number, style: "mixed" | "adjective-noun" | "numbers"): string {
  if (style === "adjective-noun") {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 99);
    return `${adj}${noun}${num}`;
  }
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const start = Math.floor(Math.random() * 26);
  result += chars[start];
  for (let i = 1; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  if (style === "numbers") {
    result = result.slice(0, Math.max(4, length - 2)) + Math.floor(Math.random() * 900 + 100);
  }
  return result.slice(0, length);
}

export function RandomUsernameTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [username, setUsername] = useState(() => generateUsername(8, "mixed"));
  const [length, setLength] = useState(8);
  const [style, setStyle] = useState<"mixed" | "adjective-noun" | "numbers">("mixed");
  const [copied, setCopied] = useState(false);

  function generate() {
    setUsername(generateUsername(length, style));
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(username);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength(8);
    setStyle("mixed");
    setUsername(generateUsername(8, "mixed"));
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 text-center">
        <p className="text-2xl font-mono font-bold tracking-wide">{username}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Longitud" : "Length"}</span>
          <input
            type="number"
            min={6}
            max={16}
            value={length}
            onChange={(e) => setLength(Math.min(16, Math.max(6, Number(e.target.value) || 8)))}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Estilo" : "Style"}</span>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as typeof style)}
            className={fieldClass}
          >
            <option value="mixed">{es ? "Mixto" : "Mixed"}</option>
            <option value="adjective-noun">{es ? "Adjetivo + Nombre" : "Adjective + Noun"}</option>
            <option value="numbers">{es ? "Con números" : "With numbers"}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={generate}>
          {es ? "Generar" : "Generate"}
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
