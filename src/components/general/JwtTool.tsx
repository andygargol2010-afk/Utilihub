import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { decodeJwt } from "@/lib/general/jwt";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base font-mono";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLES = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhbmEiLCJleHAiOjE2MDAwMDAwMDAsIm5iZiI6MTUwMDAwMDAwMH0.",
];

export function JwtTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(EXAMPLES[0]);
  const [copied, setCopied] = useState(false);
  const decoded = useMemo(() => decodeJwt(raw), [raw]);

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
    setCopied(false);
  }

  const status = decoded.status === "ok"
    ? (es ? "Payload leído. La firma no se verificó." : "Payload read. Signature was not verified.")
    : decoded.status === "empty"
      ? (es ? "Pegá un JWT con dos puntos." : "Paste a JWT with two dots.")
      : decoded.message === "parts"
        ? (es ? "Tiene que haber exactamente 3 segmentos separados por puntos." : "It needs exactly 3 segments separated by dots.")
        : decoded.message === "header"
          ? (es ? "El header no es JSON base64url." : "The header is not base64url JSON.")
          : (es ? "El payload no es JSON base64url." : "The payload is not base64url JSON.");

  const warnings = decoded.status === "ok"
    ? [
        decoded.signature ? null : (es ? "Firma vacía: no está firmado." : "Empty signature: not signed."),
        decoded.alg.toLowerCase() === "none" ? (es ? "alg none no es una firma." : "alg none is not a signature.") : null,
        decoded.expired ? (es ? "exp ya pasó." : "exp is in the past.") : null,
        decoded.notYetValid ? (es ? "nbf todavía no llegó." : "nbf is still in the future.") : null,
      ].filter(Boolean)
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw(EXAMPLES[0])}>jwt.io</button>
        <button type="button" className={buttonClass} onClick={() => setRaw(EXAMPLES[1])}>{es ? "exp vencido" : "expired exp"}</button>
      </div>
      <label className="block space-y-2">
        <span className="text-sm font-medium">JWT</span>
        <textarea
          className={`${fieldClass} min-h-28`}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label={es ? "JWT para decodificar" : "JWT to decode"}
        />
      </label>
      <p className="text-sm text-muted-foreground">{status}</p>
      {warnings.length > 0 ? (
        <ul className="space-y-1 text-sm text-muted-foreground">
          {warnings.map((w) => <li key={w}>{w}</li>)}
        </ul>
      ) : null}
      {decoded.status === "ok" ? (
        <div className="space-y-3">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">alg</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{decoded.alg || "—"}</dd>
            </div>
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">iat</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{decoded.iatIso ?? (es ? "ausente" : "absent")}</dd>
            </div>
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">exp</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{decoded.expIso ?? (es ? "ausente" : "absent")}</dd>
            </div>
            <div className="rounded-xl border border-border p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">nbf</dt>
              <dd className="mt-1 font-mono text-sm font-semibold">{decoded.nbfIso ?? (es ? "ausente" : "absent")}</dd>
            </div>
          </dl>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">header</p>
            <pre className="mt-2 overflow-x-auto text-sm">{decoded.header.pretty}</pre>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">payload</p>
            <pre className="mt-2 overflow-x-auto text-sm">{decoded.payload.pretty}</pre>
          </div>
          <button type="button" className={buttonClass} onClick={() => copy(decoded.payload.pretty)}>
            {copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar payload" : "Copy payload")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
