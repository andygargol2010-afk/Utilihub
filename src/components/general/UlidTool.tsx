import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { decodeUlid, generateUlids } from "@/lib/general/ulid";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const EXAMPLES = ["01ARZ3NDEKTSV4RRFFQ69G5FAV", "01HF7YAT00041061050R3GG28A"];

export function UlidTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [mode, setMode] = useState<"generate" | "decode">("generate");
  const [count, setCount] = useState("3");
  const [generated, setGenerated] = useState<string[]>([]);
  const [genError, setGenError] = useState("");
  const [raw, setRaw] = useState(EXAMPLES[0]);
  const [copied, setCopied] = useState(false);
  const decoded = useMemo(() => decodeUlid(raw), [raw]);

  const n = Number(count);
  const countOk = Number.isInteger(n) && n >= 1 && n <= 20;

  function generate() {
    if (!countOk) {
      setGenError(es ? "Pedí entre 1 y 20." : "Ask for 1 to 20.");
      setGenerated([]);
      return;
    }
    setGenError("");
    setGenerated(generateUlids(n));
  }

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
    setCount("3");
    setGenerated([]);
    setGenError("");
    setRaw(EXAMPLES[0]);
    setCopied(false);
    setMode("generate");
  }

  const decodeStatus = decoded.status === "ok"
    ? (es ? "ULID válido." : "Valid ULID.")
    : decoded.status === "empty"
      ? (es ? "Pegá un ULID de 26 caracteres." : "Paste a 26-character ULID.")
      : decoded.message === "length"
        ? (es ? "Tiene que medir 26 caracteres, sin contar espacios ni guiones." : "It must be 26 characters, ignoring spaces and hyphens.")
        : (es ? `Carácter no válido en la posición ${(decoded.index ?? 0) + 1}. U no se acepta.` : `Invalid character at position ${(decoded.index ?? 0) + 1}. U is not accepted.`);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setMode("generate")} aria-pressed={mode === "generate"}>
          {es ? "Generar" : "Generate"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setMode("decode")} aria-pressed={mode === "decode"}>
          {es ? "Decodificar" : "Decode"}
        </button>
        <button type="button" className={buttonClass} onClick={reset}>{es ? "Reiniciar" : "Reset"}</button>
      </div>

      {mode === "generate" ? (
        <div className="space-y-3">
          <label className="block space-y-2">
            <span className="text-sm font-medium">{es ? "Cantidad (1–20)" : "Count (1–20)"}</span>
            <input
              className={fieldClass}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              inputMode="numeric"
              aria-label={es ? "Cantidad de ULID" : "ULID count"}
            />
          </label>
          <button type="button" className={buttonClass} onClick={generate}>{es ? "Generar ULID" : "Generate ULID"}</button>
          {genError ? <p className="text-sm text-muted-foreground">{genError}</p> : null}
          {generated.length > 0 ? (
            <div className="space-y-2">
              <ul className="space-y-2">
                {generated.map((id) => (
                  <li key={id} className="break-all rounded-xl border border-border p-3 font-mono text-sm">{id}</li>
                ))}
              </ul>
              <button type="button" className={buttonClass} onClick={() => copy(generated.join("\n"))}>
                {copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar" : "Copy")}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-3">
          <label className="block space-y-2">
            <span className="text-sm font-medium">ULID</span>
            <input
              className={fieldClass}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="01ARZ3NDEKTSV4RRFFQ69G5FAV"
              aria-label={es ? "ULID para decodificar" : "ULID to decode"}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className={buttonClass} onClick={() => setRaw(ex)}>{ex.slice(0, 10)}…</button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{decodeStatus}</p>
          {decoded.status === "ok" ? (
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Fecha UTC" : "UTC time"}</dt>
                <dd className="mt-1 font-mono text-sm font-semibold">{decoded.iso}</dd>
              </div>
              <div className="rounded-xl border border-border p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Aleatorio" : "Randomness"}</dt>
                <dd className="mt-1 break-all font-mono text-sm font-semibold">{decoded.random}</dd>
              </div>
            </dl>
          ) : null}
          {decoded.status === "ok" ? (
            <button type="button" className={buttonClass} onClick={() => copy(decoded.ulid)}>
              {copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar normalizado" : "Copy normalized")}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
