/** Field builders + runners for gap seo-growth tools (WiFi QR, CUIT). */

export function buildGapSeoFields(
  slug: string,
  es: boolean,
): { title: string; btn: string; fields: Array<
  | { kind: "number" | "text" | "textarea"; label: string; placeholder?: string }
  | { kind: "select"; label: string; options: { value: string; label: string }[] }
> } | null {
  if (slug === "qr-wifi") {
    return {
      title: es ? "Generador de QR WiFi" : "WiFi QR generator",
      btn: es ? "Generar" : "Generate",
      fields: [
        { kind: "text" as const, label: "SSID", placeholder: es ? "Nombre de la red" : "Network name" },
        {
          kind: "select" as const,
          label: es ? "Seguridad" : "Security",
          options: [
            { value: "WPA", label: "WPA/WPA2" },
            { value: "WEP", label: "WEP" },
            { value: "nopass", label: es ? "Sin contraseña" : "No password" },
          ],
        },
        { kind: "text" as const, label: es ? "Contraseña" : "Password", placeholder: es ? "Opcional si sin contraseña" : "Optional if no password" },
      ],
    };
  }
  if (slug === "validador-iban") {
    return {
      title: es ? "Validador IBAN" : "IBAN validator",
      btn: es ? "Validar" : "Validate",
      fields: [{ kind: "text" as const, label: "IBAN", placeholder: es ? "ES91 2100 …" : "GB82 WEST …" }],
    };
  }
  if (slug === "validador-cuit") {
    return {
      title: es ? "Validador CUIT/CUIL" : "CUIT/CUIL validator",
      btn: es ? "Validar" : "Validate",
      fields: [{ kind: "text" as const, label: es ? "CUIT o CUIL" : "CUIT or CUIL" }],
    };
  }
  return null;
}


const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
  BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, EG: 29,
  ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28,
  HR: 21, HU: 28, IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20,
  LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19,
  MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
  RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26, UA: 29,
  VA: 22, VG: 24, XK: 20,
};

function ibanMod97(numeric: string): number {
  let rem = 0;
  for (const ch of numeric) rem = (rem * 10 + Number(ch)) % 97;
  return rem;
}

function validateIban(input: string, es: boolean): string {
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

export function runGapSeo(
  slug: string,
  values: string[],
  es: boolean,
): { result: string; qrPayload?: string } | null {
  if (slug === "qr-wifi") {
    const ssid = (values[0] || "").trim();
    const type = (values[1] || "WPA").trim();
    const pass = (values[2] || "").trim();
    if (!ssid) throw new Error(es ? "Ingresá el SSID." : "Enter the SSID.");
    if (type !== "nopass" && !pass) throw new Error(es ? "Ingresá la contraseña." : "Enter the password.");
    const esc = (s: string) => s.replace(/([\\;,\"])/g, "\\$1");
    const payload =
      type === "nopass" ? `WIFI:T:nopass;S:${esc(ssid)};;` : `WIFI:T:${type};S:${esc(ssid)};P:${esc(pass)};;`;
    return {
      result: es
        ? `Payload:\n${payload}\n\nCódigo QR generado abajo.`
        : `Payload:\n${payload}\n\nQR code generated below.`,
      qrPayload: payload,
    };
  }
  if (slug === "validador-iban") {
    return { result: validateIban(values[0] || "", es) };
  }
  if (slug === "validador-cuit") {
    const raw = (values[0] || "").replace(/\D/g, "");
    if (raw.length !== 11) {
      throw new Error(es ? "El CUIT/CUIL debe tener 11 dígitos." : "CUIT/CUIL must have 11 digits.");
    }
    const types = new Set(["20", "23", "24", "27", "30", "33", "34"]);
    const prefix = raw.slice(0, 2);
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(raw[i]) * weights[i]!;
    const mod = 11 - (sum % 11);
    const check = mod === 11 ? 0 : mod === 10 ? 9 : mod;
    const ok = check === Number(raw[10]);
    const formatted = `${raw.slice(0, 2)}-${raw.slice(2, 10)}-${raw[10]}`;
    const typeNote = types.has(prefix)
      ? es
        ? `Prefijo ${prefix} válido (tipo habitual).`
        : `Prefix ${prefix} is a common type.`
      : es
        ? `Prefijo ${prefix}: no es un tipo habitual (20, 23, 24, 27, 30, 33, 34).`
        : `Prefix ${prefix} is not a common type (20, 23, 24, 27, 30, 33, 34).`;
    if (ok) {
      return {
        result: es
          ? `Válido ✓\nFormato: ${formatted}\n${typeNote}\nDígito verificador correcto.`
          : `Valid ✓\nFormat: ${formatted}\n${typeNote}\nCheck digit OK.`,
      };
    }
    return {
      result: es
        ? `Inválido ✗\nFormato: ${formatted}\n${typeNote}\nDígito verificador esperado: ${check}, recibido: ${raw[10]}.`
        : `Invalid ✗\nFormat: ${formatted}\n${typeNote}\nExpected check digit: ${check}, got: ${raw[10]}.`,
    };
  }
  return null;
}
