import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum",
];

function generateLorem(paragraphs: number, wordsPerPara: number): string {
  const paras: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const words: string[] = [];
    for (let w = 0; w < wordsPerPara; w++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const sentence = words.join(" ");
    paras.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".");
  }
  return paras.join("\n\n");
}

export function LoremTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [paras, setParas] = useState("3");
  const [words, setWords] = useState("50");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseInt(paras, 10);
    const w = parseInt(words, 10);
    if (!paras.trim() || !words.trim()) return { status: "empty" as const };
    if (Number.isNaN(p) || Number.isNaN(w) || p < 1 || w < 1 || p > 20 || w > 200) return { status: "invalid" as const };
    return { status: "ok" as const, text: generateLorem(p, w) };
  }, [paras, words]);

  async function copyResult() {
    if (result.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const status =
    result.status === "empty"
      ? es
        ? "Los campos están vacíos. No se inventa texto."
        : "Fields are empty. No text is invented."
      : result.status === "invalid"
        ? es
          ? "Usá números positivos (máx. 20 párrafos, 200 palabras). No se inventa texto."
          : "Use positive numbers (max 20 paragraphs, 200 words). No text is invented."
        : es
          ? "Texto listo. Podés copiarlo."
          : "Text ready. You can copy it.";

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Párrafos" : "Paragraphs"}</span>
        <input className={fieldClass} value={paras} onChange={(e) => setParas(e.target.value)} inputMode="numeric" autoComplete="off" placeholder="3" />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Palabras por párrafo" : "Words per paragraph"}</span>
        <input className={fieldClass} value={words} onChange={(e) => setWords(e.target.value)} inputMode="numeric" autoComplete="off" placeholder="50" />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => { setParas("3"); setWords("50"); }}>{es ? "Ejemplo 3 × 50" : "3 × 50 example"}</button>
        <button type="button" className={buttonClass} onClick={() => { setParas("1"); setWords("20"); }}>{es ? "Ejemplo corto" : "Short example"}</button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={result.status !== "ok"}>{copied ? (es ? "Copiado" : "Copied") : es ? "Copiar texto" : "Copy text"}</button>
        <button type="button" className={buttonClass} onClick={() => { setParas(""); setWords(""); }}>{es ? "Reiniciar" : "Reset"}</button>
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? <pre className="rounded-xl border p-4 whitespace-pre-wrap text-sm">{result.text}</pre> : null}
    </div>
  );
}
