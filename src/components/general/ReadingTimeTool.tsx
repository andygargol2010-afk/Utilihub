import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function formatMinutes(minutes: number, es: boolean): string {
  if (minutes < 1) {
    const secs = Math.round(minutes * 60);
    return es ? `${secs} s` : `${secs}s`;
  }
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  if (s === 0) return es ? `${m} min` : `${m} min`;
  return es ? `${m} min ${s} s` : `${m}m ${s}s`;
}

export function ReadingTimeTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [inputMode, setInputMode] = useState<"text" | "count">("text");
  const [text, setText] = useState("");
  const [wordCountInput, setWordCountInput] = useState("500");
  const [wpm, setWpm] = useState("200");
  const [purpose, setPurpose] = useState<"read" | "speak">("read");
  const [copied, setCopied] = useState(false);

  const words = useMemo(() => {
    if (inputMode === "count") return Math.max(0, parseInt(wordCountInput) || 0);
    return countWords(text);
  }, [inputMode, text, wordCountInput]);

  const rate = Math.max(50, Math.min(600, parseInt(wpm) || 200));

  const minutes = words / rate;
  const resultLabel = purpose === "read"
    ? (es ? "Tiempo de lectura" : "Reading time")
    : (es ? "Tiempo de habla" : "Speaking time");

  async function copy() {
    const textOut = es
      ? `${resultLabel}: ${formatMinutes(minutes, true)} (${words} palabras a ${rate} ppm)`
      : `${resultLabel}: ${formatMinutes(minutes, false)} (${words} words at ${rate} WPM)`;
    try {
      await navigator.clipboard.writeText(textOut);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInputMode("text");
    setText("");
    setWordCountInput("500");
    setWpm("200");
    setPurpose("read");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{resultLabel}</p>
        <p className="text-3xl font-semibold">{formatMinutes(minutes, es)}</p>
        <p className="text-sm text-muted-foreground">
          {es
            ? `${words} palabras a ${rate} palabras por minuto`
            : `${words} words at ${rate} words per minute`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Entrada" : "Input"}</span>
          <select value={inputMode} onChange={(e) => setInputMode(e.target.value as "text" | "count")} className={fieldClass}>
            <option value="text">{es ? "Pegar texto" : "Paste text"}</option>
            <option value="count">{es ? "N\u00famero de palabras" : "Word count"}</option>
          </select>
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Prop\u00f3sito" : "Purpose"}</span>
          <select value={purpose} onChange={(e) => setPurpose(e.target.value as "read" | "speak")} className={fieldClass}>
            <option value="read">{es ? "Lectura silenciosa" : "Silent reading"}</option>
            <option value="speak">{es ? "Habla / presentaci\u00f3n" : "Speaking / presentation"}</option>
          </select>
        </label>
        {inputMode === "text" ? (
          <label className="block space-y-2 text-sm sm:col-span-2">
            <span className="font-medium">{es ? "Texto" : "Text"}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              className={fieldClass}
              placeholder={es ? "Pega el texto aqu\u00ed\u2026" : "Paste text here\u2026"}
            />
          </label>
        ) : (
          <label className="block space-y-2 text-sm">
            <span className="font-medium">{es ? "Palabras" : "Words"}</span>
            <input type="number" value={wordCountInput} onChange={(e) => setWordCountInput(e.target.value)} className={fieldClass} min="0" step="1" />
          </label>
        )}
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Palabras por minuto" : "Words per minute"}</span>
          <input type="number" value={wpm} onChange={(e) => setWpm(e.target.value)} className={fieldClass} min="50" max="600" step="10" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
