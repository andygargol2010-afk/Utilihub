import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { dniLetter } from "@/lib/general/dni-letter";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const PRESETS = [
  { id: "dni", value: "12345678", labelEn: "DNI 12345678", labelEs: "DNI 12345678" },
  { id: "nie", value: "X1234567", labelEn: "NIE X1234567", labelEs: "NIE X1234567" },
  { id: "check", value: "12345678Z", labelEn: "Check 12345678Z", labelEs: "Comprobar 12345678Z" },
];

export function DniLetterTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [value, setValue] = useState(PRESETS[0].value);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => dniLetter(value), [value]);

  async function copyResult() {
    if (!result.full) return;
    await navigator.clipboard.writeText(result.full);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const status =
    result.status === "empty"
      ? es ? "Escribí un DNI o NIE." : "Enter a DNI or NIE."
      : result.status === "invalid"
        ? es ? "Formato no válido. Usá 8 cifras o X/Y/Z más 7 cifras." : "Invalid format. Use 8 digits, or X/Y/Z plus 7 digits."
        : result.status === "match"
          ? es ? "La letra coincide." : "The letter matches."
          : result.status === "mismatch"
            ? es ? `La letra no coincide. Esperada: ${result.expected}.` : `Letter does not match. Expected ${result.expected}.`
            : es ? "Letra calculada." : "Letter calculated.";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" className={buttonClass} onClick={() => setValue(preset.value)}>
            {es ? preset.labelEs : preset.labelEn}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => setValue("")}>
          {es ? "Limpiar" : "Reset"}
        </button>
      </div>
      <label className="block space-y-1 text-sm">
        <span>{es ? "DNI o NIE" : "DNI or NIE"}</span>
        <input
          className={fieldClass}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="text"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={es ? "12345678 o X1234567L" : "12345678 or X1234567L"}
        />
      </label>
      <p className="text-sm text-muted-foreground">{status}</p>
      {result.full ? (
        <div className="rounded-xl border p-4 space-y-2">
          <p className="text-sm text-muted-foreground">{es ? "Número con letra" : "Number with letter"}</p>
          <p className="text-2xl font-semibold tracking-wide">{result.full}</p>
          <p className="text-sm">
            {es ? "Letra" : "Letter"}: {result.expected}
            {result.kind === "nie" ? (es ? " · NIE (X=0, Y=1, Z=2)" : " · NIE (X=0, Y=1, Z=2)") : es ? " · DNI" : " · DNI"}
          </p>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
