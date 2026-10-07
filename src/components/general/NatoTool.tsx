import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { callsignPreset, platePreset, spellNato, type NatoOptions } from "@/lib/general/nato";

type Locale = "en" | "es";

const inputClass = "min-h-28 w-full rounded-xl border bg-background px-3 py-2 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function NatoTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState(callsignPreset());
  const [digitStyle, setDigitStyle] = useState<NatoOptions["digitStyle"]>("icao");
  const [keepSpaces, setKeepSpaces] = useState(false);
  const [labelPunctuation, setLabelPunctuation] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => spellNato(text, { digitStyle, keepSpaces, labelPunctuation }),
    [text, digitStyle, keepSpaces, labelPunctuation],
  );

  async function copyResult() {
    if (!result.line) return;
    await navigator.clipboard.writeText(result.line);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setText(callsignPreset())}>
          {es ? "Indicativo" : "Call sign"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setText(platePreset())}>
          {es ? "Patente AB-19" : "Plate AB-19"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setText("")}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
      <label className="block space-y-1 text-sm">
        <span>{es ? "Texto a deletrear" : "Text to spell"}</span>
        <textarea className={inputClass} value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Dígitos" : "Digits"}</span>
          <select
            className="h-11 w-full rounded-xl border bg-background px-3 text-base"
            value={digitStyle}
            onChange={(event) => setDigitStyle(event.target.value as NatoOptions["digitStyle"])}
          >
            <option value="icao">{es ? "ICAO (Tree, Niner)" : "ICAO (Tree, Niner)"}</option>
            <option value="plain">{es ? "Inglés plano (Three, Nine)" : "Plain English (Three, Nine)"}</option>
          </select>
        </label>
        <div className="flex flex-col justify-end gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={keepSpaces} onChange={(event) => setKeepSpaces(event.target.checked)} />
            {es ? "Etiquetar espacios" : "Label spaces"}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={labelPunctuation} onChange={(event) => setLabelPunctuation(event.target.checked)} />
            {es ? "Etiquetar puntuación" : "Label punctuation"}
          </label>
        </div>
      </div>
      <div className="rounded-2xl border bg-muted/40 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Deletreo" : "Spelling"}</p>
        <p className="mt-2 break-words text-base font-medium">{result.line || (es ? "Nada para deletrear." : "Nothing to spell.")}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {es
            ? `${result.tokens.length} palabras · ${result.skipped} omitidos`
            : `${result.tokens.length} words · ${result.skipped} skipped`}
        </p>
        <button type="button" className={`${buttonClass} mt-3`} onClick={copyResult} disabled={!result.line}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
      </div>
    </div>
  );
}