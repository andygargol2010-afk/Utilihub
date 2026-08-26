import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { ALL_TOOLS, toolHref } from "@/lib/all-tools";

type Tool = (typeof ALL_TOOLS)[number];
const OPEN_EVENT = "utilihub:open-command-palette";

function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); }
function score(query: string, tool: Tool) {
  const q = normalize(query);
  if (!q) return 0;
  const name = normalize(tool.name), text = `${name} ${normalize(tool.slug)} ${normalize(tool.keywords?.join(" ") || "")}`;
  if (name === q) return 1000;
  if (name.startsWith(q)) return 800 - name.length;
  if (name.includes(q)) return 650 - name.indexOf(q);
  if (text.includes(q)) return 450 - text.indexOf(q);
  let cursor = 0, gaps = 0;
  for (const char of q) { const found = text.indexOf(char, cursor); if (found < 0) return -1; gaps += found - cursor; cursor = found + 1; }
  return 180 - gaps;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false), [query, setQuery] = useState(""), [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => ALL_TOOLS.map((tool) => ({ tool, score: score(query, tool) })).filter((item) => item.score >= 0).sort((a, b) => b.score - a.score).slice(0, 12), [query]);

  useEffect(() => {
    const openPalette = () => setOpen(true);
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); return; }
      if (!open) return;
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
      if (event.key === "ArrowDown") { event.preventDefault(); setSelected((i) => Math.min(i + 1, Math.max(results.length - 1, 0))); return; }
      if (event.key === "ArrowUp") { event.preventDefault(); setSelected((i) => Math.max(i - 1, 0)); return; }
      if (event.key === "Enter" && results[selected]) { event.preventDefault(); window.location.assign(toolHref(results[selected].tool)); }
    };
    window.addEventListener(OPEN_EVENT, openPalette);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener(OPEN_EVENT, openPalette); window.removeEventListener("keydown", onKey); };
  }, [open, results, selected]);

  useEffect(() => { if (open) { setQuery(""); setSelected(0); requestAnimationFrame(() => inputRef.current?.focus()); } }, [open]);
  useEffect(() => setSelected(0), [query]);

  if (!open) return null;
  return <div className="fixed inset-0 z-[100] grid place-items-start bg-black/40 p-4 pt-[10vh] sm:pt-[15vh]" role="dialog" aria-modal="true" aria-label="Buscar herramientas" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
      <div className="flex items-center gap-3 border-b px-4"><Search className="size-5 shrink-0 text-muted-foreground" /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar una herramienta…" className="h-14 min-w-0 flex-1 bg-transparent outline-none" aria-label="Buscar herramienta" autoComplete="off" /></div>
      <div className="max-h-[55vh] overflow-y-auto p-2" role="listbox" aria-label="Resultados de búsqueda">{results.length ? results.map(({ tool }, index) => <button type="button" key={tool.slug} role="option" aria-selected={selected === index} onMouseEnter={() => setSelected(index)} onClick={() => window.location.assign(toolHref(tool))} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left ${selected === index ? "bg-accent" : ""}`}><span className="min-w-0"><span className="block truncate font-semibold">{tool.name}</span><span className="block truncate text-xs text-muted-foreground">{tool.slug}</span></span><span className="ml-3 shrink-0 text-xs text-muted-foreground">{tool.category}</span></button>) : <p className="p-6 text-center text-sm text-muted-foreground">No encontramos herramientas.</p>}</div>
      <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground"><span>↑↓ navegar · Enter abrir · Esc cerrar</span><span className="hidden sm:inline">Ctrl/Cmd + K</span></div>
    </div>
  </div>;
}

export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_EVENT));
