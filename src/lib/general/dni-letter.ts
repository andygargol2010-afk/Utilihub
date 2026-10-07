/** Spanish DNI / NIE control letter. Table is the official 23-letter modulus. */
export const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

export type DniStatus = "empty" | "invalid" | "computed" | "match" | "mismatch";

export type DniResult = {
  status: DniStatus;
  kind: "dni" | "nie" | null;
  digits: string;
  expected: string;
  given: string;
  full: string;
};

const NIE_PREFIX: Record<string, string> = { X: "0", Y: "1", Z: "2" };

export function dniLetter(value: string): DniResult {
  const raw = value.trim().toUpperCase().replace(/[\s.-]/g, "");
  if (!raw) return { status: "empty", kind: null, digits: "", expected: "", given: "", full: "" };

  const nie = raw.match(/^([XYZ])(\d{7})([A-Z])?$/);
  const dni = raw.match(/^(\d{1,8})([A-Z])?$/);
  if (!nie && !dni) return { status: "invalid", kind: null, digits: "", expected: "", given: "", full: "" };

  const kind = nie ? "nie" : "dni";
  const prefix = nie ? nie[1] : "";
  const body = nie ? nie[2] : (dni?.[1] ?? "");
  const given = (nie ? nie[3] : dni?.[2]) ?? "";
  const numeric = (nie ? NIE_PREFIX[prefix] + body : body).padStart(8, "0");
  const expected = DNI_LETTERS[Number(numeric) % 23] ?? "";
  const full = `${prefix}${body.padStart(nie ? 7 : 8, "0")}${expected}`;
  const status: DniStatus = !given ? "computed" : given === expected ? "match" : "mismatch";
  return { status, kind, digits: body, expected, given, full };
}
