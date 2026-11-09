import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

export function CharacterCounterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState("Hello world\nThis is a test.");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split(/\n/).length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    return { chars, charsNoSpace, words, lines, sentences };
  }, [text]);

  async function copy() {
    const textOut = es
      ? `Caracteres: ${stats.chars} | Palabras: ${stats.words} | Líneas: ${stats.lines}`
      : `Characters: ${stats.chars} | Words: ${stats.words} | Lines: ${stats.lines}`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setText("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Estadísticas" : "Statistics"}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-semibold">{stats.chars}</p>
            <p className="text-sm text-muted-foreground">{es ? "Caracteres" : "Characters"}</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">{stats.words}</p>
            <p className="text-sm text-muted-foreground">{es ? "Palabras" : "Words"}</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">{stats.lines}</p>
            <p className="text-sm text-muted-foreground">{es ? "Líneas" : "Lines"}</p>
          </div>
        </div>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`${fieldClass} min-h-[160px]`}
          placeholder={es ? "Pega o escribe tu texto aquí" : "Paste or type your text here"}
        />
      </label>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "\"Hello world\" → 11 caracteres, 2 palabras" : "\"Hello world\" → 11 characters, 2 words"}</p>
        <p>{es ? "Texto vacío → 0 en todos los contadores" : "Empty text → 0 in all counters"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resumen" : "Copy summary"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
