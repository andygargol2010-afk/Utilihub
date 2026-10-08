/** Decode a JWT header and payload. Never verifies the signature. */

export type JwtPart = { raw: string; json: unknown; pretty: string };

export type JwtDecode =
  | { status: "empty" }
  | { status: "invalid"; message: "parts" | "header" | "payload" }
  | {
      status: "ok";
      header: JwtPart;
      payload: JwtPart;
      signature: string;
      alg: string;
      expired: boolean | null;
      notYetValid: boolean | null;
      expIso: string | null;
      iatIso: string | null;
      nbfIso: string | null;
    };

function b64urlToUtf8(segment: string): string {
  const cleaned = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = cleaned.length % 4 === 0 ? "" : "=".repeat(4 - (cleaned.length % 4));
  const binary = atob(cleaned + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function readPart(segment: string): JwtPart {
  const raw = b64urlToUtf8(segment);
  const json = JSON.parse(raw) as unknown;
  if (json === null || typeof json !== "object" || Array.isArray(json)) {
    throw new Error("object");
  }
  return { raw, json, pretty: JSON.stringify(json, null, 2) };
}

function claimSeconds(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

function isoFromSeconds(seconds: number | null): string | null {
  if (seconds === null) return null;
  const ms = seconds * 1000;
  if (!Number.isFinite(ms) || ms < -8640000000000000 || ms > 8640000000000000) return null;
  return new Date(ms).toISOString();
}

export function decodeJwt(input: string, nowMs = Date.now()): JwtDecode {
  const token = input.trim();
  if (!token) return { status: "empty" };
  const parts = token.split(".");
  if (parts.length !== 3) return { status: "invalid", message: "parts" };
  let header: JwtPart;
  let payload: JwtPart;
  try {
    header = readPart(parts[0]);
  } catch {
    return { status: "invalid", message: "header" };
  }
  try {
    payload = readPart(parts[1]);
  } catch {
    return { status: "invalid", message: "payload" };
  }
  const headerObj = header.json as Record<string, unknown>;
  const payloadObj = payload.json as Record<string, unknown>;
  const alg = typeof headerObj.alg === "string" ? headerObj.alg : "";
  const exp = claimSeconds(payloadObj.exp);
  const iat = claimSeconds(payloadObj.iat);
  const nbf = claimSeconds(payloadObj.nbf);
  const nowSec = Math.floor(nowMs / 1000);
  return {
    status: "ok",
    header,
    payload,
    signature: parts[2],
    alg,
    expired: exp === null ? null : exp < nowSec,
    notYetValid: nbf === null ? null : nbf > nowSec,
    expIso: isoFromSeconds(exp),
    iatIso: isoFromSeconds(iat),
    nbfIso: isoFromSeconds(nbf),
  };
}
