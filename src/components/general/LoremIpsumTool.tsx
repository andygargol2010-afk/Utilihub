import { useState } from "react";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const sentences = LOREM.split(/[.!?]\s+/).filter(Boolean);

function generate(count: number, mode: "paragraphs" | "sentences"): string {
  if (count <= 0) return "";
  if (mode === "sentences") {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(sentences[i % sentences.length] + ".");
    }
    return result.join(" ");
  }
  // paragraphs
  const paras: string[] = [];
  for (let p = 0; p < count; p++) {
    const sCount = 3 + (p % 3);
    const para: string[] = [];
    for (let s = 0; s < sCount; s++) {
      para.push(sentences[(p * 5 + s) % sentences.length] + ".");
    }
    paras.push(para.join(" "));
  }
  return paras.join("\n\n");
}

export function LoremIpsumTool({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"paragraphs" | "sentences">("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");

  const run = () => {
    const n = Math.min(Math.max(1, Number(count) || 1), 50);
    setOutput(generate(n, mode));
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {}
  };

  const reset = () => {
    setCount(3);
    setMode("paragraphs");
    setOutput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Modo" : "Mode"}</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "paragraphs" | "sentences")}
            className="h-11 w-full rounded-xl border bg-background px-3"
          >
            <option value="paragraphs">{es ? "Párrafos" : "Paragraphs"}</option>
            <option value="sentences">{es ? "Oraciones" : "Sentences"}</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{es ? "Cantidad" : "Count"}</span>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-11 w-32 rounded-xl border bg-background px-3"
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={run} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground">
          {es ? "Generar" : "Generate"}
        </button>
        <button onClick={copy} disabled={!output} className="rounded-xl border px-4 py-2 font-medium disabled:opacity-50">
          {es ? "Copiar" : "Copy"}
        </button>
        <button onClick={reset} className="rounded-xl border px-4 py-2 font-medium">
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      {output && (
        <output className="block whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm">
          {output}
        </output>
      )}
    </div>
  );
}
