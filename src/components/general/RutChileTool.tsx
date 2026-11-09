import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { RUT_CHILE_SAMPLE, checkRutChile } from "@/lib/general/rut-chile";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function RutChileTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState(RUT_CHILE_SAMPLE);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => checkRutChile(value), [value]);

  const statusText = (() => {
    if (result.status === "empty") return es ? "Ingresá un RUT." : "Enter a RUT.";
    if (result.error === "body") return es ? "Solo dígitos en el cuerpo y un verificador 0–9 o K." : "Body digits only, plus a 0–9 or K check digit.";
    if (result.error === "length") return es ? "El cuerpo debe tener 7 u 8 dígitos." : "The body must be 7 or 8 digits.";
    if (result.error === "digit") {
      return es
        ? `Dígito incorrecto. El esperado es ${result.expected}.`
        : `Check digit does not match. Expected ${result.expected}.`;
    }
    return es ? `RUT válido. Verificador ${result.expected}.` : `Valid RUT. Check digit ${result.expected}.`;
  })();

  async function copy() {
    if (!result.formatted) return;
    try {
      await navigator.clipboard.writeText(result.formatted);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>{es ? "RUT" : "RUT"}</span>
        <input
          className={inputClass}
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="12.345.678-5"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setValue(RUT_CHILE_SAMPLE)}>
          {es ? "Ejemplo" : "Sample"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setValue("11.111.111-1")}>
          11.111.111-1
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setValue("")}>
          {es ? "Restablecer" : "Reset"}
        </button>
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{statusText}</p>
        {result.formatted ? <p className="mt-3 font-mono text-base">{result.formatted}</p> : null}
      </div>
    </div>
  );
}
