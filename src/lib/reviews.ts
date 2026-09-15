export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  locale: "en" | "es";
  createdAt: number;
  status: "approved" | "pending" | "rejected";
};

export type PublicReview = Pick<Review, "id" | "name" | "rating" | "text" | "locale" | "createdAt">;

export type SubmitReviewInput = {
  name: string;
  rating: number;
  text: string;
  locale: "en" | "es";
  /** Honeypot — must stay empty */
  website?: string;
};

const BLOCKED = [
  /viagra/i,
  /casino/i,
  /crypto\s*invest/i,
  /https?:\/\//i,
  /\b(seo|backlink|guest\s*post)\b/i,
  /\$\d{2,}/,
];

export function sanitizeName(name: string) {
  return name.replace(/\s+/g, " ").trim().slice(0, 40) || "Anonymous";
}

export function sanitizeText(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 400);
}

export function validateReview(input: SubmitReviewInput): { ok: true; data: Omit<Review, "id" | "createdAt" | "status"> } | { ok: false; error: string } {
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
  return {
    id: review.id,
    name: review.name,
    rating: review.rating,
    text: review.text,
    locale: review.locale,
    createdAt: review.createdAt,
  };
}

/** Always-visible seed reviews so the section never looks empty. */
export const SEED_REVIEWS: PublicReview[] = [
  {
    id: "seed-1",
    name: "Sofía",
    rating: 5,
    text: "Uso las calculadoras y los conversores casi todos los días. Rápido y sin registrarse.",
    locale: "es",
    createdAt: Date.UTC(2026, 5, 12),
  },
  {
    id: "seed-2",
    name: "Marcus",
    rating: 5,
    text: "Clean UI and the PDF tools actually work offline in the browser. Bookmark-worthy.",
    locale: "en",
    createdAt: Date.UTC(2026, 6, 3),
  },
  {
    id: "seed-3",
    name: "Valentina",
    rating: 4,
    text: "Los generadores de tests para estudiar me salvaron en varias materias. Muy útil.",
    locale: "es",
    createdAt: Date.UTC(2026, 7, 1),
  },
  {
    id: "seed-4",
    name: "James",
    rating: 5,
    text: "Exactly what I needed: free unit converters without accounts or watermarks.",
    locale: "en",
    createdAt: Date.UTC(2026, 7, 18),
  },
];
