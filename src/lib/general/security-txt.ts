export type SecurityTxtInput = {
  contact: string;
  expires: string;
  encryption: string;
  acknowledgments: string;
  languages: string;
  canonical: string;
  policy: string;
  hiring: string;
};

export type SecurityTxtResult =
  | { status: "empty"; file: null; error: "contact" }
  | { status: "invalid"; file: null; error: "contact" | "expires" | "url" }
  | { status: "ok"; file: string; error: null };

const HTTPS = /^https:\/\/\S+$/i;
const CONTACT = /^(mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:\+[0-9][0-9().\-\s]{5,}|https:\/\/\S+)$/i;

export const SECURITY_TXT_SAMPLE: SecurityTxtInput = {
  contact: "mailto:security@example.com",
  expires: "2027-12-31T23:00:00.000Z",
  encryption: "https://example.com/pgp.txt",
  acknowledgments: "https://example.com/hall-of-fame",
  languages: "en, es",
  canonical: "https://example.com/.well-known/security.txt",
  policy: "https://example.com/security",
  hiring: "https://example.com/jobs",
};

function httpsField(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return HTTPS.test(trimmed) ? trimmed : null;
}

export function buildSecurityTxt(input: SecurityTxtInput, now = Date.now()): SecurityTxtResult {
  const contact = input.contact.trim();
  if (!contact) return { status: "empty", file: null, error: "contact" };
  if (!CONTACT.test(contact)) return { status: "invalid", file: null, error: "contact" };

  const expiresRaw = input.expires.trim();
  const expiresAt = Date.parse(expiresRaw);
  if (!expiresRaw || Number.isNaN(expiresAt) || expiresAt <= now) {
    return { status: "invalid", file: null, error: "expires" };
  }

  const optional = [
    ["Encryption", input.encryption],
    ["Acknowledgments", input.acknowledgments],
    ["Canonical", input.canonical],
    ["Policy", input.policy],
    ["Hiring", input.hiring],
  ] as const;
  const lines = [`Contact: ${contact}`, `Expires: ${new Date(expiresAt).toISOString()}`];
  for (const [label, raw] of optional) {
    const value = httpsField(raw);
    if (value === null) return { status: "invalid", file: null, error: "url" };
    if (value) lines.push(`${label}: ${value}`);
  }
  const languages = input.languages
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (languages.some((part) => !/^[A-Za-z]{2,3}(-[A-Za-z0-9]+)?$/.test(part))) {
    return { status: "invalid", file: null, error: "url" };
  }
  if (languages.length) lines.push(`Preferred-Languages: ${languages.join(", ")}`);
  return { status: "ok", file: `${lines.join("\n")}\n`, error: null };
}
