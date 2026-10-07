import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { CHMOD_PRESETS, parseChmod, triadLabel } from "@/lib/general/chmod";

type Locale = "en" | "es";

const inputClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function ChmodTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(CHMOD_PRESETS.public);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => parseChmod(raw), [raw]);

  const statusText = (() => {
    if (result.status === "empty") return es ? "Escribí un modo octal o simbólico." : "Enter an octal or symbolic mode.";
    if (result.status === "invalid") return es ? "Usá octal 0–7 (755), rwxr-xr-x, o u=rwx,g=rx,o=rx." : "Use octal 0–7 (755), rwxr-xr-x, or u=rwx,g=rx,o=rx.";
    return es ? "Modo válido. No se modifica ningún archivo." : "Valid mode. No file is changed.";
  })();

  const specials = [
    result.setuid ? (es ? "setuid" : "setuid") : "",
    result.setgid ? "setgid" : "",
    result.sticky ? "sticky" : "",
  ].filter(Boolean);

  const summary = result.status === "ok"
    ? [
        `${es ? "Octal" : "Octal"}: ${result.octal}`,
        `${es ? "Simbólico" : "Symbolic"}: ${result.symbolic}`,
        `${es ? "Dueño" : "Owner"}: ${triadLabel(result.owner, es)}`,
        `${es ? "Grupo" : "Group"}: ${triadLabel(result.group, es)}`,
        `${es ? "Otros" : "Others"}: ${triadLabel(result.other, es)}`,
        `${es ? "Especiales" : "Special"}: ${specials.length ? specials.join(", ") : es ? "ninguno" : "none"}`,
        statusText,
      ].join("\n")
    : "";

  async function copyResult() {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span className="font-medium">{es ? "Modo chmod" : "Chmod mode"}</span>
        <input
          className={inputClass}
          value={raw}
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={es ? "755, rwxr-xr-x o u=rwx,g=rx,o=rx" : "755, rwxr-xr-x, or u=rwx,g=rx,o=rx"}
          onChange={(event) => setRaw(event.target.value)}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setRaw(CHMOD_PRESETS.public)}>{es ? "Público 755" : "Public 755"}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw(CHMOD_PRESETS.private)}>{es ? "Privado 640" : "Private 640"}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw(CHMOD_PRESETS.sticky)}>{es ? "Sticky 1777" : "Sticky 1777"}</button>
        <button type="button" className={buttonClass} onClick={() => setRaw("")}>{es ? "Limpiar" : "Reset"}</button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={!summary}>{copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar" : "Copy")}</button>
      </div>
      <p className="text-sm text-muted-foreground">{statusText}</p>
      {result.status === "ok" ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Octal" : "Octal"}</dt>
            <dd className="font-mono text-lg">{result.octal}</dd>
          </div>
          <div className="rounded-xl border p-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Simbólico" : "Symbolic"}</dt>
            <dd className="font-mono text-lg">{result.symbolic}</dd>
          </div>
          <div className="rounded-xl border p-3 sm:col-span-2">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Quién puede qué" : "Who can do what"}</dt>
            <dd className="mt-1 text-sm">
              {es ? "Dueño" : "Owner"}: {triadLabel(result.owner, es)}. {es ? "Grupo" : "Group"}: {triadLabel(result.group, es)}. {es ? "Otros" : "Others"}: {triadLabel(result.other, es)}.
              {specials.length ? ` ${es ? "Especiales" : "Special"}: ${specials.join(", ")}.` : ""}
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
