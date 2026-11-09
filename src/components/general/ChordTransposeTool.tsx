import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { CHORD_PRESETS, transposeChart, type NoteStyle, type Spelling } from "@/lib/general/chord-transpose";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

export function ChordTransposeTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [text, setText] = useState(CHORD_PRESETS[0].text);
  const [steps, setSteps] = useState(2);
  const [spelling, setSpelling] = useState<Spelling>("sharp");
  const [style, setStyle] = useState<NoteStyle>("letter");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => transposeChart(text, steps, spelling, style), [text, steps, spelling, style]);

  async function copyResult() {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const status = result.status === "empty"
    ? (es ? "Pegá una progresión." : "Paste a chord chart.")
    : result.status === "partial"
      ? (es ? `Sin mover: ${result.unknown.join(", ")}` : `Left as written: ${result.unknown.join(", ")}`)
      : (es ? "Progresión transportada." : "Chart transposed.");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CHORD_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={buttonClass}
            onClick={() => {
              setText(preset.text);
              setSteps(preset.steps);
              setSpelling(preset.spelling);
            }}
          >
            {es ? preset.labelEs : preset.labelEn}
          </button>
        ))}
      </div>
      <label className="block space-y-1 text-sm">
        <span>{es ? "Progresión" : "Chart"}</span>
        <textarea className={fieldClass} rows={5} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1 text-sm">
          <span>{es ? "Semitonos" : "Semitones"}</span>
          <input className="h-11 w-full rounded-xl border bg-background px-3 text-base" type="number" min={-12} max={12} value={steps} onChange={(e) => setSteps(Number(e.target.value) || 0)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Escritura" : "Spelling"}</span>
          <select className="h-11 w-full rounded-xl border bg-background px-3 text-base" value={spelling} onChange={(e) => setSpelling(e.target.value as Spelling)}>
            <option value="sharp">{es ? "Sostenidos" : "Sharps"}</option>
            <option value="flat">{es ? "Bemoles" : "Flats"}</option>
          </select>
        </label>
        <label className="block space-y-1 text-sm">
          <span>{es ? "Nombres" : "Names"}</span>
          <select className="h-11 w-full rounded-xl border bg-background px-3 text-base" value={style} onChange={(e) => setStyle(e.target.value as NoteStyle)}>
            <option value="letter">C D E</option>
            <option value="solfege">Do Re Mi</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => setSteps((n) => Math.max(-12, n - 1))}>−1</button>
        <button type="button" className={buttonClass} onClick={() => setSteps((n) => Math.min(12, n + 1))}>+1</button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={!result.output}>{copied ? (es ? "Copiado" : "Copied") : (es ? "Copiar" : "Copy")}</button>
        <button type="button" className={buttonClass} onClick={() => { setText(""); setSteps(0); setCopied(false); }}>{es ? "Limpiar" : "Reset"}</button>
      </div>
      <div className="rounded-xl border bg-muted/40 p-3 text-sm">
        <p className="font-medium">{es ? "Cejilla" : "Capo"}: {result.capo}</p>
        <p className="mt-1 whitespace-pre-wrap font-mono text-base">{result.output || (es ? "—" : "—")}</p>
        <p className="mt-2 text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
