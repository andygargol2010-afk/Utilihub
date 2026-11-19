import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { listAdminReviews, replyToReview } from "@/lib/reviews.functions";
import type { Review } from "@/lib/reviews";

const TOKEN_KEY = "utilihub:admin-reviews-token";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: "Admin · Reviews | UtiliHub" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "description", content: "Private admin tools. Not for public use." },
    ],
  }),
  component: AdminReviewsPage,
});

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function AdminReviewsPage() {
  const [token, setToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [durable, setDurable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(TOKEN_KEY);
      if (saved) {
        setToken(saved);
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const load = useCallback(async (tok: string) => {
    setBusy(true);
    setError(null);
    try {
      const result = await listAdminReviews({ data: { token: tok } });
      if (!result.ok) {
        setUnlocked(false);
        setReviews([]);
        setError(
          result.error === "not_configured"
            ? "REVIEWS_ADMIN_TOKEN is not set on the server (Vercel env)."
            : "Invalid token.",
        );
        return;
      }
      setUnlocked(true);
      setReviews(result.reviews);
      setDurable(result.durable);
      try {
        sessionStorage.setItem(TOKEN_KEY, tok);
      } catch {
        // ignore
      }
    } catch {
      setError("Network error loading reviews.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (unlocked && token) void load(token);
  }, [unlocked, token, load]);

  const onUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    void load(token.trim());
  };

  const onReply = async (reviewId: string) => {
    const text = (drafts[reviewId] || "").trim();
    if (text.length < 2) {
      setStatus((s) => ({ ...s, [reviewId]: "Write at least 2 characters." }));
      return;
    }
    setStatus((s) => ({ ...s, [reviewId]: "Saving…" }));
    try {
      const result = await replyToReview({
        data: { reviewId, text, token },
      });
      if (!result.ok) {
        const msg =
          result.error === "unauthorized"
            ? "Unauthorized"
            : result.error === "not_found"
              ? "Review not found in Redis (seed reviews cannot be replied to)."
              : result.error === "not_configured"
                ? "Token not configured on server"
                : "Could not save";
        setStatus((s) => ({ ...s, [reviewId]: msg }));
        return;
      }
      setStatus((s) => ({ ...s, [reviewId]: "Saved — visible on the public home." }));
      setDrafts((d) => ({ ...d, [reviewId]: "" }));
      await load(token);
    } catch {
      setStatus((s) => ({ ...s, [reviewId]: "Network error" }));
    }
  };

  return (
    <main className="container-page max-w-3xl py-10">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Private</p>
      <h1 className="mt-1 text-3xl font-black">Review admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This page is not linked from the site. Only people who know the URL can open it. Replies require{" "}
        <code className="rounded bg-muted px-1 text-xs">REVIEWS_ADMIN_TOKEN</code> on Vercel.
      </p>

      {!unlocked ? (
        <form onSubmit={onUnlock} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold">Admin token</span>
            <input
              type="password"
              autoComplete="off"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
              placeholder="Paste REVIEWS_ADMIN_TOKEN"
              required
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              Stored reviews: <strong className="text-foreground">{reviews.length}</strong>
            </span>
            <span>·</span>
            <span>{durable ? "Redis connected" : "Memory only (no Redis)"}</span>
            <button
              type="button"
              className="ml-auto text-sm font-semibold text-primary hover:underline"
              onClick={() => void load(token)}
            >
              Refresh
            </button>
            <button
              type="button"
              className="text-sm font-semibold text-muted-foreground hover:underline"
              onClick={() => {
                try {
                  sessionStorage.removeItem(TOKEN_KEY);
                } catch {
                  // ignore
                }
                setUnlocked(false);
                setToken("");
                setReviews([]);
              }}
            >
              Lock
            </button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {reviews.length === 0 && !busy && (
            <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              No user reviews in storage yet. Seed reviews on the home page cannot receive admin replies — only reviews
              submitted by visitors (stored in Redis).
            </p>
          )}

          {reviews.map((r) => (
            <article key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold">
                    {r.name}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      · {r.rating}/5 · {r.locale} · {formatDate(r.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">id: {r.id}</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">{r.status}</span>
              </div>
              <p className="mt-3 text-sm leading-6">{r.text}</p>

              {r.reply?.text ? (
                <div className="mt-3 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5">
                  <p className="text-xs font-bold">
                    UtiliHub <span className="text-primary">Admin</span> · {formatDate(r.reply.createdAt)}
                  </p>
                  <p className="mt-1 text-sm">{r.reply.text}</p>
                </div>
              ) : null}

              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-semibold">{r.reply ? "Edit reply" : "Public reply"}</span>
                <textarea
                  value={drafts[r.id] ?? r.reply?.text ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  rows={3}
                  maxLength={600}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Thanks for the feedback…"
                />
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void onReply(r.id)}
                  className="inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
                >
                  {r.reply ? "Update reply" : "Publish reply"}
                </button>
                {status[r.id] && <span className="text-xs text-muted-foreground">{status[r.id]}</span>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
