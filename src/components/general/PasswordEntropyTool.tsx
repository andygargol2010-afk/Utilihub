import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { estimatePasswordEntropy } from "@/lib/general/password-entropy";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base font-mono";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLES = ["Tr0ub4dor&3", "correcthorsebatterystaple"];

export function PasswordEntropyTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(EXAMPLES[0]);
  const [show, setShow] = useState(true);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => estimatePasswordEntropy(raw), [raw]);

  async function copy(text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setRaw(EXAMPLES[0]);
    setShow(true);
    setCopied(false);
  }

  const bandLabel = result.band === "empty"
    ? (es ? "Vacío" : "Empty")
    : result.band === "weak"
      ? (es ? "Baja" : "Low")
      : result.band === "fair"
        ? (es ? "Media" : "Fair")
        : result.band === "strong"
          ? (es ? "Alta" : "Strong")
          : (es ? "Muy alta" : "Very strong");

  const summary = result.status !== "ok" || result.poolBits === null
    ? ""
    : [
        `length ${result.length}`,
        `charset ${result.charset}`,
        `pool ${result.poolBits.toFixed(1)} bits`,
        `shannon ${result.shannonBits?.toFixed(1)} bits`,
        `classes ${result.classes.join("+") || "none"}`,
      ].join(" | ");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw(EXAMPLES[0])}>Tr0ub4dor&3</button>
        <button type="button" className={buttonClass} onClick={() => setRaw(EXAMPLES[1])}>{es ? "solo minúsculas" : "lowercase only"}</button>
        <button type="button" className={buttonClass} onClick={() => setShow((v) => !v)}>{show ? (es ? "Ocultar" : "Hide") : (es ? "Mostrar" : "Show")}</button>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Contraseña (no se envía)" : "Password (not uploaded)"}</span>
        <input
          className={fieldClass}
          type={show ? "text" : "password"}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label={es ? "Contraseña a estimar" : "Password to estimate"}
        />
      </label>
      <p className="text-sm text-muted-foreground">
        {result.status === "empty"
          ? (es ? "Escribí una contraseña. El campo vacío no se puntúa." : "Type a password. An empty field is not scored.")
          : (es
            ? "Los bits de pool asumen un ataque al azar sobre el alfabeto detectado. Una frase de diccionario puede ser más débil."
            : "Pool bits assume a random attack over the detected alphabet. A dictionary phrase can be weaker.")}
      </p>
      {result.status === "ok" ? (
        <div className="space-y-3">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Bits de pool" : "Pool bits"}</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{result.poolBits === null ? "—" : result.poolBits.toFixed(1)}</dd>
            </div>
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Shannon</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{result.shannonBits === null ? "—" : result.shannonBits.toFixed(1)}</dd>
            </div>
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Alfabeto" : "Charset"}</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{result.charset} · {result.classes.join(", ") || "—"}</dd>
            </div>
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Banda" : "Band"}</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{bandLabel} · {result.length} / {result.unique} {es ? "únicos" : "unique"}</dd>
            </div>
          </dl>
          {result.classes.length === 1 ? (
            <p className="text-sm text-muted-foreground">{es ? "Una sola clase: el pool no cuenta frases de diccionario." : "One class only: the pool does not price dictionary phrases."}</p>
          ) : null}
          {result.hasSpace ? (
            <p className="text-sm text-muted-foreground">{es ? "El espacio suma 1 al alfabeto, no una palabra extra." : "A space adds 1 to the alphabet, not an extra word."}</p>
          ) : null}
          {result.hasNonAscii ? (
            <p className="text-sm text-muted-foreground">{es ? "Hay caracteres fuera de ASCII imprimible; el alfabeto extra es acotado." : "Characters outside printable ASCII are in a capped extra alphabet."}</p>
          ) : null}
          <button type="button" className={buttonClass} onClick={() => copy(summary)}>
            {copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar resumen" : "Copy summary")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
