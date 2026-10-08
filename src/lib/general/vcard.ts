export type VcardInput = {
  fullName: string;
  org: string;
  title: string;
  email: string;
  phone: string;
  url: string;
  street: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  note: string;
};

export type VcardResult =
  | { status: "empty"; card: null; error: "name" }
  | { status: "invalid"; card: null; error: "email" | "url" | "phone" }
  | { status: "ok"; card: string; error: null };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9][0-9\s().-]{5,}$/;

export function escapeVcard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return parts.join("\r\n");
}

export function buildVcard(input: VcardInput): VcardResult {
  const fullName = input.fullName.trim();
  if (!fullName) return { status: "empty", card: null, error: "name" };
  const email = input.email.trim();
  if (email && !EMAIL.test(email)) return { status: "invalid", card: null, error: "email" };
  const url = input.url.trim();
  if (url && !/^https?:\/\/\S+$/i.test(url)) return { status: "invalid", card: null, error: "url" };
  const phone = input.phone.trim();
  if (phone && !PHONE.test(phone)) return { status: "invalid", card: null, error: "phone" };

  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${escapeVcard(fullName)}`];
  const org = input.org.trim();
  const title = input.title.trim();
  if (org) lines.push(`ORG:${escapeVcard(org)}`);
  if (title) lines.push(`TITLE:${escapeVcard(title)}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${phone.replace(/[^\d+]/g, "")}`);
  if (url) lines.push(`URL:${url}`);
  const adr = [input.street, input.city, input.region, input.postal, input.country].map((part) => part.trim());
  if (adr.some(Boolean)) {
    lines.push(`ADR;TYPE=WORK:;;${adr.map(escapeVcard).join(";")}`);
  }
  const note = input.note.trim();
  if (note) lines.push(`NOTE:${escapeVcard(note)}`);
  lines.push("END:VCARD");
  return { status: "ok", card: lines.map(fold).join("\r\n") + "\r\n", error: null };
}

export const VCARD_SAMPLE: VcardInput = {
  fullName: "Ana Pérez",
  org: "UtiliHub",
  title: "Product",
  email: "ana@example.com",
  phone: "+5491112345678",
  url: "https://utilihub.example",
  street: "Av. Corrientes 1234",
  city: "Buenos Aires",
  region: "CABA",
  postal: "C1043",
  country: "Argentina",
  note: "Met at the workshop",
};
