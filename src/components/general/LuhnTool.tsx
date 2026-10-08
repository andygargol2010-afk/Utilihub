import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { checkLuhn, LUHN_PRESETS } from "@/lib/general/luhn";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function LuhnTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(LUHN_PRESETS.visa);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => checkLuhn(raw), [raw]);

  const statusText = (() => {
    if (result.status === "empty") return es ? "Pegá dígitos para comprobar Luhn." : "Paste digits to check Luhn.";
    if (result.status === "nondigit") return es ? "Solo dígitos, espacios y guiones." : "Digits, spaces, and dashes only.";
    if (result.status === "short") return es ? "Hacen falta entre 2 y 19 dígitos." : "Need between 2 and 19 digits.";
    if (result.status === "invalid") {
      return es
        ? `Inválido. Dígito escrito ${result.checkDigit}; esperado ${result.expectedCheck}. Resto ${result.remainder}.`
        : `Invalid. Typed check digit ${result.checkDigit}; expected ${result.expectedCheck}. Remainder ${result.remainder}.`;
    }
    return es
      ? `Válido. Suma ${result.sum}, resto 0, dígito de control ${result.checkDigit}.`
      : `Valid. Sum ${result.sum}, remainder 0, check digit ${result.checkDigit}.`;
  })();

  const summary = [
    `${es ? "Estado" : "Status"}: ${result.status}`,
    `${es ? "Dígitos" : "Digits"}: ${result.digits || "-"}`,
    `${es ? "Longitud" : "Length"}: ${result.length}`,
    `${es ? "Marca" : "Brand"}: ${result.brand}`,
    `${es ? "Control esperado" : "Expected check"}: ${result.expectedCheck || "-"}`,
  ].join("\n");

  async function copy() {
    if (result.status === "empty") return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>{es ? "Número (no se envía)" : "Number (not sent)"}</span>
        <input
          className={inputClass}
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setRaw(LUHN_PRESETS.visa)}>
          Visa
        </button>
        <button type="button" className={buttonClass} onClick={() => setRaw(LUHN_PRESETS.visaBad)}>
          {es ? "Visa inválida" : "Bad Visa"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setRaw(LUHN_PRESETS.amex)}>
          Amex
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setRaw(LUHN_PRESETS.visa)}>
          {es ? "Restablecer" : "Reset"}
        </button>
      </div>
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-medium">{statusText}</p>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{es ? "Longitud" : "Length"}</dt>
            <dd>{result.length}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{es ? "Marca estimada" : "Brand guess"}</dt>
            <dd>{result.brand}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{es ? "Dígito escrito" : "Typed check"}</dt>
            <dd>{result.checkDigit || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{es ? "Dígito esperado" : "Expected check"}</dt>
            <dd>{result.expectedCheck || "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
