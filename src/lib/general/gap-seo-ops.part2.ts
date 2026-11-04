// Part 2 of 3 — split from gap-seo-ops.ts on 2026-11-04. Edit here; gap-seo-ops.ts re-exports.
import { IBAN_LENGTHS } from "./gap-seo-ops.part1";

export function ibanMod97(numeric: string): number {
  let rem = 0;
  for (const ch of numeric) rem = (rem * 10 + Number(ch)) % 97;
  return rem;
}

export function validateIban(input: string, es: boolean): string {
  const compact = input.replace(/\s+/g, "").toUpperCase();
  if (!compact) throw new Error(es ? "Ingresá un IBAN." : "Enter an IBAN.");
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(compact)) {
    throw new Error(es ? "Formato inválido: 2 letras, 2 dígitos y el BBAN." : "Invalid format: 2 letters, 2 digits, then the BBAN.");
  }
  const country = compact.slice(0, 2);
  const expected = IBAN_LENGTHS[country];
  const printed = compact.replace(/(.{4})/g, "$1 ").trim();
  if (expected && compact.length !== expected) {
    return es
      ? `Inválido ✗\nPaís ${country}: se esperan ${expected} caracteres, hay ${compact.length}.\n${printed}`
      : `Invalid ✗\nCountry ${country}: expected ${expected} characters, got ${compact.length}.\n${printed}`;
  }
  if (!expected && (compact.length < 15 || compact.length > 34)) {
    return es
      ? `Inválido ✗\nLongitud ${compact.length} fuera del rango IBAN (15–34). País ${country} no está en la tabla local.\n${printed}`
      : `Invalid ✗\nLength ${compact.length} is outside the IBAN range (15–34). Country ${country} is not in the local table.\n${printed}`;
  }
  const rearranged = compact.slice(4) + compact.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  const ok = ibanMod97(numeric) === 1;
  const lengthNote = expected
    ? es
      ? `Longitud ${compact.length} correcta para ${country}.`
      : `Length ${compact.length} matches ${country}.`
    : es
      ? `País ${country} no está en la tabla local; solo se comprobó el checksum.`
      : `Country ${country} is not in the local length table; only the checksum was checked.`;
  if (ok) {
    return es
      ? `Válido ✓\n${printed}\nChecksum mod-97 correcto.\n${lengthNote}\nNo confirma que la cuenta exista.`
      : `Valid ✓\n${printed}\nMod-97 checksum OK.\n${lengthNote}\nThis does not confirm the account exists.`;
  }
  return es
    ? `Inválido ✗\n${printed}\nEl checksum mod-97 no cierra (ISO 13616).\n${lengthNote}`
    : `Invalid ✗\n${printed}\nMod-97 checksum failed (ISO 13616).\n${lengthNote}`;
}
