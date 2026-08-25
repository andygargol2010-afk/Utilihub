import { useCallback, useEffect, useState } from "react";

function isToolPath(pathname: string) {
  return pathname.startsWith("/herramientas/") || pathname.startsWith("/finanzas/") || pathname.startsWith("/educacion/");
}

function readParams() {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

export function useShareableParams() {
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isToolPath(window.location.pathname)) return;
    const initial = readParams();
    setParams(initial);
    for (const [name, value] of Object.entries(initial)) {
      const field = document.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${CSS.escape(name)}"]`);
      if (!field) continue;
      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isToolPath(window.location.pathname)) return;
    const update = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
      if (!target?.name) return;
      const next = new URL(window.location.href);
      if (target.value === "") next.searchParams.delete(target.name);
      else next.searchParams.set(target.name, target.value);
      window.history.replaceState(window.history.state, "", next);
      setParams(Object.fromEntries(next.searchParams.entries()));
    };
    document.addEventListener("input", update, true);
    document.addEventListener("change", update, true);
    return () => {
      document.removeEventListener("input", update, true);
      document.removeEventListener("change", update, true);
    };
  }, []);

  const share = useCallback(async () => {
    if (typeof window === "undefined") return false;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { params, share };
}
