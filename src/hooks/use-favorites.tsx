import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const KEY = "utilihub:favorites";
const EVENT = "utilihub:favorites-changed";

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

type FavoritesValue = {
  favorites: string[];
  toggle: (slug: string) => void;
  ready: boolean;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

/**
 * One localStorage read and one listener pair for the whole tree.
 * Listing cards used to each mount useFavorites(), so a category page paid
 * N JSON parses and 2N window listeners during hydration.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setFavorites(read());
    };
    // Same-tab updates go through setState. storage covers other tabs.
    // EVENT stays dispatched so any external listener keeps working, without
    // a second React commit on the click that just toggled.
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new Event(EVENT));
      } catch {
        /* localStorage may be unavailable */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ favorites, toggle, ready }), [favorites, toggle, ready]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

const EMPTY: FavoritesValue = {
  favorites: [],
  toggle: () => {},
  ready: false,
};

export function useFavorites(): FavoritesValue {
  return useContext(FavoritesContext) ?? EMPTY;
}
