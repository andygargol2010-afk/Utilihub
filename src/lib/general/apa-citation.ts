export type CitationKind = "webpage" | "book" | "journal";

export type CitationInput = {
  kind: CitationKind;
  authors: string;
  year: string;
  month: string;
  day: string;
  title: string;
  container: string;
  volume: string;
  issue: string;
  pages: string;
  url: string;
};

export type CitationResult =
  | { status: "empty" }
  | { status: "ok"; citation: string; warning: "url" | null };

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_ES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** "García Márquez, Gabriel" → "García Márquez, G."; "Gabriel García" → "García, G." */
export function formatAuthorName(raw: string): string {
  const value = clean(raw).replace(/\.$/, "");
  if (!value) return "";
  if (value.includes(",")) {
    const [surname, given = ""] = value.split(",").map(clean);
    const initials = given
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => `${part[0].toUpperCase()}.`)
      .join(" ");
    return initials ? `${surname}, ${initials}` : surname;
  }
  const parts = value.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0];
  const surname = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map((part) => `${part[0].toUpperCase()}.`).join(" ");
  return `${surname}, ${initials}`;
}

export function formatAuthorList(raw: string, es: boolean): string {
  const people = raw
    .split(/[;\n]+/)
    .map(formatAuthorName)
    .filter(Boolean);
  if (!people.length) return "";
  const join = es ? " y " : " & ";
  if (people.length === 1) return people[0];
  if (people.length === 2) return `${people[0]}${join}${people[1]}`;
  if (people.length <= 20) return `${people.slice(0, -1).join(", ")},${join}${people[people.length - 1]}`;
  return `${people.slice(0, 19).join(", ")}, ... ${people[people.length - 1]}`;
}

export function formatApaDate(year: string, month: string, day: string, es: boolean): string {
  const y = clean(year);
  const m = Number(month);
  const d = Number(day);
  if (!y) return es ? "s. f." : "n.d.";
  if (!m || m < 1 || m > 12) return y;
  const monthName = es ? MONTHS_ES[m - 1] : MONTHS_EN[m - 1];
  if (!d || d < 1 || d > 31) return es ? `${y}, ${monthName}` : `${y}, ${monthName}`;
  return es ? `${y}, ${d} de ${monthName}` : `${y}, ${monthName} ${d}`;
}

function normalizeUrl(raw: string): { url: string; warning: boolean } {
  const value = clean(raw);
  if (!value) return { url: "", warning: false };
  if (/^https?:\/\//i.test(value) || /^doi:/i.test(value)) return { url: value, warning: false };
  if (/^10\.\d{4,}\//.test(value)) return { url: `https://doi.org/${value}`, warning: false };
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(value)) return { url: `https://${value}`, warning: true };
  return { url: value, warning: true };
}

export function buildCitation(input: CitationInput, es: boolean): CitationResult {
  const title = clean(input.title);
  if (!title) return { status: "empty" };
  const authors = formatAuthorList(input.authors, es);
  const date = formatApaDate(input.year, input.month, input.day, es);
  const container = clean(input.container);
  const { url, warning } = normalizeUrl(input.url);
  const volume = clean(input.volume);
  const issue = clean(input.issue);
  const pages = clean(input.pages).replace(/\s*-\s*/g, "–");

  const head = authors ? `${authors}. (${date}).` : `${title}. (${date}).`;
  const work = authors ? title : "";

  if (input.kind === "book") {
    const parts = [head, work && `${work}.`, container && `${container}.`].filter(Boolean);
    return { status: "ok", citation: parts.join(" ").replace(/\s+/g, " "), warning: url ? warning : null };
  }

  if (input.kind === "journal") {
    const vol = volume ? (issue ? `${volume}(${issue})` : volume) : "";
    const loc = [vol, pages].filter(Boolean).join(", ");
    const parts = [
      head,
      work && `${work}.`,
      container && `${container}${loc ? `, ${loc}` : ""}.`,
      !container && loc && `${loc}.`,
      url,
    ].filter(Boolean);
    return { status: "ok", citation: parts.join(" ").replace(/\s+/g, " "), warning };
  }

  const parts = [head, work && `${work}.`, container && `${container}.`, url].filter(Boolean);
  return { status: "ok", citation: parts.join(" ").replace(/\s+/g, " "), warning };
}

export const APA_PRESETS: { id: string; input: CitationInput }[] = [
  {
    id: "web",
    input: {
      kind: "webpage",
      authors: "IPCC",
      year: "2024",
      month: "3",
      day: "20",
      title: "Climate report",
      container: "UN",
      volume: "",
      issue: "",
      pages: "",
      url: "https://example.org/report",
    },
  },
  {
    id: "book",
    input: {
      kind: "book",
      authors: "García Márquez, Gabriel",
      year: "1967",
      month: "",
      day: "",
      title: "Cien años de soledad",
      container: "Sudamericana",
      volume: "",
      issue: "",
      pages: "",
      url: "",
    },
  },
];
