import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function TextToSlugConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("Hello World Example");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text || text.trim().length === 0) return null;
    if (text.length > 500) return null;
    return toSlug(text);
  }, [text]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("Hello World Example");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Slug generado" : "Generated slug"}</p>
        {result ? (
          <p className="text-3xl font-semibold break-all">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Texto válido requerido" : "Valid text required"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} className={fieldClass} maxLength={500} />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "Hello World → hello-world" : "Hello World → hello-world"}</p>
        <p>{es ? "Mi Página Áurea! → mi-pagina-aurea" : "My Golden Page! → my-golden-page"}</p>
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
