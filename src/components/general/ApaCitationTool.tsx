import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { APA_PRESETS, buildCitation, type CitationInput, type CitationKind } from "@/lib/general/apa-citation";

type Locale = "en" | "es";

const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";
const fieldClass = "h-11 w-full rounded-xl border bg-background px-3 text-base";

const EMPTY: CitationInput = {
  kind: "webpage",
  authors: "",
  year: "",
  month: "",
  day: "",
  title: "",
  container: "",
  volume: "",
  issue: "",
  pages: "",
  url: "",
};

export function ApaCitationTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [input, setInput] = useState<CitationInput>(APA_PRESETS[0].input);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildCitation(input, es), [input, es]);

  function patch(partial: Partial<CitationInput>) {
    setInput((prev) => ({ ...prev, ...partial }));
  }

  async function copyResult() {
    if (result.status !== "ok") return;
    await navigator.clipboard.writeText(result.citation);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const containerLabel =
    input.kind === "book" ? (es ? "Editorial" : "Publisher") : input.kind === "journal" ? (es ? "Revista" : "Journal") : es ? "Sitio" : "Site name";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["webpage", "book", "journal"] as CitationKind[]).map((kind) => (
          <button key={kind} type="button" className={buttonClass} aria-pressed={input.kind === kind} onClick={() => patch({ kind })}>
            {kind === "webpage" ? (es ? "Web" : "Webpage") : kind === "book" ? (es ? "Libro" : "Book") : es ? "Artículo" : "Journal"}
          </button>
        ))}
        {APA_PRESETS.map((preset) => (
          <button key={preset.id} type="button" className={buttonClass} onClick={() => setInput(preset.input)}>
            {preset.id === "web" ? (es ? "Ejemplo web" : "Web example") : es ? "Ejemplo libro" : "Book example"}
          </button>
        ))}
        <button type="button" className={buttonClass} onClick={() => setInput(EMPTY)}>
          {es ? "Reiniciar" : "Reset"}
        </button>
        <button type="button" className={buttonClass} onClick={copyResult} disabled={result.status !== "ok"}>
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar" : "Copy"}
        </button>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">{es ? "Autores (uno por línea o con ;)" : "Authors (one per line or ; )"}</span>
        <textarea
          className="min-h-24 w-full rounded-xl border bg-background px-3 py-2 text-base"
          value={input.authors}
          placeholder={es ? "García Márquez, Gabriel" : "García Márquez, Gabriel"}
          onChange={(e) => patch({ authors: e.target.value })}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">{es ? "Año" : "Year"}</span>
          <input className={fieldClass} inputMode="numeric" value={input.year} onChange={(e) => patch({ year: e.target.value })} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">{es ? "Mes (1-12)" : "Month (1-12)"}</span>
          <input className={fieldClass} inputMode="numeric" value={input.month} onChange={(e) => patch({ month: e.target.value })} />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">{es ? "Día" : "Day"}</span>
          <input className={fieldClass} inputMode="numeric" value={input.day} onChange={(e) => patch({ day: e.target.value })} />
        </label>
      </div>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">{es ? "Título" : "Title"}</span>
        <input className={fieldClass} value={input.title} onChange={(e) => patch({ title: e.target.value })} />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">{containerLabel}</span>
        <input className={fieldClass} value={input.container} onChange={(e) => patch({ container: e.target.value })} />
      </label>
      {input.kind === "journal" ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{es ? "Volumen" : "Volume"}</span>
            <input className={fieldClass} value={input.volume} onChange={(e) => patch({ volume: e.target.value })} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{es ? "Número" : "Issue"}</span>
            <input className={fieldClass} value={input.issue} onChange={(e) => patch({ issue: e.target.value })} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">{es ? "Páginas" : "Pages"}</span>
            <input className={fieldClass} value={input.pages} onChange={(e) => patch({ pages: e.target.value })} />
          </label>
        </div>
      ) : null}
      {input.kind !== "book" ? (
        <label className="block space-y-1 text-sm">
          <span className="text-muted-foreground">URL / DOI</span>
          <input className={fieldClass} value={input.url} onChange={(e) => patch({ url: e.target.value })} />
        </label>
      ) : null}
      {result.status === "empty" ? (
        <p className="text-sm text-muted-foreground">{es ? "El título es obligatorio. Sin año se usa s. f." : "Title is required. A missing year becomes n.d."}</p>
      ) : (
        <div className="rounded-xl border p-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{es ? "Referencia APA 7" : "APA 7 reference"}</p>
          <p className="mt-1 text-sm leading-6">{result.citation}</p>
          {result.warning ? (
            <p className="mt-2 text-xs text-muted-foreground">{es ? "La URL no traía https://. Se añadió un esquema." : "The URL had no https:// scheme. One was added."}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
