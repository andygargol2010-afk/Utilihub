import { useCallback, useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isToolPath(pathname: string) {
  return pathname.startsWith("/herramientas/") || pathname.startsWith("/finanzas/") || pathname.startsWith("/educacion/");
}

function readParams() {
  if (typeof window === "undefined") return {};
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

function getFields(): Field[] {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll<Field>("main input, main select, main textarea"));
}

function ensureFieldNames(fields: Field[]) {
  fields.forEach((field, index) => {
    if (!field.name) field.name = field.id || `param${index + 1}`;
  });
}

function setNativeValue(field: Field, value: string) {
  const prototype = Object.getPrototypeOf(field) as { value?: unknown };
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  if (descriptor?.set) descriptor.set.call(field, value);
  else field.value = value;
}

function restoreParams(params: Record<string, string>) {
  const fields = getFields();
  ensureFieldNames(fields);
  for (const [name, value] of Object.entries(params)) {
    const field = fields.find((candidate) => candidate.name === name);
    if (!field) continue;
    setNativeValue(field, value);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export function useShareableParams() {
  const { pathname } = useLocation();
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined" || !isToolPath(pathname)) return;
    const initial = readParams();
    setParams(initial);
    const frame = window.requestAnimationFrame(() => restoreParams(initial));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !isToolPath(pathname)) return;

    const update = (event: Event) => {
      const target = event.target as Field | null;
      if (!target || !target.matches("input, select, textarea")) return;
      const fields = getFields();
      ensureFieldNames(fields);
      if (!target.name) return;

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

  return { params, share };
}
