import { useCallback, useEffect, useState } from "react";

function isToolPath(pathname: string) { return pathname.startsWith("/herramientas/") || pathname.startsWith("/finanzas/") || pathname.startsWith("/educacion/"); }
function readParams() { if (typeof window === "undefined") return {}; return Object.fromEntries(new URLSearchParams(window.location.search).entries()); }
function ensureFieldNames() { const fields = Array.from(document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")); fields.forEach((field, index) => { if (!field.name) field.name = field.id || `param${index + 1}`; }); return fields; }

export function useShareableParams() {
  const [params, setParams] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!isToolPath(window.location.pathname)) return;
    const initial = readParams(); const fields = ensureFieldNames(); setParams(initial);
    for (const [name, value] of Object.entries(initial)) { const field = fields.find((candidate) => candidate.name === name); if (!field) continue; field.value = value; field.dispatchEvent(new Event("input", { bubbles: true })); field.dispatchEvent(new Event("change", { bubbles: true })); }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || !isToolPath(window.location.pathname)) return;
    const update = (event: Event) => { const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null; if (!target) return; if (!target.name) target.name = target.id || `param${Array.from(document.querySelectorAll("input, select, textarea")).indexOf(target) + 1}`; const next = new URL(window.location.href); if (target.value === "") next.searchParams.delete(target.name); else next.searchParams.set(target.name, target.value); window.history.replaceState(window.history.state, "", next); setParams(Object.fromEntries(next.searchParams.entries())); };
    document.addEventListener("input", update, true); document.addEventListener("change", update, true); return () => { document.removeEventListener("input", update, true); document.removeEventListener("change", update, true); };
  }, []);
  const share = useCallback(async () => { if (typeof window === "undefined") return false; try { await navigator.clipboard.writeText(window.location.href); return true; } catch { return false; } }, []);
  return { params, share };
}
