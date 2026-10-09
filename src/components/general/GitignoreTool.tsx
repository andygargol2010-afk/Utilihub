import { useMemo, useState } from "react";
import type { GeneralTool } from "@/lib/general/types";
import { buildGitignore, type GitignoreStackId } from "@/lib/general/gitignore";

type Locale = "en" | "es";

const fieldClass = "w-full rounded-xl border bg-background px-3 py-3 text-base";
const buttonClass = "h-11 rounded-xl border px-3 text-sm font-medium hover:bg-muted";

const STACKS: ReadonlyArray<{ id: GitignoreStackId; en: string; es: string }> = [
  { id: "node", en: "Node", es: "Node" },
  { id: "python", en: "Python", es: "Python" },
  { id: "macos", en: "macOS", es: "macOS" },
  { id: "vscode", en: "VS Code", es: "VS Code" },
  { id: "next", en: "Next.js", es: "Next.js" },
];

export function GitignoreTool({ locale = "en" }: { tool: GeneralTool; locale?: Locale }) {
  const es = locale === "es";
  const [selected, setSelected] = useState<GitignoreStackId[]>(["node", "macos"]);
  const [extra, setExtra] = useState("");
  const [comments, setComments] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => buildGitignore(selected, extra, comments), [selected, extra, comments]);

  function toggle(id: GitignoreStackId) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function copyResult() {
    if (result.status !== "ok") return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{es ? "Stacks" : "Stacks"}</legend>
        <div className="flex flex-wrap gap-2">
          {STACKS.map((stack) => (
            <label key={stack.id} className="flex h-11 items-center gap-2 rounded-xl border px-3 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(stack.id)}
                onChange={() => toggle(stack.id)}
              />
              {es ? stack.es : stack.en}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={comments} onChange={(e) => setComments(e.target.checked)} />
        {es ? "Incluir comentarios" : "Include comments"}
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium">{es ? "Patrones extra" : "Extra patterns"}</span>
        <textarea
          className={fieldClass}
          rows={4}
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          spellCheck={false}
          placeholder={es ? "Una línea por patrón" : "One pattern per line"}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} onClick={() => { setSelected(["node", "macos"]); setExtra(""); }}>
          Node + macOS
        </button>
        <button type="button" className={buttonClass} onClick={() => { setSelected(["python", "vscode"]); setExtra(""); }}>
          Python + VS Code
        </button>
        <button type="button" className={buttonClass} onClick={() => { setSelected([]); setExtra(""); }}>
          {es ? "Limpiar" : "Clear"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        {result.status === "ok"
          ? es
            ? `${result.lines.length} patrones, sin líneas repetidas.`
            : `${result.lines.length} patterns, duplicate lines collapsed.`
          : es
            ? "Elegí un stack o un patrón. Vacío no inventa un archivo."
            : "Pick a stack or a pattern. Empty input does not invent a file."}
      </p>
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
