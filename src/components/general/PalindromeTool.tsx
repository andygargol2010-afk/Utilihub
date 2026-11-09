import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { isPalindrome, PALINDROME_SAMPLE, PALINDROME_SAMPLE_ES } from "@/lib/general/palindrome";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function PalindromeTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState(PALINDROME_SAMPLE);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => isPalindrome(text), [text]);

  async function copyResult() {
    if (result.status !== "ok") return;
    const label = result.isPalindrome
      ? es
        ? "Es un palíndromo"
        : "Is a palindrome"
      : es
        ? "No es un palíndromo"
        : "Is not a palindrome";
    try {
      await navigator.clipboard.writeText(label);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const status =
    result.status === "empty"
      ? es
        ? "El texto está vacío. No se trata como palíndromo."
        : "The text is empty. It is not treated as a palindrome."
      : result.isPalindrome
        ? es
          ? "Es un palíndromo."
          : "Is a palindrome."
        : es
          ? "No es un palíndromo."
          : "Is not a palindrome.";

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Texto" : "Text"}</span>
        <textarea
          className={fieldClass}
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          spellCheck={false}
          placeholder={es ? "Escribí una frase" : "Type a phrase"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => setText(es ? PALINDROME_SAMPLE_ES : PALINDROME_SAMPLE)}
        >
          {es ? "Ejemplo" : "Example"}
        </button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={result.status !== "ok"}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setText("")}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? (
        <div className="rounded-xl border p-4">
          <p className="text-2xl font-semibold">
            {result.isPalindrome ? (es ? "Sí" : "Yes") : es ? "No" : "No"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {es ? "Texto limpio:" : "Cleaned text:"} {result.cleaned}
          </p>
        </div>
      ) : null}
    </div>
  );
}
