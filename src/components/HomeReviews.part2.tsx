// Part 2 of 3 — split from HomeReviews.tsx on 2026-11-04. Edit here; HomeReviews.tsx re-exports.
import { Star } from "lucide-react";
import type { PublicReview } from "@/lib/reviews";
import { LS_KEY } from "./HomeReviews.part1";

export function readLocalReviews(): PublicReview[] {
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

export function saveLocalReview(review: PublicReview) {
  if (typeof window === "undefined") return;
  const list = readLocalReviews().filter((r) => r.id !== review.id);
  list.unshift(review);
  localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 30)));
}

export function mergeReviews(...groups: PublicReview[][]) {
  const byId = new Map<string, PublicReview>();
  for (const group of groups) {
    for (const r of group) {
      if (r?.id && !byId.has(r.id)) byId.set(r.id, r);
    }
  }
  return [...byId.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export function Stars({
  value,
  onChange,
  interactive,
}: {
  value: number;
  onChange?: (n: number) => void;
  interactive?: boolean;
}) {
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

export function formatDate(ts: number, locale: "en" | "es") {
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

export function AdminReply({ reply, locale }: { reply: NonNullable<PublicReview["reply"]>; locale: "en" | "es" }) {
  const es = locale === "es";
  return (
    <div className="mt-3 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-foreground">UtiliHub</span>
        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          {es ? "Admin" : "Admin"}
        </span>
        <span className="text-[11px] text-muted-foreground">{formatDate(reply.createdAt, locale)}</span>
      </div>
      <p className="mt-1.5 text-sm leading-6 text-foreground/90">{reply.text}</p>
    </div>
  );
}
