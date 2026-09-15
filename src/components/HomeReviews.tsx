import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";
import { listPublicReviews, submitReview } from "@/lib/reviews.functions";
import type { PublicReview } from "@/lib/reviews";
import { SEED_REVIEWS } from "@/lib/reviews";

const LS_KEY = "utilihub:local-reviews";

function readLocalReviews(): PublicReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PublicReview[];
    return Array.isArray(parsed) ? parsed.filter((r) => r && r.id && r.text) : [];
  } catch {
    return [];
  }
}

function saveLocalReview(review: PublicReview) {
  if (typeof window === "undefined") return;
  const list = readLocalReviews().filter((r) => r.id !== review.id);
  list.unshift(review);
  localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 30)));
}

function mergeReviews(...groups: PublicReview[][]) {
  const byId = new Map<string, PublicReview>();
  for (const group of groups) {
    for (const r of group) {
      if (r?.id && !byId.has(r.id)) byId.set(r.id, r);
    }
  }
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
}

function Stars({ value, onChange, interactive }: { value: number; onChange?: (n: number) => void; interactive?: boolean }) {
  return (
    <div className="flex gap-1" role={interactive ? "radiogroup" : "img"} aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={`rounded p-0.5 ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-checked={interactive ? value === n : undefined}
          role={interactive ? "radio" : undefined}
        >
          <Star className={`size-5 ${n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
        </button>
      ))}
    </div>
  );
}

function formatDate(ts: number, locale: "en" | "es") {
  try {
    return new Date(ts).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function HomeReviews({ locale = "en" }: { locale?: "en" | "es" }) {
  const es = locale === "es";
  const [reviews, setReviews] = useState<PublicReview[]>(() => mergeReviews(SEED_REVIEWS));
  const [durable, setDurable] = useState(true);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const local = readLocalReviews();
    try {
      const result = await listPublicReviews();
      const serverList = result?.reviews ?? [];
      setDurable(Boolean(result?.durable));
      setReviews(mergeReviews(local, serverList, SEED_REVIEWS));
    } catch {
      setReviews(mergeReviews(local, SEED_REVIEWS));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const result = await submitReview({
        data: { name, rating, text, locale, website },
      });
      if (!result.ok) {
        const errors: Record<string, string> = es
          ? {
              spam: "No se pudo enviar.",
              rating: "Elegí una calificación de 1 a 5.",
              short: "Escribí al menos unas palabras (mín. 8 caracteres).",
              blocked: "El texto no pasó la moderación automática.",
              rate: "Llegaste al límite de reseñas por hoy. Probá mañana.",
            }
          : {
              spam: "Could not submit.",
              rating: "Pick a rating from 1 to 5.",
              short: "Write at least a few words (min. 8 characters).",
              blocked: "That text did not pass automatic moderation.",
              rate: "Daily review limit reached. Try again tomorrow.",
            };
        setMessage({ type: "err", text: errors[result.error] ?? (es ? "No se pudo enviar." : "Could not submit.") });
        return;
      }

      // Always keep a copy on this device so reload does not erase it
      saveLocalReview(result.review);
      setDurable(result.durable);
      setReviews((prev) => mergeReviews([result.review], prev, SEED_REVIEWS));

      setMessage({
        type: "ok",
        text: result.durable
          ? es
            ? "¡Gracias! Tu reseña ya está publicada."
            : "Thanks! Your review is live."
          : es
            ? "¡Gracias! Guardamos tu reseña en este dispositivo. Para que la vean todos los visitantes hay que activar Upstash (Redis) en Vercel."
            : "Thanks! Saved on this device. Enable Upstash (Redis) on Vercel so every visitor can see new reviews.",
      });
      setName("");
      setText("");
      setRating(5);
    } catch {
      setMessage({ type: "err", text: es ? "Error de red. Intentá de nuevo." : "Network error. Try again." });
    } finally {
      setBusy(false);
    }
  };

  const visible = reviews.slice(0, 12);

  return (
    <section className="mt-10 border-t border-border/70 py-10" aria-labelledby="reviews-title">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">{es ? "Comunidad" : "Community"}</p>
          <h2 id="reviews-title" className="mt-1 text-2xl font-black sm:text-3xl">
            {es ? "Qué dicen de UtiliHub" : "What people say about UtiliHub"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {es
              ? "Dejá tu opinión sin crear cuenta. Nombre opcional, solo estrellas y un comentario."
              : "Leave feedback with no account. Name optional — just stars and a short comment."}
          </p>
        </div>
      </div>

      {!durable && (
        <p className="mt-4 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-100">
          {es
            ? "Las reseñas nuevas se guardan en tu navegador hasta activar Upstash Redis en Vercel (así quedan visibles para todo el mundo)."
            : "New reviews are kept in your browser until Upstash Redis is enabled on Vercel (so everyone can see them)."}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((review) => (
            <article key={review.id} className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt, locale)}</p>
                </div>
                <Stars value={review.rating} />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{review.text}</p>
            </article>
          ))}
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-primary/20 bg-accent/40 p-5 sm:p-6" noValidate>
          <h3 className="text-lg font-black">{es ? "Escribí tu reseña" : "Write a review"}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {es ? "Sin registro. Máximo unas pocas por día." : "No signup. A few per day max."}
          </p>

          <label className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>

          <label className="mt-4 block space-y-1.5">
            <span className="text-sm font-semibold">{es ? "Nombre (opcional)" : "Name (optional)"}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              placeholder={es ? "Ej. Ana" : "e.g. Alex"}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
            />
          </label>

          <div className="mt-4 space-y-1.5">
            <span className="text-sm font-semibold">{es ? "Calificación" : "Rating"}</span>
            <Stars value={rating} onChange={setRating} interactive />
          </div>

          <label className="mt-4 block space-y-1.5">
            <span className="text-sm font-semibold">{es ? "Comentario" : "Comment"}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={400}
              rows={4}
              required
              placeholder={es ? "¿Qué te resultó útil?" : "What worked well for you?"}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? (es ? "Enviando…" : "Sending…") : es ? "Publicar reseña" : "Post review"}
          </button>

          {message && (
            <p
              role="status"
              className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                message.type === "ok"
                  ? "border border-emerald-300/50 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
