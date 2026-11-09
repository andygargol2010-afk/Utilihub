import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function TextCaseConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("hello world");
  const [mode, setMode] = useState<"upper" | "lower" | "title" | "sentence">("upper");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!text.trim()) return "";
    switch (mode) {
      case "upper": return text.toUpperCase();
      case "lower": return text.toLowerCase();
      case "title": return text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      case "sentence": return text.toLowerCase().replace(/(^|\.\s+)\w/g, c => c.toUpperCase());
      default: return text;
    }
  }, [text, mode]);

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
    setText("hello world");
    setMode("upper");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Texto convertido" : "Converted text"}</p>
        <p className="text-xl font-semibold break-all">{result || (es ? "Introduce texto" : "Enter text")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["upper", "lower", "title", "sentence"] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`${buttonClass} ${mode === m ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setMode(m)}
          >
            {m === "upper" ? (es ? "MAYÚSCULAS" : "UPPER") : m === "lower" ? (es ? "minúsculas" : "lower") : m === "title" ? (es ? "Título" : "Title") : (es ? "Oración" : "Sentence")}
          </button>
        ))}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto original" : "Original text"}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={fieldClass}
          rows={4}
          placeholder={es ? "Escribe o pega texto" : "Type or paste text"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es ? "Convierte texto entre mayúsculas, minúsculas, título y oración." : "Convert text between uppercase, lowercase, title case and sentence case."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "hello world → HELLO WORLD (mayúsculas)" : "hello world → HELLO WORLD (upper)"}</p>
        <p>{es ? "HELLO WORLD → Hello World (título)" : "HELLO WORLD → Hello World (title)"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
