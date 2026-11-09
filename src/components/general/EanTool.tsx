import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { parseGtin, type GtinKind } from "@/lib/general/ean";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLES = ["5901234123457", "036000291452", "96385074"];

const KIND_LABEL: Record<GtinKind, { en: string; es: string }> = {
  "ean-8": { en: "EAN-8", es: "EAN-8" },
  "upc-a": { en: "UPC-A", es: "UPC-A" },
  "ean-13": { en: "EAN-13", es: "EAN-13" },
  "gtin-14": { en: "GTIN-14", es: "GTIN-14" },
};

export function EanTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(EXAMPLES[0]);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => parseGtin(raw), [raw]);

  const status = result.status === "ok"
    ? result.valid
      ? (es ? "Dígito de control correcto." : "Check digit matches.")
      : (es ? `El control esperado es ${result.expected}, no ${result.given}.` : `Expected check digit ${result.expected}, not ${result.given}.`)
    : result.status === "empty"
      ? (es ? "Pegá un código. Los espacios y guiones se ignoran." : "Paste a code. Spaces and hyphens are ignored.")
      : result.message === "digits"
        ? (es ? "Solo dígitos. Las letras no forman un GTIN." : "Digits only. Letters are not a GTIN.")
        : (es ? "Largo válido: 7–8 (EAN-8), 11–12 (UPC-A), 13 (EAN-13) o 14 (GTIN-14)." : "Valid length: 7–8 (EAN-8), 11–12 (UPC-A), 13 (EAN-13), or 14 (GTIN-14).");

  async function copyResult() {
    if (result.status !== "ok") return;
    try {
      await navigator.clipboard.writeText(result.body + result.expected);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Código de barras" : "Barcode number"}</span>
        <input
          className={fieldClass}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          placeholder="5901234123457"
          aria-label={es ? "Código EAN o UPC" : "EAN or UPC code"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button key={example} type="button" className={buttonClass} onClick={() => setRaw(example)}>
            {example}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => { setRaw(""); setCopied(false); }}>
          {es ? "Limpiar" : "Reset"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.status === "ok" ? (
        <div className="rounded-xl border p-4 space-y-3">
          <p className="text-sm text-muted-foreground">{KIND_LABEL[result.kind][es ? "es" : "en"]}</p>
          <p className="font-medium break-words">{result.formatted}</p>
          <p className="text-sm">
            {es ? "Dígito calculado" : "Calculated digit"}: {result.expected}
            {result.given ? ` · ${es ? "ingresado" : "entered"}: ${result.given}` : ""}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
