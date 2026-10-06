import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { checkIban, IBAN_PRESETS } from "@/lib/general/iban";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function IbanTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(IBAN_PRESETS.gb);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => checkIban(raw), [raw]);

  const statusText = (() => {
    if (result.status === "empty") return es ? "Pegá un IBAN para comprobarlo." : "Paste an IBAN to check it.";
    if (result.status === "format") return es ? "Formato inválido: 2 letras, 2 dígitos y 11–30 caracteres alfanuméricos (máx. 34)." : "Invalid format: 2 letters, 2 digits, then 11–30 alphanumeric characters (max 34).";
    if (result.status === "length") return es
      ? `Longitud ${result.actualLength}; ${result.country} exige ${result.expectedLength}.`
      : `Length ${result.actualLength}; ${result.country} requires ${result.expectedLength}.`;
    if (result.status === "checksum") return es
      ? `Resto MOD-97 = ${result.remainder}. Tiene que ser 1.`
      : `MOD-97 remainder = ${result.remainder}. It must be 1.`;
    return es ? "IBAN válido (formato, longitud y resto 1)." : "Valid IBAN (format, length, and remainder 1).";
  })();

  const summary = result.normalized
    ? [
        `${es ? "IBAN" : "IBAN"}: ${result.grouped || result.normalized}`,
        `${es ? "País" : "Country"}: ${result.country || "—"}`,
        `${es ? "Longitud" : "Length"}: ${result.actualLength}${result.expectedLength ? ` / ${result.expectedLength}` : ""}`,
        `${es ? "Resto" : "Remainder"}: ${result.remainder ?? "—"}`,
        statusText,
      ].join("\n")
    : "";

  async function copyResult() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>{es ? "IBAN" : "IBAN"}</span>
        <input className={inputClass} value={raw} autoCapitalize="characters" spellCheck={false} onChange={(e) => setRaw(e.target.value)} placeholder="GB82 WEST 1234 5698 7654 32" />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setRaw(IBAN_PRESETS.gb)}>{es ? "Ejemplo GB" : "GB sample"}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw(IBAN_PRESETS.es)}>{es ? "Ejemplo ES" : "ES sample"}</button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={!summary}>{copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar" : "Copy")}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw("")}>{es ? "Reiniciar" : "Reset"}</button>
      </div>
      <p className={`text-sm ${result.ok ? "text-foreground" : "text-destructive"}`}>{statusText}</p>
      {result.normalized ? (
        <div className="space-y-1 rounded-xl border p-3 text-sm">
          <p>{es ? "Normalizado" : "Normalized"}: <strong className="break-all">{result.grouped}</strong></p>
          <p>{es ? "País" : "Country"}: <strong>{result.country || "—"}</strong> · {es ? "longitud" : "length"}: <strong>{result.actualLength}</strong>{result.expectedLength ? ` / ${result.expectedLength}` : es ? " (país sin tabla)" : " (country not in table)"}</p>
          <p>{es ? "Resto MOD-97-10" : "MOD-97-10 remainder"}: <strong>{result.remainder ?? "—"}</strong></p>
        </div>
      ) : null}
    </div>
  );
}
