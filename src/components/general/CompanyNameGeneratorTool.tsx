import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const PREFIXES = ["Nex", "Inno", "Blue", "Apex", "Vivid", "Lumen", "Forge", "Nova", "Echo", "Pulse", "Zen", "Core"];
const SUFFIXES = ["Labs", "Hub", "Works", "Studio", "Co", "Group", "Tech", "Solutions", "Digital", "Media", "Systems", "Collective"];
const CONNECTORS = ["", " ", "& ", "of "];

function generateName(keyword: string): string {
  const pre = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const conn = CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)];
  const kw = keyword.trim() || ["Smart", "Future", "Green", "Fast", "Bright"][Math.floor(Math.random() * 5)];
  const patterns = [
    `${pre}${kw}`,
    `${kw}${suf}`,
    `${pre} ${kw} ${suf}`,
    `${pre}${conn}${kw}`,
    `${kw}${conn}${suf}`,
  ];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

export function CompanyNameGeneratorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [keyword, setKeyword] = useState("");
  const [names, setNames] = useState<string[]>(() => Array.from({ length: 6 }, () => generateName("")));
  const [copied, setCopied] = useState(false);

  function generate() {
    setNames(Array.from({ length: 6 }, () => generateName(keyword)));
    setCopied(false);
  }

  async function copy() {
    const text = names.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setKeyword("");
    setNames(Array.from({ length: 6 }, () => generateName("")));
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Sugerencias de nombres" : "Name suggestions"}</p>
        <ul className="space-y-1 text-lg font-medium">
          {names.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Palabra clave (opcional)" : "Keyword (optional)"}</span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={es ? "ej. tech, eco, food" : "e.g. tech, eco, food"}
          className={fieldClass}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={generate}>
          {es ? "Generar" : "Generate"}
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar lista" : "Copy list"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
