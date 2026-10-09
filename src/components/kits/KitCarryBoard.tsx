import { useEffect, useState } from "react";
import { ArrowRight, ClipboardCopy, Link2, RotateCcw } from "lucide-react";
import { publicToolPath } from "@/lib/route-slugs";
import { kitBySlug, kitTools } from "@/lib/work-kits";

export type KitBoardStep = { slug: string; label: string };

type KitCarryBoardProps = {
  kitSlug: string;
  steps: KitBoardStep[];
  locale?: "en" | "es";
};

type StoredBoard = { note?: string; done?: string[] };
type SlipPayload = { note: string; done: string[] };
type SlipStatus = "idle" | "copied" | "pending" | "imported" | "kept" | "invalid";

const storageKey = (slug: string) => `utilihub-kit-board:${slug}`;
const NOTE_LIMIT = 8000;

function stepToolPath(kitSlug: string, stepSlug: string, locale: "en" | "es") {
  const kit = kitBySlug(kitSlug);
  const tool = kit ? kitTools(kit).find((item) => item.slug === stepSlug) : undefined;
  if (!tool) return locale === "es" ? `/es/herramientas/${stepSlug}` : `/tools/${stepSlug}`;
  return publicToolPath(tool, locale);
}

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseSlip(rawHash: string, allowed: string[]): SlipPayload | null {
  const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const params = new URLSearchParams(hash);
  const token = params.get("slip");
  if (!token) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as { note?: unknown; done?: unknown };
    if (typeof parsed.note !== "string" || parsed.note.length > NOTE_LIMIT) return null;
    if (!Array.isArray(parsed.done) || parsed.done.some((item) => typeof item !== "string")) return null;
    const done = parsed.done.filter((item) => allowed.includes(item));
    return { note: parsed.note, done };
  } catch {
    return null;
  }
}

function slipHashPresent(rawHash: string) {
  const hash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  return new URLSearchParams(hash).has("slip");
}

function clearSlipHash() {
  const url = new URL(window.location.href);
  url.hash = "";
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

export function KitCarryBoard({ kitSlug, steps, locale = "en" }: KitCarryBoardProps) {
  const es = locale === "es";
  const stepKey = steps.map((step) => step.slug).join("|");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [allowPersist, setAllowPersist] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slipStatus, setSlipStatus] = useState<SlipStatus>("idle");
  const [pendingSlip, setPendingSlip] = useState<SlipPayload | null>(null);

  useEffect(() => {
    const allowed = stepKey ? stepKey.split("|") : [];
    let loadedNote = "";
    let loadedDone: string[] = [];
    try {
      const raw = localStorage.getItem(storageKey(kitSlug));
      if (raw) {
        const parsed = JSON.parse(raw) as StoredBoard;
        loadedNote = typeof parsed.note === "string" ? parsed.note : "";
        loadedDone = Array.isArray(parsed.done) ? parsed.done.filter((item) => typeof item === "string") : [];
      }
    } catch {
      loadedNote = "";
      loadedDone = [];
    }
    setNote(loadedNote);
    setDone(loadedDone);

    const hash = window.location.hash;
    if (!slipHashPresent(hash)) {
      setPendingSlip(null);
      setSlipStatus("idle");
      setAllowPersist(true);
    } else {
      const payload = parseSlip(hash, allowed);
      if (!payload) {
        setPendingSlip(null);
        setSlipStatus("invalid");
        setAllowPersist(false);
        clearSlipHash();
      } else {
        setPendingSlip(payload);
        setSlipStatus("pending");
        setAllowPersist(false);
      }
    }
    setReady(true);
  }, [kitSlug, stepKey]);

  useEffect(() => {
    if (!ready || !allowPersist) return;
    try {
      localStorage.setItem(storageKey(kitSlug), JSON.stringify({ note, done }));
    } catch {
      /* private mode or quota */
    }
  }, [note, done, ready, allowPersist, kitSlug]);

  const doneCount = steps.filter((step) => done.includes(step.slug)).length;
  const nextStep = steps.find((step) => !done.includes(step.slug));
  const nextHref = nextStep ? stepToolPath(kitSlug, nextStep.slug, locale) : "";

  function toggle(slug: string) {
    setAllowPersist(true);
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

  async function copySlip() {
    const payload = toBase64Url(JSON.stringify({ done, note }));
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#slip=${payload}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(false);
    setSlipStatus("copied");
  }

  function importSlip() {
    if (!pendingSlip) return;
    setNote(pendingSlip.note);
    setDone(pendingSlip.done);
    setPendingSlip(null);
    setAllowPersist(true);
    setSlipStatus("imported");
    clearSlipHash();
  }

  function keepBoard() {
    setPendingSlip(null);
    setSlipStatus("kept");
    clearSlipHash();
  }

  function clearBoard() {
    setAllowPersist(true);
    setNote("");
    setDone([]);
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-border/70 bg-surface/55 p-4 sm:p-5"
      aria-labelledby="kit-carry-board"
      data-kit-slip={slipStatus === "idle" ? undefined : slipStatus}
    >
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
      {slipStatus === "pending" && pendingSlip ? (
        <div className="mt-3 rounded-xl border border-primary/40 bg-accent/50 px-3 py-3 text-sm" role="status">
          <p className="font-semibold">
            {es
              ? "Este enlace trae un slip del kit. ¿Importar checks y nota a esta pizarra?"
              : "This link carries a kit slip. Import checks and note into this board?"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={importSlip} className="rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
              {es ? "Importar slip" : "Import slip"}
            </button>
            <button type="button" onClick={keepBoard} className="rounded-full border border-border px-3 py-1.5 text-sm font-bold">
              {es ? "Conservar la mía" : "Keep mine"}
            </button>
          </div>
        </div>
      ) : null}
      {slipStatus === "invalid" ? (
        <p className="mt-3 rounded-xl border border-border/70 bg-card px-3 py-2 text-sm text-muted-foreground" role="status">
          {es ? "Este enlace de slip no es válido. La pizarra no cambió." : "This slip link is invalid. The board was not changed."}
        </p>
      ) : null}
      {slipStatus === "imported" ? (
        <p className="mt-3 text-sm font-semibold text-primary" role="status">
          {es ? "Slip importado en esta pizarra." : "Slip imported into this board."}
        </p>
      ) : null}
      {slipStatus === "kept" ? (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          {es ? "Se conservó la pizarra de este navegador." : "Kept this browser’s board."}
        </p>
      ) : null}
      <div
        className="mt-3 rounded-xl border border-primary/30 bg-accent/40 px-3 py-2 text-sm"
        data-kit-next-step={ready ? (nextStep ? nextHref : "done") : "pending"}
      >
        {!ready ? (
          <span className="text-muted-foreground">{es ? "Buscando el siguiente paso…" : "Finding the next step…"}</span>
        ) : nextStep ? (
          <a href={nextHref} className="inline-flex items-center gap-1.5 font-bold text-primary">
            {es ? "Siguiente paso" : "Next step"}: {nextStep.label}
            <ArrowRight className="size-4" />
          </a>
        ) : (
          <span className="font-bold">{es ? "Kit listo" : "Kit ready"}</span>
        )}
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {es
          ? "Marca los pasos y pegá aquí el resultado de cada herramienta. Queda en este navegador, sin cuenta. El slip copia el enlace, no la pizarra."
          : "Check steps and paste each tool result here. It stays in this browser, with no account. A slip copies the link, not the board."}
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
        onChange={(event) => {
          setAllowPersist(true);
          setNote(event.target.value);
        }}
        rows={5}
        maxLength={NOTE_LIMIT}
        placeholder={es ? "Pegá conteos, slugs, nombres de archivo…" : "Paste counts, slugs, file names…"}
        className="mt-2 w-full resize-y rounded-xl border border-border/70 bg-card px-3 py-2 text-sm leading-6"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copySlip}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground"
        >
          <Link2 className="size-4" />
          {slipStatus === "copied" ? (es ? "Slip copiado" : "Slip copied") : es ? "Copiar slip" : "Copy slip"}
        </button>
        <button
          type="button"
          onClick={copyNote}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-bold"
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
