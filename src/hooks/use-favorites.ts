import { useCallback, useEffect, useState } from "react";

const KEY = "utilihub:favorites";
const EVENT = "utilihub:favorites-changed";
function read(): string[] { try { const raw = localStorage.getItem(KEY); const parsed = raw ? JSON.parse(raw) : []; return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : []; } catch { return []; } }

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setFavorites(read()); setReady(true);
    const sync = () => setFavorites(read());
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) sync(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVENT, sync);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(EVENT, sync); };
  }, []);
  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new Event(EVENT)); } catch { /* localStorage may be unavailable */ }
      return next;
    });
  }, []);
  return { favorites, toggle, ready };
}
