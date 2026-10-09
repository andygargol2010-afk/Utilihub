export type WhatsAppLinkResult =
  | { status: "empty"; url: null; error: "empty" }
  | { status: "invalid"; url: null; error: "digits" | "local" | "length" | "message" }
  | { status: "ok"; url: string; error: null; number: string };

export const WHATSAPP_SAMPLE_NUMBER = "+1 415 555 2671";
export const WHATSAPP_SAMPLE_MESSAGE = "Hello";

const MAX_MESSAGE = 500;

export function buildWhatsAppLink(rawNumber: string, rawMessage: string): WhatsAppLinkResult {
  const trimmed = rawNumber.trim();
  if (!trimmed) return { status: "empty", url: null, error: "empty" };

  const compact = trimmed.replace(/[\s().-]/g, "");
  if (compact.startsWith("00") || (compact.startsWith("0") && !compact.startsWith("+"))) {
    return { status: "invalid", url: null, error: "local" };
  }
  const digits = compact.replace(/^\+/, "");
  if (!/^\d+$/.test(digits)) return { status: "invalid", url: null, error: "digits" };
  if (digits.length < 8 || digits.length > 15) return { status: "invalid", url: null, error: "length" };

  const message = rawMessage.trim();
  if (message.length > MAX_MESSAGE) return { status: "invalid", url: null, error: "message" };

  const url = message ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : `https://wa.me/${digits}`;
  return { status: "ok", url, error: null, number: digits };
}
