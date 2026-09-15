import type { Review } from "./reviews";

const LIST_KEY = "utilihub:reviews";
const RATE_PREFIX = "utilihub:review-rate:";

/** Process-local fallback when Upstash env is not configured (dev / first deploy). */
const memoryReviews: Review[] = [];
const memoryRates = new Map<string, { count: number; day: string }>();

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function upstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstash(command: (string | number)[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Upstash error ${res.status}: ${body}`);
  }
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

export async function listStoredReviews(): Promise<Review[]> {
  if (upstashConfigured()) {
    try {
      const raw = (await upstash(["LRANGE", LIST_KEY, 0, 199])) as string[] | null;
      if (!raw?.length) return [];
      return raw
        .map((item) => {
          try {
            return JSON.parse(item) as Review;
          } catch {
            return null;
          }
        })
        .filter((r): r is Review => Boolean(r));
    } catch {
      return [...memoryReviews];
    }
  }
  return [...memoryReviews];
}

export async function appendReview(review: Review): Promise<void> {
  if (upstashConfigured()) {
    try {
      await upstash(["LPUSH", LIST_KEY, JSON.stringify(review)]);
      await upstash(["LTRIM", LIST_KEY, 0, 499]);
      return;
    } catch {
      // fall through to memory
    }
  }
  memoryReviews.unshift(review);
  if (memoryReviews.length > 200) memoryReviews.length = 200;
}

/** Returns true if the client is still under the daily limit. */
export async function checkAndBumpRate(clientKey: string, limit = 3): Promise<boolean> {
  const today = dayKey();
  const key = `${RATE_PREFIX}${clientKey}`;

  if (upstashConfigured()) {
    try {
      const raw = (await upstash(["GET", key])) as string | null;
      let count = 0;
      let day = today;
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { count: number; day: string };
          count = parsed.day === today ? parsed.count : 0;
          day = today;
        } catch {
          count = 0;
        }
      }
      if (count >= limit) return false;
      await upstash(["SET", key, JSON.stringify({ count: count + 1, day })]);
      await upstash(["EXPIRE", key, 60 * 60 * 36]);
      return true;
    } catch {
      // fall through
    }
  }

  const current = memoryRates.get(clientKey);
  if (current && current.day === today && current.count >= limit) return false;
  const nextCount = current && current.day === today ? current.count + 1 : 1;
  memoryRates.set(clientKey, { count: nextCount, day: today });
  return true;
}

export function hashClient(ip: string, ua: string) {
  const raw = `${ip}|${ua.slice(0, 80)}`;
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
