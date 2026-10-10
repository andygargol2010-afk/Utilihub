import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
  "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
  "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure",
  "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore",
  "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
  "est", "laborum",
];

function generateLorem(paragraphs: number, sentences: number, wordsPerSentence: number): string {
  const result: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const sents: string[] = [];
    for (let s = 0; s < sentences; s++) {
      const words: string[] = [];
      for (let w = 0; w < wordsPerSentence; w++) {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        words.push(w === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
      }
      sents.push(words.join(" ") + ".");
    }
    result.push(sents.join(" "));
  }
  return result.join("\n\n");
}

export function LoremIpsumTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [paragraphs, setParagraphs] = useState(3);
  const [sentences, setSentences] = useState(4);
  const [words, setWords] = useState(8);
  const [copied, setCopied] = useState(false);

  const text = useMemo(
    () => generateLorem(paragraphs, sentences, words),
    [paragraphs, sentences, words],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function regenerate() {
    // force re-memo by slight state change or just rely on random in useMemo (it re-runs on dep change)
    setParagraphs((p) => p);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-4">
        <p className="text-sm font-medium">{es ? "Texto generado" : "Generated text"}</p>
        <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm">{text}</pre>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setParagraphs(3);
            setSentences(4);
            setWords(8);
          }}
        >
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          {es ? "Párrafos" : "Paragraphs"}: {paragraphs}
        </span>
        <input
          type="range"
          min={1}
          max={10}
          value={paragraphs}
          onChange={(e) => setParagraphs(Number(e.target.value))}
          className="w-full"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          {es ? "Oraciones por párrafo" : "Sentences per paragraph"}: {sentences}
        </span>
        <input
          type="range"
          min={1}
          max={8}
          value={sentences}
          onChange={(e) => setSentences(Number(e.target.value))}
          className="w-full"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          {es ? "Palabras por oración" : "Words per sentence"}: {words}
        </span>
        <input
          type="range"
          min={4}
          max={15}
          value={words}
          onChange={(e) => setWords(Number(e.target.value))}
          className="w-full"
        />
      </label>
    </div>
  );
}
