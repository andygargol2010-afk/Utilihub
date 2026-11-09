import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { convertOklch } from "@/lib/general/oklch";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const EXAMPLE = "#0f766e";

export function OklchTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => convertOklch(input), [input]);

  async function copyResult() {
    if (result.status !== "ok") return;
    const text = input.trim().startsWith("#") || /^[0-9a-fA-F]{6}$/.test(input.trim()) ? result.css : result.hex ?? "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const message =
    result.status === "empty"
      ? es
        ? "El campo está vacío. No se inventa un color."
        : "The field is empty. No color is invented."
      : result.status === "invalid"
        ? es
          ? "Usá #rrggbb o oklch(L C H). No se inventa un hex."
          : "Use #rrggbb or oklch(L C H). No hex is invented."
        : result.status === "range"
          ? es
            ? "L debe ir de 0 a 1, C de 0 a 0.4 y H de 0 a 360."
            : "L must be 0 to 1, C 0 to 0.4, and H 0 to 360."
          : result.status === "gamut"
            ? es
              ? "Fuera de la gama sRGB. No se recorta a un hex."
              : "Outside the sRGB gamut. It is not clipped to a hex."
            : null;

  const copyLabel = result.status === "ok" && (input.trim().startsWith("#") || /^[0-9a-fA-F]{6}$/.test(input.trim())) ? result.css : result.status === "ok" ? result.hex : "";

  return (
    <div className="space-y-4">
      <label className="block space-y-2 text-sm">
        <span className="font-medium">{es ? "Hex o oklch()" : "Hex or oklch()"}</span>
        <input className={fieldClass} value={input} onChange={(event) => setInput(event.target.value)} inputMode="text" autoCapitalize="none" spellCheck={false} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setInput(EXAMPLE)}>
          {es ? "Ejemplo" : "Example"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setInput("")}>
          {es ? "Reiniciar" : "Reset"}
        </button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={result.status !== "ok"}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {result.status === "ok" ? (
        <div className="space-y-3 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-xl border" style={{ background: result.hex }} />
            <div>
              <p className="font-mono text-base">{result.hex}</p>
              <p className="font-mono text-sm text-muted-foreground">{result.css}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{es ? "Se copia" : "Copy sends"}: {copyLabel}</p>
        </div>
      ) : null}
    </div>
  );
}
