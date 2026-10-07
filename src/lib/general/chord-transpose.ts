/** Transpose chord symbols. Letters and solfege; slash bass; German H. */
export type Spelling = "sharp" | "flat";
export type NoteStyle = "letter" | "solfege";

const SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const SOLFEGE_SHARP = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
const SOLFEGE_FLAT = ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"];

const PITCH: Record<string, number> = {
  C: 0, "B#": 0, "C#": 1, DB: 1, D: 2, "D#": 3, EB: 3, E: 4, FB: 4, F: 5, "E#": 5,
  "F#": 6, GB: 6, G: 7, "G#": 8, AB: 8, A: 9, "A#": 10, BB: 10, B: 11, CB: 11, H: 11,
  DO: 0, "DO#": 1, REB: 1, RE: 2, "RE#": 3, MIB: 3, MI: 4, FA: 5, "FA#": 6, SOLB: 6,
  SOL: 7, "SOL#": 8, LAB: 8, LA: 9, "LA#": 10, SIB: 10, SI: 11,
};

export type TransposeResult = {
  status: "empty" | "ok" | "partial";
  output: string;
  capo: number;
  unknown: string[];
};

export const CHORD_PRESETS = [
  { id: "pop", labelEn: "C G Am F +2", labelEs: "C G Am F +2", text: "C G Am F", steps: 2, spelling: "sharp" as Spelling },
  { id: "flat", labelEn: "Bbmaj7 −1", labelEs: "Bbmaj7 −1", text: "Bbmaj7 Eb/G", steps: -1, spelling: "flat" as Spelling },
  { id: "solfege", labelEn: "Do Re Mi", labelEs: "Do Re Mi", text: "Do Rem Fa Sol7", steps: 0, spelling: "sharp" as Spelling },
];

function spell(pc: number, spelling: Spelling, style: NoteStyle) {
  const i = ((pc % 12) + 12) % 12;
  if (style === "solfege") return spelling === "flat" ? SOLFEGE_FLAT[i] : SOLFEGE_SHARP[i];
  return spelling === "flat" ? FLAT[i] : SHARP[i];
}

function pitchOf(root: string, acc: string) {
  const key = (root + acc).normalize("NFC").toUpperCase().replace("♭", "B").replace("♯", "#");
  return PITCH[key];
}

function transposeChord(token: string, steps: number, spelling: Spelling, style: NoteStyle): string | null {
  const match = token.match(/^([A-Ha-h]|Do|Re|Mi|Fa|Sol|La|Si|do|re|mi|fa|sol|la|si)([#b♯♭]?)([^/\s]*)(?:\/([A-Ha-h]|Do|Re|Mi|Fa|Sol|La|Si|do|re|mi|fa|sol|la|si)([#b♯♭]?))?$/);
  if (!match) return null;
  const rootPc = pitchOf(match[1], match[2] ?? "");
  if (rootPc === undefined) return null;
  const quality = match[3] ?? "";
  const bass = match[4];
  const next = spell(rootPc + steps, spelling, style) + quality;
  if (!bass) return next;
  const bassPc = pitchOf(bass, match[5] ?? "");
  if (bassPc === undefined) return null;
  return `${next}/${spell(bassPc + steps, spelling, style)}`;
}

export function transposeChart(text: string, steps: number, spelling: Spelling, style: NoteStyle): TransposeResult {
  if (!text.trim()) return { status: "empty", output: "", capo: 0, unknown: [] };
  const delta = ((steps % 12) + 12) % 12;
  const unknown: string[] = [];
  const output = text.replace(/[A-Za-zÁÉÍÓÚáéíóúÑñ#b♯♭0-9+()°]+(?:\/[A-Za-z#b♯♭]+)?/g, (token) => {
    if (/^(NC|N\.C\.|x|X|%|—|-)$/.test(token)) return token;
    if (/^\d+$/.test(token)) return token;
    const moved = transposeChord(token, steps, spelling, style);
    if (!moved) {
      if (/[A-Ga-g]|Do|Re|Mi|Fa|Sol|La|Si/i.test(token)) unknown.push(token);
      return token;
    }
    return moved;
  });
  return { status: unknown.length ? "partial" : "ok", output, capo: delta, unknown };
}
