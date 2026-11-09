/** Crockford base32 ULID: 48-bit ms timestamp + 80-bit randomness. No I, L, O, U. */
export const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const DECODE: Record<string, number> = {};
for (let i = 0; i < CROCKFORD.length; i++) DECODE[CROCKFORD[i]] = i;
DECODE.I = 1;
DECODE.L = 1;
DECODE.O = 0;

export type UlidDecode =
  | { status: "empty" }
  | { status: "invalid"; message: "length" | "char"; index?: number }
  | { status: "ok"; ulid: string; timeMs: number; iso: string; random: string };

export function normalizeUlid(raw: string): string {
  return raw.trim().replace(/[\s-]/g, "").toUpperCase();
}

export function decodeUlid(raw: string): UlidDecode {
  const text = normalizeUlid(raw);
  if (!text) return { status: "empty" };
  if (text.length !== 26) return { status: "invalid", message: "length" };
  let timeMs = 0;
  for (let i = 0; i < 10; i++) {
    const v = DECODE[text[i]];
    if (v === undefined) return { status: "invalid", message: "char", index: i };
    timeMs = timeMs * 32 + v;
  }
  if (timeMs > 0xffffffffffff) return { status: "invalid", message: "char", index: 0 };
  let random = "";
  for (let i = 10; i < 26; i++) {
    const v = DECODE[text[i]];
    if (v === undefined) return { status: "invalid", message: "char", index: i };
    random += CROCKFORD[v];
  }
  return { status: "ok", ulid: text.slice(0, 10) + random, timeMs, iso: new Date(timeMs).toISOString(), random };
}

export function encodeTime(timeMs: number): string {
  if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs > 0xffffffffffff) {
    throw new Error("time");
  }
  const n = Math.floor(timeMs);
  let out = "";
  let rest = n;
  for (let i = 0; i < 10; i++) {
    out = CROCKFORD[rest % 32] + out;
    rest = Math.floor(rest / 32);
  }
  return out;
}

export function encodeRandom(bytes: Uint8Array): string {
  if (bytes.length !== 10) throw new Error("random");
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  let out = "";
  for (let i = 15; i >= 0; i--) out += CROCKFORD[Number((n >> BigInt(i * 5)) & 31n)];
  return out;
}

export function randomBytes(): Uint8Array {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return bytes;
}

export function incrementBytes(bytes: Uint8Array): boolean {
  for (let i = bytes.length - 1; i >= 0; i--) {
    if (bytes[i] < 255) {
      bytes[i] += 1;
      return true;
    }
    bytes[i] = 0;
  }
  return false;
}

export function generateUlids(count: number, timeMs = Date.now()): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("count");
  const bytes = randomBytes();
  const stamp = encodeTime(timeMs);
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(stamp + encodeRandom(bytes));
    if (i < count - 1 && !incrementBytes(bytes)) throw new Error("overflow");
  }
  return out;
}
