import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";
type CaseMode = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

function toSentenceCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^|\.\s+|\!\s+|\?\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
}

function toCamelCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function toSnakeCase(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function toKebabCase(s: string): string {
  return s
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function convert(text: string, mode: CaseMode): string {
  if (!text.trim()) return "";
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "camel":
      return toCamelCase(text);
    case "snake":
      return toSnakeCase(text);
    case "kebab":
      return toKebabCase(text);
    default:
      return text;
  }
}

const MODES: { id: CaseMode; en: string; es: string }[] = [
  { id: "upper", en: "UPPERCASE", es: "MAYÚSCULAS" },
  { id: "lower", en: "lowercase", es: "minúsculas" },
  { id: "title", en: "Title Case", es: "Title Case" },
  { id: "sentence", en: "Sentence case", es: "Oración" },
  { id: "camel", en: "camelCase", es: "camelCase" },
  { id: "snake", en: "snake_case", es: "snake_case" },
  { id: "kebab", en: "kebab-case", es: "kebab-case" },
];

export function CaseConverterTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("Hello world example text");
  const [mode, setMode] = useState<CaseMode>("title");
  const [copied, setCopied] = useState(false);

  const result = convert(input, mode);

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInput("");
    setMode("title");
  }

  return (
    <div className="space-y-6">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto de entrada" : "Input text"}</span>
        <textarea
          className={`${fieldClass} min-h-[120px] font-mono`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={es ? "Pegá o escribí el texto aquí…" : "Paste or type text here…"}
        />
      </label>

      <div className="space-y-2">
        <p className="text-sm font-medium">{es ? "Formato" : "Case"}</p>
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`${buttonClass} ${mode === m.id ? "bg-muted font-semibold" : ""}`}
              onClick={() => setMode(m.id)}
            >
              {es ? m.es : m.en}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-sm font-medium">{es ? "Resultado" : "Result"}</p>
        <p className="mt-2 break-words font-mono text-base whitespace-pre-wrap">{result || "—"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={copy} disabled={!result}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Limpiar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
