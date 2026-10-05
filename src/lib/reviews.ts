export type ReviewReply = {
  text: string;
  createdAt: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  locale: "en" | "es";
  createdAt: number;
  status: "approved" | "pending" | "rejected";
  /** Optional public reply from the site owner (admin only). */
  reply?: ReviewReply;
};

export type PublicReview = Pick<
  Review,
  "id" | "name" | "rating" | "text" | "locale" | "createdAt" | "reply"
>;

export type SubmitReviewInput = {
  name: string;
  rating: number;
  text: string;
  locale: "en" | "es";
  /** Honeypot — must stay empty */
  website?: string;
};

export type ReplyToReviewInput = {
  reviewId: string;
  text: string;
  /** Must match REVIEWS_ADMIN_TOKEN on the server */
  token: string;
};

const BLOCKED = [
  /viagra/i,
  /casino/i,
  /crypto\s*invest/i,
  /https?:\/\//i,
  /\b(seo|backlink|guest\s*post)\b/i,
  /\$\d{2,}/,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /vbscript\s*:/i,
  /\bon\w+\s*=/i,
];

/**
 * Defense-in-depth for user-generated text.
 * React already escapes on render; this strips markup so stored content stays plain text
 * even if a future UI uses dangerouslySetInnerHTML by mistake.
 */
function stripUnsafeMarkup(input: string): string {
  return input
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<\/?[a-zA-Z][^>]*>/g, " ")
    .replace(/[<>]/g, "")
    .replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)/g, "& ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeName(name: string) {
  return stripUnsafeMarkup(name).slice(0, 40) || "Anonymous";
}

export function sanitizeText(text: string) {
  return stripUnsafeMarkup(text).slice(0, 400);
}

export function sanitizeReply(text: string) {
  return stripUnsafeMarkup(text).slice(0, 600);
}

export function validateReview(
  input: SubmitReviewInput,
): { ok: true; data: Omit<Review, "id" | "createdAt" | "status" | "reply"> } | { ok: false; error: string } {
  if (input.website && input.website.trim()) {
    return { ok: false, error: "spam" };
  }
  const name = sanitizeName(input.name || "");
  const text = sanitizeText(input.text || "");
  const rating = Math.round(Number(input.rating));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "rating" };
  }
  if (text.length < 8) {
    return { ok: false, error: "short" };
  }
  if (BLOCKED.some((re) => re.test(text) || re.test(name))) {
    return { ok: false, error: "blocked" };
  }
  const locale = input.locale === "es" ? "es" : "en";
  return { ok: true, data: { name, rating, text, locale } };
}

export function toPublic(review: Review): PublicReview {
  const out: PublicReview = {
    id: review.id,
    name: review.name,
    rating: review.rating,
    text: review.text,
    locale: review.locale,
    createdAt: review.createdAt,
  };
  if (review.reply?.text) {
    out.reply = {
      text: review.reply.text,
      createdAt: review.reply.createdAt,
    };
  }
  return out;
}

/** No fabricated reviews — only real user/server reviews are shown. */
export const SEED_REVIEWS: PublicReview[] = [];
