import { useState } from "react";
import type { GeneralTool } from "@/lib/general/types";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-4 text-sm font-medium hover:bg-muted";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailValidatorTool({ locale = "en" }: { tool?: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const trimmed = email.trim();
  const valid = trimmed.length > 0 && EMAIL_RE.test(trimmed);
  const hasAt = trimmed.includes("@");
  const hasDot = trimmed.includes(".");

  async function copy() {
    const text = es
      ? `Email: ${trimmed}\nVálido: ${valid ? "Sí" : "No"}`
      : `Email: ${trimmed}\nValid: ${valid ? "Yes" : "No"}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setEmail("");
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-muted/30 p-6 space-y-2">
        <p className="text-sm text-muted-foreground">{es ? "Resultado" : "Result"}</p>
        <p className={`text-lg font-medium ${valid ? "text-green-600" : "text-red-600"}`}>
          {trimmed.length === 0
            ? es
              ? "Ingresá un email"
              : "Enter an email"
            : valid
              ? es
                ? "Formato válido"
                : "Valid format"
              : es
                ? "Formato inválido"
                : "Invalid format"}
        </p>
        {trimmed.length > 0 && !valid && (
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            {!hasAt && <li>{es ? "Falta el símbolo @" : "Missing @ symbol"}</li>}
            {hasAt && !hasDot && <li>{es ? "El dominio parece incompleto (falta punto)" : "Domain looks incomplete (missing dot)"}</li>}
            {hasAt && hasDot && <li>{es ? "El formato no coincide con un email típico" : "Format does not match a typical email"}</li>}
          </ul>
        )}
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Dirección de email" : "Email address"}</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={es ? "ejemplo@dominio.com" : "example@domain.com"}
          className={fieldClass}
          autoComplete="off"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-primary text-primary-foreground`} onClick={copy} disabled={!trimmed}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar resultado" : "Copy result"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>
    </div>
  );
}
