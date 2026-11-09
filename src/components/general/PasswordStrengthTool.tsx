import { useState, useMemo } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

function scorePassword(pw: string): { score: number; label: string; tips: string[] } {
  let score = 0;
  const tips: string[] = [];
  if (pw.length >= 8) score += 1; else tips.push("Use at least 8 characters");
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1; else tips.push("Mix upper and lower case");
  if (/\d/.test(pw)) score += 1; else tips.push("Add numbers");
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1; else tips.push("Add symbols");
  if (pw.length > 0 && !/(.)\1{2,}/.test(pw)) score += 1; else if (pw.length > 0) tips.push("Avoid repeated characters");
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return { score: Math.min(score, 5), label: labels[Math.min(score, 5)], tips: tips.slice(0, 3) };
}

export function PasswordStrengthTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => scorePassword(pw), [pw]);

  const labelsES = ["Muy débil", "Débil", "Regular", "Buena", "Fuerte", "Muy fuerte"];
  const label = es ? labelsES[result.score] : result.label;
  const color = ["text-red-600", "text-orange-600", "text-yellow-600", "text-blue-600", "text-green-600", "text-emerald-600"][result.score];

  async function copy() {
    const text = es
      ? `Contraseña: ${pw}\nFuerza: ${label}`
      : `Password: ${pw}\nStrength: ${label}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function reset() {
    setPw("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Fuerza" : "Strength"}</p>
        <p className={`text-lg font-medium ${color}`}>
          {pw.length === 0 ? (es ? "Ingresá una contraseña" : "Enter a password") : label}
        </p>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className={`h-full ${["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-emerald-500"][result.score]}`} style={{ width: `${(result.score / 5) * 100}%` }} />
        </div>
        {pw.length > 0 && result.tips.length > 0 && (
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mt-2">
            {result.tips.map((t, i) => <li key={i}>{es ? t.replace("Use at least 8 characters", "Usá al menos 8 caracteres").replace("Mix upper and lower case", "Mezclá mayúsculas y minúsculas").replace("Add numbers", "Agregá números").replace("Add symbols", "Agregá símbolos").replace("Avoid repeated characters", "Evitá caracteres repetidos") : t}</li>)}
          </ul>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Contraseña" : "Password"}</span>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder={es ? "Escribí una contraseña" : "Type a password"}
            className={fieldClass}
            autoComplete="off"
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" onClick={() => setShow(!show)}>
            {show ? (es ? "Ocultar" : "Hide") : (es ? "Mostrar" : "Show")}
          </button>
        </div>
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!pw}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
