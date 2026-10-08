import { useCallback, useEffect, useState } from "react";

const KEY = "utilihub:recent-tools";
const EVENT = "utilihub:recent-tools-changed";
const LIMIT = 12;

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string").slice(0, LIMIT) : [];
  } catch {
    return [];
  }
}

/** Persist a visit without subscribing. Tool shells call this so they do not hydrate the list. */
export function recordRecentTool(slug: string) {
  if (!slug || typeof window === "undefined") return;
  const prev = read();
  if (prev[0] === slug) return;
  const next = [slug, ...prev.filter((item) => item !== slug)].slice(0, LIMIT);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage may be unavailable */
  }
}

export function useRecentTools() {
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRecent(read());
    setReady(true);
    const sync = () => setRecent(read());
    const onStorage = (event: StorageEvent) => { if (event.key === KEY) sync(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  const addRecent = useCallback((slug: string) => {
    recordRecentTool(slug);
    setRecent(read());
  }, []);

  return { recent, addRecent, ready };
}
