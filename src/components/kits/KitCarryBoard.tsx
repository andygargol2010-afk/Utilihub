import { useEffect, useState } from "react";
import { ClipboardCopy, RotateCcw } from "lucide-react";

export type KitBoardStep = { slug: string; label: string };

type KitCarryBoardProps = {
  kitSlug: string;
  steps: KitBoardStep[];
  locale?: "en" | "es";
};

type StoredBoard = { note?: string; done?: string[] };

const storageKey = (slug: string) => `utilihub-kit-board:${slug}`;

export function KitCarryBoard({ kitSlug, steps, locale = "en" }: KitCarryBoardProps) {
  const es = locale === "es";
  const [note, setNote] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(kitSlug));
      if (raw) {
        const parsed = JSON.parse(raw) as StoredBoard;
        setNote(typeof parsed.note === "string" ? parsed.note : "");
        setDone(Array.isArray(parsed.done) ? parsed.done.filter((item) => typeof item === "string") : []);
      } else {
        setNote("");
        setDone([]);
      }
    } catch {
      setNote("");
      setDone([]);
    }
    setReady(true);
  }, [kitSlug]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey(kitSlug), JSON.stringify({ note, done }));
    } catch {
      /* private mode or quota */
    }
  }, [note, done, ready, kitSlug]);

  const doneCount = steps.filter((step) => done.includes(step.slug)).length;

  function toggle(slug: string) {
    setDone((prev) => (prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]));
  }

  async function copyNote() {
    if (!note.trim()) return;
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  function clearBoard() {
    setNote("");
    setDone([]);
  }

  return (
    <section className="mt-8 rounded-2xl border border-border/70 bg-surface/55 p-4 sm:p-5" aria-labelledby="kit-carry-board">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
            {es ? "Pizarra del kit" : "Kit board"}
          </p>
          <h2 id="kit-carry-board" className="mt-1 text-lg font-black">
            {es ? "Llevá el trabajo entre pasos" : "Carry work between steps"}
          </h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {doneCount}/{steps.length} {es ? "hechos" : "done"}
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {es
          ? "Marca los pasos y pegá aquí el resultado de cada herramienta. Queda en este navegador, sin cuenta."
          : "Check steps and paste each tool result here. It stays in this browser, with no account."}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {steps.map((step, index) => {
          const checked = done.includes(step.slug);
          return (
            <li key={step.slug}>
              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                  checked={checked}
                  onChange={() => toggle(step.slug)}
                />
                <span className={checked ? "text-muted-foreground line-through" : "font-medium"}>
                  <span className="mr-1 text-xs font-bold text-primary">{index + 1}.</span>
                  {step.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <label className="mt-4 block text-sm font-bold" htmlFor="kit-carry-note">
        {es ? "Nota para el siguiente paso" : "Note for the next step"}
      </label>
      <textarea
        id="kit-carry-note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={5}
        maxLength={8000}
        placeholder={es ? "Pegá conteos, slugs, nombres de archivo…" : "Paste counts, slugs, file names…"}
        className="mt-2 w-full resize-y rounded-xl border border-border/70 bg-card px-3 py-2 text-sm leading-6"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyNote}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground"
        >
          <ClipboardCopy className="size-4" />
          {copied ? (es ? "Copiado" : "Copied") : es ? "Copiar nota" : "Copy note"}
        </button>
        <button
          type="button"
          onClick={clearBoard}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold"
        >
          <RotateCcw className="size-4" />
          {es ? "Vaciar pizarra" : "Clear board"}
        </button>
      </div>
    </section>
  );
}
