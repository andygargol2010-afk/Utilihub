import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { type Locale } from "./RomanNumeralsConverterTool.part1";
import { toRoman, fromRoman, buttonClass, fieldClass } from "./RomanNumeralsConverterTool.part2";

export function RomanNumeralsConverterTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState("2026");
  const [mode, setMode] = useState<"toRoman" | "toNumber">("toRoman");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const raw = input.trim();
    if (!raw) return null;
    if (mode === "toRoman") {
      const n = parseInt(raw, 10);
      if (Number.isNaN(n) || !Number.isInteger(n)) {
        return { error: es ? "Introduce un número entero válido" : "Enter a valid integer" };
      }
      if (n < 1 || n > 3999) {
        return { error: es ? "Rango clásico: 1–3999" : "Classic range: 1–3999" };
      }
      return { value: toRoman(n), kind: "roman" as const };
    } else {
      const n = fromRoman(raw);
      if (n === null) {
        return { error: es ? "Número romano inválido (usa I,V,X,L,C,D,M y forma correcta)" : "Invalid Roman numeral (use I,V,X,L,C,D,M in correct form)" };
      }
      return { value: String(n), kind: "number" as const };
    }
  }, [input, mode, es]);

  async function copy() {
    if (!result || "error" in result) return;
    const text = es
      ? `Resultado: ${result.value}`
      : `Result: ${result.value}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setInput(mode === "toRoman" ? "2026" : "MMXXVI");
    setCopied(false);
  }

  function switchMode(next: "toRoman" | "toNumber") {
    setMode(next);
    setInput(next === "toRoman" ? "2026" : "MMXXVI");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          className={`${buttonClass} ${mode === "toRoman" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => switchMode("toRoman")}
        >
          {es ? "Número → Romano" : "Number → Roman"}
        </button>
        <button
          type="button"
          className={`${buttonClass} ${mode === "toNumber" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => switchMode("toNumber")}
        >
          {es ? "Romano → Número" : "Roman → Number"}
        </button>
      </div>

      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">
          {es ? "Resultado" : "Result"}
        </p>
        {result && !("error" in result) ? (
          <p className="text-lg font-semibold">{result.value}</p>
        ) : result && "error" in result ? (
          <p className="text-sm text-destructive">{result.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Introduce un valor" : "Enter a value"}</p>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          {mode === "toRoman"
            ? es ? "Número (1–3999)" : "Number (1–3999)"
            : es ? "Número romano" : "Roman numeral"}
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={fieldClass}
          placeholder={mode === "toRoman" ? "2026" : "MMXXVI"}
          inputMode={mode === "toRoman" ? "numeric" : "text"}
        />
      </label>

      <p className="text-sm text-muted-foreground">
        {es
          ? "Conversión bidireccional clásica (notación sustractiva: IV, IX, XL, XC, CD, CM). Rango 1–3999."
          : "Bidirectional classic conversion (subtractive notation: IV, IX, XL, XC, CD, CM). Range 1–3999."}
      </p>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "2026 → MMXXVI" : "2026 → MMXXVI"}</p>
        <p>{es ? "49 → XLIX · MCMXCIV → 1994" : "49 → XLIX · MCMXCIV → 1994"}</p>
      </div>

      <div className="text-sm space-y-1">
        <p className="font-medium">{es ? "Herramientas relacionadas" : "Related tools"}</p>
        <p>
          <a href={es ? "/es/herramientas/contador-caracteres" : "/tools/contador-caracteres"} className="underline text-primary">
            {es ? "Contador de caracteres" : "Character counter"}
          </a>
          {" · "}
          <a href={es ? "/es/herramientas/convertidor-casos-texto" : "/tools/convertidor-casos-texto"} className="underline text-primary">
            {es ? "Conversor de mayúsculas" : "Case converter"}
          </a>
        </p>
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
