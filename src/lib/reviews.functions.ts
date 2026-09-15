import { createServerFn } from "@tanstack/react-start";
import {
  SEED_REVIEWS,
  toPublic,
  validateReview,
  type PublicReview,
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
