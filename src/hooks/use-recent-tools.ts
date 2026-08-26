import { useCallback, useEffect, useState } from "react";

const KEY = "utilihub:recent-tools";
const EVENT = "utilihub:recent-tools-changed";
const LIMIT = 8;

type RecentTool = { slug: string; name: string; visitedAt: number };

function read(): RecentTool[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v): v is RecentTool => v && typeof v.slug === "string" && typeof v.name === "string" && Number.isFinite(v.visitedAt))
      .sort((a, b) => b.visitedAt - a.visitedAt)
      .slice(0, LIMIT);
  } catch {
    return [];
  }
}

export function useRecentTools() {
  const [recent, setRecent] = useState<RecentTool[]>([]);
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

  const record = useCallback((tool: { slug: string; name: string }) => {
    setRecent((prev) => {
      const next = [{ slug: tool.slug, name: tool.name, visitedAt: Date.now() }, ...prev.filter((item) => item.slug !== tool.slug)].slice(0, LIMIT);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT));
      } catch { /* localStorage may be unavailable */ }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(KEY);
      window.dispatchEvent(new Event(EVENT));
    } catch { /* localStorage may be unavailable */ }
  }, []);

  return { recent, ready, record, clear };
}
