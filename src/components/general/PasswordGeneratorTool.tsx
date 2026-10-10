import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  excludeSimilar: boolean,
): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";
  const similar = "Il1O0";

  let chars = "";
  if (useUpper) chars += excludeSimilar ? upper.replace(/[Il]/g, "") : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (useLower) chars += excludeSimilar ? lower.replace(/[l]/g, "") : "abcdefghijklmnopqrstuvwxyz";
  if (useNumbers) chars += excludeSimilar ? numbers : "0123456789";
  if (useSymbols) chars += symbols;

  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  const cryptoObj = window.crypto || (window as any).msCrypto;
  const randomValues = new Uint32Array(length);
  cryptoObj.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

export function PasswordGeneratorTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [password, setPassword] = useState(() =>
    generatePassword(16, true, true, true, true, true),
  );
  const [copied, setCopied] = useState(false);

  const strength = useMemo(() => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (useUpper && useLower) score++;
    if (useNumbers) score++;
    if (useSymbols) score++;
    if (score >= 4) return es ? "Fuerte" : "Strong";
    if (score >= 2) return es ? "Media" : "Medium";
    return es ? "Débil" : "Weak";
  }, [length, useUpper, useLower, useNumbers, useSymbols, es]);

  function regenerate() {
    setPassword(
      generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeSimilar),
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border p-4">
        <p className="text-sm font-medium">{es ? "Contraseña generada" : "Generated password"}</p>
        <p className="mt-2 break-all font-mono text-xl">{password}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {es ? "Fuerza:" : "Strength:"} {strength}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={regenerate}>
          {es ? "Regenerar" : "Regenerate"}
        </button>
        <button type="button" className={buttonClass} onClick={copy}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">
          {es ? "Longitud" : "Length"}: {length}
        </span>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useUpper}
            onChange={(e) => setUseUpper(e.target.checked)}
          />
          {es ? "Mayúsculas" : "Uppercase"}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useLower}
            onChange={(e) => setUseLower(e.target.checked)}
          />
          {es ? "Minúsculas" : "Lowercase"}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useNumbers}
            onChange={(e) => setUseNumbers(e.target.checked)}
          />
          {es ? "Números" : "Numbers"}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(e) => setUseSymbols(e.target.checked)}
          />
          {es ? "Símbolos" : "Symbols"}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
          />
          {es ? "Excluir similares (I, l, 1, 0, O)" : "Exclude similar (I, l, 1, 0, O)"}
        </label>
      </div>

      <button type="button" className={buttonClass} onClick={regenerate}>
        {es ? "Generar nueva" : "Generate new"}
      </button>
    </div>
  );
}
