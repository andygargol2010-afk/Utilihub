import { createServerFn } from "@tanstack/react-start";
import {
  SEED_REVIEWS,
  sanitizeReply,
  toPublic,
  validateReview,
  type PublicReview,
  type ReplyToReviewInput,
  type Review,
  type SubmitReviewInput,
} from "./reviews";

function newId() {
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function getStore() {
  return import("./reviews-store.server");
}

async function clientFingerprint(): Promise<string> {
  try {
    const mod = await import("@tanstack/react-start/server");
    const getRequest = (mod as { getRequest?: () => Request }).getRequest;
    if (typeof getRequest === "function") {
      const req = getRequest();
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";
      const ua = req.headers.get("user-agent") || "";
      const { hashClient } = await getStore();
      return hashClient(ip, ua);
    }
  } catch {
    // ignore
  }
  const { hashClient } = await getStore();
  return hashClient("unknown", "unknown");
}

function isDurable() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function adminTokenConfigured() {
  return Boolean(process.env.REVIEWS_ADMIN_TOKEN?.trim());
}

function verifyAdminToken(token: string | undefined): boolean {
  const expected = process.env.REVIEWS_ADMIN_TOKEN?.trim();
  if (!expected || !token) return false;
  // Constant-time-ish compare for typical secret lengths
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}

export const listPublicReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ reviews: PublicReview[]; durable: boolean }> => {
    const { listStoredReviews } = await getStore();
    const stored = await listStoredReviews();
    const approved = stored.filter((r) => r.status === "approved").map(toPublic);
    const byId = new Map<string, PublicReview>();
    for (const r of [...approved, ...SEED_REVIEWS]) {
      if (!byId.has(r.id)) byId.set(r.id, r);
    }
    return {
      reviews: [...byId.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 24),
      durable: isDurable(),
    };
  },
);

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data: SubmitReviewInput) => data)
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; review: PublicReview; durable: boolean } | { ok: false; error: string }> => {
      const validated = validateReview(data);
      if (!validated.ok) {
        return { ok: false, error: validated.error };
      }

      const { appendReview, checkAndBumpRate } = await getStore();
      const fp = await clientFingerprint();
      const allowed = await checkAndBumpRate(fp, 3);
      if (!allowed) {
        return { ok: false, error: "rate" };
      }

      const review: Review = {
        id: newId(),
        ...validated.data,
        createdAt: Date.now(),
        status: "approved",
      };

      await appendReview(review);
      return { ok: true, review: toPublic(review), durable: isDurable() };
    },
  );

/** Admin-only: list stored reviews (requires REVIEWS_ADMIN_TOKEN). */
export const listAdminReviews = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string }) => data)
  .handler(
    async ({
      data,
    }): Promise<
      | { ok: true; reviews: Review[]; durable: boolean }
      | { ok: false; error: "unauthorized" | "not_configured" }
    > => {
      if (!adminTokenConfigured()) {
        return { ok: false, error: "not_configured" };
      }
      if (!verifyAdminToken(data.token)) {
        return { ok: false, error: "unauthorized" };
      }
      const { listStoredReviews } = await getStore();
      const stored = await listStoredReviews();
      return {
        ok: true,
        reviews: stored.sort((a, b) => b.createdAt - a.createdAt),
        durable: isDurable(),
      };
    },
  );

/** Admin-only: publish a public reply on a stored review. */
export const replyToReview = createServerFn({ method: "POST" })
  .inputValidator((data: ReplyToReviewInput) => data)
  .handler(
    async ({
      data,
    }): Promise<
      | { ok: true; review: PublicReview }
      | { ok: false; error: "unauthorized" | "not_configured" | "not_found" | "short" }
    > => {
      if (!adminTokenConfigured()) {
        return { ok: false, error: "not_configured" };
      }
      if (!verifyAdminToken(data.token)) {
        return { ok: false, error: "unauthorized" };
      }
      const text = sanitizeReply(data.text || "");
      if (text.length < 2) {
        return { ok: false, error: "short" };
      }
      const { setReviewReply } = await getStore();
      const updated = await setReviewReply(data.reviewId, {
        text,
        createdAt: Date.now(),
      });
      if (!updated) {
        return { ok: false, error: "not_found" };
      }
      return { ok: true, review: toPublic(updated) };
    },
  );
