import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { shiftSrt } from "@/lib/general/srt-offset";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const DELAY_EXAMPLE = "1\n00:00:01,000 --> 00:00:03,000\nHello there";
const ADVANCE_EXAMPLE = "1\n00:00:01,000 --> 00:00:03,000\nHello there";

export function SrtOffsetTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [raw, setRaw] = useState(DELAY_EXAMPLE);
  const [offset, setOffset] = useState("1500");
  const [copied, setCopied] = useState(false);
  const parsed = Number(offset);
  const result = useMemo(() => shiftSrt(raw, parsed), [raw, parsed]);

  async function copyResult() {
    if (result.status !== "ok") return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const message =
    result.status === "ok"
      ? es
        ? `${result.cues} cue${result.cues === 1 ? "" : "s"} desplazado${result.cues === 1 ? "" : "s"}.`
        : `${result.cues} cue${result.cues === 1 ? "" : "s"} shifted.`
      : result.status === "empty"
        ? es
          ? "Vacío no inventa un archivo."
          : "Empty input does not invent a file."
        : result.status === "negative"
          ? es
            ? "El desfase dejaría un tiempo bajo cero. No se recorta en silencio."
            : "The offset would drop a time below zero. It is not silently clamped."
          : result.status === "too-big"
            ? es
              ? "Demasiado largo. Máximo 400 cues o 200 000 caracteres."
              : "Too long. Maximum 400 cues or 200,000 characters."
            : es
              ? "Cue inválido. Hace falta un sello HH:MM:SS,mmm y una línea de texto."
              : "Invalid cue. A HH:MM:SS,mmm stamp and a text line are required.";

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Subtítulos SRT" : "SRT subtitles"}</span>
        <textarea
          className={fieldClass}
          rows={8}
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          spellCheck={false}
          placeholder={es ? "Pegá cues SubRip" : "Paste SubRip cues"}
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Desfase (ms)" : "Offset (ms)"}</span>
        <input
          className={fieldClass}
          inputMode="numeric"
          value={offset}
          onChange={(event) => setOffset(event.target.value)}
          aria-label={es ? "Desfase en milisegundos" : "Offset in milliseconds"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => { setRaw(DELAY_EXAMPLE); setOffset("1500"); }}>
          {es ? "Retraso 1,5 s" : "Delay 1.5 s"}
        </button>
        <button type="button" className={buttonClass} onClick={() => { setRaw(ADVANCE_EXAMPLE); setOffset("-500"); }}>
          {es ? "Adelanto 0,5 s" : "Advance 0.5 s"}
        </button>
        <button type="button" className={buttonClass} onClick={() => { setRaw(""); setOffset("0"); }}>
          {es ? "Limpiar" : "Clear"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      {result.status === "ok" ? (
        <div className="space-y-3 rounded-xl border p-4">
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm">{result.output}</pre>
          <button type="button" className={buttonClass} onClick={copyResult}>
            {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
