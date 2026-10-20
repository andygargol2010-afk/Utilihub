import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function generatePassword(length: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean): string {
  let chars = "";
  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!chars) return "";
  let result = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export function PasswordGeneratorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState("16");
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const len = parseInt(length, 10);
    if (isNaN(len) || len < 4 || len > 128) return null;
    const pw = generatePassword(len, upper, lower, numbers, symbols);
    return pw || null;
  }, [length, upper, lower, numbers, symbols]);

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setLength("16");
    setUpper(true);
    setLower(true);
    setNumbers(true);
    setSymbols(false);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-3">
        <p className="text-sm text-muted-foreground">{es ? "Contraseña generada" : "Generated password"}</p>
        {result ? (
          <p className="text-2xl font-mono break-all">{result}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{es ? "Longitud 4–128 y al menos un tipo" : "Length 4–128 and at least one type"}</p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="block space-y-2 text-sm">
          <span className="font-medium">{es ? "Longitud" : "Length"}</span>
          <input type="number" min="4" max="128" value={length} onChange={(e) => setLength(e.target.value)} className={fieldClass} />
        </label>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> {es ? "Mayúsculas" : "Uppercase"}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> {es ? "Minúsculas" : "Lowercase"}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> {es ? "Números" : "Numbers"}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> {es ? "Símbolos" : "Symbols"}</label>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-2">
        <p className="font-medium">{es ? "Ejemplos" : "Examples"}</p>
        <p>{es ? "16 chars, todos los tipos → ejemplo seguro" : "16 chars, all types → strong example"}</p>
        <p>{es ? "8 chars, solo números → pin-like" : "8 chars, numbers only → pin-like"}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
