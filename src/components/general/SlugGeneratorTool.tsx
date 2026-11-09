import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function slugify(text: string, separator = "-", lowercase = true): string {
  let result = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, separator)
    .replace(new RegExp(`[${separator}]{2,}`, "g"), separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
  if (lowercase) result = result.toLowerCase();
  return result;
}

export function SlugGeneratorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState(es ? "Hola Mundo Árbol" : "Hello World Tree");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = slugify(input, separator, lowercase);

  async function copy() {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInput(es ? "Hola Mundo Árbol" : "Hello World Tree");
    setSeparator("-");
    setLowercase(true);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Slug generado" : "Generated slug"}</p>
        <p className="text-lg font-medium break-all">{slug || (es ? "(vacío)" : "(empty)")}</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`${fieldClass} min-h-[100px]`}
          placeholder={es ? "Escribe el texto aquí..." : "Type your text here..."}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Separador" : "Separator"}</span>
          <select value={separator} onChange={(e) => setSeparator(e.target.value)} className={fieldClass}>
            <option value="-">-</option>
            <option value="_">_</option>
            <option value=".">.</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm pt-6">
          <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
          <span>{es ? "Minúsculas" : "Lowercase"}</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar slug" : "Copy slug"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
