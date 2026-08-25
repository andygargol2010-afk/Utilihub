import { useCallback, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isToolPath(pathname: string) {
  return pathname.startsWith("/herramientas/") || pathname.startsWith("/finanzas/") || pathname.startsWith("/educacion/");
}

function readParams() {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

/** Only explicitly marked controls participate in shareable URLs. */
function getShareableFields(): Field[] {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll<Field>("main [data-share-param]"));
}

function paramName(field: Field) {
  return field.getAttribute("data-share-param") || field.name || field.id || "";
}

function setNativeValue(field: Field, value: string) {
  const prototype = Object.getPrototypeOf(field) as { value?: unknown };
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  if (descriptor?.set) descriptor.set.call(field, value);
  else field.value = value;
}

function restoreParams(params: Record<string, string>) {
  for (const field of getShareableFields()) {
    const name = paramName(field);
    if (!name || !(name in params)) continue;
    setNativeValue(field, params[name]);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export function useShareableParams() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !isToolPath(pathname)) return;
    const initial = readParams();
    const frame = window.requestAnimationFrame(() => restoreParams(initial));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !isToolPath(pathname)) return;

    const update = (event: Event) => {
      const target = event.target as Field | null;
      if (!target || !target.matches("input, select, textarea")) return;
      if (!target.hasAttribute("data-share-param")) return;
      const name = paramName(target);
      if (!name) return;

      const next = new URL(window.location.href);
      if (target.value === "") next.searchParams.delete(name);
      else next.searchParams.set(name, target.value);
      window.history.replaceState(window.history.state, "", next);
    };

    document.addEventListener("input", update, true);
    document.addEventListener("change", update, true);
    return () => {
      document.removeEventListener("input", update, true);
      document.removeEventListener("change", update, true);
    };
  }, [pathname]);

  const share = useCallback(async () => {
    if (typeof window === "undefined") return false;
    try {
      await navigator.clipboard.writeText(window.location.href);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { share };
}
