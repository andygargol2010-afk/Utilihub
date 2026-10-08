import { useEffect, useState } from "react";

type KitDeskTrailProps = {
  kitSlug: string;
  stepCount: number;
  locale?: "en" | "es";
};

type StoredBoard = { note?: string; done?: string[] };

/** Same key as KitCarryBoard so the index can resume a local kit without an account. */
export const kitBoardStorageKey = (slug: string) => `utilihub-kit-board:${slug}`;

export function KitDeskTrail({ kitSlug, stepCount, locale = "en" }: KitDeskTrailProps) {
  const es = locale === "es";
  const [done, setDone] = useState(0);
  const [hasNote, setHasNote] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function read() {
      try {
        const raw = localStorage.getItem(kitBoardStorageKey(kitSlug));
        if (!raw) {
          setDone(0);
          setHasNote(false);
          return;
        }
        const parsed = JSON.parse(raw) as StoredBoard;
        const marks = Array.isArray(parsed.done) ? parsed.done.filter((item) => typeof item === "string") : [];
        setDone(marks.length);
        setHasNote(typeof parsed.note === "string" && parsed.note.trim().length > 0);
      } catch {
        setDone(0);
        setHasNote(false);
      }
    }
    read();
    setReady(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === kitBoardStorageKey(kitSlug)) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [kitSlug]);

  const label = es
    ? hasNote
      ? `${done}/${stepCount} en este navegador · nota`
      : `${done}/${stepCount} en este navegador`
    : hasNote
      ? `${done}/${stepCount} on this browser · note`
      : `${done}/${stepCount} on this browser`;

  return (
    <p
      className="mt-3 text-xs font-semibold text-muted-foreground"
      data-kit-desk-trail={kitSlug}
      data-ready={ready ? "1" : "0"}
    >
      {label}
    </p>
  );
}
