import { useCallback, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
function isToolPath(pathname: string) { return pathname.startsWith("/herramientas/") || pathname.startsWith("/finanzas/") || pathname.startsWith("/educacion/"); }
function readParams() { if (typeof window === "undefined") return {}; return Object.fromEntries(new URLSearchParams(window.location.search).entries()); }
function getShareableFields(): Field[] { if (typeof document === "undefined") return []; return Array.from(document.querySelectorAll<Field>("main [data-share-param]")); }
function paramName(field: Field) { return field.getAttribute("data-share-param") || field.name || field.id || ""; }
function setNativeValue(field: Field, value: string) { const prototype = Object.getPrototypeOf(field) as { value?: unknown }; const descriptor = Object.getOwnPropertyDescriptor(prototype, "value"); if (descriptor?.set) descriptor.set.call(field, value); else field.value = value; }
function restoreParams(params: Record<string, string>) { for (const field of getShareableFields()) { const name = paramName(field); if (!name || !(name in params)) continue; setNativeValue(field, params[name]); field.dispatchEvent(new Event("input", { bubbles: true })); field.dispatchEvent(new Event("change", { bubbles: true })); } }

export function useShareableParams() {
  const { pathname } = useLocation();
  useEffect(() => { if (typeof window === "undefined" || !isToolPath(pathname)) return; const frame = window.requestAnimationFrame(() => restoreParams(readParams())); return () => window.cancelAnimationFrame(frame); }, [pathname]);
  useEffect(() => {
    if (typeof window === "undefined" || !isToolPath(pathname)) return;
    const update = (event: Event) => { const target = event.target as Field | null; if (!target || !target.matches("input, select, textarea") || !target.hasAttribute("data-share-param")) return; const name = paramName(target); if (!name) return; const next = new URL(window.location.href); if (target.value === "") next.searchParams.delete(name); else next.searchParams.set(name, target.value); window.history.replaceState(window.history.state, "", next); };
    document.addEventListener("input", update, true); document.addEventListener("change", update, true);
    return () => { document.removeEventListener("input", update, true); document.removeEventListener("change", update, true); };
  }, [pathname]);

  const share = useCallback(async () => {
    if (typeof window === "undefined") return false;
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: document.title, url }); return true; }
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); return true; }
      const textarea = document.createElement("textarea"); textarea.value = url; textarea.setAttribute("readonly", ""); textarea.style.position = "fixed"; textarea.style.opacity = "0"; document.body.appendChild(textarea); textarea.select(); const copied = document.execCommand("copy"); textarea.remove(); return copied;
    } catch { return false; }
  }, []);
  return { share };
}
