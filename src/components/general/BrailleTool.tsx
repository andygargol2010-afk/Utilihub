import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { brailleToText, textToBraille } from "@/lib/general/braille";

type Locale = "en" | "es";
type Direction = "to-braille" | "to-text";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function BrailleTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [direction, setDirection] = useState<Direction>("to-braille");
  const [value, setValue] = useState("hola");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => (direction === "to-braille" ? textToBraille(value) : brailleToText(value)),
    [direction, value],
  );

  const status =
    result.status === "ok"
      ? es
        ? "Listo para copiar."
        : "Ready to copy."
      : result.status === "empty"
        ? es
          ? "Escribí texto o celdas. Vacío no inventa braille."
          : "Enter text or cells. Empty input does not invent braille."
        : result.issue === "number"
          ? es
            ? "El signo numérico ⠼ necesita al menos un dígito."
            : "The number sign ⠼ needs at least one digit."
          : result.issue === "cell"
            ? es
              ? `Celda no reconocida: ${result.detail}`
              : `Unrecognized cell: ${result.detail}`
            : es
              ? `Carácter no soportado: ${result.detail}`
              : `Unsupported character: ${result.detail}`;

  async function copyResult() {
    if (result.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setDirection("to-braille")}>
          {es ? "Texto → braille" : "Text → braille"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDirection("to-text")}>
          {es ? "Braille → texto" : "Braille → text"}
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
          aria-label={es ? "Entrada de braille" : "Braille input"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-braille");
            setValue("hola");
          }}
        >
          hola
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-braille");
            setValue("Ñ 12");
          }}
        >
          Ñ 12
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-text");
            setValue("⠓⠕⠇⠁");
          }}
        >
          ⠓⠕⠇⠁
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-braille");
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
            {es ? "Celdas" : "Cells"}: {result.cells} · {es ? "mayúsculas" : "capitals"}: {result.capitals} ·{" "}
            {es ? "signos numéricos" : "number signs"}: {result.numbers}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
