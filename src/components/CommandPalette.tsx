import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { ALL_TOOLS } from "@/lib/all-tools";

function score(query: string, text: string) {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t.includes(q)) return 100 - t.indexOf(q);
  let qi = 0;
  let gaps = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
    else if (qi > 0) gaps++;
  }
  return qi === q.length ? 50 - gaps : -1;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => ALL_TOOLS.map((tool) => ({ tool, score: score(query, `${tool.name} ${tool.slug} ${tool.keywords?.join(" ") || ""}`) })).filter((x) => x.score >= 0).sort((a, b) => b.score - a.score).slice(0, 12), [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (!open) return;
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key === "ArrowDown") { event.preventDefault(); setSelected((i) => Math.min(i + 1, Math.max(results.length - 1, 0))); }
      if (event.key === "ArrowUp") { event.preventDefault(); setSelected((i) => Math.max(i - 1, 0)); }
      if (event.key === "Enter" && results[selected]) { event.preventDefault(); window.location.href = results[selected].tool.category === "finanzas" ? `/finanzas/${results[selected].tool.slug}` : `/herramientas/${results[selected].tool.slug}`; setOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selected]);

  useEffect(() => { if (open) { setQuery(""); setSelected(0); requestAnimationFrame(() => inputRef.current?.focus()); } }, [open]);
  useEffect(() => setSelected(0), [query]);

  if (!open) return null;
  return <div className="fixed inset-0 z-[100] grid place-items-start bg-black/40 p-4 pt-[15vh]" role="dialog" aria-modal="true" aria-label="Buscar herramientas" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
      <div className="flex items-center gap-3 border-b px-4"><Search className="size-5 text-muted-foreground"/><input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar una herramienta…" className="h-14 flex-1 bg-transparent outline-none" aria-label="Buscar herramienta"/></div>
      <div className="max-h-[55vh] overflow-y-auto p-2">{results.length ? results.map(({ tool }, index) => <button type="button" key={tool.slug} onMouseEnter={() => setSelected(index)} onClick={() => { window.location.href = tool.category === "finanzas" ? `/finanzas/${tool.slug}` : `/herramientas/${tool.slug}`; setOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left ${selected === index ? "bg-accent" : ""}`}><span><span className="block font-semibold">{tool.name}</span><span className="text-xs text-muted-foreground">{tool.slug}</span></span><span className="text-xs text-muted-foreground">{tool.category}</span></button>) : <p className="p-6 text-center text-sm text-muted-foreground">No encontramos herramientas.</p>}</div>
      <div className="border-t px-4 py-2 text-xs text-muted-foreground">↑↓ navegar · Enter abrir · Esc cerrar</div>
    </div>
  </div>;
}
