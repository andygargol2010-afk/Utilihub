import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function QrCodeGeneratorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("https://utilihub.net");
  const [copied, setCopied] = useState(false);

  // Simple visual representation (real QR would use a lightweight lib or canvas algorithm)
  const visual = text ? `■`.repeat(Math.min(text.length, 20)) : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("https://utilihub.net");
    setCopied(false);
  }

  function download() {
    // Placeholder for PNG download
    alert(es ? "Descarga de PNG disponible en versión completa" : "PNG download available in full version");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">{es ? "Vista previa" : "Preview"}</p>
        <div className="inline-block border-4 border-black p-4 bg-white text-black font-mono text-xs">{visual || (es ? "Ingresa texto" : "Enter text")}</div>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto o URL" : "Text or URL"}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className={fieldClass}
          placeholder={es ? "https://ejemplo.com" : "https://example.com"}
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={download}>
          {es ? "Descargar PNG" : "Download PNG"}
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar texto" : "Copy text"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
