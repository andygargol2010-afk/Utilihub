import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { morseToText, textToMorse } from "@/lib/general/morse";

type Locale = "en" | "es";
type Direction = "to-morse" | "to-text";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function MorseTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [direction, setDirection] = useState<Direction>("to-morse");
  const [value, setValue] = useState("SOS");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => (direction === "to-morse" ? textToMorse(value) : morseToText(value)),
    [direction, value],
  );

  const status =
    result.status === "ok"
      ? es
        ? "Listo para copiar."
        : "Ready to copy."
      : result.status === "empty"
        ? es
          ? "Escribí texto o Morse. Vacío no inventa código."
          : "Enter text or Morse. Empty input does not invent a code."
        : result.issue === "char"
          ? es
            ? `Carácter no soportado: ${result.detail}`
            : `Unsupported character: ${result.detail}`
          : es
            ? `Token Morse no válido: ${result.detail}`
            : `Invalid Morse token: ${result.detail}`;

  async function copyResult() {
    if (result.status !== "ok") return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setDirection("to-morse")}>
          {es ? "Texto → Morse" : "Text → Morse"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDirection("to-text")}>
          {es ? "Morse → texto" : "Morse → text"}
        </button>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Entrada" : "Input"}</span>
        <textarea
          className={fieldClass}
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label={es ? "Entrada de Morse" : "Morse input"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-morse");
            setValue("SOS");
          }}
        >
          SOS
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-morse");
            setValue("HELLO WORLD");
          }}
        >
          HELLO WORLD
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-text");
            setValue("... --- ...");
          }}
        >
          ... --- ...
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-morse");
            setValue("");
          }}
        >
          {es ? "Limpiar" : "Clear"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? (
        <div className="space-y-3 rounded-xl border p-4">
          <p className="break-words font-medium text-lg">{result.output}</p>
          <p className="text-sm text-muted-foreground">
            {es ? "Letras" : "Letters"}: {result.letters} · {es ? "palabras" : "words"}: {result.words}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
