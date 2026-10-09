import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { numberToRoman, romanToNumber } from "@/lib/general/roman";

type Locale = "en" | "es";
type Direction = "to-roman" | "to-number";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function RomanTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [direction, setDirection] = useState<Direction>("to-roman");
  const [value, setValue] = useState("1994");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => (direction === "to-roman" ? numberToRoman(value) : romanToNumber(value)),
    [direction, value],
  );

  const status =
    result.status === "ok"
      ? es
        ? "Listo para copiar."
        : "Ready to copy."
      : result.status === "empty"
        ? es
          ? "Escribí un número o un romano. Vacío no inventa resultado."
          : "Enter a number or a Roman numeral. Empty input does not invent a result."
        : result.issue === "range"
          ? es
            ? "Solo 1 a 3999. El cero y el 4000 no entran."
            : "Only 1 to 3999. Zero and 4000 are out of range."
          : result.issue === "number"
            ? es
              ? "Usá un entero sin puntos ni comas."
              : "Use an integer with no separators."
            : es
              ? "Forma no estándar. IIII, IC y VX se rechazan."
              : "Non-standard form. IIII, IC, and VX are rejected.";

  async function copyResult() {
    if (result.status !== "ok") return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setDirection("to-roman")}>
          {es ? "Número → romano" : "Number → Roman"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDirection("to-number")}>
          {es ? "Romano → número" : "Roman → number"}
        </button>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Entrada" : "Input"}</span>
        <input
          className={fieldClass}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          inputMode={direction === "to-roman" ? "numeric" : "text"}
          aria-label={es ? "Entrada de números romanos" : "Roman numeral input"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-roman");
            setValue("1994");
          }}
        >
          1994
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-number");
            setValue("MCMXCIV");
          }}
        >
          MCMXCIV
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-roman");
            setValue("14");
          }}
        >
          14
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => {
            setDirection("to-roman");
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
            {es ? "Valor" : "Value"}: {result.value}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
