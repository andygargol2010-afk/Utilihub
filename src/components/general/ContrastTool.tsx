import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import {
  bodyPreset,
  borderlinePreset,
  computeContrast,
  emptyContrast,
  failPreset,
  formatRatio,
  validateContrast,
  type ContrastInput,
} from "@/lib/general/contrast";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function ContrastTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [draft, setDraft] = useState<ContrastInput>(bodyPreset());
  const [copied, setCopied] = useState(false);
  const issues = useMemo(() => validateContrast(draft, es), [draft, es]);
  const result = useMemo(() => (issues.length ? null : computeContrast(draft)), [draft, issues]);

  function patch(partial: Partial<ContrastInput>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function copyResult() {
    if (!result) return;
    const line = `${result.foreground} on ${result.background} = ${result.ratioLabel}`;
    await navigator.clipboard.writeText(line);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function badge(ok: boolean, label: string) {
    return (
      <span className={`rounded-full border px-2 py-1 text-xs font-medium ${ok ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
        {label}: {ok ? (es ? "pasa" : "pass") : es ? "no" : "fail"}
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setDraft(bodyPreset())}>
          {es ? "Texto cuerpo" : "Body text"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(borderlinePreset())}>
          {es ? "Gris límite AA" : "AA borderline gray"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(failPreset())}>
          {es ? "Rojo que falla" : "Failing red"}
        </button>
        <button type="button" className={buttonClass} onClick={() => setDraft(emptyContrast())}>
          {es ? "Reiniciar" : "Reset"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Color del texto" : "Text color"}</span>
          <input className={inputClass} value={draft.foreground} onChange={(event) => patch({ foreground: event.target.value })} placeholder="#0F172A" />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Color de fondo" : "Background color"}</span>
          <input className={inputClass} value={draft.background} onChange={(event) => patch({ background: event.target.value })} placeholder="#FFFFFF" />
        </label>
      </div>

      {issues.length > 0 ? (
        <ul className="space-y-1 rounded-2xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
          {issues.map((issue) => (
            <li key={`${issue.field}-${issue.message}`}>{issue.message}</li>
          ))}
        </ul>
      ) : result ? (
        <div className="space-y-3 rounded-2xl border p-3">
          <div className="rounded-xl border p-4 text-base font-medium" style={{ color: result.foreground, background: result.background }}>
            {es ? "Vista previa: el texto se lee sobre este fondo." : "Preview: text sits on this background."}
          </div>
          <p className="text-2xl font-semibold">{result.ratioLabel}</p>
          <p className="text-sm text-muted-foreground">
            {es
              ? "Fórmula WCAG: (Lclaro + 0.05) / (Loscuro + 0.05), con luminancia relativa sRGB."
              : "WCAG formula: (Lighter + 0.05) / (Ldarker + 0.05), using sRGB relative luminance."}
          </p>
          <div className="flex flex-wrap gap-2">
            {badge(result.normalAa, es ? "AA normal 4.5" : "AA normal 4.5")}
            {badge(result.normalAaa, es ? "AAA normal 7" : "AAA normal 7")}
            {badge(result.largeAa, es ? "AA grande 3" : "AA large 3")}
            {badge(result.uiAa, es ? "UI 3" : "UI 3")}
          </div>
          {result.suggestion ? (
            <p className="text-sm">
              {es ? "Texto sugerido para AA normal" : "Suggested text for normal AA"}: {result.suggestion}
              {result.suggestionRatio ? ` (${formatRatio(result.suggestionRatio)})` : ""}
            </p>
          ) : (
            <p className="text-sm">{es ? "El texto ya alcanza AA para texto normal (4.5:1)." : "Text already meets AA for normal text (4.5:1)."}</p>
          )}
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
