import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base font-mono min-h-[120px]";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function Base64Tool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  function process() {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(es ? "Entrada inválida para Base64." : "Invalid Base64 input.");
      setOutput("");
    }
  }

  function copy() {
    if (output) navigator.clipboard.writeText(output);
  }

  function reset() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button type="button" className={`${buttonClass} ${mode === "encode" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("encode")}>
          {es ? "Codificar" : "Encode"}
        </button>
        <button type="button" className={`${buttonClass} ${mode === "decode" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMode("decode")}>
          {es ? "Decodificar" : "Decode"}
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Entrada" : "Input"}</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className={fieldClass} placeholder={es ? "Texto o Base64..." : "Text or Base64..."} />
      </label>

      <div className="flex gap-2">
        <button type="button" className={buttonClass} onClick={process}>
          {es ? "Procesar" : "Process"}
        </button>
        <button type="button" className={buttonClass} onClick={copy} disabled={!output}>
          {es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {output && (
        <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
          <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
          <pre className="whitespace-pre-wrap break-all font-mono text-sm">{output}</pre>
        </div>
      )}
    </div>
  );
}
